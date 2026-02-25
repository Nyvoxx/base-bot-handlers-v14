module.exports = {
  name: 'clientReady',
  once: true,
  execute(client) {
    console.log(`[✓] ${client.user.tag} is now online!`);
    console.log(`[i] Serving ${client.guilds.cache.size} guilds and ${client.users.cache.size} users`);
    
    client.user.setPresence({
      activities: [{ name: `${client.prefix}help | /help`, type: 3 }], 
      status: 'online',
    });
  },
}; 

