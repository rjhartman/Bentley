const { Command } = require("discord.js-commando");
module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: "purge",
            group: "mod",
            memberName: "purge",
            description: "Purges a given number of messages.",
            examples: ["purge 10 (deletes last 10 messages)"],
            args: [
                {
                    key: "number",
                    prompt: "How many messages should I purge?",
                    type: "integer"
                }
            ]
        });
    }

    run(msg, { number }) {
        if(number <= 0) {
            return msg.reply(`Cannot purge ${number} of messages.`)
        } else if(number > 100) {
            return msg.reply(`Cannot purge ${number}, as it exceeds the max of 100 messages.`)
        }
        msg.delete();
        msg.channel.bulkDelete(number)
        .then(messages => { console.info(`Succesfully deleted ${messages.size} messages.`)})
        .catch(e => {console.error(`Couldn't delete ${number} messages. ${e}`) });
    }
};
