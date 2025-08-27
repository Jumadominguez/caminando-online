require('dotenv').config({ path: __dirname + '/../../.env' });
const { conectarMongo, guardarProducto } = require('./mongo');
const { extraerProductosDesdeURL } = require('./processProducts');

(async () => {
  const db = await conectarMongo();

  const retailer = 'carrefour';
  const categorias = await db
    .collection(`supermercado_metadata_${retailer}.categorias_metadata`)
    .find({})
    .toArray();

  for (const categoria of categorias) {
    const { nombre, url } = categoria;
    console.log(`[${retailer}] ▶️ Procesando categoría: ${nombre}`);

    const productos = await extraerProductosDesdeURL(url);

    for (const producto of productos) {
      await guardarProducto(db, retailer, producto);
    }

    console.log(`[${retailer}] ✅ Guardados ${productos.length} productos en ${nombre}`);
  }

  process.exit(0);
})();