const client = require("../index");
const fs = require("fs");
const moment = require("moment");
const { EmbedBuilder } = require("discord.js");

//When a messages is deleted check if server configures it to log the delete messages and if so log it to the channel provided
//We also need to get the image deleted then add that to the embed.
client.on("messageDelete", async (message, channel) => {
    try {
        if (!message) return;
        let rawdata = fs.readFileSync(`./servers/${message.guild.id}.json`);
        let configfile = JSON.parse(rawdata);
        if (configfile.message_event_logs) {
            const channel = message.guild.channels.cache.get(configfile.message_event_logs);
            try {
                Date.prototype.toUnixTime = function () { return this.getTime() / 1000 | 0 };
                Date.time = function () { return new Date().toUnixTime(); }
                const embed = new EmbedBuilder()
                    //Here is where I define the image to be added to the embed.
                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                    .setDescription(`Message deleted in ${message.channel}`)
                    .setColor("Blurple")
                    .addFields({ name: "Content/Message", value: message.content || "No content" })
                    //Timestamp in unix time
                    .addFields({ name: "Timestamp", value: `<t:${Date.time()}:R>` })
                    .addFields({ name: "ID", value: "```m\nUser = " + message.author.id + "\nMessage = " + message.id + "```" })
                    .setTimestamp()
                    .setFooter({ text: `Moderation Utilities`, iconURL: client.user.displayAvatarURL() });
                channel.send({ embeds: [embed] });
            } catch (err) {
            }
        }
    } catch {

    }
});


//When a message is edited check if server configures it to log the edit messages and if so log it to the channel provided
client.on("messageUpdate", async (oldMessage, newMessage) => {
    try {
        if (newMessage.author.bot) return;
        let rawdata = fs.readFileSync(`./servers/${newMessage.guild.id}.json`);
        let configfile = JSON.parse(rawdata);
        if (configfile.message_event_logs) {
            const channel = newMessage.guild.channels.cache.get(configfile.message_event_logs);
            try {
                Date.prototype.toUnixTime = function () { return this.getTime() / 1000 | 0 };
                Date.time = function () { return new Date().toUnixTime(); }
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${newMessage.author.tag}`, iconURL: newMessage.author.displayAvatarURL() })
                    .setDescription(`Message edited in ${newMessage.channel}`)
                    .setColor("Blurple")
                    .addFields({ name: "Content/Message", value: newMessage.content || "No Content" })
                    .addFields({ name: "Old Content/Message", value: oldMessage.content || "No Content" })
                    //Timestamp in unix time
                    .addFields({ name: "Timestamp", value: `<t:${Date.time()}:R>` })
                    .addFields({ name: "ID", value: "```m\nUser = " + newMessage.author.id + "\nMessage = " + newMessage.id + "```" })
                    .setTimestamp()
                    .setFooter({ text: `Moderation Utilities`, iconURL: client.user.displayAvatarURL() });
                channel.send({ embeds: [embed] });
            } catch (err) {

            }
        }
    } catch { }
});