const Discord = require("discord.js");
const private = require("./private");

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = private.botToken;

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
    message.channel.send("I don't want to run anymore").then((message) => {
      message.react("🍰");
    });
  }
  if (message.content === "what is my avatar") {
    // Send the user's avatar URL
    message.reply(message.author.avatarURL);
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  if (reaction.emoji.name === "🍰" && reaction.me) {
    for (var [key, value] of reaction.users) {
      reaction.message.channel.send(
        "User " + value.username + " hat mein Emoji geklickt"
      );
    }
  } else {
    console.log("Error");
  }
});

// Log our bot in
client.login(token);
