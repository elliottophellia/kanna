const { Client, MessageEmbed } = require('discord.js');
const client = new Client({disableMentions: 'everyone'});
const BannedWords = require('./botconfig/badword.json');
const config = require('./botconfig/config.json');
const usersMap = new Map();
const LIMIT = 4; // limit message/diff
const TIME = 10000; // timeout
const DIFF = 2000; // diff every one message

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
  
client.on("message", message => {
    const clan = message.guild;
    const clanname =  clan ? clan.name : 'GUILD BAN';
    const clanowner = clan ? clan.ownerID : ' ';

    const BannedWordsz = new MessageEmbed()
    .setColor(`${config.color}`)
    .setTitle('Badword Detected!')
    .setDescription(`User <@${message.author.id}> got warn for using badword!`)

    const BannedRaid = new MessageEmbed()
    .setColor(`${config.color}`)
    .setTitle('Raid Detected!')
    .setDescription(`User <@${message.author.id}> got banned for raid attempt!`)
    .setImage('https://static.wikia.nocookie.net/maid-dragon/images/f/f7/Kanna_is_mad.png')

    const FalseBan = new MessageEmbed()
    .setColor(`${config.color}`)
    .setTitle(`${clanname}`)
    .setDescription(`User <@${message.author.id}>, You got banned from ${clanname}!\r\n\r\nIf you think this was mistake then DM Owner <@${clanowner}>`)

    if (BannedWords.some(word => message.toString().toLowerCase().trim().match(/\w+|\s+|[^\s\w]+/g) !== null && message.toString().toLowerCase().trim().match(/\w+|\s+|[^\s\w]+/g).includes(word))) { message.delete().catch(e => console.error("Couldn't delete message.")); message.author.send(BannedWordsz) };
    
    if (message.content.includes("@everyone")) { if(message.member.permissions.has("ADMINISTRATOR")) return; clan.members.cache.get(message.author.id).ban({ reason : 'Raid attempt!'}).catch(e => console.error("Couldn't ban him/her.")); message.author.send(FalseBan); message.channel.send(BannedRaid) };
    
    if (message.content.includes("@here")) { if(message.member.permissions.has("ADMINISTRATOR")) return; clan.members.cache.get(message.author.id).ban({ reason : 'Raid attempt!'}).catch(e => console.error("Couldn't ban him/her.")); message.author.send(FalseBan); message.channel.send(BannedRaid) };

    if(message.author.bot) return;
    if(message.member.permissions.has("ADMINISTRATOR")) return; // if you use this then someone who has administrator role will be ignored from mapping
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
          message.author.send(FalseBan);
          clan.members.cache.get(message.author.id).ban({ reason : 'Raid attempt!'});
          message.channel.send(BannedRaid);
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
