const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Aki } = require("aki-api")
const isPlaying = new Set()
module.exports = {
    name: 'aki',
    description: "Starts a game of akinator",
    cooldown: 10000,
    run: async (client, message, args) => {
        //akinator(message, client)


        if (isPlaying.has(message.author.id)) return message.reply("You are already playing a game of Akinator. Please complete or cancel that game to start a new game.").catch(err => { })

        isPlaying.add(message.author.id)



        const region = 'en'
        const childMode = true
        const proxy = undefined

        const aki = new Aki({ region, childMode, proxy })

        const waitEmbed = new EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setTitle("Please Wait")
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`Starting a new game of Akinator for ${message.author.tag}!`)
            .setColor("Blurple")
            .setFooter({ text: `Akinator game requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

        const waitMessage = await message.channel.send({ embeds: [waitEmbed] })

        await aki.start()

        const startEmbed = new EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setTitle(`Question ${aki.currentStep + 1}`)
            .addFields(
                {
                    name: "Question",
                    value: `${aki.question}`
                },
                {
                    name: "Progress",
                    value: `${aki.progress}%`
                }
            )
            .setColor("Blurple")
            .setFooter({ text: `Akinator game requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("Yes")
                .setEmoji("✅")
                .setCustomId("y"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("No")
                .setEmoji("❌")
                .setCustomId("n"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("Don't Know")
                .setEmoji("❓")
                .setCustomId("idk")
        )

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("Probably")
                .setEmoji("🤔")
                .setCustomId("pb"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("Probaby Not")
                .setEmoji("🙄")
                .setCustomId("pn"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel("Stop")
                .setEmoji("🛑")
                .setCustomId("stop"),
        )

        const startMessage = await waitMessage.edit({ embeds: [startEmbed], components: [row1, row2] })

        const filter = (interaction) => {

            if (interaction.user.id === message.author.id) return true;
            return interaction.reply({
                content: `Only ${message.author.tag} can use this interaction!`,
                ephemeral: true,
            });
        };

        const collector = startMessage.createMessageComponentCollector({
            filter,
            time: 60000 * 5
        })

        collector.on("collect", async (interaction) => {
            if (interaction.customId === "y") {
                await aki.step(0)
            }
            if (interaction.customId === "n") {
                await aki.step(1)
            }
            if (interaction.customId === "idk") {
                await aki.step(2)
            }
            if (interaction.customId === "pb") {
                await aki.step(3)
            }
            if (interaction.customId === "pn") {
                await aki.step(4)
            }
            if (interaction.customId === "stop") {

                row1.components[0].setDisabled(true)
                row1.components[1].setDisabled(true)
                row1.components[2].setDisabled(true)
                row2.components[0].setDisabled(true)
                row2.components[1].setDisabled(true)
                row2.components[2].setDisabled(true)

                await startMessage.edit({ content: "This game has been stopped", components: [row1, row2] })

                collector.stop()
                isPlaying.delete(message.author.id)
            }

            if (aki.progress >= 90 || aki.currentStep >= 48) {
                await aki.win(region)

                collector.stop()
                isPlaying.delete(message.author.id)

                const guessEmbed = new EmbedBuilder()
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setTitle("Is this your character?")
                    .setDescription(`**Name:** ${aki.answers[0].name}\n\n${aki.answers[0].description}`)
                    .setImage(aki.answers[0].absolute_picture_path)
                    .setColor("Blurple")
                    .setFooter({ text: `Akinator game requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

                const row3 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Success)
                        .setLabel("Yes")
                        .setEmoji("✅")
                        .setCustomId("yes"),

                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setLabel("No")
                        .setEmoji("❌")
                        .setCustomId("no"),
                )

                const guessMessage = await interaction.update({ embeds: [guessEmbed], components: [row3] })

                const buttoncollector = startMessage.createMessageComponentCollector({
                    filter,
                    time: 60000
                })

                buttoncollector.on("collect", async (interaction) => {
                    if (interaction.customId === "yes") {
                        const yesEmbed = new EmbedBuilder()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle("Guessed it correctly!")
                            .addFields(
                                {
                                    name: `Name`,
                                    value: `${aki.answers[0].name}`,
                                    inline: true
                                },
                                {
                                    name: `Description`,
                                    value: `${aki.answers[0].description}`,
                                    inline: true
                                },
                                {
                                    name: `Ranking`,
                                    value: `${aki.answers[0].ranking}`,
                                    inline: true
                                }
                            )
                            .setColor("#39FF14")
                            .setThumbnail(client.user.displayAvatarURL())
                            .setImage(aki.answers[0].absolute_picture_path)
                            .setFooter({ text: `Akinator game requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        row3.components[0].setDisabled(true)
                        row3.components[1].setDisabled(true)

                        interaction.update({ embeds: [yesEmbed], components: [row3] })
                    }
                    if (interaction.customId === "no") {
                        const yesEmbed = new EmbedBuilder()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle("You win!")
                            .setDescription(`You win this time, but I will definitely with the next time!\n\nWell Played!`)
                            .setColor("#FF0000")
                            .setThumbnail(client.user.displayAvatarURL())
                            .setFooter({ text: `Akinator game requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

                        row3.components[0].setDisabled(true)
                        row3.components[1].setDisabled(true)

                        interaction.update({ embeds: [yesEmbed], components: [row3] })
                    }
                })
            } else {
                const continueEmbed = new EmbedBuilder()
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setTitle(`Question ${aki.currentStep + 1}`)
                    .addFields(
                        {
                            name: "Question",
                            value: `${aki.question}`
                        },
                        {
                            name: "Progress",
                            value: `${aki.progress}%`
                        }
                    )
                    .setColor("Blurple")
                    .setFooter({ text: `Akinator game requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

                await interaction.update({ embeds: [continueEmbed], components: [row1, row2] })
            }
        })
        collector.on('end', async (coll, reason) => {
            if (reason === "time") {
                await waitMessage.edit({ content: "The game ended because you didnt answer in 60 seconds", embeds: [], components: [] })
            }
        })

    }
};
