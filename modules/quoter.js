const Discord = require("discord.js");

exports.onReactionAdd = (reaction, user) => {
  const message = reaction.message;
  const channel = message.channel;
  const emoji = reaction.emoji;

  if (emoji.name !== "💬")
    return;

  const embed = createEmbed(message, message.author);
  channel.send(embed);
};

exports.onMessage = (message, bot) => {
  const commandParserRegex = /^!(?<command>\w+)(?: (?<data>.+)|$)/;
  const commands = {
    "quote": quoteHandler
  };

  const content = message.content;
  const commandRegexResult = commandParserRegex.exec(content);

  if (commandRegexResult) {
    const context = {
      channel: message.channel,
      content: message.content,
      guild: message.guild,
      member: message.member,
      author: message.author,
      state: bot.state,
      bot: bot,
      data: commandRegexResult.groups.data
    };

    const commandName = commandRegexResult.groups.command;
    if (commands.hasOwnProperty(commandName)) {
      return commands[commandName](context);
    }
  }
};

const quoteHandler = function(context) {
  const channel = context.channel;
  const guild = context.guild;
  const user = context.author;
  const msgID = context.data;

  const textChannels = guild.channels.array();
  for (let chan of textChannels)
    if (chan.type === "text")
      chan.fetchMessage(msgID).then(message => {
        const embed = createEmbed(message, user);
        channel.send(embed);
      });
};

const createEmbed = function(message, user) {
  let embed = new Discord.RichEmbed()
    .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL, message.url)
    .setDescription(message.content)
    .setFooter(`Message from #${message.channel.name}`)
    .setTimestamp(message.createdAt)
    .setColor(0x61DE2A);

  return embed;
};