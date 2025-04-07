const { createEmbed, paginate } = require('../../../utils/functions');

module.exports = {
  name: 'help',
  description: 'Lists all available commands or info about a specific command',
  aliases: ['commands', 'cmds'],
  usage: '[command name]',
  cooldown: 3,
  async execute(message, args, client) {
    const prefix = client.prefix;
    
    if (!args.length) {

      const categories = new Map();
      
      const uniqueCommands = [...new Set(client.prefixCommands.map(cmd => cmd.name))];
      
      uniqueCommands.forEach(commandName => {
        const command = client.prefixCommands.get(commandName);
        
        if (typeof command === 'string') return;
        
        const category = command.category || 'Uncategorized';
        
        if (!categories.has(category)) {
          categories.set(category, []);
        }
        
        if (!categories.get(category).some(cmd => cmd.name === command.name)) {
          categories.get(category).push(command);
        }
      });
      
      const fields = [];
      
      categories.forEach((commands, category) => {

        commands.sort((a, b) => a.name.localeCompare(b.name));
        
        const commandList = commands.map(cmd => `\`${prefix}${cmd.name}\` - ${cmd.description}`).join('\n');
        
        fields.push({ name: `${category} [${commands.length}]`, value: commandList });
      });
      
      const embed = createEmbed({
        title: 'Available Commands',
        description: `Use \`${prefix}help [command]\` to get info on a specific command.`,
        fields: fields,
        color: '#0099ff',
        footer: { text: `${uniqueCommands.length} total prefix commands` },
        timestamp: true
      });
      
      return message.reply({ embeds: [embed] });
    }
    
    const commandName = args[0].toLowerCase();
    const command = client.prefixCommands.get(commandName)
      || client.prefixCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    if (!command) {
      return message.reply(`That's not a valid command!`);
    }
    
    const fields = [];
    
    if (command.aliases) {
      fields.push({ name: 'Aliases', value: command.aliases.join(', '), inline: true });
    }
    
    if (command.usage) {
      fields.push({ name: 'Usage', value: `${prefix}${command.name} ${command.usage}`, inline: true });
    }
    
    fields.push({ name: 'Cooldown', value: `${command.cooldown || 3} seconds`, inline: true });
    
    const embed = createEmbed({
      title: `Command: ${command.name}`,
      description: command.description,
      fields: fields,
      color: '#0099ff',
      timestamp: true
    });
    
    return message.reply({ embeds: [embed] });
  },
}; 