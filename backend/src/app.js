// Composición de la aplicación Express (cadena de middlewares).
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { corsOrigin } = require('./config/env');
const requestLogger = require('./middlewares/requestLogger');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '100kb' }));
app.use(requestLogger);

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
