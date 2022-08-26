/* Library: Discord.JS */

 require('dotenv').config()
const express = require("express")
const app = express()
app.get("/", async(req, res) => {
  res.sendStatus(200)
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server Started Serving on port: ${PORT}`)
})
const {Client, MessageEmbed} = require('discord.js');
const { token } = process.env;
const config = require('./config.json')
const ms = require('pretty-ms')
const client = new Client({
    intents: ["GUILDS",
    
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING"],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    restTimeOffset: 0,
    allowedMentions: {
        parse: ['users']
    }
})

client.on('messageCreate', async message => {
    if(message.author.bot) return;
    if(message.content.toLowerCase() === ".ping") {
      const l = await message.channel.send('Pinging...')
      const ping = l.createdTimestamp - message.createdTimestamp
      await l.edit(`Pong! (Websocket: ${client.ws.ping}ms. Roundtrip: ${ping}ms.)`)
    }
    if(message.content.toLowerCase() === ".uptime") {
  return message.channel.send(`I have been running for: ${ms(client.uptime)}`)
    }
    if(message.channel.id === config.channel) {
        const embed = new MessageEmbed()
        .setTitle('Welcome to Fletify')
        .setDescription('Please Send a message below describing your bug and wait for me to open a thread!')
        .setTimestamp()
        .setColor("RANDOM")
        const embed2 = new MessageEmbed()
        .setTitle(`Welcome to the thread @${message.author.username}`)
        .setDescription('Please Explain your bug here, and wait for a developer to respond. If this bug is resolved please archive this thread by typing `.archive`')
        .setTimestamp()
        .setColor("RANDOM")
        await message.channel.bulkDelete(2, true)
       const thread =  await message.channel.threads.create({
            name:  `${message.author.tag}'s Thread`,
            autoArchiveDuration: 10080,
            reason: 'Bug Report'
        })
        if (thread.joinable) await thread.join();
        await thread.members.add(message.author.id);
        thread.send({embeds: [embed2]})
        message.channel.send({embeds: [embed]})
    }
})

client.on('messageCreate', async message => {
  if(message.author.bot) return;
  if(message.channel.id === config.support_channel) {
      const embed = new MessageEmbed()
      .setTitle('Welcome to Fletify')
      .setDescription('Please Send a message below describing what help you need and wait for me to open a thread!')
      .setTimestamp()
      .setColor("RANDOM")
      const embed2 = new MessageEmbed()
      .setTitle(`Welcome to the thread @${message.author.username}`)
      .setDescription('Please Explain your problem here, and wait for a developer to respond. If this is resolved please archive this thread by typing `.archive`')
      .setTimestamp()
      .setColor("RANDOM")
      await message.channel.bulkDelete(2, true)
     const thread =  await message.channel.threads.create({
          name:  `${message.author.tag}'s Thread`,
          autoArchiveDuration: 10080,
          reason: 'Support Thread'
      })
      if (thread.joinable) await thread.join();
      await thread.members.add(message.author.id);
      thread.send({embeds: [embed2]})
      message.channel.send({embeds: [embed]})
  }
})


client.on('messageCreate', async message => {
    if(message.author.bot) return;
    if(message.channel.type !== 'GUILD_PUBLIC_THREAD') return;
    if(message.content === '.archive') {
      await message.channel.send("This thread is now Archived.")
      await message.channel.setLocked(true);
      await message.channel.setArchived(true);
    }
});


client.on('ready', () => {
  console.log("Bot is ready!");

  client.user.setPresence({ activities: [{ name: 'Among Us' }], status: 'idle' });
  
  const rainbowRoles = ["1010089722120511529", "1012756640891678801"];
  const guild = client.guilds.cache.get("943734426737725472");
  const randomColors = 
      ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

  rainbowRoles.forEach((rainbowRole) => {

    const role = guild.roles.cache.get(rainbowRole);
    const color = randomColors[Math.floor(Math.random() * randomColors.length)];

    try {
      role.edit({ color: color });
    } 
    catch(err) {}
    
    setInterval(() => {
      try {
        role.edit({ color: color });
      } catch(err) {}
    }, 1000 * 60 * 30);
    
  });
  
})
client.login(token);
