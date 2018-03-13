const Discord = require("discord.js");
const fs = require("fs");
const private = require("./private");
const jsonfile = require("jsonfile");
const fileName = "./messageFiles/welcome.json";

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = private.botToken;

let roleMessageId = null;
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
  const guild = client.guilds.find("name", "MoguaiTestServer");
  const channels = guild.channels;
  const welcomeChannel = channels.find("name", "willkommen");
  if (welcomeChannel) {
    welcomeChannel.fetchPinnedMessages().then((stickies) => {
      if (stickies) {
        const welcomeMessage = stickies.find("id", roleMessageId);
        if (!welcomeMessage) {
          sendWelcomeMessage(welcomeChannel);
        }
      }
    });
  } else {
    guild.createChannel("willkommen").then((newWelcomeChannel) => {
      sendWelcomeMessage(newWelcomeChannel);
    });
  }
  console.log("I am ready!");
});

const sendWelcomeMessage = (welcomeChannel) => {
  welcomeChannel
    .send("Herzlich willkommen, wähle deine Rolle!")
    .then((newMessage) => {
      newMessage.pin().then((myMessage) => {
        //newMessage.delete();
        roleMessageId = myMessage.id;
        jsonfile.writeFile(fileName, { messageId: roleMessageId }, (err) => {
          if (err) {
            console.error(err);
          }
        });
        myMessage.react("🤠");
        myMessage.react("☠");
        myMessage.react("🤖");
        const filter = (reaction, user) => reaction.emoji.name === "🤠";
        //const filter = (reaction, user) => ({});
        myMessage
          .awaitReactions(filter, { time: 100000 })
          .then((collected) => {
            console.log("got reaction");
          })
          .catch((collected) => {
            console.log("error reaction");
          });
      });
    });
};

// Create an event listener for messages
client.on("message", (message) => {
  // If the message is "ping"
  if (message.content === "ping") {
    // Send "pong" to the same channel
    message.channel.send("pong");
  }
  if (message.content === "what is my avatar") {
    // Send the user's avatar URL
    message.reply(message.author.avatarURL);
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  if (!user.bot && reaction.message.id === roleMessageId) {
    const roleUser = reaction.message.guild.members.get(user.id);
    const tankRole = roleUser.guild.roles.find("name", "tank");
    const healRole = roleUser.guild.roles.find("name", "heal");
    const ddRole = roleUser.guild.roles.find("name", "dd");
    const test = roleUser.roles;
    switch (reaction.emoji.name) {
      case "🤠":
        roleUser.addRole(tankRole.id);
        reaction.message.channel
          .send("User " + user.username + " ist jetzt Tank")
          .then((msg) => {
            msg.delete(15000);
          });
        break;
      case "☠":
        roleUser.addRole(ddRole.id);
        reaction.message.channel
          .send("User " + user.username + " ist jetzt DD")
          .then((msg) => {
            msg.delete(15000);
          });
        break;
        break;
      case "🤖":
        roleUser.addRole(healRole.id);
        reaction.message.channel
          .send("User " + user.username + " ist jetzt Heal")
          .then((msg) => {
            msg.delete(15000);
          });
        break;
        break;
      default:
        break;
    }
  }
});

client.on("messageReactionRemove", (reaction, user) => {
  if (!user.bot && reaction.message.id === roleMessageId) {
    const roleUser = reaction.message.guild.members.get(user.id);
    const tankRole = roleUser.guild.roles.find("name", "tank");
    const healRole = roleUser.guild.roles.find("name", "heal");
    const ddRole = roleUser.guild.roles.find("name", "dd");
    const test = roleUser.roles;
    switch (reaction.emoji.name) {
      case "🤠":
        roleUser.removeRole(tankRole.id);
        reaction.message.channel
          .send("User " + user.username + " ist jetzt kein Tank mehr")
          .then((msg) => {
            msg.delete(15000);
          });
        break;
      case "☠":
        roleUser.removeRole(ddRole.id);
        reaction.message.channel
          .send("User " + user.username + " ist jetzt kein DD mehr")
          .then((msg) => {
            msg.delete(15000);
          });
        break;
        break;
      case "🤖":
        roleUser.removeRole(healRole.id);
        reaction.message.channel
          .send("User " + user.username + " ist jetzt kein Heal mehr")
          .then((msg) => {
            msg.delete(15000);
          });
        break;
        break;
      default:
        break;
    }
  }
});

// Log our bot in
client.login(token);
