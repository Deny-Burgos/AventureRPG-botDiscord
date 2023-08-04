const { default: axios } = require('axios');
const { getColorFromURL } = require('color-thief-node');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function ColorToHex(colorRgb) {
  const hexadecimal = colorRgb.toString(16);
  return hexadecimal.length == 1 ? '0' + hexadecimal : hexadecimal;
}
function ConvertRGBtoHex(colorRgb) {
  return ColorToHex(colorRgb[0]) + ColorToHex(colorRgb[1]) + ColorToHex(colorRgb[2]);
}
const createEmbed = (country, weather, color) => {
  const exampleEmbed = new EmbedBuilder()
    .setColor(color)
    .setTitle(country.name.common)
    .setURL(`https://en.wikipedia.org/wiki/${country.name.common}`)
    .setDescription('Informacion del Pais')
    .setThumbnail(`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`)
    .addFields(
      { name: 'Capital', value: `${country.capital[0]}`, inline: true },
      { name: 'Poblacion', value: `${country.population}`, inline: true },
      { name: 'temperatura', value: `${weather.main.temp}`, inline: true },
    )
    .setImage(country.flags.png);
  return exampleEmbed;
};

module.exports = {
  // cada vez que se edita data o elimina un comando hacer correr npm run deploy
  data: new SlashCommandBuilder()
    .setName('buscar-pais')
    .setDescription('Muestra la informacion de un pais')
    .addStringOption(Option =>
      Option
        .setName('nombre')
        .setDescription('El nombre del pais a buscar')
        .setRequired(true),
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const name = interaction.options.getString('nombre');
      const { data: country } = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
      const lat = country[0].latlng[0];
      const lon = country[0].latlng[1];
      const { data: clima } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=75ef195357bb4c86442cecf9f177705d&units=metric`);
      const { data: colorFlags } = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
      const color = await getColorFromURL(colorFlags[0].flags.png);
      ConvertRGBtoHex(color);
      const embed = createEmbed(country[0], clima, color);
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      await interaction.reply('El pais no existe');
    }
  },
};