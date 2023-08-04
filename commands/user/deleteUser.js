const { SlashCommandBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete-user')
    .setDescription('Elimina tu usuario!'),
  async execute(interaction) {
    try {
      const id = interaction.user.id;

      const deleteStatement = db
        .prepare(`
      DELETE FROM users
      WHERE discord_id = ?
      `)
        .run(id);

      if (deleteStatement.changes === 0) {
        return await interaction.reply('No tienes usuario en la base de datos');

      }

      await interaction.reply(`Usuario eliminado para <@${id}>`);
    } catch (error) {
      console.log(error);
      await interaction.reply('Ha habido un error');
    }
  },
};