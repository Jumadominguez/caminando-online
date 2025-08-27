const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");

const clientMetadata = new MongoClient("mongodb://localhost:27017/");
const clientFiltros = new MongoClient("mongodb://localhost:27017/");

const dbMetadata = clientMetadata.db("supermercados_metadata_jumbo");
const dbFiltros = clientFiltros.db("supermercados_normalized_jumbo");

const collectionCategorias = dbMetadata.collection("categorias_metadata");
const collectionFiltros = dbFiltros.collection("filtros");

router.get("/", async (req, res) => {
  try {
    await clientMetadata.connect();
    await clientFiltros.connect();

    const categorias = await collectionCategorias.find({ supermercado: "jumbo" }).toArray();
    const resultado = [];

    for (const cat of categorias) {
      const categoria_normalizada = cat.categoria_normalizada;

      const filtro = await collectionFiltros.findOne({ categoria_normalizada });
      if (!filtro || !filtro.grupos) continue;

      const grupoTipo = filtro.grupos.find(g => g.grupo_normalizado === "tipo de producto");
      if (!grupoTipo || !grupoTipo.opciones) continue;

      resultado.push({
        categoria_normalizada,
        subcategorias: grupoTipo.opciones
      });
    }

    res.json(resultado);
  } catch (err) {
    console.error("❌ Error al construir menú:", err);
    res.status(500).send("Error interno");
  } finally {
    await clientMetadata.close();
    await clientFiltros.close();
  }
});

module.exports = router;
