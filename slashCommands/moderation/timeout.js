//Imports
const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Command } = require("reconlx")
const ms = require("ms")
const fs = require("fs")

//Exports
module.exports = new Command({
    name: 'timeout',
    description: "Timeouts a member",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: 'ModerateMembers', // permission required
    botPerms: "ModerateMembers", // bot permissions required
    options: [
        {
            name: 'user',
            description: 'the user that you want to time out',
            type: 6,
            required: true
        }, {
            name: 'length',
            description: 'The length you want to timeout this user.',
            type: 3,
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
        const cache  = member.id
        const length = interaction.options.getString('length')
        const reason = interaction.options.getString('reason')
        const timeInMs = ms(length);


        //Buttons
        const undo_button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Undo')
                .setStyle(ButtonStyle.Danger)
                .setCustomId('undo')
        )

        //Embeds
        const invalid_time = new EmbedBuilder() //Invalid Time
            .setTitle('Error | Timeout')
            .setAuthor({ name: "Moderation Utility", iconURL: "https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256" })
            .setDescription('Please specify a valid time! (Eg, 1m, 1h, 1d)')
            .setColor('Red')

        const self_timeout = new EmbedBuilder() //Self Timeout
            .setTitle('Error | Timeout')
            .setAuthor({ name: "Moderation Utility", iconURL: "https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256" })
            .setDescription('You cannot time out your self silly!')
            .setColor("Red")

        const admin_timeout = new EmbedBuilder() //Administrator Timeout 
            .setTitle('Error | Timeout')
            .setAuthor({ name: "Moderation Utility", iconURL: "https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256" })
            .setDescription('You cannot timeout an administrator.')
            .setColor('Red')

        const invalid_permissions = new EmbedBuilder() //Invalid Permissions
            .setTitle('Error | Timeout')
            .setAuthor({ name: "Moderation Utility", iconURL: "https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256" })
            .setDescription('I cannot timeout this user. Their role rank is higher then me.')
            .setColor("Red")

        const invalid_user_permissions = new EmbedBuilder() //Invalid Permissions
            .setTitle('Error | Timeout')
            .setAuthor({ name: "Moderation Utility", iconURL: "https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256" })
            .setDescription('You cannot time out someone that is higher then you.')
            .setColor("Red")

        
        const invalid_bot_permissions = new EmbedBuilder() //Invalid Bot permissions
            .setTitle('Error | Timeout')
            .setAuthor({ name: "Moderation Utility", iconURL: "https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256" })
            .setDescription('I cannot timeout this user. Check bot permissions.')
            .setColor("Red")

        const invalid_bot_permissions_logs = new EmbedBuilder() //Invalid Bot permissions
            .setTitle('Error | Timeout')
            .setAuthor({ name: "Moderation Utility", iconURL: "https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256" })
            .setDescription('Failed to send logs. Check bot permissions.')
            .setColor("Red")
        const mission_success = new EmbedBuilder() //Timeout success
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .setDescription(`**Action: **Timeout ${member}\n**Length: ** ${length}\n**Reason: ** ${reason}`)
            .setColor("Red")
            .setTimestamp()

        const mission_success_user = new EmbedBuilder() //Timeout success for user dm
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .setTitle(`You have been timed out from ${interaction.guild.name}`)
            .setDescription(`**Action: **Timeout ${member}\n**Length: ** ${length}\n**Reason: ** ${reason}`)
            .setColor("Blurple")
            .setTimestamp()


        //Permission Checking
        if (!timeInMs) return interaction.reply({ embeds: [invalid_time] });
        if (interaction.guild.members.cache.get(client.user.id).roles.highest.comparePositionTo(member.roles.highest.id) < 0) return interaction.reply({ embeds: [invalid_permissions] })
        if (interaction.member.roles.highest.comparePositionTo(member.roles.highest.id) < 1 ) return interaction.reply({embeds: [invalid_user_permissions]})
        if (member.permissions.has("Administrator")) return interaction.reply({ embeds: [admin_timeout] })
        if (member.id === interaction.user.id) return interaction.reply({ embeds: [self_timeout] })
        if (member.moderatable === false) return interaction.reply({ embeds: [invalid_bot_permissions] })
        
        //Perform Actions
        try { member.send({ embeds: [mission_success_user] }) } catch { }
        member.timeout(timeInMs, reason).then((user) => { interaction.reply({ embeds: [mission_success], components: [undo_button] }); }).catch((error) => { interaction.reply({ embeds: [invalid_bot_permissions] }) });
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
        //Button management
        const filter = (button_interaction) => {
            if (button_interaction.user.id === interaction.user.id) return true;
            {
                try {
                    button_interaction.reply({ content: `Only <@${interaction.user.id}> may undo the timeout!`, ephemeral: true })
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
                try {
                member.timeout(null)
                ButtonInteraction.first().reply({ content: `Removed timeout on <@${cache}>.` })
                } catch {}
            }
        })
    }
})