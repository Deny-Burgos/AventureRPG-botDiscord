const { SlashCommandBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('healing')
    .setDescription('restaura 20 de vida'),
  async execute(interaction) {
    const id = interaction.user.id;
    const healing = db.prepare(`
      SELECT vida
      FROM personajesRPG
      WHERE discord_id = ?
    `).get(id);
    healing.vida = healing.vida < 80 ? healing.vida + 20 : 100;
    db.prepare(`
      UPDATE personajesRPG
      set vida = ?
      WHERE discord_id = ?
    `).run(healing.vida, id);
    // console.log(healing);
    if (healing.vida === 100) {
      return await interaction.reply('vida completa');
    }
    await interaction.reply(`Ha curado a <@${id}>`);
  },
};