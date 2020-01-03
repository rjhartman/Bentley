require('dotenv').config();
const Commando = require('discord.js-commando');
const path = require('path');
const token = process.env.TOKEN;
const client = new Commando.Client({
	owner: process.env.ID,
});

client.registry
	.registerGroups([
		['help', 'Helpful commands'],
		['other', 'Miscellaneous commands'],
	])
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(token);
client.on('ready', () => {
	console.info(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
	if(msg.content === '!stats') {
		console.info(`User "${msg.author.username}#${msg.author.tag}" issued command !stats.`)
		msg.channel.send(`
		Server name: ${msg.guild.name}, 
		Total members: ${msg.guild.memberCount}
		Server owner: ${msg.guild.owner}, ID: ${msg.guild.ownerID}
		Roles: `);
		msg.guild.roles.forEach(role => {
			msg.channel.send(`\t\t\n${role.name}`);
		});
	}
});