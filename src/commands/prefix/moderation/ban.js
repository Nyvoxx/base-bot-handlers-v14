const { PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../../utils/functions');

module.exports = {
  name: 'ban',
  description: 'Ban a user from the server',
  aliases: ['banish'],
  usage: '<user> [reason] [days]',
  args: true,
  guildOnly: true,
  cooldown: 5,
  async execute(message, args, client) {

    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply('You do not have permission to ban members!');
    }
    
    if (!args.length) {
      return message.reply(`Please provide a user to ban!\nUsage: \`${client.prefix}${this.name} ${this.usage}\``);
    }
    
    const target = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
    
    if (!target) {
      return message.reply('Please mention a valid user or provide a valid user ID!');
    }
    
    args.shift();
    
    let deleteMessageDays = 0;
    if (args.length > 0 && !isNaN(args[args.length - 1]) && Number(args[args.length - 1]) >= 0 && Number(args[args.length - 1]) <= 7) {
      deleteMessageDays = parseInt(args.pop());
    }
    
    const reason = args.length ? args.join(' ') : 'No reason provided';
    
    const targetMember = await message.guild.members.fetch(target.id).catch(() => null);
    
    if (targetMember) {
      if (!targetMember.bannable) {
        return message.reply('I cannot ban that user. They may have higher permissions than me.');
      }
      
      if (
        message.member.id !== message.guild.ownerId && 
        message.member.roles.highest.position <= targetMember.roles.highest.position
      ) {
        return message.reply('You cannot ban that user. They have the same or higher role than you.');
      }
    }
    
    try {
      await message.guild.members.ban(target.id, {
        deleteMessageDays,
        reason: `${message.author.tag}: ${reason}`
      });
      
      const embed = createEmbed({
        title: 'User Banned',
        description: `**${target.tag}** has been banned from the server.`,
        fields: [
          { name: 'Banned by', value: `${message.author.tag}`, inline: true },
          { name: 'Reason', value: reason, inline: true },
          { name: 'Message History Deleted', value: `${deleteMessageDays} days`, inline: true }
        ],
        color: '#FF0000',
        timestamp: true
      });
      
      return message.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return message.reply(`Failed to ban the user: ${error.message}`);
    }
  },
}; 