const { Command } = require("discord.js-commando");
module.exports = class VibeCheckCommand extends Command {
  constructor(client) {
    super(client, {
      name: "vibe-check",
      group: "other",
      memberName: "vibe-check",
      description: "Checks your vibes.",
      examples: ["vibe-check"]
    });
  }

  run(msg) {
    var vibeage = Math.floor(Math.random() * 100);
    if (vibeage == 0) {
      return msg.reply(`wow. 0% vibeage. Vibe check failed.`);
    } else if (vibeage == 100) {
      return msg.reply(
        `your vibe meter is at ${vibeage}. You are most definitely vibing.`
      );
    } else {
      return msg.reply(`your vibe meter is at ${vibeage}%`);
    }
  }
};
