const { ActivityType } = require('discord.js');
const client = require('..');
const chalk = require('chalk');

client.on("ready", () => {
	const activities = [
		{ name: `${client.guilds.cache.size} Servers`, type: ActivityType.Watching },
		{ name: `${client.users.cache.size} Users`, type: ActivityType.Watching },
	];
	function getActivity() {
		return client.users.cache.size;
	}
	const status = [
		'online',
	];
	let i = 0;
	setInterval(() => {
		if(i >= activities.length) i = 0
		client.user.setActivity(activities[i])
		i++;
	}, 5000);

	let s = 0;
	setInterval(() => {
		if(s >= activities.length) s = 0
		client.user.setStatus(status[s])
		s++;
	}, 30000);
	console.log(chalk.greenBright(`Logged in as ${client.user.tag}!`))
});