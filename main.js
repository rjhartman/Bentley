require('dotenv').config();
const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const path = require('path');
const token = process.env.TOKEN;
const client = new Commando.Client({
    owner: process.env.ID,
});

client.registry
    .registerGroups([
    ['help', 'Helpful commands'],
    ['other', 'Miscellaneous commands']
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(token);
client.on('ready', () => {
    console.info(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
    if(msg.content == 'ping') {
        msg.reply('pong');
        msg.channel.send('pong');
    }
});