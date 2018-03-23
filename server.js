const Discord = require("discord.js");
require("dotenv").config();
const jsonfile = require("jsonfile");
const welcomeMessageFile = "./messageFiles/welcome.json";
const configFile = "./configuration.json";

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = process.env.BOTTOKEN;

let botMessages = [];
let botConfig = null;

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on("ready", () => {
  jsonfile.readFile(welcomeMessageFile, function(err, obj) {
    if (err) {
      console.log("No file");
    } else {
      botMessages = obj;
      readConfig();
    }
  });
});

client.on("guildDelete", (guild) => {
  botMessages.forEach((ele, index) => {
    if (ele.guildId === guild.id) {
      botMessages.splice(index, 1);
      jsonfile.writeFile(welcomeMessageFile, botMessages, (err) => {
        if (err) {
          console.error(err);
        }
        return;
      });
    }
  });
});

client.on("channelDelete", (channel) => {
  botMessages.forEach((ele, index) => {
    if (ele.guildId === channel.guild.id) {
      botMessages.splice(index, 1);
      jsonfile.writeFile(welcomeMessageFile, botMessages, (err) => {
        if (err) {
          console.error(err);
        }
        return;
      });
    }
  });
});

const getRoleMessageIds = (guildId) => {
  for (const msg of botMessages) {
    if (msg.guildId === guildId) {
      return msg.messages;
    }
  }
  return null;
};

const roleMessageExist = (guildId, messageId) => {
  for (const msg of botMessages) {
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
      for (const roleMsg of botMessages) {
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
          botMessages.push({
            messages: [myMessage.id],
            guildId: welcomeChannel.guild.id
          });
        } else {
          messageToAddGuild.messages.push(myMessage.id);
        }
      }
      jsonfile.writeFile(welcomeMessageFile, botMessages, (err) => {
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
      const welcomeChannel = channels.find(
        "name",
        botConfig.welcomeChannelName
      );
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
  for (const msg of botConfig.serverMessages) {
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
    for (const welcomeText of botConfig.welcomeChannelMessages) {
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
    for (const welcomeText of botConfig.welcomeChannelMessages) {
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

const checkGuildRoles = (guild) => {
  for (const welcomeText of botConfig.welcomeChannelMessages) {
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
};

const readConfig = () => {
  jsonfile.readFile(configFile, function(err, obj) {
    if (err) {
      console.log("No config file");
    } else {
      botConfig = obj;
      for (const configGuild of botConfig.yourServerNames) {
        const guild = client.guilds.find("name", configGuild);
        if (guild) {
          checkGuildRoles(guild);
          const channels = guild.channels;
          const welcomeChannel = channels.find(
            "name",
            botConfig.welcomeChannelName
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
                  for (const msg of botConfig.welcomeChannelMessages) {
                    sendWelcomeMessage(welcomeChannel, msg);
                  }
                }
              }
            });
          } else {
            guild
              .createChannel(botConfig.welcomeChannelName)
              .then((newWelcomeChannel) => {
                for (const msg of botConfig.welcomeChannelMessages) {
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
};

// Log our bot in
client.login(token);
