/**
 * Collection of utility functions for the Discord bot
 */

const { EmbedBuilder } = require('discord.js');

/**
 * Creates a standardized embed with the bot's theme
 * @param {Object} options - The options for the embed
 * @param {string} options.title - The title of the embed
 * @param {string} options.description - The description of the embed
 * @param {string} options.color - The color of the embed (hex code)
 * @param {Array} options.fields - The fields for the embed
 * @param {Object} options.footer - The footer object {text, iconURL}
 * @param {string} options.thumbnail - The thumbnail URL
 * @param {string} options.image - The image URL
 * @returns {EmbedBuilder} The created embed
 */
function createEmbed(options = {}) {
  const embed = new EmbedBuilder()
    .setColor(options.color || '#0099ff');
  
  if (options.title) embed.setTitle(options.title);
  if (options.description) embed.setDescription(options.description);
  if (options.fields) embed.addFields(options.fields);
  if (options.footer) embed.setFooter(options.footer);
  if (options.thumbnail) embed.setThumbnail(options.thumbnail);
  if (options.image) embed.setImage(options.image);
  if (options.author) embed.setAuthor(options.author);
  if (options.timestamp) embed.setTimestamp();
  
  return embed;
}

/**
 * Format milliseconds into a readable time string
 * @param {number} ms - Time in milliseconds
 * @returns {string} Formatted time string
 */
function formatTime(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  let result = '';
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m `;
  if (seconds > 0) result += `${seconds}s`;
  
  return result.trim() || '0s';
}

/**
 * Check if a user has required permissions
 * @param {GuildMember} member - The guild member to check
 * @param {Array} requiredPermissions - Array of required permissions
 * @returns {boolean} Whether the user has all required permissions
 */
function hasPermissions(member, requiredPermissions) {
  if (!member || !requiredPermissions) return false;
  return member.permissions.has(requiredPermissions);
}

/**
 * Paginate an array of items for embeds
 * @param {Array} items - Array of items to paginate
 * @param {number} itemsPerPage - Number of items per page
 * @param {number} page - Page number (1-based)
 * @returns {Object} Object containing paginated items and page info
 */
function paginate(items, itemsPerPage = 10, page = 1) {
  const maxPage = Math.ceil(items.length / itemsPerPage);
  if (page < 1) page = 1;
  if (page > maxPage) page = maxPage;
  
  const startIndex = (page - 1) * itemsPerPage;
  
  return {
    items: items.slice(startIndex, startIndex + itemsPerPage),
    page,
    maxPage,
    startIndex,
    endIndex: Math.min(startIndex + itemsPerPage - 1, items.length - 1)
  };
}

module.exports = {
  createEmbed,
  formatTime,
  hasPermissions,
  paginate
}; 