//Import
const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const { Command } = require("reconlx")

//Export
module.exports = new Command({
    name: 'help',
    description: "need help? heres help",
    type: ApplicationCommandType.ChatInput,
    cooldown: 7000,
    run: async ({ client, interaction }) => {
        //Vars

        //Embeds
        const Dropdown_Select = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .setDescription('Select a help option in the drop down below!')
            .addFields({ name: 'Note', value: 'You can only select one option to prevent the bot from overloading. You also have 20 seconds to select.' })
            .setColor('Blurple')
        const Timmedout_Select = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .setDescription('You didnt make a selection in time!')
            .addFields({ name: 'To make a selection', value: 'Run /help again.' })
            .setColor('Blurple')

        //Menus
        const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('select')
                    .setPlaceholder('Click here to select')
                    .setDisabled(false)
                    .addOptions([
                        {
                            label: 'Moderation',
                            description: 'sends moderation commands',
                            value: 'moderation',
                            emoji: '🧑‍⚖️'
                        },
                        {
                            label: 'Settings',
                            description: 'sends setting configuration',
                            value: 'settings',
                            emoji: '⚙'
                        },
                        {
                            label: 'Fun',
                            description: `sends fun bot commands`,
                            value: 'fun',
                            emoji: '😎'
                        }
                    ]),
            );

        await interaction.reply({ content: "Make a selection!", embeds: [Dropdown_Select], components: [row] });

        const filter = (interaction1) =>
            interaction1.isSelectMenu() && interaction1.user.id === interaction.user.id;
        const collecter = interaction.channel.createMessageComponentCollector({
            filter,
            time: "20000",
            max: '1',
        })

        collecter.on('collect', async (collected) => {
            const value = collected.values[0]
            collected.deferUpdate()

            if (value === "moderation") {
                const embed2 = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                    .setDescription(`Here are the moderation commands.
                \`/timeout\` - **Timeouts a user of your choice**
                \`/kick\` - **Kicks a user of your choice**
                \`/ban\` - **Bans a user of your choice**
                \`/clear\` - **Bulk delete messages in case of raid, or just if you want**
                `)
                    .setTimestamp()
                    .addFields({name: 'Note', value: 'Run the help command to make another selection.'})
                    .setColor('Blurple')
                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new SelectMenuBuilder()
                            .setCustomId('select')
                            .setPlaceholder(`${interaction.user.tag} selected ${value}`)
                            .setDisabled(true)
                            .addOptions([
                                {
                                    label: 'Moderation',
                                    description: 'sends moderation commands',
                                    value: 'mod',
                                    emoji: '🧑‍⚖️'
                                },
                                {
                                    label: 'Settings',
                                    description: 'sends setting configuration',
                                    value: 'settings',
                                    emoji: '⚙'
                                },
                                {
                                    label: 'Fun',
                                    description: `sends fun bot commands`,
                                    value: 'fun',
                                    emoji: '😎'
                                }
                            ]),
                    );
                await interaction.editReply({ content: "To make another selection, re-run this command!", embeds: [embed2], components: [row2] })
            }
            if (value === "settings") {
                const embed2 = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                    .setDescription(`To use settings run  \`/config [setting] [enabled or disable]\`.
                \`/view_settings\` - **Allows you to view the current state of all the settings.**
                \`/config moderation\` - **Enables or disables moderation commands in this server**
                \`/config logs\`- **Enables or disables server/moderation logs**
                \`/config wordfilter\` - **Enables or disables wordfilter in this server. Warning: It is very strict**
                \`/config antispam\` - **Enabled or disables antispam in this server.**
                \`/info\` - **View what error codes mean here**`)
                    .setTimestamp()
                    .addFields({name: 'Note', value: 'Run the help command to make another selection.'})
                    .setColor('Blurple')
                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new SelectMenuBuilder()
                            .setCustomId('select')
                            .setPlaceholder(`${interaction.user.tag} selected ${value}`)
                            .setDisabled(true)
                            .addOptions([
                                {
                                    label: 'Moderation',
                                    description: 'sends moderation commands',
                                    value: 'mod',
                                    emoji: '🧑‍⚖️'
                                },
                                {
                                    label: 'Settings',
                                    description: 'sends setting configuration',
                                    value: 'settings',
                                    emoji: '⚙'
                                },
                                {
                                    label: 'Fun',
                                    description: `sends fun bot commands`,
                                    value: 'fun',
                                    emoji: '😎'
                                }
                            ]),
                    );
                await interaction.editReply({ content: "To make another selection, re-run this command!", embeds: [embed2], components: [row2] })
            }
            if (value === "fun") {
                const embed3 = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                    .setDescription(`\`/rock-paper-scissor [user]\` - **Play a game of rock-paper-scissors with a user!**
                \`/tictactoe [user]\` - **Play a game of rock-paper-scissors with a user!**
                \`>aki\` - **Starts a game of akinator!**`)
                    .setTimestamp()
                    .addFields({name: 'Note', value: 'Run the help command to make another selection.'})
                    .setColor('Blurple')
                const row3 = new ActionRowBuilder()
                    .addComponents(
                        new SelectMenuBuilder()
                            .setCustomId('select')
                            .setPlaceholder(`${interaction.user.tag} selected ${value}`)
                            .setDisabled(true)
                            .addOptions([
                                {
                                    label: 'Moderation',
                                    description: 'sends moderation commands',
                                    value: 'mod',
                                    emoji: '🧑‍⚖️'
                                },
                                {
                                    label: 'Settings',
                                    description: 'sends setting configuration',
                                    value: 'settings',
                                    emoji: '⚙'
                                },
                                {
                                    label: 'Fun',
                                    description: `sends fun bot commands`,
                                    value: 'fun',
                                    emoji: '😎'
                                }
                            ]),
                    );
                await interaction.editReply({ content: "To make another selection, re-run this command!", embeds: [embed3], components: [row3] })
            }
        })
        collecter.on('end', async(coll, reason) =>{
            if (reason === "time"){
                await interaction.editReply({content: "Uh oh!", embeds: [Timmedout_Select]})
            }
        })
        
    }
});