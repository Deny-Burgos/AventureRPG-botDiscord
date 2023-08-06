const db = require('.');

const createPjTable = async () => {
  db.prepare('DROP TABLE IF EXISTS personajesRPG').run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS personajesRPG(
        discord_id TEXT PRIMARY KEY,
        namepj TEXT NOT NULL,
        genero TEXT '',
        rol TEXT '',
        vida INTEGER DEFAULT 100
        )
    `).run();
};

const createTables = async () => {
  await createPjTable();
  console.log('Tabla de personajes');
  console.log('Tablas creadas');
};

createTables();