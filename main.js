require("dotenv").config();
const { RichEmbed } = require("discord.js");
const { CommandoClient, SQLiteProvider } = require("discord.js-commando");
const loadChannels = require("./util/get-channels");
const path = require("path");
const sqlite = require("sqlite");
const args = process.argv.slice(2);
var token = "";

if (args[0] == "dev") {
  token = process.env.DEV_TOKEN;
} else {
  token = process.env.TOKEN;
}
const client = new CommandoClient({
  owner: process.env.OWNER_ID,
  unknownCommandResponse: false,
  nonCommandEditable: false
});

client.registry
  .registerGroups([
    ["help", "Helpful commands"],
    ["mod", "Moderation commands"],
    ["debug", "Debugging commands"],
    ["events", "Events related commands"],
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

var messageLogsChannel = client.channels.find("name", "chat-logs");
client.on("ready", () => {
  console.info(`Logged in as ${client.user.tag}`);
  module.exports.client = client;
  client.user.setPresence({
    status: "online",
    game: { name: "with consciousness" }
  });
  loadChannels();
});

client.on("messageDelete", msg => {
  if (messageLogsChannel) {
    embed = new RichEmbed()
      .setColor("#FFE800")
      .setTitle(`Deleted Message in #${msg.channel.name}`)
      .setAuthor(msg.author.tag, msg.author.avatarURL)
      .setDescription(msg.content);
    if (msg.attachments) {
      msg.attachments.forEach(attachment => {
        embed.addField("Attachment", attachment.url);
      });
      embed.addField("Date:", new Date(), true);
    }
    messageLogsChannel.send(embed);
  } else {
    console.error(
      `ERROR: Couldn't log deleted message by ${msg.author.tag} because the message logs channel cannot be found. Please make sure Bentley has access to a channel named "message-logs".`
    );
  }
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
  if (msg.content == "!shutdown") {
    msg.author.send("Shutting down.");
    client.destroy();
  }
});

client.on("userUpdate", (oldUser, newUser) => {
  if (oldUser.avatarURL != newUser.avatarURL) {
    if (messageLogsChannel) {
      embed = new RichEmbed()
        .setColor("#00A3DB")
        .setTitle(`Profile Picture Change`)
        .setAuthor(newUser.tag, newUser.avatarURL)
        .setThumbnail(oldUser.avatarURL)
        .setImage(newUser.avatarURL)
        .addField("Date:", new Date(), true);
      messageLogsChannel.send(embed);
    } else {
      console.error(
        `ERROR: Couldn't log profile picture update by ${newUser.tag} because the message logs channel cannot be found. Please make sure Bentley has access to a channel named "message-logs".`
      );
    }
  }
});
