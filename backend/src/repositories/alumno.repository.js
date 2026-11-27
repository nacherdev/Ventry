// Repository: única capa que conoce Prisma para la entidad Alumno.
// Si mañana cambia el ORM, solo se toca este fichero.
const prisma = require('../config/prisma');

async function search(query, { skip, take }) {
  const where = {
    activo: true,
    OR: [
      { nombre: { contains: query, mode: 'insensitive' } },
      { apellidos: { contains: query, mode: 'insensitive' } },
      { dni: { startsWith: query.toUpperCase() } },
      { nia: { startsWith: query } },
    ],
  };

  const [items, total] = await prisma.$transaction([
    prisma.alumno.findMany({
      where,
      skip,
      take,
      orderBy: [{ apellidos: 'asc' }, { nombre: 'asc' }],
      // Proyección: solo se leen las columnas que necesita el DTO.
      select: { id: true, nombre: true, apellidos: true, curso: true, fechaNacimiento: true },
    }),
    prisma.alumno.count({ where }),
  ]);

  return { items, total };
}

module.exports = { search };
