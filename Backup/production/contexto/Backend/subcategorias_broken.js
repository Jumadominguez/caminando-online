const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

const DB_FILTROS = "supermercados_normalized_jumbo";
const DB_CATEGORIAS = "supermercados_metadata_jumbo";

const COLLECTION_FILTROS = "filtros";
const COLLECTION_CATEGORIAS = "categorias_metadata";

router.get("/", async (req, res) => {
  let client;

  try {
    client = await MongoClient.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const dbFiltros = client.db(DB_FILTROS);
    const dbCategorias = client.db(DB_CATEGORIAS);

    const filtros = await dbFiltros.collection(COLLECTION_FILTROS).find({}).toArray();
    const categorias = await dbCategorias.collection(COLLECTION_CATEGORIAS).find({}).toArray();

    const categoriasValidas = new Set(
      categorias.map(c => c.categoria_normalizada?.trim().toLowerCase()).filter(Boolean)
    );

    const agrupado = {};

    filtros.forEach(filtro => {
      const categoria = filtro.categoria_normalizada?.trim().toLowerCase();
      const grupo = filtro.grupo_normalizado?.trim().toLowerCase();
      const opciones = filtro.opciones;

      if (!categoria || !categoriasValidas.has(categoria)) return;
      if (grupo !== "tipo de producto") return;
      if (!Array.isArray(opciones) || opciones.length === 0) return;

      if (!agrupado[categoria]) {
        agrupado[categoria] = new Set();
      }

      opciones.forEach(op => {
        if (typeof op === "string" && op.trim()) {
          agrupado[categoria].add(op.trim());
        }
      });
    });

    const resultado = Object.entries(agrupado).map(([categoria_normalizada, subSet]) => ({
      categoria_normalizada,
      subcategorias: Array.from(subSet)
    }));

    res.json(resultado);
  } catch (err) {
    console.error("❌ Error en /api/subcategorias:", err);
    res.status(500).json({ error: "Error al obtener subcategorías" });
  } finally {
    if (client) client.close();
  }
});

module.exports = 