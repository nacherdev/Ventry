// Service: reglas de negocio de la búsqueda (RF-05).
const alumnoRepository = require('../repositories/alumno.repository');
const { toAlumnoBusquedaDTO } = require('../dtos/alumno.dto');
const { HttpError } = require('../middlewares/errorHandler');

const MAX_PAGE_SIZE = 20;

async function buscar({ query, page = 1, size = MAX_PAGE_SIZE }) {
  const q = (query || '').trim();
  if (q.length < 2) {
    throw new HttpError(400, 'El parámetro "query" debe tener al menos 2 caracteres');
  }
  const take = Math.min(Math.max(Number(size) || MAX_PAGE_SIZE, 1), MAX_PAGE_SIZE);
  const currentPage = Math.max(Number(page) || 1, 1);
  const skip = (currentPage - 1) * take;

  const { items, total } = await alumnoRepository.search(q, { skip, take });
  return {
    data: items.map(toAlumnoBusquedaDTO),
    page: currentPage,
    size: take,
    total,
  };
}

module.exports = { buscar };
