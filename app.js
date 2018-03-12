const Discord = require("discord.js");
const private = require("./private");

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = private.botToken;

let roleMessageId = null;
// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on("ready", () => {
  console.log("I am ready!");
});

// Create an event listener for messages
client.on("message", (message) => {
  // If the message is "ping"
  if (message.content === "ping") {
    // Send "pong" to the same channel
    message.channel.send("I don't want to run anymore").then((myMessage) => {
      roleMessageId = myMessage.id;
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
  }
  if (message.content === "what is my avatar") {
    // Send the user's avatar URL
    message.reply(message.author.avatarURL);
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  if (reaction.me && !user.bot && reaction.message.id === roleMessageId) {
    const roleUser = reaction.message.guild.members.get(user.id);
    const tankRole = roleUser.guild.roles.find("name", "tank");
    const healRole = roleUser.guild.roles.find("name", "heal");
    const ddRole = roleUser.guild.roles.find("name", "dd");
    const test = roleUser.roles;
    switch (reaction.emoji.name) {
      case "🤠":
        roleUser.addRole(tankRole.id);
        reaction.message.channel.send(
          "User " + user.username + " ist jetzt Tank"
        );
        break;
      case "☠":
        roleUser.addRole(ddRole.id);
        reaction.message.channel.send(
          "User " + user.username + " ist jetzt DD"
        );
        break;
        break;
      case "🤖":
        roleUser.addRole(healRole.id);
        reaction.message.channel.send(
          "User " + user.username + " ist jetzt Heal"
        );
        break;
        break;
      default:
        break;
    }
  }
});

client.on("messageReactionRemove", (reaction, user) => {
  if (reaction.me && !user.bot && reaction.message.id === roleMessageId) {
    const roleUser = reaction.message.guild.members.get(user.id);
    const tankRole = roleUser.guild.roles.find("name", "tank");
    const healRole = roleUser.guild.roles.find("name", "heal");
    const ddRole = roleUser.guild.roles.find("name", "dd");
    const test = roleUser.roles;
    switch (reaction.emoji.name) {
      case "🤠":
        roleUser.removeRole(tankRole.id);
        reaction.message.channel.send(
          "User " + user.username + " ist jetzt kein Tank mehr"
        );
        break;
      case "☠":
        roleUser.removeRole(ddRole.id);
        reaction.message.channel.send(
          "User " + user.username + " ist jetzt kein DD mehr"
        );
        break;
        break;
      case "🤖":
        roleUser.removeRole(healRole.id);
        reaction.message.channel.send(
          "User " + user.username + " ist jetzt kein Heal mehr"
        );
        break;
        break;
      default:
        break;
    }
  }
});

// Log our bot in
client.login(token);
