const Discord = require("discord.js");
const fs = require("fs");
require("dotenv").config();
const jsonfile = require("jsonfile");
const fileName = "./messageFiles/welcome.json";
const configFile = "./configuration.json";

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = process.env.BOTTOKEN;

let roleMessages = [];
let config = null;
// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on("ready", () => {
  jsonfile.readFile(fileName, function(err, obj) {
    if (err) {
      console.log("No file");
    } else {
      roleMessages = obj;
    }
  });
  jsonfile.readFile(configFile, function(err, obj) {
    if (err) {
      console.log("No config file");
    } else {
      config = obj;
      for (const configGuild of config.yourServerNames) {
        const guild = client.guilds.find("name", configGuild);
        if (guild) {
          for (const role of config.roles) {
            const roleExist = guild.roles.find("name", role.roleName);
            if (!roleExist) {
              guild.createRole({
                name: role.roleName,
                color: role.color
              });
            }
          }
          const channels = guild.channels;
          const welcomeChannel = channels.find(
            "name",
            config.welcomeChannelName
          );
          if (welcomeChannel) {
            welcomeChannel.fetchPinnedMessages().then((stickies) => {
              if (stickies) {
                let roleMessageId = getRoleMessageId(guild.id);
                if (!roleMessageId || !stickies.find("id", roleMessageId)) {
                  sendWelcomeMessage(welcomeChannel);
                }
              }
            });
          } else {
            guild
              .createChannel(config.welcomeChannelName)
              .then((newWelcomeChannel) => {
                sendWelcomeMessage(newWelcomeChannel);
              });
          }
        } else {
          console.log(
            "Can't find " +
              configGuild +
              "! Check if configuration.json is configured properly and Bot is assigend to this Server"
          );
        }
      }
      console.log("I am ready!");
    }
  });
});

client.on("guildDelete", (guild) => {
  roleMessages.forEach((ele, index) => {
    if (ele.guildId === guild.id) {
      roleMessages.splice(index, 1);
      jsonfile.writeFile(fileName, roleMessages, (err) => {
        if (err) {
          console.error(err);
        }
        return;
      });
    }
  });
});

const getRoleMessageId = (guildId) => {
  for (const msg of roleMessages) {
    if (msg.guildId === guildId) {
      return msg.messageId;
    }
  }
  return null;
};

const sendWelcomeMessage = (welcomeChannel) => {
  welcomeChannel.send(config.welcomeChannelText).then((newMessage) => {
    newMessage.pin().then((myMessage) => {
      let found = false;
      for (const roleMsg of roleMessages) {
        if (roleMsg.guildId === myMessage.guild.id) {
          roleMsg.messageId = myMessage.id;
          found = true;
          break;
        }
      }
      if (!found) {
        roleMessages.push({
          messageId: myMessage.id,
          guildId: welcomeChannel.guild.id
        });
      }
      jsonfile.writeFile(fileName, roleMessages, (err) => {
        if (err) {
          console.error(err);
        }
      });
      for (const role of config.roles) {
        myMessage.react(role.icon);
      }
    });
  });
};

// Create an event listener for messages
client.on("message", (message) => {
  for (const msg of config.serverMessages) {
    if (message.content === msg.reactMessage) {
      // send answer from configuration json
      message.channel.send(msg.botAnswer);
    }
    break;
  }
  if (message.content === "what is my avatar") {
    // Send the user's avatar URL
    message.reply(message.author.avatarURL);
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  if (
    !user.bot &&
    getRoleMessageId(reaction.message.guild.id) === reaction.message.id
  ) {
    const roleUser = reaction.message.guild.members.get(user.id);
    for (const role of config.roles) {
      if (role.icon === reaction.emoji.name) {
        roleUser.addRole(roleUser.guild.roles.find("name", role.roleName));
        const msgText = role.roleSetText.replace("[username]", user.username);
        reaction.message.channel.send(msgText).then((msg) => {
          msg.delete(15000);
        });
      }
    }
  }
});

client.on("messageReactionRemove", (reaction, user) => {
  if (
    !user.bot &&
    getRoleMessageId(reaction.message.guild.id) === reaction.message.id
  ) {
    const roleUser = reaction.message.guild.members.get(user.id);
    for (const role of config.roles) {
      if (role.icon === reaction.emoji.name) {
        roleUser.removeRole(roleUser.guild.roles.find("name", role.roleName));
        const msgText = role.roleRemoveText.replace(
          "[username]",
          user.username
        );
        reaction.message.channel.send(msgText).then((msg) => {
          msg.delete(15000);
        });
      }
    }
  }
});

// Log our bot in
client.login(token);
