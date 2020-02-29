const { RichEmbed } = require("discord.js");

module.exports = {
    name: "removerole",
    category: "moderation",
    aliases: ["roledelete", "delrole", "deleterole", "roleremove", "remrole", "rolerem"],
    description: "Adds a role to the user",
    usage: "<id | mention>",
    run: async (client, message, args) => {
      
         //.addrole @user (role)
         if (message.deletable) message.delete();
        
         // Either a mention or ID
         let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);
         
         // No person found
         if (!rMember)
             return message.reply("Couldn't find that person?").then(m => m.delete(5000));
 
         // The member has BAN_MEMBERS or is a bot
         if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
             return message.channel.send("Can't add roles to that member").then(m => m.delete(5000));
 
         // If there's no argument
         if (!args[1])
             return message.channel.send("Please specify a role").then(m => m.delete(5000));
         
         let gRole = message.guild.roles.find(`name`, role);
         if(!gRole) return message.reply("Couldn't find that role.");

        const channel = message.guild.channels.find(c => c.name === "moderation")

        if(!rMember.roles.has(gRole.id)) return message.reply("They don't have that role.");
          await(rMember.removeRole(gRole.id));

        try{
          await rMember.send(`${gRole.name} has been removed from you.`)
        }
        
        catch{
          message.channel.send(`<@${rMember.id}> has had ${gRole.name} removed from them. We tried to DM them, but their DMs are locked.`)
        }
            
         // No channel found
        if (!channel)
             return message.channel.send("Couldn't find a `#moderation` channel").then(m => m.delete(5000));
        
        const embed = new RichEmbed()
          .setColor("#ff0000")
          .setTimestamp()
          .setFooter(message.guild.name, message.guild.iconURL)
          .setAuthor("Role removed", rMember.user.displayAvatarURL)
          .setDescription(stripIndents
          `**> Member:** ${rMember} (${rMember.user.id})
          **> Removed by:** ${message.member}
          **> Role removed:** ${gRole.name}`);
 
         return channel.send(embed);
  }
}