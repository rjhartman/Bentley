const bot = require("../main");
module.exports = function() {
  console.log("+===============================================");
  console.log("| Checking for channels...");
  messageLogsChannel = bot.client.channels.find("name", "message-logs");
  bot.messageLogsChannel = messageLogsChannel;
  console.log(`|    + Message logs channel connected`);

  const nickLogsChannel = bot.client.channels.find("name", "nickname-logs");
  if (nickLogsChannel) {
    console.log(`|    + Nickname logs channel connected`);
    bot.nickLogsChannel = nickLogsChannel;
  } else {
    console.log(
      '|    - Nickname logs channel not found. Make sure Bentley can reach a channel called "nickname-logs"'
    );
  }

  const pfpLogsChannel = bot.client.channels.find("name", "pfp-logs");
  if (pfpLogsChannel) {
    console.log(`|    + Profile picture logs channel connected`);
    bot.pfpLogsChannel = pfpLogsChannel;
  } else {
    console.log(
      '|    - Profile picture logs channel not found. Make sure Bentley can reach a channel called "pfp-logs"'
    );
  }

  const eventsDataChannel = bot.client.channels.find("name", "events-json");
  if (eventsDataChannel) {
    console.log(`|    + Events data channel connected`);
    bot.eventsDataChannel = eventsDataChannel;
    bot.events = [];
    eventsDataChannel.fetchMessages().then(messages => {
      messages.forEach(eventMsg => {
        bot.events.push(JSON.parse(eventMsg.content));
      });
    });
  } else {
    console.log(
      '|    - Events data channel not found. Make sure Bentley can reach a channel called "events-json"'
    );
  }

  const eventsChannel = bot.client.channels.find("name", "events");
  if (eventsChannel) {
    console.log(`|    + Events channel connected`);
    bot.eventsChannel = eventsChannel;
  } else {
    console.log(
      '|    - Events channel not found. Make sure Bentley can reach a channel called "events"'
    );
  }

  const botChannel = bot.client.channels.find("name", "bot_chat");
  if (botChannel) {
    console.log(`|    + Bot chat channel connected`);
    bot.botChannel = botChannel;
  } else {
    console.log(
      '|    - Bot chat channel not found. Make sure Bentley can reach a channel called "bot_chat"'
    );
  }
  console.log("+===============================================");
};
