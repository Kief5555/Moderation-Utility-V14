const client = require('../index')
const fs = require('fs')
const chalk = require('chalk')

client.on("guildCreate", async(guild)=>{
    const writeme = {
        "message_event_logs":"",
        "moderation_logs":"",
        "anti_spam":"disabled"
    }
    console.log(chalk.yellow(`I got added to guild ` + chalk.green(`${guild.id}`)))
    let data = JSON.stringify(writeme)
    fs.writeFileSync(`./servers/${guild.id}.json`, data)
    try {
    guild.channels.cache.find(channel => channel.name === "general").send(`Hello, I am ${client.user.username}! I am a Public, and custom bot made my Kief#2583 for his servers and others that want this bot. I am currently in development. Please wait for the owner to add you to the server list as that function is broken currently.\n \`To get started, run /help\``)} catch {
        try {guild.channels.cache.find(channel => channel.name === "chat").send(`Hello, I am ${client.user.username}! I am a Public, and custom bot made my Kief#2583 for his servers and others that want this bot. I am currently in development. Please wait for the owner to add you to the server list as that function is broken currently.\n \`To get started, run /help\``)} catch {
            console.log(chalk.red(`I could not send a message to the general and chat channel of ${guild.id}`))
        }
    }
})