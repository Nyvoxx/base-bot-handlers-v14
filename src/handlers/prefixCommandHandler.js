const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
  const commandsPath = path.join(__dirname, '..', 'commands', 'prefix');
  
  // Load all prefix command files
  const commandFolders = fs.readdirSync(commandsPath);
  
  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    
    // Skip if not a directory
    if (!fs.statSync(folderPath).isDirectory()) continue;
    
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);
      
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ('name' in command && 'execute' in command) {
        // Register command with its name and any aliases
        client.prefixCommands.set(command.name, command);
        
        // Register aliases if they exist
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