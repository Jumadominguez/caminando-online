const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = "supermercados_metadata_disco";
const COLLECTION = "categorias_metadata";

router.get("/", async (req, res) => {
  let client;

  try {
    client = await MongoClient.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    const docs = await collection.find({}).toArray();

    const grouped = docs.reduce((acc, doc) => {
      const categoria = doc.categoria_original?.trim();
      const grupos = doc.grupos || [];

      if (!categoria) return acc;

      if (!acc[categoria]) acc[categoria] = new Set();

      grupos.forEach(grupo => {
        const opciones = grupo.opciones || [];
        opciones.forEach(op => acc[categoria].add(op.trim()));
      });

      return acc;
    }, {});

    const result = Object.entries(grouped).map(([category, subtypes]) => ({
      category,
      filters: { "Tipo de producto": Array.from(subtypes).sort() }
    }));

    res.json(result);
  } catch (err) {
    console.error("❌ Error en /api/categorias:", err);
    res.status(500).json({ error: "Error al obtener categorías" });
  } finally {
    if (client) client.close();
  }
});

module.exports = router;
