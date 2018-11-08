const Discord = require("discord.js");
const config = require("./config_toxic.json");
const role = require("./modules/role.js");
const fs = require('fs');

const bot = new Discord.Client();
const state = {
  update: function(newState) {
    Object.keys(newState).forEach(key => {
      this[key] = newState[key];
    });
  },
  roleList: []
};

bot.state = state;
bot.writeConfig = () => {
  config.state = bot.state;
  fs.writeFile("./config_toxic.json", JSON.stringify(config), (err) => {
    if (err) throw err;

    console.log("config saved");
  });
};

bot.on("ready", () => {
  if (config.state) {
    bot.state.update(config.state);
  } else {
    config.state = state;
  }
});

bot.on("message", message => {
  role.onMessage(message, bot);
});

bot.on("error", console.error);

bot.login(config.token);