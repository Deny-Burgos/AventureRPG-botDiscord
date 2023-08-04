const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');

const select = new StringSelectMenuBuilder()
  .setCustomId('selecciona una clase')
  .setPlaceholder('Selecciona un Rol para tu Personaje')
  .addOptions(
    new StringSelectMenuOptionBuilder()
      .setLabel('Guerrero')
      .setDescription('caballero, combate cuerpo a cuerpo')
      .setValue('guerrero'),
    new StringSelectMenuOptionBuilder()
      .setLabel('Mago')
      .setDescription('Usa magia, combate a distancia, usa mana para sus conjuros')
      .setValue('mago'),
    new StringSelectMenuOptionBuilder()
      .setLabel('Arquero')
      .setDescription('Arco y flecha, combate a distancia')
      .setValue('arquero'),
  );
const rowRol = new ActionRowBuilder()
  .addComponents(select);

const embedRols = new EmbedBuilder()
  .setColor(0x0099FF)
  .setImage('https://i.pinimg.com/originals/0f/80/6a/0f806aa021d95df6bb065a48f29dc0c8.gif')
  .setDescription('Selecciona tu manera de combate');


const rol = {
  content: '',
  embeds: [embedRols],
  components: [rowRol],
};
module.exports = {
  rol,
};