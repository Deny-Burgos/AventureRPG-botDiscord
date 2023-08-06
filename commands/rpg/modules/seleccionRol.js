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

const embedGlobal2 = (nombre, genero, rol, imagen) => {
  const example = new EmbedBuilder()
    .setColor(0x0099FF)
    .addFields(
      { name: 'Name', value: `${nombre}`, inline: true },
      { name: 'Genero', value: `${genero}`, inline: true },
      { name: 'Rol', value: `${rol}`, inline: true },
    )
    .setImage(imagen);
  return example;
};

const imagenResource = {
  guerrero: 'https://i.pinimg.com/564x/af/dd/11/afdd1118f7754416c6e6a2914d11656b.jpg',
  mago: 'https://i.pinimg.com/564x/7e/98/2f/7e982f5eccd5bd461a5f90aaea67cbbf.jpg',
  arquero: 'https://i.pinimg.com/564x/e6/41/77/e64177f54bec25067c6a2775a0a7d4cc.jpg',
};
const rol = {
  content: '',
  embeds: [embedRols],
  components: [rowRol],
};
module.exports = {
  rol, select, embedGlobal2, imagenResource,
};