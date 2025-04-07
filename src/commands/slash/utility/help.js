const { SlashCommandBuilder } = require('@discordjs/builders');
const { createEmbed, paginate } = require('../../../utils/functions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lists all available commands or info about a specific command')
    .addStringOption(option => 
      option.setName('command')
        .setDescription('Get info about a specific command')
        .setRequired(false)),
  cooldown: 3,
  async execute(interaction, client) {
    const commandName = interaction.options.getString('command');
    
    if (commandName) {
      const command = client.slashCommands.get(commandName);
      
      if (!command) {
        return interaction.reply({
          content: `Could not find command \`${commandName}\`!`,
          ephemeral: true
        });
      }
      
      const embed = createEmbed({
        title: `Command: ${command.data.name}`,
        description: command.data.description,
        fields: [
          { name: 'Cooldown', value: `${command.cooldown || 3} seconds`, inline: true }
        ],
        color: '#0099ff',
        timestamp: true
      });
      
      return interaction.reply({ embeds: [embed] });
    }
    
    const categories = new Map();
    
    client.slashCommands.forEach(command => {

      const category = command.data.name === 'help' ? 'Utility' : 
        command.category || command.data.name.split('/').slice(-2, -1)[0] || 'Uncategorized';
      
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      
      categories.get(category).push({
        name: command.data.name,
        description: command.data.description
      });
    });
    
    const fields = [];
    
    categories.forEach((commands, category) => {

      commands.sort((a, b) => a.name.localeCompare(b.name));
      
      const commandList = commands.map(cmd => `\`/${cmd.name}\` - ${cmd.description}`).join('\n');
      
      fields.push({ name: `${category} [${commands.length}]`, value: commandList });
    });
    
    const embed = createEmbed({
      title: 'Available Commands',
      description: `Use \`/help <command>\` to get info on a specific command.\nThe bot prefix is \`${client.prefix}\` for text commands.`,
      fields: fields,
      color: '#0099ff',
      footer: { text: `${client.slashCommands.size} total slash commands` },
      timestamp: true
    });
    
    return interaction.reply({ embeds: [embed] });
  },
}; 