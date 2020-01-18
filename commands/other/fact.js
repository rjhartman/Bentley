const { Command } = require("discord.js-commando");
const fetch = require("node-fetch");
const bot = require("../../main");

module.exports = class DankCommand extends Command {
  constructor(client) {
    super(client, {
      name: "fact",
      group: "other",
      memberName: "fact",
      description: "Get a #funfact",
      examples: ["fact"],
      aliases: ["fun-fact"]
    });
  }

  run(msg) {
    if (msg.channel == bot.botChannel)
      fetch("https://uselessfacts.jsph.pl/random.json?language=en")
        .then(response => {
          return response.json();
        })
        .then(response => {
          msg.reply(response.text);
        })
        .catch(e => {
          console.log(`ERROR: Failed to retrieve a random fact, ${e}`);
        });
  }
};
