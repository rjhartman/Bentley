const { Command } = require("discord.js-commando");
module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: "reply",
      group: "other",
      memberName: "reply",
      description: "Replies with a Message.",
      examples: ["reply"]
    });
  }

  run(msg) {
    console.time("timer");
    for (var i = 0; i < 5000; i++) {}
    return msg.reply(`Hi, my name is Bentley!`);
  }
};
