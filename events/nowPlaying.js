const message_id = new Set()
const client = require("..")
const { Player, Queue, Track } = require("discord-player")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const chalk = require("chalk")
const ms = require("ms")


client.player.on("trackStart", (queue, track) => {
    let cache = client.playerCh
    console.log(chalk.blue(`Guild: ${queue.guild.name} | Requester: ${track.requestedBy.username + "#" + track.requestedBy.discriminator} | Track: ${track.title}`))

    //WatchDog

    const action_button_play = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setEmoji("⏹️")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('stop'),
        new ButtonBuilder()
            .setEmoji("⏮️")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('replay'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`pause`)
            .setEmoji("⏸️"),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`forward`)
            .setEmoji("⏭️"),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`loop`)
            .setEmoji("🔁"),
    )

    const action_button_pause = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setEmoji("⏹️")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('stop'),
        new ButtonBuilder()
            .setEmoji("⏮️")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('replay'),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`pause`)
            .setEmoji("▶️"),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`forward`)
            .setEmoji("⏭️"),
        new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`loop`)
            .setEmoji("🔁"),
    )




    const nowPlaying = new EmbedBuilder()
        .setAuthor({ name: "Now Playing", iconURL: "" })
        .setColor("Blurple")
        .setDescription(`[${track.title}](${track.url})`)
        .setThumbnail(track.thumbnail)
        .addFields(
            { name: 'Requested By', value: `<@${track.requestedBy.id}>`, inline: true },
            { name: 'Duration', value: `\`${track.duration}\``, inline: true }
        )

    const fortnite = client.guilds.cache.get(cache.guild).channels.cache.get(cache.channel)
    fortnite.send({ embeds: [nowPlaying], components: [action_button_play] }).then((message) => {
        message_id.add(message.id)
        const collecter = fortnite.createMessageComponentCollector({
            length: 900000
        })
        collecter.on('collect', async (ButtonInteraction) => {
            const id = ButtonInteraction.customId
            if (ButtonInteraction.customId === "pause") {
                if (queue.connection.paused === true) {
                    queue.setPaused(false)
                    ButtonInteraction.update({ components: [action_button_play] })
                } else {
                    queue.setPaused(true)
                    ButtonInteraction.update({ components: [action_button_pause] })
                }
            }
            if (ButtonInteraction.customId === "stop") {
                queue.stop()
                let stop = new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription("Successfully stopped the player!")

                let queueEmbed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setAuthor({
                        name: "The queue has ended",
                        iconURL: "",
                    })
                    .setFooter({ text: "Queue ended" })
                    .setTimestamp();
                const channel = client.channels.cache.get(cache.channel)
                channel.send({ embeds: [stop, queueEmbed] }).then((message) => {
                    setTimeout(() => {
                        message.delete()
                    }, 10000);
                })
            }
        })
    })


})

client.player.on("trackEnd", (queue, track) => {

    let cache = client.playerCh

    if (message_id) {
        message_id.forEach(id => {
            const channel = client.channels.cache.get(cache.channel)
            channel.messages.fetch(id).then(msg => msg.delete())
            message_id.delete(id)
        });
    }
})

client.player.on("queueEnd", (queue, track) => {
    let cache = client.playerCh

    if (message_id) {
        message_id.forEach(id => {
            let queueEmbed = new EmbedBuilder()
                .setColor("Blurple")
                .setAuthor({
                    name: "The queue has ended",
                    iconURL: "",
                })
                .setFooter({ text: "Queue ended" })
                .setTimestamp();
            const channel = client.channels.cache.get(cache.channel)
            channel.message.fetch(id).send({ embeds: [queueEmbed] })
        });
    }
})
