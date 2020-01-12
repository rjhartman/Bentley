require("dotenv").config();
const { RichEmbed } = require("discord.js");
const { CommandoClient, SQLiteProvider } = require("discord.js-commando");
const path = require("path");
const sqlite = require("sqlite");
const token = process.env.TOKEN;
const client = new CommandoClient({
  owner: process.env.OWNER_ID,
  unknownCommandResponse: false,
  nonCommandEditable: false
});

client.registry
  .registerGroups([
    ["help", "Helpful commands"],
    ["mod", "Moderation commands"],
    ["org", "Organization commands"],
    ["other", "Miscellaneous commands"]
  ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, "commands"));

sqlite
  .open(path.join(__dirname, "settings.sqlite3"))
  .then(db => {
    client.setProvider(new SQLiteProvider(db));
  })
  .catch(e => {
    console.error(`Failed to connect sqlite database.`);
  });

client.setProvider(
  sqlite
    .open(path.join(__dirname, "settings.sqlite3"))
    .then(db => new SQLiteProvider(db))
    .catch(console.error)
);

client.login(token);

client.on("ready", () => {
  console.info(`Logged in as ${client.user.tag}`);
  client.user.setPresence({
    status: "online",
    game: { name: "with consciousness" }
  });
});

client.on("messageDelete", msg => {
  embed = new RichEmbed()
    .setColor("#FFE800")
    .setTitle("Deleted Message")
    .setAuthor(msg.author.tag, msg.author.avatarURL)
    .setDescription(msg.content);
  if (msg.attachments) {
    msg.attachments.forEach(attachment => {
      embed.addField("Attachment", attachment.url);
    });
    embed.addField("Date:", new Date(), true);
  }
  msg.channel.send(embed);
});

client.on("message", msg => {
  if (msg.content.includes("discord.gg/" || "discord.app/invite/")) {
    msg.delete().then(() => {
      embed = new RichEmbed()
        .setColor("#E00000")
        .setTitle("Blocked Message")
        .setAuthor(msg.author.tag, msg.author.avatarURL)
        .setDescription(msg.content)
        .addField("Reason:", "Detected a Discord invite.")
        .addField("Date:", new Date());
      msg.author.send(
        `Sorry, but it seems you sent an invite link in the channel **${msg.channel.name}**. Invite links are not allowed unless you are permitted by a moderator. If you believe this is an error, please contact an administrator.`
      );
      msg.author.send(embed);
    });
  }
});
