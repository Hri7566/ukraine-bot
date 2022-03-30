require('dotenv').config();
const Discord = require('discord.js');

let cl = new Discord.Client({
    intents: [
        'DIRECT_MESSAGES',
        'GUILDS',
        'GUILD_MESSAGES'
    ]
});

cl.on('messageCreate', handleMessage);
cl.on('messageUpdate', handleMessage);

class Command {
    constructor (name, desc, func) {
        this.name = name;
        this.desc = desc;
        this.func = func;
    }
}

let commands = [];

let prefix = '!';

function addCmd(name, desc, func) {
    commands.push(new Command(name, desc, func));
}

const fetch = require('node-fetch');

addCmd('ukraine', 'Get info about ukraine.', msg => {
    fetch("https://ukrainewarnews.herokuapp.com/news").then(res => res.json()).then(json => {
        let embed = new Discord.MessageEmbed()
            .setTitle('Ukraine')
            .setColor('#ff0000')
            .setDescription('News about the Ukrainian War');
        
        for (let i = 0; i < 10; i++) {
            embed.addField(json[i].title, json[i].url);
        }

        msg.channel.send({
            embeds: [
                embed
            ]
        });
    });
});

function handleMessage(msg) {
    msg.a = msg.content;
    msg.args = msg.a.split(' ');
    msg.argcat = msg.a.substring(msg.args[0].length ).trim();
    msg.cmd = msg.args[0].substring(prefix.length).toLowerCase();

    if (!msg.a.startsWith(prefix)) return;

    for (let cmd of commands) {
        if (msg.cmd === cmd.name) {
            cmd.func(msg);
            return;
        }
    }
}

cl.login(process.env.DISCORD_TOKEN);
