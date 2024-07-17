//Import
const { ApplicationCommandType, EmbedBuilder, Embed } = require('discord.js');
const { Command } = require("reconlx")
const ms = require('ms');

//Export
module.exports = new Command({
	name: 'clear',
	description: "clears messages",
	type: ApplicationCommandType.ChatInput,
    default_member_permissions: 'ManageMessages', // permission required
    botPerms: "ManageMessages", // bot permissions required
	options: [
        {
            name: 'amount',
            description: 'the amount of messages you want to clear',
            type: 4,
            required: true
        }
    ],
	run: async ({client, interaction}) => {
        //Vars  
        const amount = interaction.options.getInteger('amount')

        //Embeds
        const max_messages = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('Error | Clear')
        .setDescription('The maximum amount of messages to delete is 100')
        .setTimestamp()
        const no_permisisons = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('Error | Clear')
        .setDescription('I dont seem to have permission to delete messages in this channel.')
        .setTimestamp()

        const problem_deleting = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('Error | Clear')
        .setDescription('There was a problem attempting to while trying to purge the messages.')
        .setTimestamp()


        //Check if amount is greater then 100
        if (amount > 100) return interaction.reply({ embeds: [max_messages] })

        //Check if bot has permissions
        if (!interaction.guild.members.cache.get(client.user.id).permissions.has('ManageMessages')) return interaction.reply({ embeds: [no_permisisons] })

        //Execute
        const messages = await interaction.channel.messages.fetch({limit: amount ,})
        const filtered = messages.filter((msg => Date.now() - msg.createdTimestamp < ms('14 days')))
        const success_deleting = new EmbedBuilder()
        .setTitle('Success | Clear')
        .setColor('Blurple')
        .setDescription('Successfully deleted ' + filtered.size + ' messages.')
        .setTimestamp()


        try {interaction.channel.bulkDelete(filtered, true); interaction.reply({embeds: [success_deleting]})} catch { return interaction.reply({ embeds: [problem_deleting] }) }
	}
});