const { RichEmbed } = require("discord.js");

module.exports = {
    name: "removerole",
    category: "moderation",
    aliases: ["roledelete", "delrole", "deleterole", "roleremove", "remrole", "rolerem"],
    description: "Adds a role to the user",
    usage: "<id | mention>",
    run: async (client, message, args) => {
      
        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);
        let role = args.join(" ").slice(22);
        let gRole = message.guild.roles.find(`name`, role);
      
        if(!message.member.hasPermission("MANAGE_MEMBERS")) 
            return message.reply("Insufficient permissions.").then(m => m.delete(5000));
        
        // No person found
        if (!rMember)
            return message.reply("Couldn't find that person?").then(m => m.delete(5000));
        
        if(!role) 
            return message.reply("Specify a role!").then(m => m.delete(5000));

        if(!gRole) 
            return message.reply("Couldn't find that role.").then(m => m.delete(5000));

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
          **> Role removed:** ${gRole.name}`);
 
         return channel.send(embed);
  }
}