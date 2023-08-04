const { SlashCommandBuilder, ActionRowBuilder } = require('discord.js');
const db = require('../../db');

const { femenino, masculino, exampleEmbed } = require('./modules/seleccionarGenero.js');
const { rol } = require('./modules/seleccionRol.js');
const { mago } = require('./modules/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-pj')
    .setDescription('Crea un nuevo Personaje')
    .addStringOption(option =>
      option
        .setName('nombre')
        .setDescription('Nombre del Personaje')
        .setRequired(true),
    ),
  /**
     *
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     * @returns
     */
  async execute(interaction) {
    try {
      const namePj = interaction.options.getString('nombre');
      const id = interaction.user.id;

      db.prepare(`
      INSERT INTO personajesRPG (discord_id, namepj)
      VALUES (?, ?)
      `)
        .run(id, namePj);

      console.log(namePj);

      const row = new ActionRowBuilder()
        .addComponents(masculino, femenino);

      const collectorFilter = i => i.user.id === interaction.user.id;

      const generoEmbed = await interaction.reply({
        content: `Personaje creado **${namePj}** para <@${id}>`,
        components: [row],
        embeds: [exampleEmbed],
      });
      const selectGenero = await generoEmbed.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

      const newGenero = db.prepare(`
      UPDATE personajesRPG  
      SET genero = ?
      WHERE discord_id = ?
      `).run(selectGenero.customId, id);
      newGenero;


      const selector = await selectGenero.update(rol);
      const selectRol = await selector.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
      // console.log(selectRol);

      const newRol = db.prepare(`
      UPDATE personajesRPG  
      SET rol = ?
      WHERE discord_id = ?
      `).run(selectRol.values[0], id);
      newRol;

      await selectRol.update({
        content: 'Personaje Creado',
        embeds: [mago],
        components: [],
      });
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
        return await interaction.reply('El personaje ya existe');
      }
      console.log(error);
      await interaction.reply('Ha habido un error');
    }
  },
};