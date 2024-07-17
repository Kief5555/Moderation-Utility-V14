const client = require('../index')
const { EmbedBuilder } = require("discord.js")
client.on("messageCreate", async (message) => {

  // Get our input arguments
  const args = message.content.split(" ").slice(1);

  // The actual eval command
  if (message.content.startsWith(`>eval`)) {

    // If the message author's ID does not equal
    // our ownerID, get outta there!
    if (message.author.id !== "538797349821087777")
      return message.reply({ content: "Access is denied." });

    // In case something fails, we to catch errors
    // in a try/catch block
    const clean = async (client, text) => {
      // If our input is a promise, await it before continuing
      if (text && text.constructor.name == "Promise")
        text = await text;

      // If the response isn't a string, `util.inspect()`
      // is used to 'stringify' the code in a safe way that
      // won't error out on objects with circular references
      // (like Collections, for example)
      if (typeof text !== "string")
        text = require("util").inspect(text, { depth: 1 });
      // Replace symbols with character code alternatives
      text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
      
      // Send off the cleaned up result
      return text
    }
    try {
      // Evaluate (execute) our input
      const evaled = eval(args.join(" "));

      // Put our eval result through the function
      // we defined above
      const cleaned = await clean(client, evaled);

      // Reply in the channel with our result
      //message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``);
    } catch (err) {
      // Reply in the channel with our error
      message.channel.send(`\`\`\`xl\nAn error occured while trying to execute the command. It has been logged to ~/logs/.\n\`\`\``);
    }
    // End of our command
  }

  // End of our message event handler
});