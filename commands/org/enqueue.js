const { Command } = require("discord.js-commando");
module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: "enqueue",
      group: "org",
      memberName: "enqueue",
      description: "Adds a user to the queue.",
      examples: ["purge 10 (deletes last 10 messages)"],
      hidden: true,
      args: [
        {
          key: "user",
          prompt: "How many messages should I purge?",
          type: "user"
        }
      ]
    });
  }

  run(msg, { user }) {}
};
