//Import
const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { Command } = require("reconlx")
//const TicTacToe = require('discord-tictactoe');
//const game = new TicTacToe({ language: 'en', commandOptionName: 'user' });
const simplydjs = require("simply-djs");
//Export
module.exports = new Command({
	name: 'tictactoe',
	description: "plays a game of tictactoe?",
    options: [
        {
            type: 6,
            name: 'user',
            description: "Mention the User",
            required: true
        }
    ],
	type: ApplicationCommandType.ChatInput,
	userPerms: [],
	botPerms: ["SendMessages"],
	cooldown: 3000,
	run: async ({client, interaction}) => {
        simplydjs.tictactoe(interaction, {
            xEmoji: "❌", //default: ❌
            oEmoji: "⭕", //default: ⭕
            idleEmoji: "➖", //default: ➖
            embedColor: "#075FFF", //default: #075FFF
            embedFoot: 'Make sure to win :)' //default: 'Make sure to win ;)'
          });
		//game.handleInteraction(interaction);
	}
});