const Discord = require("discord.js");
const fs = require("fs");
const private = require("./private");
const jsonfile = require("jsonfile");
const fileName = "./messageFiles/welcome.json";
const configFile = "./configuration.json";

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = private.botToken;

let roleMessageId = null;
let config = null;
// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on("ready", () => {
  jsonfile.readFile(fileName, function(err, obj) {
    if (err) {
      console.log("No file");
    } else {
      roleMessageId = obj.messageId;
    }
  });
  jsonfile.readFile(configFile, function(err, obj) {
    if (err) {
      console.log("No config file");
    } else {
      config = obj;
      const guild = client.guilds.find("name", config.yourServerName);
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
      const welcomeChannel = channels.find("name", config.welcomeChannelName);
      if (welcomeChannel) {
        welcomeChannel.fetchPinnedMessages().then(stickies => {
          if (stickies) {
            const welcomeMessage = stickies.find("id", roleMessageId);
            if (!welcomeMessage) {
              sendWelcomeMessage(welcomeChannel);
            }
          }
        });
      } else {
        guild
          .createChannel(config.welcomeChannelName)
          .then(newWelcomeChannel => {
            sendWelcomeMessage(newWelcomeChannel);
          });
      }
      console.log("I am ready!");
    }
  });
});

const sendWelcomeMessage = welcomeChannel => {
  welcomeChannel.send(welcomeChannelText).then(newMessage => {
    newMessage.pin().then(myMessage => {
      //newMessage.delete();
      roleMessageId = myMessage.id;
      jsonfile.writeFile(fileName, { messageId: roleMessageId }, err => {
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
client.on("message", message => {
  for (const msg of config.serverMessages) {
    if (message.content === msg.reactMessage) {
      // Send "pong" to the same channel
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
  if (!user.bot && reaction.message.id === roleMessageId) {
    const roleUser = reaction.message.guild.members.get(user.id);
    for (const role of config.roles) {
      if (role.icon === reaction.emoji.name) {
        roleUser.addRole(roleUser.guild.roles.find("name", role.roleName));
        reaction.message.channel
          .send(user.username + role.roleSetText)
          .then(msg => {
            msg.delete(15000);
          });
      }
    }
  }
});

client.on("messageReactionRemove", (reaction, user) => {
  if (!user.bot && reaction.message.id === roleMessageId) {
    const roleUser = reaction.message.guild.members.get(user.id);
    for (const role of config.roles) {
      if (role.icon === reaction.emoji.name) {
        roleUser.removeRole(roleUser.guild.roles.find("name", role.roleName));
        reaction.message.channel
          .send(user.username + role.roleRemoveText)
          .then(msg => {
            msg.delete(15000);
          });
      }
    }
  }
});

// Log our bot in
client.login(token);
