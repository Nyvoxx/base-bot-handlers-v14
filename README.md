# base-bot-handlers-v14 - Advanced Discord Bot Framework

A powerful, modular Discord bot framework that supports both slash commands and prefix commands.

## Features

- **Dual Command System**: Supports both modern slash commands and traditional prefix commands
- **Modular Architecture**: Easy to add new commands and events
- **Handler System**: Automatic command and event registration
- **Cooldown Management**: Built-in cooldown system for commands
- **Utility Functions**: Helpful utilities for embeds, pagination, and more
- **Category Organization**: Commands organized by category
- **Error Handling**: Robust error catching and reporting

## Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```
3. Configure your `.env` file with your bot token and IDs:
```
TOKEN=your_discord_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here  # Optional: for guild-specific slash commands
PREFIX=!  # Default prefix for text commands
```
4. Start the bot:
```bash
node src/index.js
```

## Project Structure

```
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
├── src/                    # Source code
│   ├── index.js            # Main entry point
│   ├── commands/           # Bot commands
│   │   ├── slash/          # Slash commands
│   │   │   ├── utility/    # Utility slash commands
│   │   │   └── moderation/ # Moderation slash commands
│   │   └── prefix/         # Prefix commands
│   │       ├── utility/    # Utility prefix commands
│   │       └── moderation/ # Moderation prefix commands
│   ├── events/             # Discord.js event handlers
│   ├── handlers/           # Command and event handlers
│   └── utils/              # Utility functions
```

## Adding New Commands

### Slash Command Example

```js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('example')
    .setDescription('Example command')
    .addStringOption(option => 
      option.setName('input')
        .setDescription('Example input')
        .setRequired(true)),
  cooldown: 5,
  async execute(interaction, client) {
    // Command logic here
    const input = interaction.options.getString('input');
    await interaction.reply(`You provided: ${input}`);
  },
};
```

### Prefix Command Example

```js
module.exports = {
  name: 'example',
  description: 'Example command',
  aliases: ['ex', 'sample'],
  usage: '<input>',
  args: true,
  cooldown: 5,
  async execute(message, args, client) {
    // Command logic here
    const input = args.join(' ');
    await message.reply(`You provided: ${input}`);
  },
};
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
