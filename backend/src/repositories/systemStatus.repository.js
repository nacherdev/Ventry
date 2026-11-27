// Repository: encapsula el acceso a la tabla system_status.
const prisma = require('../config/prisma');

async function findLatest() {
  return prisma.systemStatus.findFirst({ orderBy: { id: 'desc' } });
}

module.exports = { findLatest };
