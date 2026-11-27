const healthService = require('../services/health.service');

// Controller: traduce HTTP <-> servicio. Sin lógica de negocio ni SQL.
async function health(req, res, next) {
  try {
    res.status(200).json(await healthService.getHealth());
  } catch (err) {
    next(err);
  }
}

module.exports = { health };
