const Discord = require("discord.js");
const config = require("./config.json");

const bot = new Discord.Client();
bot.config = config;

bot.on("message", (message) => {
  //Petuh logic
  if (message.content.startsWith("!petuh")) {
  }
});

bot.login(config.token);