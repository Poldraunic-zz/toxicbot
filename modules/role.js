const Discord = require("discord.js");

exports.onMessage = (message, roleList) => {
  const channel = message.channel;
  const content = message.content;
  const guild = message.guild;
  const member = message.member;

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
    if (roleList.includes(roleName)) {
      console.log(`${role.name} is already in the list.`);
      const embed = new Discord.RichEmbed()
        .setDescription(`Role **${role.name}** is already in the list.`)
        .setColor(0xde2a61);
      channel.send(embed);
      return;
    }

    // Add role name to the list.
    roleList.push(role.name.toLowerCase());
    const embed = new Discord.RichEmbed()
      .setDescription(`Role **${role.name}** has been added to the list.`)
      .setColor(0x61de2a);
    channel.send(embed);
  }

  // Allow members to self assign a role if it is in the list.
  if (content.startsWith("!iam ")) {
    let desiredRole = content.slice(5).toLowerCase();

    // Check if role is in the list
    if (!roleList.includes(desiredRole)) return;

    let role = guild.roles.find(r => r.name.toLowerCase() === desiredRole);

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

    if (!roleList.includes(desiredRole)) {
      console.log("Desired role is not in the list");
      return;
    }

    let role = guild.roles.find(r => r.name.toLowerCase() === desiredRole);

    if (member.roles.has(role.id)) {
      member.removeRole(role);
      const embed = new Discord.RichEmbed()
        .setDescription(`Role ${role.name} has been removed.`)
        .setColor(0x61de2a);
      channel.send(embed);
    }
  }
};
