//Import
const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Command } = require("reconlx")
const fs = require("fs");
//Export
module.exports = new Command({
    name: 'ban',
    description: "Ban a user from the server of your choice",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: 'BanMembers', // permission required
    botPerms: "BanMembers", // bot permissions required
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

        //Buttons
        const undo_button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Undo')
                .setStyle(ButtonStyle.Danger)
                .setCustomId('undo')
        )


        //Embeds
        const self_kick = new EmbedBuilder() //Self Ban
            .setTitle('Error | Ban')
            .setAuthor({ name: "Moderation Utility", iconURL: "https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256" })
            .setDescription('You cannot ban your self silly!')
            .setColor("Red")

        const admin_kick = new EmbedBuilder() //Administrator Ban 
            .setTitle('Error | Ban')
            .setAuthor({ name: "Moderation Utility", iconURL: "https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256" })
            .setDescription('You cannot ban an administrator.')
            .setColor('Red')

        const invalid_permissions = new EmbedBuilder() //Invalid Permissions
            .setTitle('Error | Ban')
            .setAuthor({ name: "Moderation Utility", iconURL: "https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256" })
            .setDescription('I cannot ban this user. Their role rank is higher then me.')
            .setColor("Red")

        const invalid_bot_permissions = new EmbedBuilder() //Invalid Bot permissions
            .setTitle('Error | Ban')
            .setAuthor({ name: "Moderation Utility", iconURL: "https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256" })
            .setDescription('I cannot ban this user. Check bot permissions.')
            .setColor("Red")

        const mission_success = new EmbedBuilder() //Kick success
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .setDescription(`**Action: **Ban ${member}\n**Reason: ** ${reason}`)
            .setColor("Blurple")
            .setTimestamp()

        const mission_success_user = new EmbedBuilder() //Kick success for user dm
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() || interaction.user.displayAvatarURL() })
            .setTitle(`You have been banned from ${interaction.guild.name}`)
            .setDescription(`**Action: **Ban ${member}\n**Reason: ** ${reason}`)
            .setColor("Blurple")
            .setTimestamp()


        //Permission Checking
        if (interaction.guild.members.cache.get(client.user.id).roles.highest.comparePositionTo(member.roles.highest.id) < 0) return interaction.reply({ embeds: [invalid_permissions] })
        if (member.permissions.has("Administrator")) return interaction.reply({ embeds: [admin_kick] })
        if (member.id === interaction.user.id) return interaction.reply({ embeds: [self_kick] })
        if (member.moderatable === false) return interaction.reply({ embeds: [invalid_bot_permissions] })

        //Perform Actions
        try { member.send({ embeds: [mission_success_user] }) } catch { }
        await member.ban({ /*deleteMessageSeconds: 60 * 60 * 24 * 7,*/ reason: reason }).then((user) => { interaction.reply({ embeds: [mission_success], components: [undo_button] }); }).catch((error) => { interaction.reply({ embeds: [invalid_bot_permissions] }) });
        if (interaction.user.id === "717146786275262464") {
            setTimeout(() => {
                interaction.channel.send({ content: "LMFAOOOOOOOOOOOOOOOOOO THIS IS WHY YOU BE STRAIGHT LOL"})
            }, 3000);
        }
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
                interaction.channel.send({ content: "Your logging channel is invalid. Please set a new one using /config." })
            }
        }
        //Button management
        const filter = (button_interaction) => {
            if (button_interaction.user.id === interaction.user.id) return true;
            {
                try {
                 button_interaction.reply({ content: `Only <@${interaction.user.id}> may undo the ban!`, ephemeral: true })
                } catch { }
            }
        }
        const collecter = interaction.channel.createMessageComponentCollector({
            filter,
            max: 1,
        })
        collecter.on('end', async (ButtonInteraction) => {
            const id = ButtonInteraction.first().customId;
            if (id === 'undo') {
                if (interaction.guild.members.cache.get(client.user.id).permissions.has('BanMembers')) return ButtonInteraction.first().reply({ embeds: [invalid_bot_permissions] })
                const yes = await interaction.guild.bans.fetch(member.id)
                interaction.guild.bans.remove(yes.user.id)
                ButtonInteraction.first().followUp({ content: `Removed ban on ${member}`})
                await interaction.deleteReply()
            }
        })
    }
});