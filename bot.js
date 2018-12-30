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
                if (players[i].GetId() == message.author.id && message.author.id!='242360233593274369') {
                    return;
                }
            }
            var p = new Player(message.author.id, message.content);
            players.push(p);
            try {
                DisplayPlayers(message.channel);
            }
            catch (error) {
                console.log(error);
            }
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
                break;

            case prefix + "stop":
                if (!channels.includes(message.channel.id)) {
                    message.channel.send(message.author + " Channel is not running.");
                    return;
                }
                players = [];
                channels = [];
                message.channel.send(message.author + " Stopped.");
                break;
            case prefix + "message":
                var text = message.content.substring(cmd.length);
                var emb = new Discord.RichEmbed()
                    .addField('מה הולך חברים', text)
                    .setColor('08BDFF')
                message.channel.sendEmbed(emb);
                break;

            default:
                message.channel.send("Commands: " + prefix + "Start," + prefix + "Stop");
                break;
        }
    }

});
function SortCodes(codesClasses){
    var sorted = false;
    while(!sorted){
        sorted = true;
        for(var i =0;i<codesClasses.length-1;i++){
            if(codesClasses[i].GetPlayerAmount()<codesClasses[i+1].GetPlayerAmount()){
                sorted = false;
                var temp = codesClasses[i];
                codesClasses[i] = codesClasses[i+1];
                codesClasses[i+1] = temp;
            }
        }
    }
    return codesClasses;
}
function DisplayPlayers(channel) {
    var codeRegions = [];
    var codesClasses = [];
    for (var i = 0; i < players.length; i++) {
        if (!codeRegions.includes(players[i].GetCode())) {
            codeRegions.push(players[i].GetCode());
            var newCodeClass = new Code(players[i].GetCode());
            newCodeClass.AddPlayer(players[i].GetId());
            codesClasses.push(newCodeClass);
        }
        else{
            for(var j=0;j<codesClasses.length;j++){
                if(codesClasses[j].GetCode()==players[i].GetCode()){
                    codesClasses[j].AddPlayer(players[i].GetId());
                    break;
                }
            }
        }
    }
    codesClasses = SortCodes(codesClasses);
    const emb = new Discord.RichEmbed()
        .setTitle('Scrim codes')
        .setColor('08BDFF')
    var textForSingle = "";
    for(var i =0;i<codesClasses.length;i++){
        var currentCodeText = " ";
        if(codesClasses[i].GetPlayerAmount()==1)
        {
            var currentUser = bot.users.find("id", codesClasses[i].GetPlayerId(0));
            textForSingle += currentUser + "("+codesClasses[i].GetCode()+ ")"+" ";
        }
        else{
            for(var j =0;j<codesClasses[i].GetPlayerAmount();j++){
                var currentUser = bot.users.find("id", codesClasses[i].GetPlayerId(j));
                currentCodeText += currentUser + "\n";
            }
            emb.addField(codesClasses[i].GetCode(), currentCodeText, true);
        }
    }
    if(textForSingle!="")
        emb.addField("Single codes",textForSingle);
    channel.sendEmbed(emb);
}

bot.login('NTI4Mjg4MDMwNzcxOTA0NTE2.DwgHKg.W034nAjuxxjHliHc9b1sLnEaE4A');//(process.env.BOT_TOKEN);
class Code{
    constructor(code){
        this.code = code;
        this.players = [];
    }
    GetCode(){
        return this.code;
    }
    AddPlayer(playerID){
        this.players.push(playerID);
    }
    HasPlayer(playerID){
        return this.players.includes(playerID);
    }
    GetPlayerAmount(){
        return this.players.length;
    }
    GetPlayerId(index)
    {
        return this.players[index];
    }
}

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
