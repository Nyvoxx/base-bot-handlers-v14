const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
  const commandsPath = path.join(__dirname, '..', 'commands', 'prefix');
  
  const commandFolders = fs.readdirSync(commandsPath);
  
  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    
    if (!fs.statSync(folderPath).isDirectory()) continue;
    
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);
      
      if ('name' in command && 'execute' in command) {

        client.prefixCommands.set(command.name, command);
        
        if (command.aliases && Array.isArray(command.aliases)) {
          command.aliases.forEach(alias => {
            client.prefixCommands.set(alias, command);
          });
        }
        
        console.log(`[✓] Loaded prefix command: ${command.name}`);
      } else {
        console.log(`[✗] The command at ${filePath} is missing a required "name" or "execute" property.`);
      }
    }
  }
}; 
