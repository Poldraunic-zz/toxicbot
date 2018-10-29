const Discord = require("discord.js");
const config = require("./config_toxic.json");

const bot = new Discord.Client();
bot.config = config;

bot.on("message", message => {
  //Petuh logic
  if (message.content.startsWith("!petuh")) {
    message.guild.members.forEach(member => {
      if (member.hoistRole != null) {
        if (member.hoistRole.name === "@petuh") {
          message.channel.send(
            member.user.username + " носит позорный титул петуха!"
          );
        }
      }
    });
  }
  if (message.content.startsWith("!petuhvote")) {
    //TODO: Vote
  }
});

bot.login(config.token);
