const { SlashCommandBuilder, codeBlock } = require('discord.js');
const db = require('../../db');
const { AsciiTable3, AlignmentEnum } = require('ascii-table3');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('my-notes')
    .setDescription('ver tus notas'),
  async execute(interaction) {
    try {
      const id = interaction.user.id;

      const notes = db
        .prepare(`
      SELECT * FROM notes
      WHERE discord_id = ?
      `)
        .all(id);
      console.log(notes);
      const formatedNotes = notes.map(note => [note.title, note?.description || '']);

      const table =
        new AsciiTable3('Mis notas')
          .setHeading('titulo', 'descripcion')
          .setAlign(3, AlignmentEnum.CENTER)
          .addRowMatrix(formatedNotes);
      await interaction.reply(`Notas totales: ${notes.length}`);
      await interaction.followUp(codeBlock(table));
    } catch (error) {
      console.log(error);
      await interaction.reply('Ha habido un error');
    }
  },
};