const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../../utils/functions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to ban')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('The reason for the ban')
        .setRequired(false))
    .addIntegerOption(option => 
      option.setName('days')
        .setDescription('Number of days of messages to delete (0-7)')
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  cooldown: 5,
  async execute(interaction, client) {
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const deleteMessageDays = interaction.options.getInteger('days') || 0;
    
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    
    if (!targetMember) {
      return interaction.reply({
        content: 'That user is not in this server.',
        ephemeral: true
      });
    }
    
    if (!targetMember.bannable) {
      return interaction.reply({
        content: 'I cannot ban that user. They may have higher permissions than me.',
        ephemeral: true
      });
    }
    
    if (
      interaction.member.id !== interaction.guild.ownerId && 
      interaction.member.roles.highest.position <= targetMember.roles.highest.position
    ) {
      return interaction.reply({
        content: 'You cannot ban that user. They have the same or higher role than you.',
        ephemeral: true
      });
    }
    
    await interaction.deferReply();
    
    try {
      await interaction.guild.members.ban(targetUser.id, {
        deleteMessageDays,
        reason: `${interaction.user.tag}: ${reason}`
      });
      
      const embed = createEmbed({
        title: 'User Banned',
        description: `**${targetUser.tag}** has been banned from the server.`,
        fields: [
          { name: 'Banned by', value: `${interaction.user.tag}`, inline: true },
          { name: 'Reason', value: reason, inline: true },
          { name: 'Message History Deleted', value: `${deleteMessageDays} days`, inline: true }
        ],
        color: '#FF0000',
        timestamp: true
      });
      
      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: `Failed to ban the user: ${error.message}`
      });
    }
  },
}; 