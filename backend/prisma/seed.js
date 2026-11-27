// Semilla de la PoC: un registro en system_status y un pequeño censo ficticio
// de alumnos (datos inventados, sin datos personales reales -> RGPD).
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const alumnos = [
  { nia: '1000001', dni: '00000001R', nombre: 'Lucía', apellidos: 'Martínez Gómez', curso: '2º DAW', fechaNacimiento: '2005-03-14' },
  { nia: '1000002', dni: '00000002W', nombre: 'Pablo', apellidos: 'Sánchez Ruiz', curso: '1º DAW', fechaNacimiento: '2009-01-22' },
  { nia: '1000003', dni: '00000003A', nombre: 'Marta', apellidos: 'López Fernández', curso: '2º SMR', fechaNacimiento: '2004-11-02' },
  { nia: '1000004', dni: '00000004G', nombre: 'Álvaro', apellidos: 'García Navarro', curso: '1º Bachillerato', fechaNacimiento: '2010-06-30' },
  { nia: '1000005', dni: '00000005M', nombre: 'Sofía', apellidos: 'Pérez Moreno', curso: '2º DAM', fechaNacimiento: '2006-09-18' },
  { nia: '1000006', dni: '00000006Y', nombre: 'Hugo', apellidos: 'Romero Díaz', curso: '1º SMR', fechaNacimiento: '2008-12-05' },
];

async function main() {
  const existing = await prisma.systemStatus.count();
  if (existing === 0) {
    await prisma.systemStatus.create({ data: { message: 'Conexión DB operativa' } });
  }

  for (const a of alumnos) {
    await prisma.alumno.upsert({
      where: { nia: a.nia },
      update: {},
      create: { ...a, fechaNacimiento: new Date(a.fechaNacimiento) },
    });
  }
  console.log(`[seed] system_status y ${alumnos.length} alumnos listos`);
}

main()
  .catch((err) => {
    console.error('[seed] error', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
