const Discord = require("discord.js");

const whoHandler = function(context) {
  let embed = new Discord.RichEmbed()
    .setDescription()
    .setColor();
};

exports.onMessage = (message, bot) => {
  const commands = {
    "petuhwho": whoHandler
  };
  const content = message.content;
  const commandParserRegex = /^!(?<command>\w+)(?: (?<data>.+)|$)/;

  const commandRegexResult = commandParserRegex.exec(content);

  if(commandRegexResult) {
    const context = {
      channel: message.channel,
      content: message.content,
      guild: message.guild,
      member: message.member,
      state: bot.state,
      bot: bot,
      data: commandRegexResult.groups.data,
    };
    const commandName = commandRegexResult.groups.command;
    if(commands.hasOwnProperty(commandName)) {
      return commands[commandName](context);
    }
  }
};