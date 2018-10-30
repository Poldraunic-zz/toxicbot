const Discord = require("discord.js");
const config = require("./config_toxic.json");

const bot = new Discord.Client();
let roleList = [];

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

  // Allows members with ADMINISTRATOR permission to add roles to the list of
  // self assignable roles.
  if (content.startsWith("!asar ") && member.hasPermission("ADMINISTRATOR")) {
    // Check if role exists
    const roles = guild.roles;
    const roleName =  content.slice(6); // FIXME: Get rid of magic number later.
    const role = roles.find(r => r.name.toLowerCase() === roleName.toLowerCase());

    if (!role) {
      console.log("No such role exists.");
      return;
    }

    // Check if role is in list already.
    if (roleList.includes(role)) {
      console.log(`${role.name} is already in the list.`);
      const embed = new Discord.RichEmbed()
        .setDescription(`Role **${role.name}** is already in the list.`)
        .setColor(0xDE2A61);
      channel.send(embed);
      return;
    }

    // Add role name to the list.
    roleList.push(role.name.toLowerCase());
    const embed = new Discord.RichEmbed()
      .setDescription(`Role **${role.name}** has been added to the list.`)
      .setColor(0x61DE2A);
    channel.send(embed);
  }

});

bot.login(config.token);
