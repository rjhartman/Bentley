const bot = require("../main");
module.exports = function() {
  messageLogsChannel = bot.client.channels.find("name", "message-logs");
  bot.messageLogsChannel = messageLogsChannel;
  console.log(`Message logs channel connected`);

  const eventsDataChannel = bot.client.channels.find("name", "events-json");
  if (eventsDataChannel) {
    console.log(`Events data channel connected`);
    bot.eventsDataChannel = eventsDataChannel;
    bot.events = [];
    eventsDataChannel.fetchMessages().then(messages => {
      messages.forEach(eventMsg => {
        bot.events.push(JSON.parse(eventMsg.content));
      });
    });
  } else {
    console.log(
      'Events data channel not found. Make sure Bentley can reach a channel called "events-json"'
    );
  }

  const eventsChannel = bot.client.channels.find("name", "events");
  if (eventsChannel) {
    console.log(`Events channel connected`);
    bot.eventsChannel = eventsChannel;
  } else {
    console.log(
      'Events channel not found. Make sure Bentley can reach a channel called "events"'
    );
  }

  const botChannel = bot.client.channels.find("name", "bot_chat");
  if (eventsChannel) {
    console.log(`Bot chat channel connected`);
    bot.botChannel = botChannel;
  } else {
    console.log(
      'Bot chat channel not found. Make sure Bentley can reach a channel called "bot_chat"'
    );
  }
};
