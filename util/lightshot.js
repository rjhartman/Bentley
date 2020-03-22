const bot = require("../main");

function newImage(amt) {
    var ID = bot.lightshot.url.match("[0-9|a-z]*$")[0]
    return "http://prnt.sc/" + (parseInt(ID, 36) + amt).toString(36) // Add one in decimal, then convert to base36
}

function updateEmbed(amt) {
    const newURL = newImage(amt);
    bot.lightshot.url = newURL;
    bot.lightshot.message.edit(newURL);
}

function addReactions() {
    bot.lightshot.message.react('⏫')
    .then(() => bot.lightshot.message.react('⬆'))
    .then(() => bot.lightshot.message.react('⬇'))
    .then(() => bot.lightshot.message.react('⏬'))
    .then(() => console.log("| Succesfully reacted to lightshot message."))
    .catch(err => {
        console.error(`| Error: Couldn't react to lightshot message. ${err}`);
    });

    const filter = (reaction) => {
        return ['⏫', '⬆', '⬇', '⏬'].includes(reaction.emoji.name);
    }
    const collector = bot.lightshot.message.createReactionCollector(filter);
    const parseReaction = (reaction, user) => {
        if (reaction.emoji.name === '⏫') {
            updateEmbed(10);
        } else if (reaction.emoji.name === '⬆') {
            updateEmbed(1);
        } else if (reaction.emoji.name === '⬇') {
            updateEmbed(-1);
        } else {
            updateEmbed(-10);
        }
        bot.lightshot.message.reactions.forEach((reac, usr) => {
            if (usr == user) {
                reac.remove();
            }
        })
    }
    collector.on("collect", parseReaction);
}

function init() {
    bot.lightshot = {};
    if (bot.lightshotChannel) {
        console.log("| Initializing lightshot...");
        bot.lightshotChannel.fetchMessages({ limit: 1 }).then(messages => {
            let url;
            if (!messages.first() || messages.first().author != bot.client.user) {
                url = "https://prnt.sc/qmin1k";
            } else {
                url = messages.first().content;
                messages.first().delete();
            }
            bot.lightshot.url = url;
            bot.lightshotChannel.send(url).then(embed => {
                bot.lightshot.message = embed;
                console.log("| Succesfully created lightshot embed.")
                addReactions();
            }).catch(err => {
                console.error(`Error: Failed to create lightshot embed. ${err}`);
            });
        }).catch((err) => {
            error(`Failed to fetch messages. ${err}`);
        })
    } else {
        error("Could not initialize lightshot. Lightshot channel not found.");
    }
    console.log("+===============================================");
}

function error(msg) {
    console.error(`| Error: ${msg}`);
    return;
}

module.exports = {
    addReactions: addReactions,
    init: init,
}