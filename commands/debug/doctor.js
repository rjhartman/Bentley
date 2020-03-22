const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const bot = require("../../main");

module.exports = class DoctorCommand extends Command {
  constructor(client) {
    super(client, {
      name: "doctor",
      group: "debug",
      memberName: "doctor",
      description: "Checks if Bentley is installed correctly.",
      examples: ["doctor"],
      userPermissions: ["MANAGE_MESSAGES"]
    });
  }

  run(msg) {
    var healthScore = 0;
    var embed = new RichEmbed();
    var errorEmote = ":octagonal_sign:";
    var successEmote = ":white_check_mark:";

    if (bot.eventsDataChannel) {
      embed.addField(`${successEmote} Events JSON channel connected`, "` `");
      healthScore++;
    } else {
      embed.addField(
        `${errorEmote} Events JSON channel error`,
        'Make sure Bentley can reach a channel called "events-json"'
      );
    }
    if (bot.eventsChannel) {
      embed.addField(`${successEmote} Events channel connected`, "` `");
      healthScore++;
    } else {
      embed.addField(
        `${errorEmote} Events channel error`,
        'Make sure Bentley can reach a channel called "events"'
      );
    }
    if (bot.messageLogsChannel) {
      embed.addField(`${successEmote} Message logs channel connected`, "` `");
      healthScore++;
    } else {
      embed.addField(
        `${errorEmote} Message logs channel error`,
        'Make sure Bentley can reach a channel called "message-logs"'
      );
    }
    if (bot.pfpLogsChannel) {
      embed.addField(
        `${successEmote} Profile picture logs channel connected`,
        "` `"
      );
      healthScore++;
    } else {
      embed.addField(
        `${errorEmote} Profile picture logs channel error`,
        'Make sure Bentley can reach a channel called "pfp-logs"'
      );
    }
    if (bot.nickLogsChannel) {
      embed.addField(`${successEmote} Nickname logs channel connected`, "` `");
      healthScore++;
    } else {
      embed.addField(
        `${errorEmote} Nickname logs channel error`,
        'Make sure Bentley can reach a channel called "nickname-logs"'
      );
    }
    if (bot.botChannel) {
      embed.addField(`${successEmote} Bot chat channel connected`, "` `");
      healthScore++;
    } else {
      embed.addField(
        `${errorEmote} Bot chat channel error`,
        'Make sure Bentley can reach a channel called "bot_chat"'
      );
    }
    if (bot.lightshotChannel) {
      embed.addField(`${successEmote} Lightshot channel connected`, "` `");
      healthScore++;
    } else {
      embed.addField(
        `${errorEmote} Lightshot channel error`,
        'Make sure Bentley can reach a channel called "lightshot"'
      );
    }
    if (healthScore <= 3) {
      embed.setColor("#E10000").setTitle("Detected Significant Issues");
    } else if (healthScore == 6) {
      embed.setColor("#00DA07").setTitle("All Tests Passed");
    } else {
      embed.setColor("#F3FF00").setTitle("Detected Some Issues");
    }

    msg.channel.send(embed);
  }
};
