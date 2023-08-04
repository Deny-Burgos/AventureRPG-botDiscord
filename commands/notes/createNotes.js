const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const db = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-note')
    .setDescription('Crea una nueva nota')
    .addStringOption(option =>
      option
        .setName('titulo')
        .setDescription('El Titulo de la nota')
        .setRequired(true),
    )
    .addStringOption(option =>
      option
        .setName('descripcion')
        .setDescription('La descripcion de la nota'),
    ),
  async execute(interaction) {
    try {
      const title = interaction.options.getString('titulo');
      const description = interaction.options.getString('descripcion');
      const id = interaction.user.id;

      db.prepare(`
      INSERT INTO notes (title, description, discord_id)
      VALUES (?, ?, ?)
      `)
        .run(title, description, id);

      const button = new ButtonBuilder()
        .setCustomId('primary')
        .setLabel('Like')
        .setStyle(ButtonStyle.Primary);
      // .setEmoji('123456789012345678');

      const row = new ActionRowBuilder()
        .addComponents(button);

      const response = await interaction.reply({
        content: `Notas creada "${title}" para <@${id}>`,
        components: [row],
      });

      const collectorFilter = i => i.user.id === interaction.user.id;
      try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

        if (confirmation.customId === 'primary') {
          console.log('click');
        }
      } catch (e) {
        await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
      }


    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        return await interaction.reply('El usuario no existe! crea un usuario');
      }
      console.log(error);
      await interaction.reply('Ha habido un error');
    }
  },
};