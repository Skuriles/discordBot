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
      jsonfile.readFile(configFile, function(err, obj) {
        if (err) {
          console.log("No config file");
        } else {
          config = obj;
          for (const configGuild of config.yourServerNames) {
            const guild = client.guilds.find("name", configGuild);
            if (guild) {
              for (const welcomeText of config.welcomeChannelMessages) {
                for (const role of welcomeText.roles) {
                  const roleExist = guild.roles.find("name", role.roleName);
                  if (!roleExist) {
                    guild.createRole({
                      name: role.roleName,
                      color: role.color
                    });
                  }
                }
              }
              const channels = guild.channels;
              const welcomeChannel = channels.find(
                "name",
                config.welcomeChannelName
              );
              if (welcomeChannel) {
                welcomeChannel
                  .fetchPinnedMessages()
                  .then((cachedMessages) => {
                    cachedMessages.forEach(function(cmsg, csmgId) {
                      cmsg.reactions.forEach(function(reaction, reactionId) {
                        reaction.fetchUsers();
                      });
                    });
                  })
                  .catch(console.error);
                welcomeChannel.fetchPinnedMessages().then((stickies) => {
                  if (stickies) {
                    let roleMessageIds = getRoleMessageIds(guild.id);
                    if (
                      !roleMessageIds ||
                      !stickies.find("id", roleMessageIds[0])
                    ) {
                      for (const msg of config.welcomeChannelMessages) {
                        sendWelcomeMessage(welcomeChannel, msg);
                      }
                    }
                  }
                });
              } else {
                guild
                  .createChannel(config.welcomeChannelName)
                  .then((newWelcomeChannel) => {
                    for (const msg of config.welcomeChannelMessages) {
                      sendWelcomeMessage(newWelcomeChannel, msg);
                    }
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

const getRoleMessageIds = (guildId) => {
  for (const msg of roleMessages) {
    if (msg.guildId === guildId) {
      return msg.messages;
    }
  }
  return null;
};

const roleMessageExist = (guildId, messageId) => {
  for (const msg of roleMessages) {
    if (msg.guildId === guildId) {
      for (const msgId of msg.messages) {
        if (messageId === msgId) {
          return true;
        }
      }
    }
  }
  return false;
};

const sendWelcomeMessage = (welcomeChannel, msg) => {
  welcomeChannel.send(msg.text).then((newMessage) => {
    newMessage.pin().then((myMessage) => {
      let found = false;
      let guildFound = false;
      let messageToAddGuild = null;
      for (const roleMsg of roleMessages) {
        if (roleMsg.guildId === myMessage.guild.id) {
          guildFound = true;
          messageToAddGuild = roleMsg;
          for (const roleMsgId of roleMsg.messages) {
            if (roleMsgId === myMessage.id) {
              found = true;
              break;
            }
          }
        }
      }
      if (!found) {
        if (!guildFound) {
          roleMessages.push({
            messages: [myMessage.id],
            guildId: welcomeChannel.guild.id
          });
        } else {
          messageToAddGuild.messages.push(myMessage.id);
        }
      }
      jsonfile.writeFile(fileName, roleMessages, (err) => {
        if (err) {
          console.error(err);
        }
      });
      for (const role of msg.roles) {
        myMessage.react(role.icon);
      }
    });
  });
};

// Create an event listener for messages
client.on("message", (message) => {
  if (message.author.bot) {
    return;
  }
  const str = message.content;
  if (str.startsWith("!editBotMessage")) {
    const roleUser = message.guild.members.get(message.author.id);
    if (!roleUser.hasPermission("ADMINISTRATOR ")) {
      message.channel.sendMessage("Nice try, Mr. Non-Administrator");
      return;
    }
    const num = parseInt(str.substring(str.indexOf("[") + 1, str.indexOf("]")));
    if (num && num > 0) {
      const ids = getRoleMessageIds(message.guild.id);
      const channels = message.guild.channels;
      const welcomeChannel = channels.find("name", config.welcomeChannelName);
      if (welcomeChannel) {
        welcomeChannel.fetchPinnedMessages().then((stickies) => {
          if (stickies) {
            const stickyMsg = stickies.find("id", ids[num - 1]);
            if (stickyMsg) {
              stickyMsg
                .edit(str.substr(str.indexOf("]") + 1, str.length - 1))
                .then((msg) => {
                  console.log(`New message content: ${msg}`);
                  welcomeChannel
                    .fetchMessages()
                    .then((cachedMessages) =>
                      console.log(`Received ${messages.size} messages`)
                    )
                    .catch(console.error);
                })
                .catch(console.error);
            }
          }
        });
      }
    }
  }
  for (const msg of config.serverMessages) {
    if (str === msg.reactMessage) {
      // send answer from configuration json
      message.channel.send(msg.botAnswer);
    }
    break;
  }
  if (str === "what is my avatar") {
    // Send the user's avatar URL
    message.reply(message.author.avatarURL);
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  if (
    !user.bot &&
    roleMessageExist(reaction.message.guild.id, reaction.message.id)
  ) {
    const roleUser = reaction.message.guild.members.get(user.id);
    for (const welcomeText of config.welcomeChannelMessages) {
      for (const role of welcomeText.roles) {
        if (role.icon === reaction.emoji.name) {
          roleUser.addRole(roleUser.guild.roles.find("name", role.roleName));
          const msgText = role.roleSetText.replace("[username]", user.username);
          reaction.message.channel.send(msgText).then((msg) => {
            msg.delete(15000);
          });
        }
      }
    }
  }
});

client.on("messageReactionRemove", (reaction, user) => {
  if (
    !user.bot &&
    roleMessageExist(reaction.message.guild.id, reaction.message.id)
  ) {
    const roleUser = reaction.message.guild.members.get(user.id);
    for (const welcomeText of config.welcomeChannelMessages) {
      for (const role of welcomeText.roles) {
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
  }
});

// Log our bot in
client.login(token);
