const { Command } = require("discord.js-commando");
module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: "dm",
            group: "other",
            memberName: "dm",
            description: "Direct messages a user a message.",
            examples: ["dm @user <message>"],
            args: [
                {
                    key: "user",
                    prompt: "Who should I send a message?",
                    type: "user"
                },
                {
                    key: "text",
                    prompt: "What should I send this user?",
                    type: "string"
                }
            ]
        });
    }

    run(msg, { user, text }) {
        msg.delete();
        console.info(`Sent ${user} direct message: ${text}`);
        user.send(text);
    }
};
