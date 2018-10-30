const Discord = require("discord.js");

exports.onMessage = (message, bot) => {
  const channel = message.channel;
  const content = message.content;
  const guild = message.guild;
  const member = message.member;
  const state = bot.state;

  // Allows members with ADMINISTRATOR permission to add roles to the list of
  // self assignable roles.
  if (content.startsWith("!asar ") && member.hasPermission("ADMINISTRATOR")) {
    // Check if role exists
    const roles = guild.roles;
    const roleName = content.slice(6).toLowerCase(); // FIXME: Get rid of magic number later.
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
    bot.writeConfig();
  }

  // Allow members to self assign a role if it is in the list.
  if (content.startsWith("!iam ")) {
    let desiredRole = content.slice(5).toLowerCase();
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
  }

  // Allow members to self remove role if it is in the list.
  if (content.startsWith("!iamnot ")) {
    let desiredRole = content.slice(8).toLowerCase();
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
  }

  // Remove role from the list
  if (content.startsWith("!rsar ")) {
    let desiredRole = content.slice(6).toLowerCase();

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
  }

  // List all self-assignable roles from the list
  if (content === "!lsar")
  {
    let roles = "";
    roleList.forEach(function (role) {roles += role.name + "\n";});

    const embed = new Discord.RichEmbed()
      .setTitle(`There are ${roleList.length} self assignable roles`)
      .setDescription(roles)
      .setColor(0x61DE2A);
    channel.send(embed);
  }

  bot.state.update(state);
}
