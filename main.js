const Discord = require("discord.js");
const fs = require('fs');

const config = require("./config_toxic.json");
const petuh = require("./modules/petuh.js");
const role = require("./modules/role.js");

// Bot state
const bot = new Discord.Client();
const state = {
  update: function(newState) {
    Object.keys(newState).forEach(key => {
      this[key] = newState[key];
    });
  },
  roleList: [],
  petuh_list: []
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

// Read bot state on ready event
bot.on("ready", () => {
  if (config.state) {
    bot.state.update(config.state);
  } else {
    config.state = state;
  }
});

// Catch regular messages
bot.on("message", message => {
  role.onMessage(message, bot);
  petuh.onMessage(message, bot);
});

// Catch errors
bot.on("error", console.error);

// Start bot
bot.login(config.token);