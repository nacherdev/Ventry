// Instancia única (Singleton) del cliente Prisma compartida por los repositorios.
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
