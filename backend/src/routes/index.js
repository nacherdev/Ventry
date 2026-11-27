// Router v1 de la API REST.
const { Router } = require('express');
const healthController = require('../controllers/health.controller');
const alumnoController = require('../controllers/alumno.controller');

const router = Router();

router.get('/health', healthController.health);
// En el MVP esta ruta irá protegida por los middlewares authJwt + requireRole('ROLE_CONSERJE').
router.get('/alumnos/buscar', alumnoController.buscar);

module.exports = router;
