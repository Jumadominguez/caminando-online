const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = "supermercados_metadata_vea";
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

    const result = docs.map(doc => ({
      categoria_original: doc.categoria_original?.trim() || "",
      categoria_normalizada: doc.categoria_normalizada?.trim() || ""
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