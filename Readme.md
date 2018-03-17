# How To

1.  Download Code
2.  Do ```npm install``` in root folder
3.  Create a ".env" file in root with content:

```
   BOTTOKEN=<YOUR BOT TOKEN>
```

4.  Configure configuration.json to your wishes (roles will be automatically added on bot start if they not already exist)
    1. ```"yourServerNames": ["Servername"]``` => List of Guilds (Server) the bot is running on.
    2. ```"welcomeChannelName": "willkommen",``` => Name of channel the bot creates if it does not already exist and where it posts it's role message
    3. ```"welcomeChannelText": "Herzlich willkommen, wähle deine Rolle!",``` => Text of the welcome message 
    4. ```"roles": [
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
    5. ```"serverMessages": [
            {
            "reactMessage": "ping",
            "botAnswer": "pong"
            }
        ]
        ```
        => List of serverMessages the bot can post. (Maybe will be extended in future versions)
5.  Do ```node server.js```

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
