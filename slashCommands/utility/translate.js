//Import
const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { Command } = require("reconlx")
const translate = require("@iamtraction/google-translate")

//Export
module.exports = new Command({
	name: 'Translate',
	type: ApplicationCommandType.Message,
	cooldown: 3000,
	run: async ({client, interaction}) => {
        const msg = await interaction.channel.messages.fetch(
            interaction.targetId
          );
          if(msg.content.length > 500) {
            await interaction.reply({content: `Message is too long. Please try to translate 500 characters or less. (Error: 0x80030018)`});
          } else {
          const translated = await translate(msg.content, { to: 'en' });
          const embed = new EmbedBuilder()
          .setFooter({text:`Translate | Requested by ${interaction.user.tag}`})
          .setTimestamp()
          .addFields({name: "Text To Translate:", value: `\`\`\`${msg.content}\`\`\``}, {name: "Translateted Text:", value: `\`\`\`${translated.text}\`\`\``}, {name: 'Message URL', value: `[Click here](${msg.url})`})
          .setColor('Blurple')
          await interaction.reply({ embeds: [embed] })}
	}
});