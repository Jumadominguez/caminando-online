require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const conectarDB = require("./config/db");
const settings = require("./config/settings");

// Conexión a la base de datos
conectarDB();

// Inicializar app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas API
app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));
app.use("/api/categorias", require("./routes/categorias"));
app.use("/api/subcategorias", require("./routes/subcategorias"));
app.use("/api/supermercados", require("./routes/supermercados"));


// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use(express.static(path.join(__dirname, "..", "frontend", "public")));

// Ruta raíz (sirve index.html del frontend)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

// Inicio del servidor
const PORT = settings.port || process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});