const Discord = require("discord.js");

// Allows members with ADMINISTRATOR permission to add roles to the list of
// self assignable roles.
const asarHandler = function(context) {
  const member = context.member;
  const guild = context.guild;
  const state = context.state;
  const channel = context.channel;
  const bot = context.bot;

  if(!member.hasPermission("ADMINISTRATOR")) {
    return;
  }
  // Check if role exists
  const roles = guild.roles;
  const roleName = context.data;

  const role = roles.find(r => r.name.toLowerCase() === roleName);

  if (!role) {
    console.log("No such role exists.");
    return;
  }

  // Check if role is in list already.
  if (state.roleList.find(r => r.name.toLowerCase() === roleName)) {
    console.log(`${role.name} is already in the list.`);
    const embed = new Discord.RichEmbed()
      .setDescription(`Role **${role.name}** is already in the list.`)
      .setColor(0xde2a61);
    channel.send(embed);
    return;
  }

  // Add role name to the list.
  state.roleList.push(role);
  const embed = new Discord.RichEmbed()
    .setDescription(`Role **${role.name}** has been added to the list.`)
    .setColor(0x61de2a);
  channel.send(embed);
  bot.state.update(state);
};

// Allow members to self assign a role if it is in the list.
const iamHandler = function(context) {
  const guild = context.guild;
  const member = context.member;
  const channel = context.channel;
  const desiredRole = context.data;

  const role = guild.roles.find(r => r.name.toLowerCase() === desiredRole);

  // Check if role is in the list
  if (!role)
    return;

  // Check if member has the role already
  if (member.roles.has(role.id)) {
    const embed = new Discord.RichEmbed()
      .setDescription(`You already have **${role.name}** role.`)
      .setColor(0xde2a61);
    channel.send(embed);
    return;
  }

  // Add role to the member
  member.addRole(role, "Self Assigned");
  const embed = new Discord.RichEmbed()
    .setDescription(`You now have **${role.name}** role.`)
    .setColor(0x61de2a);
  channel.send(embed);
};

// Allow members to self remove role if it is in the list.
const iamnotHandler = function(context) {
  const guild = context.guild;
  const member = context.member;
  const channel = context.channel;
  const desiredRole = context.data;

  const role = guild.roles.find(r => r.name.toLowerCase() === desiredRole);

  if (!role) {
    console.log("Desired role is not in the list");
    return;
  }

  if (member.roles.has(role.id)) {
    member.removeRole(role);
    const embed = new Discord.RichEmbed()
      .setDescription(`Role **${role.name}** has been removed.`)
      .setColor(0x61de2a);
    channel.send(embed);
  }
};

// Remove role from the list
const rsarHandler = function(context) {
  const desiredRole = context.data;
  const channel = context.channel;
  const roleList = context.state.roleList;

  const role = roleList.find(r => r.name.toLowerCase() === desiredRole);
  if (!role)
  {
    const embed = new Discord.RichEmbed()
      .setDescription("This role isn't self-assignable")
      .setColor(0xde2a61);
    channel.send(embed);
    return;
  }

  const idx = roleList.indexOf(role);
  roleList.splice(idx, 1);

  const embed = new Discord.RichEmbed()
    .setDescription(`Role **${role.name}** has been removed from the list of self-assignable roles.`)
    .setColor(0x61de2a);
  channel.send(embed);
};

// List all self-assignable roles from the list
const lsarHandler = function(context) {
  const roleList = context.state.roleList;
  const channel = context.channel;

  let roles = "";
  roleList.forEach(function (role) {roles += role.name + "\n";});

  const embed = new Discord.RichEmbed()
    .setTitle(`There are ${roleList.length} self assignable roles`)
    .setDescription(roles)
    .setColor(0x61DE2A);
  channel.send(embed);
}

exports.onMessage = (message, bot) => {
  const commands = {
    "asar": asarHandler,
    "iam": iamHandler,
    "iamnot": iamnotHandler,
    "rsar": rsarHandler,
    "lsar": lsarHandler
  };
  const content = message.content;
  const commandParserRegex = /^!(?<command>\w+) ?(?<data>.*)/;

  const commandRegexResult = commandParserRegex.exec(content);

  if(commandRegexResult) {
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
    if(commands.hasOwnProperty(commandName)) {
      return commands[commandName](context);
    }
  }
};

