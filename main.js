const Discord = require("discord.js");
const config = require("./config.json");

const bot = new Discord.Client();
bot.config = config;

bot.on("message", (message) => {
  //Petuh logic
  if (message.content.startsWith("!petuh")) {
    message.channel.send("Петушара бля!");
  }
});

bot.login(config.token);