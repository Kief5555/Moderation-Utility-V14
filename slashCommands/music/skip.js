const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { Command } = require("reconlx")
const { QueryType } = require("discord-player")

module.exports = new Command({
    name: 'skip',
    description: "skips the music",
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)
        const ErrEmbed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("There are no songs in the queue")
        .setColor("Red")
		if (!queue) return await interaction.reply({embeds: [ErrEmbed]})

        const currentSong = queue.current
		queue.skip()
        let tdel = await interaction.reply({
            embeds: [
                new EmbedBuilder().setDescription(`Skipped!`).setColor('Blurple')
            ]
        })
        setTimeout(() => {
            try {
            tdel.delete()
            } catch {}
        }, 10000);
    }
});