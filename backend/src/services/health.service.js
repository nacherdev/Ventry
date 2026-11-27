// Service: lógica del chequeo de salud. Consulta real a la BD.
const systemStatusRepository = require('../repositories/systemStatus.repository');

async function getHealth() {
  const started = Date.now();
  const status = await systemStatusRepository.findLatest();
  return {
    status: 'OK',
    database: status ? status.message : 'Sin registros en system_status',
    latencyMs: Date.now() - started,
    timestamp: new Date().toISOString(),
  };
}

module.exports = { getHealth };
