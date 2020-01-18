const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const randomColor = require("../../util/random-color");
const uuid = require("uuid/v1");
const bot = require("../../main");
module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: "event-add",
      aliases: ["events-add", "add-event"],
      group: "events",
      memberName: "event-add",
      description: "Adds an event that users can sign up for.",
      examples: ["event-add <name>"],
      userPermissions: ["MANAGE_MESSAGES"],
      args: [
        {
          key: "eventName",
          prompt: "What is the name for this event?",
          type: "string"
        },
        {
          key: "eventDesc",
          prompt: "Give me a description of the event.",
          type: "string"
        },
        {
          key: "eventGame",
          prompt: "What is the game for this event?",
          type: "string"
        },
        {
          key: "eventMaxUsers",
          prompt: "Should there be a max amount of users for this event?",
          type: "integer",
          default: -1,
          validate: number => {
            if (number <= 0) {
              return `There cannot be a max of ${number} users.`;
            } else {
              return true;
            }
          }
        }
      ]
    });
  }

  run(msg, { eventName, eventDesc, eventGame, eventMaxUsers }) {
    if (eventMaxUsers == -1) {
      eventMaxUsers = null;
    }
    var uuid = uuid();
    const encodedEvent = {
      id: uuid,
      name: eventName,
      desc: eventDesc,
      game: eventGame,
      maxUsers: eventMaxUsers
    };
    const embed = new RichEmbed()
      .setColor(randomColor())
      .setTitle(eventName)
      .setAuthor(msg.author.tag, msg.author.avatarURL)
      .setDescription(eventDesc)
      .addField("Game", eventGame)
      .addField("Date: ", new Date())
      .addField("UUID:", uuid);
    switch (eventGame) {
      case "CS:GO":
        embed.setThumbnail("https://i.redd.it/1s0j5e4fhws01.png");
        break;
      case "Rocket League":
        embed.setThumbnail(
          "https://cdn11.bigcommerce.com/s-sq9zkarfah/images/stencil/1280x1280/products/125809/119078/Rocket-League-Logo-Vinyl-Decal-Sticker__03077.1507851430.jpg?c=2&imbypass=on"
        );
        break;
    }
    bot.eventsDataChannel.send(`${JSON.stringify(encodedEvent)}`);
    bot.events.push(encodedEvent);
    bot.eventsChannel.send(embed);
  }
};
