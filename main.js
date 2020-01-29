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
    console.error(`Failed to connect sqlite database. ${e}`);
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
  exports.client = client;
  exports.permits = [];
  client.user.setPresence({
    status: "online",
    game: { name: "with consciousness" }
  });
  loadChannels();
  exports.messageLogsChannel.send("I'm alive!");
  console.log(`| Logged in as ${client.user.tag}`);
  console.log("+===============================================");
});

client.on("messageDelete", msg => {
  if (exports.messageLogsChannel) {
    embed = new RichEmbed()
      .setColor("#FFE800")
      .setTitle(`Deleted Message in #${msg.channel.name}`)
      .setAuthor(msg.author.tag, msg.author.avatarURL)
      .setDescription(msg.content);
    if (msg.attachments) {
      msg.attachments.forEach(attachment => {
        embed.addField("Attachment", attachment.url);
      });
      embed.setImage(msg.attachments[0]);
      embed.addField("Date:", new Date(), true);
    }
    exports.messageLogsChannel.send(embed);
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
});

client.on("userUpdate", (oldUser, newUser) => {
  if (oldUser.avatarURL != newUser.avatarURL) {
    if (exports.messageLogsChannel) {
      embed = new RichEmbed()
        .setColor("#00A3DB")
        .setTitle(`Profile Picture Change`)
        .setAuthor(newUser.tag, newUser.avatarURL)
        .setThumbnail(oldUser.avatarURL)
        .setImage(newUser.avatarURL)
        .addField("Date:", new Date(), true);
      exports.messageLogsChannel.send(embed);
    } else {
      console.error(
        `ERROR: Couldn't log profile picture update by ${newUser.tag} because the profile picture logs channel cannot be found. Please make sure Bentley has access to a channel named "pfp-logs".`
      );
    }
  }
  if (oldUser.username != newUser.username) {
    if (exports.nickLogsChannel) {
      embed = new RichEmbed()
        .setColor("#E400FF")
        .setTitle(`Nickname change`)
        .addField("Old:", oldUser.username, true)
        .addField("New:", newUser.username, true)
        .setAuthor(newUser.tag, newUser.avatarURL)
        .addField("Date:", new Date());
      exports.messageLogsChannel.send(embed);
    } else {
      console.error(
        `ERROR: Couldn't log nickname update by ${newUser.tag} because the nickname logs channel cannot be found. Please make sure Bentley has access to a channel named "nickname-logs".`
      );
    }
  }
});

client.on("messageUpdate", (oldMsg, newMsg) => {
  if (oldMsg.content != newMsg.content) {
    if (exports.messageLogsChannel) {
      embed = new RichEmbed()
        .setColor("#FF7C00")
        .setTitle(`Edited Message in #${newMsg.channel.name}`)
        .setAuthor(newMsg.author.tag, newMsg.author.avatarURL)
        .setDescription(newMsg.content);
      if (newMsg.attachments) {
        newMsg.attachments.forEach(attachment => {
          embed.addField("Attachment", attachment.url);
        });
        embed.setImage(newMsg.attachments[0]);
        embed.addField("Date:", new Date(), true);
      }
      exports.messageLogsChannel.send(embed);
    } else {
      console.error(
        `ERROR: Couldn't log message edit by ${newUser.tag} because the message logs channel cannot be found. Please make sure Bentley has access to a channel named "message-logs".`
      );
    }
  }
});

client.on("guildMemberAdd", newUser => {
  newUser = newUser.user;
  embed = new RichEmbed()
    .setColor("#40ff00")
    .setTitle(`User Joined`)
    .setAuthor(newUser.tag, newUser.avatarURL)
    .addField("Date:", new Date(), true);
  exports.messageLogsChannel.send(embed);
});

client.on("guildMemberRemove", oldUser => {
  oldUser = oldUser.user;
  embed = new RichEmbed()
    .setColor("#ff0000")
    .setTitle(`User Left`)
    .setAuthor(oldUser.tag, oldUser.avatarURL)
    .addField("Date:", new Date(), true);
  exports.messageLogsChannel.send(embed);
});
