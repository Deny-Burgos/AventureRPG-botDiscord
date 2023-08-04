const { SlashCommandBuilder, codeBlock } = require('discord.js');
const db = require('../../db');
const { AsciiTable3, AlignmentEnum } = require('ascii-table3');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('all-notes')
    .setDescription('Todas las notas'),
  async execute(interaction) {
    try {
      const notes = db
        .prepare(`
      SELECT notes.title, notes.description, users.name
      FROM notes
      JOIN users
        ON notes.discord_id = users.discord_id
      `)
        .all();

      console.log(notes);

      const formatedNotes = notes.map(note => [note.title, note?.description || '', note.name]);

      const table =
        new AsciiTable3('Mis notas')
          .setHeading('titulo', 'descripcion', 'user')
          .setAlign(3, AlignmentEnum.CENTER)
          .addRowMatrix(formatedNotes);
      await interaction.reply(codeBlock(table));
    } catch (error) {
      console.log(error);
      await interaction.reply('Ha habido un error');
    }
  },
};