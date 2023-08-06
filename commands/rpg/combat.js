const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, codeBlock } = require('discord.js');
const db = require('../../db');
function barraFn(vidaRes) {
  const vida = 100;
  const largoBarra = 20;
  const diff = Math.floor((vidaRes / vida) * largoBarra);
  diff;
  let barra = '';
  for (let i = 0; i < largoBarra; i++) {
    barra += diff >= i && vidaRes !== 0 ? '❤' : '♡';
  }
  return `\`${barra}\``;
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName('combat')
    .setDescription('Inicia tu Pelea')
    .addUserOption((option) => option.setName('user').setDescription('Que jugador deseas retar?').setRequired(true)),
  /**
   *
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   * @returns
   */
  async execute(interaction) {
    try {
      const id = interaction.user.id;
      const nameVersus = interaction.options.getMember('user');
      const idVersus = nameVersus.id;
      const vida = db.prepare(`
          SELECT *
          FROM personajesRPG
          WHERE discord_id = ?
      `).all(id)[0];
      if (!vida?.rol || !vida?.genero) {
        return await interaction.reply(codeBlock('El personaje no existe, debes crear uno,usar el comando /create-pj'));
      }
      if (vida.vida === 0) {
        return await interaction.reply(codeBlock('tienes 0 vida'));
      }
      const vidaVs = db.prepare(`
          SELECT *
          FROM personajesRPG
          WHERE discord_id = ?
      `).all(idVersus)[0];
      if (!vidaVs?.rol || !vidaVs?.genero) {
        return await interaction.reply(codeBlock('El contrincante no tiene personaje creado'));
      }
      if (vidaVs.vida === 0) {
        return await interaction.reply(codeBlock('El contrincante tiene 0 vida'));
      }
      // console.log(vida);
      const damageBtn = new ButtonBuilder()
        .setCustomId('ataque')
        .setLabel('Ataque')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('<a:PVP82:1137818755519496336>');
      const row = new ActionRowBuilder().addComponents(damageBtn);
      const response = await interaction.reply({
        content: `combate contra: ${nameVersus}
         ${vidaVs.vida}/100
         ${barraFn(vida)}
        `,
        components: [row],
      });

      const collector = response.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 3_600_000,
      });
      collector.on('collect', async (i) => {
        // console.log(i.user);
        const newID = i.user.id;
        // console.log(newID);
        if (newID === id) {
          const daño = db.prepare(`
            SELECT vida
            FROM personajesRPG
            WHERE discord_id = ?
          `).get(idVersus);
          daño.vida -= 10;
          daño.vida === 0
            ? await i.update({ content: `combate terminado, ganador <@${id}>`, components: [] })
            : await i.update(`
              combate contra: ${nameVersus}
              ${daño.vida}
              ${barraFn(daño.vida)}
            `);
          db.prepare(`
            UPDATE personajesRPG
            SET vida = ?
            WHERE discord_id = ?
          `).run(daño.vida, idVersus);
          // console.log(daño.vida, 'vida del jugador enemigo');
          // if (daño.vida === 0 && newID === id) {
          //   db.prepare(`
          //     DELETE FROM personajesRPG
          //     WHERE discord_id = ?
          //   `).run(idVersus);
          //   console.log('pj eliminado');
          // }
        } else {
          // jugador 2
          const daño2 = db.prepare(`
            SELECT vida
            FROM personajesRPG
            WHERE discord_id = ?
          `).get(id);
          console.log(daño2);
          daño2.vida -= 10;
          daño2.vida === 0
            ? await i.update({ content: `combate terminado, ganador <@${idVersus}>`, components: [] })
            : await i.update(`
              combate contra: <@${id}>
              ${daño2.vida}
              ${barraFn(daño2.vida)}
            `);
          db.prepare(`
            UPDATE personajesRPG
            SET vida = ?
            WHERE discord_id = ?
          `).run(daño2.vida, id);
          // if (newID === idVersus && daño2.vida === 0) {
          //   db.prepare(`
          //     DELETE FROM personajesRPG
          //     WHERE discord_id = ?
          //   `).run(id);
          //   console.log('daño 2');
          // }
        }
      });
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        return await interaction.reply('El usuario no existe! crea un usuario');
      }
      console.log(error);
      await interaction.reply('Ha habido un error');
    }
  },
};
