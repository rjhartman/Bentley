const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const randomColor = require("../../util/random-color");
const bot = require("../../main");

function getEventEmoji(eventName) {
  switch (eventName) {
    case "CS:GO":
      return "<:csgo:667898182553829396>";
    case "Rocket League":
      return "<:rocketleague:667899032579997726>";
    default:
      return "";
  }
}

module.exports = class EventsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "events",
      group: "events",
      memberName: "events",
      description: "Lists the current events and their IDs",
      examples: ["event"],
      userPermissions: ["MANAGE_MESSAGES"]
    });
  }

  run(msg) {
    if (bot.events && bot.events.length > 0) {
      var i = 1;
      var embed = new RichEmbed()
        .setColor(randomColor())
        .setTitle(`Current Events`);
      bot.events.forEach(event => {
        embed.addField(
          `${i}. ${event.name} - ${event.game} ${getEventEmoji(event.game)}`,
          `${event.desc}`
        );
        i++;
      });
      msg.channel.send(embed);
    } else {
      msg.reply("There are no current events.");
    }
  }
};
