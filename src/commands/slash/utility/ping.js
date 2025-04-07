const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with bot latency and API ping'),
  cooldown: 5, 
  async execute(interaction, client) {

    const ping = client.ws.ping;
    
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    
    const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
    
    await interaction.editReply({
      content: `🏓 Pong!\n⏱️ Roundtrip latency: ${roundtrip}ms\n📡 API Latency: ${ping}ms`
    });
  },
}; 