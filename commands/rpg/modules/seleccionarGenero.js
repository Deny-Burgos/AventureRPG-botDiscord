const { ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const masculino = new ButtonBuilder()
  .setCustomId('masculino')
  .setLabel('Masculino')
  .setStyle(ButtonStyle.Primary);

const femenino = new ButtonBuilder()
  .setCustomId('femenino')
  .setLabel('Femenino')
  .setStyle(ButtonStyle.Primary);

const embedGenero = new EmbedBuilder()
  .setColor(0x0099FF)
  .setImage('https://i.pinimg.com/564x/7f/42/ce/7f42cea9ee3861b074093636104f18c1.jpg')
  .setDescription('Selecciona tu genero');

module.exports = {
  femenino, masculino, embedGenero,
};