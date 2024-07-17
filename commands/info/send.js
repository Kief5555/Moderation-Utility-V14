const { EmbedBuilder } = require("discord.js")

//Config 
const title = "";
const description = "";
const color = "";
const field = { name: "", value: "" };


const arrayOfGroup1 = []
const arrayOfGroup2 = []
const arrayOfGroup3 = []
module.exports = {
    name: 'sendshard',
    description: "sends a shardcat to kill you ",
    cooldown: 3000,
    userPerms: [],
    botPerms: [],
    run: async (client, message, args) => {
        if (message.author.id !== "538797349821087777") return message.reply('0x8003001F')
        message.delete()
        const embed = new EmbedBuilder()
            .setTitle("Vancouver Aquatic Centre Meet")
            .setDescription(`
            This weekend's meet is at Vancouver Aquatic Centre. Parking does get full pretty quickly, so please drop your swimmer off before finding parking unless you're very early.
            As you'll be able to tell in the session reports I've attached, the format is a bit different this weekend. 
            The lunch breaks are very short, so coaches will tell swimmers what time they need to be back for the Sat/Sun afternoon session. Some swimmers will need to be back at the times below, but others may be able to take a longer lunch break. Thankfully we are done fairly early all 3 nights. Bring deck chairs, bring healthy snacks and please communicate if you are running late or anything like that.
            

            **Times**
            > Fri AM - 9:15am on deck (George, Tim, Hope, Taylor EggMan Dama)
            > Fri PM - 2:10pm on deck (<t:1674252600:R>)
            > Sat AM - 7:00am on deck (<t:1674313200:R>)
            > Sat PM - 1:30pm on deck (<t:1674336600:R>)
            > Sun AM - 7:00am on deck (<t:1674399600:R>)
            > Sun PM - 11:45am on deck (<t:1674416700:R>)



            **Location/Map**
            > Location: 1050 Beach Ave, Vancouver, BC V6E 1T7, Canada
            > [Google maps](https://goo.gl/maps/7QWo5Sxi4HnYs3Xm8) | [Apple Maps](https://maps.apple.com/?address=1050%20Beach%20Ave,%20Vancouver%20BC%20V6E%201V3,%20Canada&auid=18331148799436299867&ll=49.276780,-123.135399&lsp=9902&q=Vancouver%20Aquatic%20Centre)
            `)
            .setColor("Blurple")
            .setTimestamp()
        message.channel.send({ embeds: [embed] })
    }
};