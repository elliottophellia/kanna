const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ],
    disableMentions: 'everyone',
});
const BannedWords = require('./botconfig/badword.json');
const config = require('./botconfig/config.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
  
client.on("message", message => {

    const BannedWordsz = new MessageEmbed()
    .setColor(`${config.color}`)
    .setTitle('Badword Detected!')
    .setDescription(`User <@${message.author.id}> got warn for using badword!`)

    const BannedRaid = new MessageEmbed()
    .setColor(`${config.color}`)
    .setTitle('Raid Detected!')
    .setDescription(`User <@${message.author.id}> got banned for raid attempt!`)
    .setImage('https://static.wikia.nocookie.net/maid-dragon/images/f/f7/Kanna_is_mad.png')

    if (BannedWords.some(word => message.toString().toLowerCase().trim().match(/\w+|\s+|[^\s\w]+/g) !== null && message.toString().toLowerCase().trim().match(/\w+|\s+|[^\s\w]+/g).includes(word))) { message.delete().catch(e => console.error("Couldn't delete message.")); message.author.send(BannedWordsz) };
    
    if (message.content.includes("@everyone")) { message.guild.members.get(message.author.id).ban({ reason : 'Raid attempt!'}).catch(e => console.error("Couldn't ban him/her.")); message.channel.send(BannedRaid) };
    
    if (message.content.includes("@here")) { message.guild.members.get(message.author.id).ban({ reason : 'Raid attempt!'}).catch(e => console.error("Couldn't ban him/her.")); message.channel.send(BannedRaid) };
});

const usersMap = new Map();
const LIMIT = 4;
const TIME = 10000;
const DIFF = 2000;

client.on('message', message => {
  const BannedRaid = new MessageEmbed()
  .setColor(`${config.color}`)
  .setTitle('Raid Detected!')
  .setDescription(`User <@${message.author.id}> got banned for raid attempt!`)
  .setImage('https://static.wikia.nocookie.net/maid-dragon/images/f/f7/Kanna_is_mad.png')
  const FalseBan = new MessageEmbed()
  .setColor(`${config.color}`)
  .setTitle('BANNED FROM LYGC+!')
  .setDescription(`User <@${message.author.id}>, You got banned from LYGC+!\n\nIf you thing this was mistakes then DM me EiLALUTH#5752`)
  .setImage('https://static.wikia.nocookie.net/maid-dragon/images/f/f7/Kanna_is_mad.png')
  if(message.author.bot) return;
  //if(message.member.permissions.has("ADMINISTRATOR")) return;
  if(usersMap.has(message.author.id)) {
    const userData = usersMap.get(message.author.id);
    const { lastMessage, timer } = userData;
    const difference = message.createdTimestamp - lastMessage.createdTimestamp;
    let msgCount = userData.msgCount;
    console.log(difference);
    if(difference > DIFF) {
      clearTimeout(timer);
      console.log('Cleared timeout');
      userData.msgCount = 1;
      userData.lastMessage = message;
      userData.timer = setTimeout(() => {
        usersMap.delete(message.author.id);
        console.log('Removed from RESET.');
      }, TIME);
      usersMap.set(message.author.id, userData);
    }
    else {
      ++msgCount;
      if(parseInt(msgCount) === LIMIT) {
        message.author.send(FalseBan)
        message.guild.members.resolve(message.author.id).ban({ reason : 'Raid attempt!'})
        message.channel.send(BannedRaid)
      } else {
        userData.msgCount = msgCount;
        usersMap.set(message.author.id, userData);
      }
    }
  }
  else {
    let fn = setTimeout(() => {
      usersMap.delete(message.author.id);
      console.log('Removed from map.');
    }, TIME);
    usersMap.set(message.author.id, {
      msgCount: 1,
      lastMessage: message,
      timer: fn
    });
  }
});
  
client.login(config.token);
