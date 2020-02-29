module.exports = {
    name: "addrole",
    category: "moderation",
    aliases: ["roleadd"],
    description: "Adds a role to the user",
    usage: "<id | mention>",
    run: async (client, message, args) => {

         //.addrole @user (role)
        if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("Sorry pal, you can't do that.");
        let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if(!rMember) return message.reply("Couldn't find that user, yo.");
        let role = args.join(" ").slice(22);
        if(!role) return message.reply("Specify a role!");
        let gRole = message.guild.roles.find(`name`, role);
        if(!gRole) return message.reply("Couldn't find that role.");

        const channel = message.guild.channels.find(c => c.name === "moderation")

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
          **> Role added:** ${gRole.name}`);
 
         return channel.send(embed);
        }
    }
}