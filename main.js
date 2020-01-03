require("dotenv").config();
const Command = require("discord.js-commando");
const path = require("path");
const token = process.env.TOKEN;
const client = new Command.Client({
  owner: process.env.OWNER_ID
});

client.registry
  .registerGroups([
    ["help", "Helpful commands"],
    ["other", "Miscellaneous commands"]
  ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, "commands"));

client.login(token);
client.on("ready", () => {
  console.info(`Logged in as ${client.user.tag}`);
  client.user.setPresence({
    status: "online",
    game: { name: "with consciousness" }
  });
});

client.on("message", msg => {
  if (msg.content == "ping") {
    msg.reply("pong");
    msg.channel.send("pong");
  } else if (msg.content === ".myconfig") {
    msg.reply(`${msg.author.tag}, your ID is ${msg.author.id}`);
  }
});
