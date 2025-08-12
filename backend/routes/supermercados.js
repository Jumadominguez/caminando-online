const express = require("express");
const router = express.Router();

// Lista de supermercados disponibles
const supermercados = [
  "jumbo",
  "dia",
  "Disco",
  "carrefour",
  "vea"
];

// GET /api/supermercados
router.get("/", (req, res) => {
  res.json({ supermercados });
});

module.exports = router;