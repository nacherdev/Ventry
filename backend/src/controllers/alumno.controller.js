const alumnoService = require('../services/alumno.service');

async function buscar(req, res, next) {
  try {
    const { query, page, size } = req.query;
    res.status(200).json(await alumnoService.buscar({ query, page, size }));
  } catch (err) {
    next(err);
  }
}

module.exports = { buscar };
