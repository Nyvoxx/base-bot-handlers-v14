const { Collection } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {

    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);

    if (!command) {
      console.error(`[!] No command matching ${interaction.commandName} was found.`);
      return;
    }

    if (!command.data) {
      console.error(`[!] Command ${interaction.commandName} has no data property.`);
      return interaction.reply({ 
        content: 'This command is not properly configured!', 
        ephemeral: true 
      });
    }

    const { cooldowns } = client;

    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return interaction.reply({ 
          content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.data.name}\` command.`,
          ephemeral: true 
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
        
      if (typeof command.execute !== 'function') {
        console.error(`[!] Command ${interaction.commandName} has no execute function.`);
        return interaction.reply({ 
          content: 'This command is not properly implemented!', 
          ephemeral: true 
        });
      }

      await command.execute(interaction, client);
    } catch (error) {
      console.error(`[ERROR] Command execution failed for ${interaction.commandName}:`, error);
      
      const errorMessage = { 
        content: 'There was an error executing this command!', 
        ephemeral: true 
      };
      
      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorMessage);
        } else {
          await interaction.reply(errorMessage);
        }
      } catch (followUpError) {
        console.error('Failed to send error message:', followUpError);
      }
    }
  },
}; 