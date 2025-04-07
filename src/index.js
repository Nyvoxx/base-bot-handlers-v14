const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.slashCommands = new Collection();
client.prefixCommands = new Collection();
client.cooldowns = new Collection();

client.prefix = process.env.PREFIX || '!';

const handlersPath = path.join(__dirname, 'handlers');
const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));

(async () => {
  for (const file of handlerFiles) {
    const filePath = path.join(handlersPath, file);
    const handler = require(filePath);
    await handler(client);
  }
  
  client.login(process.env.TOKEN);
})();

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

module.exports = client; 