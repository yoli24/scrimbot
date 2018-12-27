const Discord = require('discord.js');
const bot = new Discord.Client();
const prefix = '!!!';
var channels = [];
var players = [];

bot.on('ready', async () => {
    console.log("\x1b[42m%s\x1b[0m", `Connected to ${bot.user.tag}!`);
});

bot.on('message', (message) => {
    if (message.channel.type == "dm") return;
    if (message.author.bot) return;

    if (channels.includes(message.channel.id)) {
        if (message.content.length == 3) {
            for (var i = 0; i < players.length; i++) {
                if (players[i].GetId() == message.author.id) {
                    return;
                }
            }
            var p = new Player(message.author.id, message.content);
            players.push(p);
            DisplayPlayers(message.channel);
            return;
        }
    }

    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    var cmd = message.content.split(' ')[0];
    if (cmd.startsWith(prefix)) {
        switch (cmd) {
            case prefix + "start":
                if (channels.includes(message.channel.id)) {
                    message.channel.send(message.author + " Already started.");
                    return;
                }
                if (channels.length >= 1) {
                    message.channel.send(message.author + " Bot is busy.");
                    return;
                }
                message.channel.send(message.author + " Added channel.");
                channels.push(message.channel.id);
                console.log(channels);
                break;

            case prefix + "stop":
                if (!channels.includes(message.channel.id)) {
                    message.channel.send(message.author + " Channel is not running.");
                    return;
                }
                var index = channels.indexOf(message.channel.id);
                channels.splice(index, 1);
                players = [];
                message.channel.send(message.author + " Stopped.");
            default:
                message.channel.send("Commands: " + prefix + "Start," + prefix + "Stop");
                break;
        }
    }

});
function DisplayPlayers(channel) {
    var codeRegions = [];
    for (var i = 0; i < players.length; i++) {
        if (!codeRegions.includes(players[i].GetCode())) {
            codeRegions.push(players[i].GetCode());
        }
    }
    var codeText = "";
    var currentCodeText ="";
    const emb = new Discord.RichEmbed()
    .setTitle('Scrim codes')
    for (var i = 0; i < codeRegions.length; i++) {
        codeText += codeRegions[i] + " players:\n";
        currentCodeText = "";
        for (var j = 0; j < players.length; j++) {
            if(j>=25)
                break;
            if (players[j].GetCode() == codeRegions[i]) {
                var currentUser = bot.users.find("id", players[j].GetId());
                codeText += currentUser + "\n";
                currentCodeText+=currentUser+"\n";
            }
        }
        emb.addField(codeRegions[i], currentCodeText, true);
    }

    
      if(emb != null)
           message.channel.sendEmbed(emb);

}

bot.login(process.env.BOT_TOKEN);

class Player {

    constructor(id, code) {
        this.id = id;
        this.code = code;
    }
    GetId() {
        return this.id;
    }
    GetCode() {
        return this.code;
    }
}
