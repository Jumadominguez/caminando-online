// backend/routes/categorias.js
const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = "jumbo_scraper";
const COLLECTION = "category_filters";

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
      const category = doc.category?.trim();
      const subtypes = doc.filters?.["Tipo de Producto"] || [];

      if (!category) return acc;

      if (!acc[category]) acc[category] = new Set();
      subtypes.forEach(sub => acc[category].add(sub.trim()));

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