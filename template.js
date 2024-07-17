//Import
const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { Command } = require("reconlx")

//Export
module.exports = new Command({
	name: '',
	description: "",
	type: ApplicationCommandType.ChatInput,
	userPerms: [],
	botPerms: [],
	cooldown: 3000,
	run: async ({client, interaction}) => {
		
	}
});