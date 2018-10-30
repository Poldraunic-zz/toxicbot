const Discord = require("discord.js");
const config = require("./config_toxic.json");

const bot = new Discord.Client();

bot.on("message", message => {
  const channel = message.channel;
  const content = message.content;
  const guild   = message.guild;
  const member  = message.member;

  //Petuh command logic
  if (content === "!petuh") {
    guild.members.forEach(m => {
      if ((!m.hoistRole) && (m.hoistRole.name === "@petuh")) {
        channel.send(member.user.username + " носит позорный титул петуха!");
      }
    });
  }

  if (content.startsWith("!petuhvote ")) {
    //TODO: Vote
  }

});

bot.login(config.token);
