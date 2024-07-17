const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { Command } = require("reconlx")
const { QueryType } = require("discord-player")

module.exports = new Command({
    name: 'resume',
    description: "resumes the music",
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

        const ErrEmbed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("There are no songs in the queue")
        .setColor("Red")
		if (!queue) return await interaction.reply({embeds: [ErrEmbed]})

		queue.setPaused(false)
        const PauseEmbed = new EmbedBuilder()
        .setTitle("Resumed!")
        .setDescription("Music has been resumed! Use `/pause` to pause the music")
        .setColor("Green")
        let tdel = await interaction.reply({embeds: [PauseEmbed]})
        setTimeout(() => {
            try {
            tdel.delete()
            } catch {}
        }, 10000);
    }
});