const Discord = require("discord.js");
const fs = require('fs');

const config = require("./config_toxic.json");
const petuh = require("./modules/petuh.js");
const role = require("./modules/role.js");
const quoter = require("./modules/quoter");

// Bot state
const bot = new Discord.Client();
const state = {
  update: function(newState) {
    Object.keys(newState).forEach(key => {
      this[key] = newState[key];
    });
  },
  roleList: [],
  petuh_list: [],
  textChannels: []
};

// Write bot state to file
bot.state = state;
bot.writeConfig = () => {
  config.state = bot.state;
  fs.writeFile("./config_toxic.json", JSON.stringify(config), (err) => {
    if (err) throw err;

    console.log("config saved");
  });
};

// Catch events

// Read bot state on ready event
bot.on("ready", () => {
  if (config.state) {
    bot.state.update(config.state);
  } else {
    config.state = state;
  }

  quoter.getTextChannels(bot)
});

// Workaround for catching reactions to old messages
// More info on the issue here: https://discordjs.guide/#/popular-topics/reactions?id=listening-for-reactions-on-old-messages
// Code taken from here: https://github.com/discordjs/guide/blob/master/code-samples/popular-topics/reactions/raw-event.js
const events = {
  MESSAGE_REACTION_ADD: 'messageReactionAdd',
  MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

bot.on('raw', async event => {
  if (!events.hasOwnProperty(event.t)) return;

  const { d: data } = event;
  const user = bot.users.get(data.user_id);
  const channel = bot.channels.get(data.channel_id) || await user.createDM();

  if (channel.messages.has(data.message_id)) return;

  const message = await channel.fetchMessage(data.message_id);
  const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
  let reaction = message.reactions.get(emojiKey);

  if (!reaction) {
    const emoji = new Discord.Emoji(bot.guilds.get(data.guild_id), data.emoji);
    reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === bot.user.id);
  }

  bot.emit(events[event.t], reaction, user);
});

// Catch regular messages
bot.on("message", message => {
  role.onMessage(message, bot);
  petuh.onMessage(message, bot);
  quoter.onMessage(message, bot);
});

// Catch reactions
bot.on('messageReactionAdd', (reaction, user) => {
  quoter.onReactionAdd(reaction, user);
  console.log(`${user.username} reacted with "${reaction.emoji.name}".`);
});

bot.on('channelCreate', (channel) => {
  if (channel.type === "text")
    bot.state.textChannels.push(channel.id);
});

bot.on('channelDelete', (channel) => {
  if (channel.type !== "text")
    return;

  let idx = bot.state.textChannels.indexOf(channel.id);
  bot.state.textChannels.splice(idx, 1);
});

// Catch errors
bot.on("error", console.error);

// Start bot
bot.login(config.token);