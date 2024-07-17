//Import
const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { Command } = require("reconlx")
const fs = require("fs");
//Export
module.exports = new Command({
    name: 'kick',
    description: "Kicks a user from the server of your choice",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: 'KickMembers', // permission required
    botPerms: "KickMembers", // bot permissions required
    options: [
        {
            name: 'user',
            description: 'the user you want to kick',
            type: 6,
            required: true
        }, {
            name: "reason",
            description: "The reason of this timeout",
            type: 3,
            required: true
        }
    ],
    run: async ({ client, interaction }) => {
        //Vars
        const member = interaction.guild.members.cache.get(interaction.options.get('user').value);
        const reason = interaction.options.getString('reason')

        //Embeds
        const self_kick = new EmbedBuilder() //Self Kick
            .setTitle('Error | Kick')
            .setAuthor({ name: "Moderation Utility", iconURL: "https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256" })
            .setDescription('You cannot kick your self silly!')
            .setColor("Red")

        const admin_kick = new EmbedBuilder() //Administrator Kick 
            .setTitle('Error | Kick')
            .setAuthor({ name: "Moderation Utility", iconURL: "https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256" })
            .setDescription('You cannot kick an administrator.')
            .setColor('Red')

        const invalid_permissions = new EmbedBuilder() //Invalid Permissions
            .setTitle('Error | Kick')
            .setAuthor({ name: "Moderation Utility", iconURL: "https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256" })
            .setDescription('I cannot kick this user. Their role rank is higher then me.')
            .setColor("Red")

        const invalid_bot_permissions = new EmbedBuilder() //Invalid Bot permissions
            .setTitle('Error | Kick')
            .setAuthor({ name: "Moderation Utility", iconURL: "https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256" })
            .setDescription('I cannot kick this user. Check bot permissions.')
            .setColor("Red")

        const invalid_bot_permissions_logs = new EmbedBuilder() //Invalid Bot permissions
            .setTitle('Error | Timeout')
            .setAuthor({ name: "Moderation Utility", iconURL: "https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256" })
            .setDescription('Failed to send logs. Check bot permissions.')
            .setColor("Red")
            
        const mission_success = new EmbedBuilder() //Kick success
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .setDescription(`**Action: **Kick ${member}\n**Reason: ** ${reason}`)
            .setColor("Blurple")
            .setTimestamp()

        const mission_success_user = new EmbedBuilder() //Kick success for user dm
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .setTitle(`You have been kicked from ${interaction.guild.name}`)
            .setDescription(`**Action: **Kick ${member}\n\n**Reason: ** ${reason}`)
            .setColor("Blurple")
            .setTimestamp()


        //Permission Checking
        if (interaction.guild.members.cache.get(client.user.id).roles.highest.comparePositionTo(member.roles.highest.id) < 0) return interaction.reply({ embeds: [invalid_permissions] })
        if (member.permissions.has("Administrator")) return interaction.reply({ embeds: [admin_kick] })
        if (member.id === interaction.user.id) return interaction.reply({ embeds: [self_kick] })
        if (member.moderatable === false) return interaction.reply({ embeds: [invalid_bot_permissions] })

        //Perform Actions
        try { member.send({ embeds: [mission_success_user] }) } catch { }
        member.kick(reason).then((user) => { interaction.reply({ embeds: [mission_success] }); }).catch((error) => { interaction.reply({ embeds: [invalid_bot_permissions] }) });

        //Log actions
        const preCacheJson = fs.readFileSync(`./servers/${interaction.guild.id}.json`);
        const server_config = JSON.parse(preCacheJson);
        if (server_config.moderation_logs) {
            try {
                const channel = interaction.guild.channels.cache.get(server_config.moderation_logs);
                try {
                    channel.send({ embeds: [mission_success] })
                } catch {
                    interaction.channel.send({ embeds: [invalid_bot_permissions_logs] })
                }
            } catch {
                interaction.channel.send({ content: "Your logging channel is invalid. Please set a new one using /config " })
            }
        }
    }
});