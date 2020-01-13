const { Command } = require("discord.js-commando");
const bot = require("../../main");
module.exports = class SayCommand extends Command {
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
    msg.channel.send(`Current events:`);
    var i = 1;
    bot.events.forEach(event => {
      msg.channel.send(`${i}. ${event.name}`);
      i++;
    });
  }
};
