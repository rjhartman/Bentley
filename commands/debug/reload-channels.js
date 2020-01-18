const { Command } = require("discord.js-commando");
const reloadChannels = require("../../util/get-channels");

module.exports = class ReloadChannelsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "reload-channels",
      group: "debug",
      memberName: "reload-channels",
      description: "Reloads the channels used by Bentley.",
      examples: ["reload"],
      userPermissions: ["MANAGE_MESSAGES"]
    });
  }

  run(msg) {
    reloadChannels();
    msg.reply("reloaded channels");
  }
};
