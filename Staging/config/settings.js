require('dotenv').config();

const settings = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/caminando',
  jwtSecret: process.env.JWT_SECRET || 'clave_por_defecto',
  nodeEnv: process.env.NODE_ENV || 'development',
  enableScraping: process.env.ENABLE_SCRAPING === 'true', // ejemplo de flag
  defaultCurrency: process.env.DEFAULT_CURRENCY || 'ARS', // ejemplo de parámetro funcional
};

module.exports = settings;