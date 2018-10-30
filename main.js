const Discord = require("discord.js");
const config = require("./config_toxic.json");
const role = require("./modules/role.js");

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

bot.on("message", message => {
  role.onMessage(message, bot);
});

bot.login(config.token);
