// main.js
require('./config/env');
const logger = require('./config/logger');
const { fetchCategories } = require('./modules/categories');
const { fetchListingsByCategory } = require('./modules/listings');
const { processProducts } = require('./modules/products');
const env = require('../config/env')

(async () => {
  const runId = `run_${Date.now()}`;
  logger.info({ runId }, 'Inicio de scraping');

  // 1. Categorías
  const categories = await fetchCategories(runId);
  if (!categories.length) {
    logger.warn({ runId }, 'No hay categorías. Fin.');
    process.exit(0);
  }

  // 2. Listados y queue
  let urlQueue = [];
  for (const cat of categories) {
    const q = await fetchListingsByCategory(runId, cat);
    urlQueue = urlQueue.concat(q);
  }

  // 3. Procesar productos
  await processProducts(runId, urlQueue);

  // 4. Post-procesamiento
  logger.info({ runId, totalUrls: urlQueue.length },
    'Scraping completado');
  process.exit(0);
})();