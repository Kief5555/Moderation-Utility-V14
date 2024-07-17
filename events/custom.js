const client = require("../index");
const {EmbedBuilder, Embed} = require("discord.js")
const refront = `^<@!?928883516391960636>`;
const mention = new RegExp(refront + "$");

client.on("guildMemberAdd", async(user) => {
    if(user.guild.id === "955200268998434856") {
        const channel = user.guild.channels.cache.get("955200269430435901")
        const embed = new EmbedBuilder()
        .setAuthor({name: user.user.tag, iconURL: user.displayAvatarURL()})
        .setDescription('This person joined. Thought I just let you know.. hehe i coded this.')
        .setColor('Red')

        channel.send({content: "<@538797349821087777> a user joined this guild sussy baker", embeds: {embed}})
    }
    
});

client.on("messageCreate", async (message) => {
    if (message.content.match(mention)) {
		const mentionEmbed = new EmbedBuilder()
			.setColor(client.config.embedColor)
			.setDescription(
				`My prefix on this server is \`/\` (Slash Command).\nTo get started you can type \`/help\` to see all my commands.\nIf you can't see it, Please [re-invite](invite) me with the correct permissions.`,
			);
		message.channel.send({
			embeds: [mentionEmbed],
		});
	}
    if(message.content === ">init")
    if(message.member.id === "538797349821087777") {
        message.channel.send("[Init] Preparing")
        setTimeout(() => {
            message.channel.send("[Init] Fetching users")   
            message.channel.send("[Init] Fetching servers")
            message.channel.send("[Init] Fetching events")
            message.channel.send("[Init] Registering")
            setTimeout(() => {
                message.channel.send("[Init] Reported Success")
            }, 10000);
        }, 3000);
    }
})