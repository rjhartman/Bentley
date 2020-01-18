const { Command } = require("discord.js-commando");
const fetch = require("node-fetch");
const bot = require("../../main");

module.exports = class DankCommand extends Command {
  constructor(client) {
    super(client, {
      name: "dank",
      group: "other",
      memberName: "dank",
      description: "You'll see.",
      examples: ["dank"],
      aliases: ["meme"]
    });
  }

  run(msg) {
    if (msg.channel == bot.botChannel)
      fetch("https://meme-api.herokuapp.com/gimme/1")
        .then(response => {
          return response.json();
        })
        .then(response => {
          msg.reply(response.memes[0].url);
        })
        .catch(e => {
          console.log(`ERROR: Failed to retrieve a meme, ${e}`);
        });
  }
};
