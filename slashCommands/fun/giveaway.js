//Import
const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { Command } = require("reconlx")
const simplydjs = require("simply-djs");
//Export
module.exports = new Command({
	name: 'giveaway',
	description: "your giving away something, dang. thats cool.",
    options: [
        {
            type: 3,
            name: 'prize',
            description: "The prize for the winner or winners",
            required: true
        },
        {
            type: 3,
            name: 'time',
            description: "time limit for the giveaway",
            required: true
        },
        {
            type: 4,
            name: 'winners',
            description: "amount of winners",
            required: true
        }
    ],
	type: ApplicationCommandType.ChatInput,
	userPerms: ["ManageMessages"],
	botPerms: ["ManageMessages"],
	cooldown: 3000,
	run: async ({client, interaction}) => {
        simplydjs.giveawaySystem(client, interaction, { 
        })
	}
});