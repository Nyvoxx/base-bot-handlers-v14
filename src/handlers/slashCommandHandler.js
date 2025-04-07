const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

module.exports = async (client) => {
  const commands = [];
  const commandsPath = path.join(__dirname, '..', 'commands', 'slash');
  
  const commandFolders = fs.readdirSync(commandsPath);
  
  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    
    if (!fs.statSync(folderPath).isDirectory()) continue;
    
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);
      
      if ('data' in command && 'execute' in command) {
        client.slashCommands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        console.log(`[✓] Loaded slash command: ${command.data.name}`);
      } else {
        console.log(`[✗] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }
  }
  
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  
  try {
    console.log('[⌛] Started refreshing application (/) commands.');
    
    const route = process.env.GUILD_ID 
      ? Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
      : Routes.applicationCommands(process.env.CLIENT_ID);
    
    await rest.put(route, { body: commands });
    
    console.log('[✓] Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}; 