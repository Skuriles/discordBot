# How To

1.  Download Code
2.  Do `npm install` in root folder
3.  Create a ".env" file in root with content:

    ```
    BOTTOKEN=<YOUR BOT TOKEN>
    ```

4.  Configure `configuration.json` to your wishes (roles will be automatically added on bot start if they not already exist). You can find a full example in the repository.

    1.  `"yourServerNames": ["Servername"]` => List of Guilds (Server) the bot is running on.
    2.  `"welcomeChannelName": "welcome",` => Name of channel the bot creates if it does not already exist and where it posts its role messages. Changing the name of the channel can cause problems. So if you want to change, just change the configuration.json and restart the bot. The bot reactions will be gone, but the role assignments will not be affected.
    3.  `"welcomeChannelMessages": [{` => List of welcome messages

        1.  `"text": "Welcome, choose your role!",` => Text of the welcome message
        2.  List of roles of the bot. The roles will be created with default rights if they don't exist. For roleSetText and roleRemoveText you can use "[username]" tag which will be replaced by the the name of the user:
            ```
                    "roles": [
                            {
                                "icon": "🤠",
                                "roleName": "tank",
                                "roleSetText": "[username] is now role tank",
                                "roleRemoveText": "[username] is no tank anymore",
                                "color": "BLUE"
                                }..
                            ]},{
                                "text": "message2",
                                "roles: [...more roles]
                            }],
            ```
        3.  Emojis: Please read about emojis at bottom\*\*\*


    4.  List of serverMessages the bot can react to. (Maybe will be extended in future versions):
        ```
                "serverMessages": [
                        {
                        "reactMessage": "ping",
                        "botAnswer": "pong"
                        }
                    ]
        ```

5.  Be sure that the bot is assigned to server (guild) and has the role rights from below before starting the bot. Otherwise it could lead to a crash.
6.  To start the bot write `node server.js` in the root of your bot folder

## Edit/Update Bot messages

Discord does even Administrators not allow to edit messages from other users, including bots. This bot has a `editBotMessage` interface. This can be used to update bot messages without restarting the bot or reset the channel.
To use it just type  
`!editBotMessage[1] <YOUR NEW MESSAGE>`  
in the Chat.

Explanation:

* `!editBotMessage` is the command for the bot. This is only available for server administrators!!
* `[1]` is the index of the message you want to edit. First message you added in `configuration.json` is index 1, second is index 2....
* `<YOUR NEW MESSAGE>` the text of your new message. This will completly override the bot message. So if you want to edit the existing message, just copy and paste the original message and then edit.

Important:

* The reactions (and with it the role assignments etc.) are not affected by `editBotMessage`. So you can change the message without any lose of data.

## Bot needs the following rights:

1.  Role Management
2.  Send Messages
3.  Manage Messages (to create pin/sticky messages)
4.  Bot role must be higher than the roles he provides (this will automatically be achieved if the bot creates on it's own the roles on startup (measn the role does not exist on bot start))

## Where can I run my bot?

1.  You can host the bot on any server or on a webhoster which has node.js > V8.0.0 installed. For german speaking people witg some knowledge in Linux Terminal (or want to learn it) I prefer https://uberspace.de.
2.  A free hosting solution would be Glitch.com (no guarantee for security issues from my side!)
    1.  Small guide https://anidiotsguide_old.gitbooks.io/discord-js-bot-guide/content/other-guides/hosting-on-glitchcom.html
    2.  Don't forget to switch the project to "private", otherwise everyone can modify your bot code which is not recommended.
3.  Easiest way to run the bot on glitch.com is to create an account (or login with Github if you have an account), start a new project, open "Project options" in the top left corner, go to "Advanced Options" => "Import from Github", enter the name of this repository "Skuriles/discordBot" and import the current version of the bot. Then add the `.env` file and modifiy the `configuration.json` to your wishes as described above. On every change on a file Glitch will try to restart the Bot (this behavior can be set to false). So don't wonder if there are some errors at the beginning. If you are finished, to restart your bot you can simply modify a file (e.g. add or a remove a space), as there is not start/stop functionality in glitch.com (you can simply break the code by opening package.json and change the script tag "node server.js" to something which will break startup like "no node server.js". If you now close the glitch.com browser window, the app stops restarting after 5 minutes => if the bot is correctly started it will run if you close the browser session for sure :-))

For DiscordJS this guide maybe helps:
https://anidiotsguide_old.gitbooks.io/discord-js-bot-guide/content/coding-guides/using-emojis.html

Create Bot and get a token:
https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token

Add to server:
https://github.com/jagrosh/MusicBot/wiki/Adding-Your-Bot-To-Your-Server

## About Emojis\*\*\*

Additional information regarding Emojis:
The bot can handle three types of emojis:

1.  Unicode emojis => just copy the raw 🤠 emoji in the configuration.json file (don't forget the "quotes"). Discord supports all official unicode emojis
    (e.g. form here https://unicode.org/emoji/charts/full-emoji-list.html). Most code editors (e.g. VS Code, notepad++) can show the emoji by default if you copy them directly from browser (others maybe not => check your editor).
    Example:
    `"icon": "🤠",`
2.  Alias => in case of uploaded emojis just add the alias, including the colons before and at the end of alias (without it will not work!!). You can find the alias near to the uploaded emoji in server settings.
    Example:
    `"icon": ":myemojialias:",`
3.  ID => Each Emoji has an unique ID on each server. So this is just for special cases. To use an ID for an emoji add `"[id]"` before the emoji ID so that the bot knows it has to search for an emoji ID instead of an alias or a raw emoji
    Example:
    `"icon": "[id]1293345678120",`
4.  The server will write a message if the emoji wasn't found => `"Emoji not found"`
5.  Be sure to use unique emojis for each role (even if they are used for different messages). Otherwise it could cause errors (double assignment etc.)
