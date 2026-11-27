const app = require('./app');
const prisma = require('./config/prisma');
const { port } = require('./config/env');

const server = app.listen(port, () => {
  console.log(`[ventry-api] escuchando en http://0.0.0.0:${port}`);
});

// Apagado ordenado: cierra conexiones al recibir SIGTERM (docker compose down).
async function shutdown() {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
