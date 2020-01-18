const { Command } = require("discord.js-commando");
module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "purge",
      group: "mod",
      memberName: "purge",
      description: "Purges a given number of messages.",
      examples: ["purge 10 (deletes last 10 messages)"],
      userPermissions: ["MANAGE_MESSAGES"],
      args: [
        {
          key: "number",
          prompt: "How many messages should I purge?",
          type: "integer",
          validate: number => {
            if (number <= 0) {
              return `Unable to delete ${number} messages.`;
            } else if (number > 100) {
              return `Unable to delete ${number} messages, as it exceeds the maximum of 100.`;
            } else {
              return true;
            }
          }
        }
      ]
    });
  }

  run(msg, { number }) {
    if (msg.channel.name != "message-logs") {
      console.log(msg.channel.name);
      msg.delete();
      msg.channel
        .bulkDelete(number)
        .then(messages => {
          console.info(`Succesfully deleted ${messages.size} messages.`);
        })
        .catch(e => {
          console.error(`Couldn't delete ${number} messages. ${e}`);
        });
    } else {
      // Log someone tried to purge in the chatlogs channel!
    }
  }
};
