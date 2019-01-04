const Discord = require("discord.js");

exports.onReactionAdd = (reaction, user) => {
  const message = reaction.message;
  const channel = message.channel;
  const emoji = reaction.emoji;

  if (emoji.name !== "💬")
    return;

  let embed = new Discord.RichEmbed()
    .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL, message.url)
    .setDescription(message.content)
    .setFooter(`Message from #${channel.name}`)
    .setTimestamp(message.createdAt)
    .setColor(0x61DE2A);

  channel.send(embed);
};