// Configuración centralizada a partir de variables de entorno (12-factor).
module.exports = {
  port: Number(process.env.PORT) || 3000,
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:8080').split(','),
  nodeEnv: process.env.NODE_ENV || 'development',
};
