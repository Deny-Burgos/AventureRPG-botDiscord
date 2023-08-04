const { SlashCommandBuilder } = require('discord.js');
const { default: axios } = require('axios');
const { getColorFromURL } = require('color-thief-node');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Replies with Pong!'),
  async execute() {
    const { data: colorFlags } = await axios.get('https://restcountries.com/v3.1/name/peru');
    const color = await getColorFromURL(colorFlags[0].flags.png);
    console.log(color);
    function ColorToHex(colorRgb) {
      const hexadecimal = colorRgb.toString(16);
      return hexadecimal.length == 1 ? '0' + hexadecimal : hexadecimal;
    }
    function ConvertRGBtoHex(colorRgb) {
      return '#' + ColorToHex(colorRgb[0]) + ColorToHex(colorRgb[1]) + ColorToHex(colorRgb[2]);
    }
    console.log(ConvertRGBtoHex(color));
  },
};