const { ApplicationCommandType } = require('discord.js');
const { EmbedBuilder } = require('discord.js')
const { Command } = require("reconlx")
module.exports = new Command({
	name: 'ping',
	description: "Check bot's ping.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	run: async ({client, interaction}) => {
		let msg = await interaction.channel.send({
			embeds: [
				new EmbedBuilder()
					.setDescription("🏓 | Fetching ping...")
					.setColor("#6F8FAF"),
			],
		});

		let zap = "⚡";
		let green = "🟢";
		let red = "🔴";
		let yellow = "🟡";

		var botState = zap;
		var apiState = zap;

		let apiPing = client.ws.ping;
		let botPing = Math.floor(msg.createdAt - interaction.createdAt);

		if (apiPing >= 40 && apiPing < 200) {
			apiState = green;
		} else if (apiPing >= 200 && apiPing < 400) {
			apiState = yellow;
		} else if (apiPing >= 400) {
			apiState = red;
		}

		if (botPing >= 40 && botPing < 200) {
			botState = green;
		} else if (botPing >= 200 && botPing < 400) {
			botState = yellow;
		} else if (botPing >= 400) {
			botState = red;
		}
		try {
		msg.delete();
		} catch {
			
		}
		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("🏓 | Pong!")
					.addFields(
						{
							name: "API Latency",
							value: `\`\`\`yml\n${apiState} | ${apiPing}ms\`\`\``,
							inline: true,
						},
						{
							name: "Bot Latency",
							value: `\`\`\`yml\n${botState} | ${botPing}ms\`\`\``,
							inline: true,
						}
					)
					.setColor("Blurple")
					.setFooter({
						text: `Requested by ${interaction.user.tag}`,
						iconURL: interaction.user.avatarURL(),
					}),
			],
		});
	}
});