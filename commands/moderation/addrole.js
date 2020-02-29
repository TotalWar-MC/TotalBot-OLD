const { RichEmbed } = require("discord.js");

module.exports = {
    name: "addrole",
    category: "moderation",
    aliases: ["roleadd"],
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
    
        const channel = message.guild.channels.find(c => c.name === "moderation")
        
        let gRole = message.guild.roles.find(`name`, role);
        if(!gRole) return message.reply("Couldn't find that role.");

        if(rMember.roles.has(gRole.id)) return message.reply("They already have that role, try .removerole");
            await(rMember.addRole(gRole.id));
        
        if (gRole.id == `Banned`);
            await rMember.send(`You have been given a chance to repeal your ban in #banappeals. You can only send one message once every hour.`)

        try{
            await rMember.send(`Congrats, you have been given the role ${gRole.name}`)
        }
         
        catch{
            message.channel.send(`<@${rMember.id}> has been given the role ${gRole.name}. We tried to DM them, but their DMs are locked.`)
        
        // No channel found
        if (!channel)
             return message.channel.send("Couldn't find a `#moderation` channel").then(m => m.delete(5000));
        
        const embed = new RichEmbed()
          .setColor("#ff0000")
          .setTimestamp()
          .setFooter(message.guild.name, message.guild.iconURL)
          .setAuthor("Role added", rMember.user.displayAvatarURL)
          .setDescription(stripIndents
          `**> Member:** ${rMember} (${rMember.user.id})
          **> Added by:** ${message.member}
          **> Role added:** ${gRole.name}`);
 
         return channel.send(embed);
        }
    }
}