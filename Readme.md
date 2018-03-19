# How To

1.  Download Code
2.  Do `npm install` in root folder
3.  Create a ".env" file in root with content:

```
   BOTTOKEN=<YOUR BOT TOKEN>
```

4.  Configure configuration.json to your wishes (roles will be automatically added on bot start if they not already exist)
    1.  `"yourServerNames": ["Servername"]` => List of Guilds (Server) the bot is running on.
    2.  `"welcomeChannelName": "willkommen",` => Name of channel the bot creates if it does not already exist and where it posts it's role message
    3.  `"welcomeChannelText": "Herzlich willkommen, wähle deine Rolle!",` => Text of the welcome message
    4.  ```"roles": [
        {
            "icon": "🤠",
            "roleName": "tank",
            "roleSetText": "[username] ist jetzt Tank",
            "roleRemoveText": "[username] ist jetzt kein Tank mehr",
            "color": "BLUE"
            }..
        ],
        ```
        => List of roles of the bot. The roles will be created with default rights if they don't exist. For roleSetText and roleRemoveText you can use "[username]" tag which will be replaced by the the nam of the user
    5.  ```"serverMessages": [
            {
            "reactMessage": "ping",
            "botAnswer": "pong"
            }
        ]
        ```
        => List of serverMessages the bot can post. (Maybe will be extended in future versions)
5.  Be sure that the bot is assigned to server (guild) and has the role rights from below before starting the bot. Otherwise it could lead to a crash.
6.  To start the bot write `node server.js` in the root of your bot folder

Bot needs the following rights:

1.  Role Management
2.  Send Messages
3.  Manage Messages (to create pin/sticky messages)
4.  Bot role must be higher than the roles he provides

Where can I run my bot?

1.  You can host the bot on any server or on a webhoster which has node.js > V8.0.0 installed. For german speaking people witg some knowledge in Linux Terminal (or want to learn it) I prefer https://uberspace.de.
2.  A free hosting solution would be Glitch.com (no guarantee for security issues from my side!)
    1.  Small guide https://anidiotsguide_old.gitbooks.io/discord-js-bot-guide/content/other-guides/hosting-on-glitchcom.html
    2.  Don't forget to switch the project to "private", otherwise everyone can modify your bot code which is not recommended.
3.  Easiest way to run the bot on glitch.com is to create an account (or login with Github if you have an account), start a new project, open "Project options" in the top left corner, go to "Advanced Options" => "Import from Github", enter the name of this repository "Skuriles/discordBot" and import the current version of the bot. Then add the `.env` file and modifiy the `configuration.json` to your wishes as described above. On every change on a file Glitch will try to restart the Bot (this behavior can be set to false). So don't wonder if there are some errors at the beginning. If you are finished, to restart your bot you can simply modify a file (e.g. add or a remove a space), as there is not start/stop functionality in glitch.com (you can simply break the code by go to package.json and change the script tag "node server.js" to something which will break startup like "no node server.js". If you now close the glitch.com browser window the app stops restarting after 5 minutes => if the bot is correctly started it will run if you close the browser session for sure :-))

Additional information regarding Emojis:
Some code editors (e.g. VS Code) can show the emoji graphics by default if you copy them directly form browser (e.g. form here https://unicode.org/emoji/charts/full-emoji-list.html).
Others (like Notepad++) will replace them with the according Unicode.

For DiscordJS this guide maybe helps:
https://anidiotsguide_old.gitbooks.io/discord-js-bot-guide/content/coding-guides/using-emojis.html

Create Bot and get a token:
https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token

Add to server:
https://github.com/jagrosh/MusicBot/wiki/Adding-Your-Bot-To-Your-Server
