const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { Command } = require("reconlx")
const { QueryType } = require("discord-player")
const channel_id = new Set()

module.exports = new Command({
    name: 'play',
    description: "loads a song from youtube",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'query',
            description: 'What am I looking for?',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    cooldown: 1000,
    run: async ({ client, interaction }) => {
        await interaction.reply("Seaching!")
        if (!interaction.member.voice.channel) return interaction.editReply("You need to be in a VC to use this command")
        function validURL(str) {
            var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
            return !!pattern.test(str);
        }
        const isUrl = validURL(interaction.options.getString("query"))
        const queue = await client.player.createQueue(interaction.guild)
        client.playerCh = {
            guild: interaction.guild.id,
            channel: interaction.channel.id
        }
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.editReply({ content: "Could not join your voice channel!", ephemeral: true });
        }

        let embed = new EmbedBuilder()
            .setAuthor({ name: "Added to queue", iconURL: "" })
            .setColor("Blurple")
            .setTimestamp()


        let url = interaction.options.getString("query")
        if (isUrl === true) {
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("No results")

            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`[${song.title}](${song.url})`)
                .setThumbnail(song.thumbnail)
                .addFields(
                    { name: 'Requested By', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Duration', value: `\`${song.duration}\``, inline: true }
                )
        } else {
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.editReply("No results")

            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`[${song.title}](${song.url})`)
                .setThumbnail(song.thumbnail)
                .addFields(
                    { name: 'Requested By', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Duration', value: `\`${song.duration}\``, inline: true }
                )
        }
        if (!queue.playing) await queue.play()
        let tdel = await interaction.editReply({
            content: "",
            embeds: [embed]
        })
        setTimeout(() => {
            try {
                tdel.delete()
            } catch { }
        }, 10000);
        channel_id.add(interaction.channel.id)
    }
});