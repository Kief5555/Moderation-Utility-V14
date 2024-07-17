//Import
const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Command } = require("reconlx")
const moment = require('moment');
const fs = require('fs');

//Export
module.exports = new Command({
    name: 'config',
    description: "configureable settings",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: 'Administrator', // permission required
    cooldown: 3000,
    options: [
        {
            name: 'setting',
            description: 'what setting do you want to configure?',
            type: 3,
            required: true,
            choices: [
                {
                    name: 'message event logs',
                    description: 'configure the message event logs, this will log all message events such as message edits, message deletes',
                    value: 'message_event_logs'
                }, {
                    name: 'moderation logs',
                    description: 'configure the moderation logs, this will log all moderation events such as kicks, bans, timeouts',
                    value: 'moderation_logs'
                },
                {
                    name: 'anti spam',
                    description: 'anti spam.. duh',
                    value: 'anti_spam'
                }
            ]
        },
    ],
    run: async ({ client, interaction }) => {
        //Vars
        const setting = interaction.options.getString('setting')
        const configJSON = fs.readFileSync(`./servers/${interaction.guild.id}.json`)
        let config = JSON.parse(configJSON)
        //Buttons. (Cancel, Enable, Disable)
        const actions = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Enable')
                .setStyle(ButtonStyle.Success)
                .setCustomId('enable'),
            new ButtonBuilder()
                .setLabel('Disable')
                .setStyle(ButtonStyle.Danger)
                .setCustomId('disable'),
            new ButtonBuilder()
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('cancel')

        )
        //Embeds
        const Timmedout_Select = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .setDescription('You didnt make a selection in time!')
            .addFields({ name: 'To make a selection', value: 'Run the command again.' })
            .setColor('Blurple')

        const channel_selector = new EmbedBuilder()
            .setColor('Blurple')
            .setDescription('Select a channel below, this will be your logging channel. You have 20 seconds.')
            .setTimestamp();

        const operation_cancled = new EmbedBuilder()
            .setColor('Red')
            .setDescription('Operation cancled.')
            .setTimestamp();


        //Menus
        let selectMenus = [
            new ActionRowBuilder().addComponents(
                new SelectMenuBuilder()
                    .setCustomId('channel')
                    .setPlaceholder('Nothing selected')
                    .addOptions([
                        {
                            label: `Cancel`,
                            description: 'Cancel the channel selection',
                            value: 'cancel',
                        },
                    ]),
            ),
        ];

        //Code
        await interaction.guild.channels.fetch();

        // iterate over the channels and create menu option objects
        let options = interaction.guild.channels.cache.map((channel) => ({
            label: channel.name,
            description: `#${channel.name}`,
            value: channel.id,
        }));

        // if there is less than 24 fields, you can safely send the menu
        // in a single message
        if (options.length <= 24) {
            selectMenus[0].components[0].addOptions(options);
            await interaction.reply({ embeds: [channel_selector], components: selectMenus });
        } else {

            // if there are more, you need to create chunks w/ max 24 fields
            // you can use the helper function created above
            function chunkify(arr, len) {
                let chunks = [];
                let i = 0;
                let n = arr.length;

                while (i < n)
                    chunks.push(arr.slice(i, (i += len)));

                return chunks;
            }
            const chunks = chunkify(options, 24);

            chunks.forEach((options, i) => {
                // if this is the first row, append the options
                if (i === 0)
                    selectMenus[0].components[0].addOptions(options);

                // else just create a new action row with a new menu for each 24 fields
                else
                    selectMenus.push(
                        new ActionRowBuilder().addComponents(
                            new SelectMenuBuilder()
                                .setCustomId(`channel-${i}`)
                                .setPlaceholder('Nothing selected')
                                .addOptions(options),
                        ),
                    );
            });

            if (setting === "message_event_logs" || setting === "moderation_logs") {
                await interaction.reply({ embeds: [channel_selector], components: selectMenus });
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
                    const channel = interaction.guild.channels.cache.get(value)
                    if (channel.type === 2 || channel.type === 2) return interaction.editReply({ content: 'You cannot select a voice or category channel!', embeds: [], components: [] })
                    var now = new Date()
                    var tomorrow = moment(now).add(20, 'seconds').unix()
                    const Confirm_set = new EmbedBuilder()
                        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                        .setDescription(`Are you sure you want to set the \`${setting}\` channel to <#${channel.id}> then enable it or disable it?\n\nEnabling will overwrite the current channel. Disabling will remove the current set one.\n\nThe current one is set to: ${config[setting]}`)
                        .addFields({ name: 'Timer', value: `You have <t:${tomorrow}:R> to make a selection.` })
                        .setColor('Blurple')

                    interaction.editReply({ content: `You selected #${channel.name}`, embeds: [Confirm_set], components: [actions] })

                    const mfilter = (button_interaction) => {
                        if (button_interaction.user.id === button_interaction.user.id) return true;
                        return button_interaction.reply({ content: `Only <@${interaction.user.id}> may press the button!`, ephemeral: true })
                    }
                    const mcollector = interaction.channel.createMessageComponentCollector({
                        mfilter,
                        max: 1,
                        time: 20000,
                    })
                    mcollector.on('collect', async (collected) => {
                        const id = collected.customId
                        collected.deferUpdate()
                        if (id === 'enable') {
                            const Operation_Inprogress = new EmbedBuilder()
                                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                                .setDescription(`Operation in progress.\n\nCurrently setting \`${setting}\` to ${id}d with the channel <#${channel.id}>. Please wait.`)
                                .addFields({ name: 'Time', value: `This operation usally takes less then 1 minute.` })
                                .setColor('Blurple')
                            interaction.editReply({ content: `You selected ${id}.`, embeds: [Operation_Inprogress], components: [] })
                            setTimeout(() => {
                                if (setting === "message_event_logs") {
                                    const writeme = {
                                        message_event_logs: channel.id,
                                        moderation_logs: config.moderation_logs,
                                        anti_spam: config.anti_spam
                                    }
                                    let data = JSON.stringify(writeme)
                                    fs.writeFileSync(`./servers/${interaction.guild.id}.json`, data)
                                } if (setting === "moderation_logs") {
                                    const writeme = {
                                        message_event_logs: config.message_event_logs,
                                        moderation_logs: channel.id,
                                        anti_spam: config.anti_spam
                                    }
                                    let data = JSON.stringify(writeme)
                                    fs.writeFileSync(`./servers/${interaction.guild.id}.json`, data)
                                }
                                const Operation_Success = new EmbedBuilder()
                                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                                    .setDescription(`Operation success.\n\nSuccessfully set \`${setting}\` to ${id}d with the channel <#${channel.id}>.`)
                                    .setColor('Blurple')
                                interaction.editReply({ embeds: [Operation_Success], components: [] })
                            }, 7000);
                        } else if (id === 'disable') {
                            const Operation_Inprogress = new EmbedBuilder()
                                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                                .setDescription(`Operation in progress.\n\nCurrently setting \`${setting}\` to ${id}d and removing the set channel (if there is one). Please wait.`)
                                .addFields({ name: 'Time', value: `This operation usally takes less then 1 minute.` })
                                .setColor('Blurple')
                            interaction.editReply({ content: `You selected ${id}.`, embeds: [Operation_Inprogress], components: [] })
                            setTimeout(() => {
                                if (setting === "message_event_logs") {
                                    const writeme = {
                                        message_event_logs: "",
                                        moderation_logs: config.moderation_logs
                                    }
                                    let data = JSON.stringify(writeme)
                                    fs.writeFileSync(`./servers/${interaction.guild.id}.json`, data)
                                } if (setting === "moderation_logs") {
                                    const writeme = {
                                        message_event_logs: config.message_event_logs,
                                        moderation_logs: "",
                                        anti_spam: config.anti_spam
                                    }
                                    let data = JSON.stringify(writeme)
                                    fs.writeFileSync(`./servers/${interaction.guild.id}.json`, data)
                                }
                                const Operation_Success = new EmbedBuilder()
                                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                                    .setDescription(`Operation success.\n\nSuccessfully set \`${setting}\` to ${id}d and removed the channel (if there was one).`)
                                    .setColor('Blurple')
                                interaction.editReply({ embeds: [Operation_Success], components: [] })
                            }, 6000);
                        } else if (id === 'cancel') {
                            try { interaction.editReply({ content: 'Cancelled!', embeds: [operation_cancled], components: [] }) } catch { }
                        } else {
                            try {
                                interaction.editReply({ content: 'An error occured!', embeds: [], components: [] })
                            } catch { }
                        }
                    })
                    mcollector.on('end', async (coll, reason) => {
                        if (reason === "time") {
                            await interaction.editReply({ content: "Uh oh!", embeds: [Timmedout_Select], components: [] })
                        }
                    })
                })
                collecter.on('end', async (coll, reason) => {
                    if (reason === "time") {
                        await interaction.editReply({ content: "Uh oh!", embeds: [Timmedout_Select], components: [] })
                    }
                })
            }
            if (setting === "anti_spam") {
                var now = new Date()
                var tomorrow = moment(now).add(20, 'seconds').unix()
                const Option_Choose = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                    .setDescription(`Choose an action to configure \`${setting}\`\n\nThe current one is set to: ${config[setting]}\n\n\n**Note:** Any channel nammed \`spam\` will be ignored.`)
                    .addFields({ name: 'Timer', value: `You have <t:${tomorrow}:R> to make a selection.` })
                    .setColor('Blurple')
                await interaction.reply({ embeds: [Option_Choose], components: [actions] })
                const mfilter = (button_interaction) => {
                    if (button_interaction.user.id === button_interaction.user.id) return true;
                    return button_interaction.reply({ content: `Only <@${interaction.user.id}> may press the button!`, ephemeral: true })
                }
                const mcollector = interaction.channel.createMessageComponentCollector({
                    mfilter,
                    max: 1,
                    time: 20000,
                })
                mcollector.on('collect', async (collected) => {
                    const id = collected.customId
                    collected.deferUpdate()
                    if (id === 'enable') {
                        const Operation_Inprogress = new EmbedBuilder()
                            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                            .setDescription(`Operation in progress.\n\nCurrently setting \`${setting}\` to ${id}d. Please wait.`)
                            .addFields({ name: 'Time', value: `This operation usally takes less then 1 minute.` })
                            .setColor('Blurple')
                        interaction.editReply({ embeds: [Operation_Inprogress], components: [] })
                        setTimeout(() => {
                            if (setting === "anti_spam") {
                                const writeme = {
                                    message_event_logs: config.message_event_logs,
                                    moderation_logs: config.moderation_logs,
                                    anti_spam: id + "d"
                                }
                                let data = JSON.stringify(writeme)
                                fs.writeFileSync(`./servers/${interaction.guild.id}.json`, data)
                            }
                            const Operation_Success = new EmbedBuilder()
                                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                                .setDescription(`Operation success.\n\nSuccessfully set \`${setting}\` to ${id}d.`)
                                .setColor('Blurple')
                            interaction.editReply({ embeds: [Operation_Success], components: [] })
                        }, 7000);
                    } else if (id === 'disable') {
                        const Operation_Inprogress = new EmbedBuilder()
                            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                            .setDescription(`Operation in progress.\n\nCurrently setting \`${setting}\` to ${id}d. Please wait.`)
                            .addFields({ name: 'Time', value: `This operation usally takes less then 1 minute.` })
                            .setColor('Blurple')
                        interaction.editReply({ embeds: [Operation_Inprogress], components: [] })
                        setTimeout(() => {
                            if (setting === "anti_spam") {
                                const writeme = {
                                    message_event_logs: config.message_event_logs,
                                    moderation_logs: config.moderation_logs,
                                    anti_spam: id + "d"
                                }
                                let data = JSON.stringify(writeme)
                                fs.writeFileSync(`./servers/${interaction.guild.id}.json`, data)
                            }
                            const Operation_Success = new EmbedBuilder()
                                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                                .setDescription(`Operation success.\n\nSuccessfully set \`${setting}\` to ${id}d.`)
                                .setColor('Blurple')
                            interaction.editReply({ embeds: [Operation_Success], components: [] })
                        }, 6000);
                    } else if (id === 'cancel') {
                        try { interaction.editReply({ content: 'Cancelled!', embeds: [operation_cancled], components: [] }) } catch { }
                    } else {
                        try {
                            interaction.editReply({ content: 'An error occured!', embeds: [], components: [] })
                        } catch { }
                    }
                });
                mcollector.on('end', async (coll, reason) => {
                    if (reason === "time") {
                        await interaction.editReply({ content: "Uh oh!", embeds: [Timmedout_Select], components: [] })
                    }
                });
            }
        }
    }
});