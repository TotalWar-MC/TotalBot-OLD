const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const fs = require("fs");
const ms = require("ms");

module.exports = {
    name: "warn",
    category: "moderation",
    description: "Warns a member",
    usage: "<mention, id>",
    run: async (client, message, args) => {
        // If the bot can delete the message, do so
        if (message.deletable) message.delete();

        // Either a mention or ID
        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No person found
        if (!rMember)
            return message.reply("Couldn't find that person?").then(m => m.delete(5000));

        // The member has BAN_MEMBERS or is a bot
        if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
            return message.channel.send("Can't warn that member").then(m => m.delete(5000));

        // If there's no argument
        if (!args[1])
            return message.channel.send("Please provide a reason for the warn").then(m => m.delete(5000));
        
        const channel = message.guild.channels.find(c => c.name === "moderation")
        
        let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));

        if(!warns[rMember.id]) warns[rMember.id] = {
            warns: 0
          };
        
          warns[rMember.id].warns++;

          fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
            if (err) console.log(err)
          });

        // No channel found
        if (!channel)
            return message.channel.send("Couldn't find a `#moderation` channel").then(m => m.delete(5000));

        const embed = new RichEmbed()
        .setColor("#ff9d00")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Warning", rMember.user.displayAvatarURL)
            .setDescription(stripIndents`**> Member:** ${rMember} (${rMember.user.id})
            **> Warned by:** ${message.member}
            **> Warned in:** ${message.channel}
            **> Number of Warnings:** ${warns[rMember.id].warns}
            **> Reason:** ${args.slice(1).join(" ")}`);
            
        return channel.send(embed);

        if(warns[rMember.id].warns == 2){
            let muterole = message.guild.roles.find(`name`, "Muted");
            if(!muterole) return message.reply("You should create that role dude.");
        
            let mutetime = "10s";
            await(rMember.addRole(muterole.id));
            message.channel.send(`<@${rMember.id}> has been temporarily muted`);
        
            setTimeout(function(){
              rMember.removeRole(muterole.id)
              message.reply(`<@${rMember.id}> has been unmuted.`)
            }, ms(mutetime))
          }
          if(warns[rMember.id].warns == 3){
            message.guild.member(rMember).ban(reason);
            message.reply(`<@${rMember.id}> has been banned.`)
          }
    }
}