const Discord = require("discord.js");

exports.onReactionAdd = (reaction, user) => {
  const message = reaction.message;
  const channel = message.channel;
  const emoji = reaction.emoji;

  if (emoji.name !== "💬")
    return;

  const embed = createEmbed(message, user);
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

exports.getTextChannels = (bot) => {
  const guildChans = bot.guilds.first().channels;

  if (!guildChans)
    return;

  const textChans = guildChans.filter(c => c.type === "text");
  bot.state.textChannels = [];

  textChans.forEach(function(chan) {
    bot.state.textChannels.push(chan.id);
  });

  bot.writeConfig();
};

const quoteHandler = function(context) {
  const bot = context.bot;
  const guild = context.guild;
  const channel = context.channel;
  const msgID = context.data;
  const user = context.author;

  for (let id of bot.state.textChannels) {
    let chan = guild.channels.get(id);
    
    chan.fetchMessage(msgID).then(message => {
      const embed = createEmbed(message, user);
      channel.send(embed);
    }).catch(error =>
      console.log(`Message ${id} not found in channel ${chan.id}`)
    );
  }
};

const createEmbed = function(message, requester) {
  let timestamp = message.createdAt.toString();
  const idx = timestamp.indexOf(" (");
  timestamp = timestamp.slice(0, idx);

  let embed = new Discord.RichEmbed()
    .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
    .setDescription(message.content)
    .setFooter(`Requested by: ${requester.username}#${requester.discriminator} | Message from #${message.channel.name} | ${timestamp}`)
    .setColor(0x61DE2A);

  return embed;
};