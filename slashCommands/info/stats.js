//Vars
const { ApplicationCommandType } = require('discord.js');
const { EmbedBuilder } = require('discord.js')
require("moment-duration-format");
const cpuStat = require("cpu-stat");
const moment = require("moment");
const { Command } = require("reconlx")

module.exports = new Command({
    name: 'stats',
    description: "Check the bot's stats",
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    run: async ({ client, interaction }) => {
        cpuStat.usagePercent(async function (err, percent, seconds) {
            if (err) {
                return console.log(err);
            }
            const duration = moment.duration(interaction.client.uptime).format(" D[d], H[h], m[m]");
            const embed = new EmbedBuilder()
            embed.setColor("Blurple")
            embed.setTitle(`Stats from \`${client.user.username}\``)
            embed.addFields({
                name: ':ping_pong: Ping',
                value: `┕\`${Math.round(client.ws.ping)}ms\``,
                inline: true
            },
                {
                    name: ':clock1: Uptime',
                    value: `┕\`${duration}\``,
                    inline: true
                }, {
                name: ':file_cabinet: Memory',
                value: `┕\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb\``,
                inline: true
            })

            embed.addFields({
                name: ':homes: Servers',
                value: `┕\`${client.guilds.cache.size}\``,
                inline: true
            },
                {
                    name: ':busts_in_silhouette: Users',
                    value: `┕\`${client.users.cache.size}\``,
                    inline: true
                }, {
                name: ':control_knobs: API Latency',
                value: `┕\`${(interaction.client.ws.ping)}ms\``,
                inline: true
            }, {
                name: ':robot: Version',
                value: `┕\`v${require("../../package.json").version}\``,
                inline: true
            }, {
                name: ':blue_book: Discord.js',
                value: `┕\`v${"14.6.0"}\``,
                inline: true
            }, {
                name: ':green_book: Node',
                value: `┕\`${process.version}\``,
                inline: true
            })
            interaction.reply({ embeds: [embed] })
        })
    }
});