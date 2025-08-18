const express = require("express");
const router = express.Router();

// Lista de supermercados disponibles
const supermercados = [
  "Jumbo",
  "Día",
  "Disco",
  "Carrefour",
  "Vea"
];

// GET /api/supermercados
router.get("/", (req, res) => {
  res.json({ supermercados });
});

module.exports = router;