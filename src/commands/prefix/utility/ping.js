module.exports = {
  name: 'ping',
  description: 'Replies with bot latency and API ping',
  aliases: ['latency', 'pong'],
  cooldown: 5,
  async execute(message, args, client) {

    const ping = client.ws.ping;
    
    const sent = await message.reply('Pinging...');
    
    const roundtrip = sent.createdTimestamp - message.createdTimestamp;
    
    await sent.edit(`🏓 Pong!\n⏱️ Roundtrip latency: ${roundtrip}ms\n📡 API Latency: ${ping}ms`);
  },
}; 