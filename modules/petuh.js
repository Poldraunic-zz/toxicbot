const Discord = require("discord.js");
const _ = require("lodash");

const whoHandler = function(context) {
  const petuh = exports.determinePetuh(context.guild, context.bot);
  let description = "error";
  if (!petuh) {
    description = "Couldn't find petuh here :(";
  } else {
    description = "Our disgusting petuh is " + petuh.user.username + " nowadays!";
  }
  let embed = new Discord.RichEmbed().setDescription(description).setColor(0x61de2a);
  context.channel.send(embed);
};

const setupHandler = function(context) {
  if (!context.data || !context.member.hasPermission("ADMINISTRATOR")) return;
  const state = context.bot.state;
  const petuhRole = context.guild.roles.find(
    r => r.name.toLowerCase() === context.data.toLowerCase()
  );
  if (!petuhRole) {
    console.log("Invalid role");
    return;
  }

  let petuh_data = {
    guild: context.guild.id,
    role: petuhRole.id,
    petuh: undefined,
    channel: undefined
  };
  let i = _.findIndex(state.petuh_list, { guild: context.guild.id });
  if (i > -1) {
    petuh_data = state.petuh_list[i];
    petuh_data.role = petuhRole.id;
    let petuh = exports.determinePetuh(context.guild, context.bot);
    if (petuh) petuh_data.petuh = petuh.id;
  } else {
    let petuh = exports.determinePetuh(context.guild, context.bot);
    if (petuh) petuh_data.petuh = petuh.id;
    state.petuh_list.push(petuh_data);
  }

  console.log("new petuh setup for guild " + context.guild.id);
  if (petuh_data.role) {
    console.log("current petuh role id is " + petuh_data.role);
  } else {
    console.log("error determining role");
  }
  if (petuh_data.petuh) {
    console.log("current petuh id is " + petuh_data.petuh);
  } else {
    console.log("couldn't find petuh in this guild");
  }
  context.bot.writeConfig();
};

exports.determinePetuh = (guild, bot) => {
  if (!guild.available) return undefined;
  let petuhRole = undefined;
  let entry = _.find(bot.state.petuh_list, o => {
    return o.guild === guild.id;
  });
  if (entry) {
    petuhRole = guild.roles.find(role => {
      return role.id === entry.role;
    });
  } else {
    return undefined;
  }
  if (!petuhRole) return undefined;
  return guild.members.find(member => {
    return member.roles.find(role => {
      return role === petuhRole;
    });
  });
};

exports.onReady = bot => {
  const state = bot.state;
  //if (state.current_petuh)
};

exports.onMessage = (message, bot) => {
  const commands = {
    petuhwho: whoHandler,
    petuhsetup: setupHandler
  };
  const content = message.content;
  const commandParserRegex = /^!(?<command>\w+)(?: (?<data>.+)|$)/;

  const commandRegexResult = commandParserRegex.exec(content);

  if (commandRegexResult) {
    const context = {
      channel: message.channel,
      content: message.content,
      guild: message.guild,
      member: message.member,
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