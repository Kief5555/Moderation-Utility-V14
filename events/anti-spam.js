const client = require('..')
const AntiSpam = require("discord-anti-spam");

const fs = require('fs')
const antiSpam = new AntiSpam({
  warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
  muteThreshold: 6, // Amount of messages sent in a row that will cause a mute
  kickThreshold: 10000000000000000000n, // Amount of messages sent in a row that will cause a kick.
  banThreshold: 1000000000000000000n, // Amount of messages sent in a row that will cause a ban.
  maxInterval: 2000, // Amount of time (in milliseconds) in which messages are considered spam.
  warnMessage: "{@user}, Please stop spamming.", // Message that will be sent in chat upon warning a user.
  kickMessage: "**{user_tag}** has been kicked for spamming.", // Message that will be sent in chat upon kicking a user.
  muteMessage: "**{@user}**, You have been muted for 10 Minutes. Reason: Spamming.", // Message that will be sent in chat upon muting a user.
  banMessage: "**{user_tag}** has been banned for spamming.", // Message that will be sent in chat upon banning a user.
  maxDuplicatesWarning: 6, // Amount of duplicate messages that trigger a warning.
  maxDuplicatesKick: 10000000000000000, // Amount of duplicate messages that trigger a warning.
  maxDuplicatesBan: 1000000000000000000, // Amount of duplicate messages that trigger a warning.
  maxDuplicatesMute: 8, // Ammount of duplicate message that trigger a mute.
  ignoredPermissions: ["Administrator", "ManageMessages"], // Bypass users with any of these permissions.
  ignoreBots: true, // Ignore bot messages.
  verbose: true, // Extended Logs from module.
  ignoredMembers: [], // Array of User IDs that get ignored.
  muteRoleName: "Muted", // Name of the role that will be given to muted users!
  unMuteTime: 10, // Amount of time (in minutes) a user will be muted for.
  removeMessages: true, // If the bot should remove all the spam messages when taking action on a user!
  // And many more options... See the documentation.
});
client.on('guildMemberRemove', (member) => {
  antiSpam.userleave(member);
});
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  const guild = message.guild;
  try {
  let rawdata = fs.readFileSync(`./servers/${guild.id}.json`);
  let configfile = JSON.parse(rawdata);
  if (configfile.anti_spam === "enabled") return antiSpam.message(message)
  } catch {
    
  }
});