# How To

1.  Download Code
2.  Do "npm install" in root folder
3.  Create a private.js file in root with content:

```
    module.exports = {
    botToken: "YOUR BOT TOKEN"
    };
```

4.  Replace all icons and role names according to your wishes in code
5.  Do "node app.js"

Bot needs the following rights:

1.  Role Management
2.  Send Messages
3.  Manage Messages (to create pin/sticky messages)
4.  Bot role must be higher than the roles he provides

Additional information regarding Emojis:
Some code editors (e.g. VS Code) can show the emoji graphics by default if you copy them directly form browser (e.g. form here https://unicode.org/emoji/charts/full-emoji-list.html).
Others (like Notepad++) will replace them with the according Unicode.

For DiscordJS this guide maybe helps:
https://anidiotsguide_old.gitbooks.io/discord-js-bot-guide/content/coding-guides/using-emojis.html

Create Bot and get a token:
https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token

Add to server:
https://github.com/jagrosh/MusicBot/wiki/Adding-Your-Bot-To-Your-Server
