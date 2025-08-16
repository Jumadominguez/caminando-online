/* =====================================================
   🚀 SERVIDOR PRINCIPAL ACTUALIZADO - server.js
   ===================================================== */

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

// Middlewares globales
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://caminando.online', 'https://www.caminando.online']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para capturar IP del cliente
app.use((req, res, next) => {
  req.ip = req.headers['x-forwarded-for'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null);
  next();
});

// Middleware de logging en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
  });
}

/**
 * 🔗 RUTAS DE LA API
 */

// Rutas de autenticación (nuevas)
app.use("/api/auth", require("./routes/auth"));

// Rutas existentes
app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));
app.use("/api/categorias", require("./routes/categorias"));
app.use("/api/subcategorias", require("./routes/subcategorias"));
app.use("/api/supermercados", require("./routes/supermercados"));

/**
 * 📁 SERVIR ARCHIVOS ESTÁTICOS
 */

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use(express.static(path.join(__dirname, "..", "frontend", "public")));

// Servir archivos del área privada
app.use('/private', express.static(path.join(__dirname, "..", "frontend", "private")));

/**
 * 🌐 RUTAS DEL FRONTEND
 */

// Ruta raíz (sirve index.html del frontend)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

// Rutas del área privada
app.get("/private/auth/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "private", "auth", "login.html"));
});

app.get("/private/auth/registro", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "private", "auth", "registro.html"));
});

app.get("/private/dashboard/*", (req, res) => {
  // Redirigir todas las rutas del dashboard al dashboard principal
  // El frontend manejará la navegación interna
  res.sendFile(path.join(__dirname, "..", "frontend", "private", "dashboard", "dashboard.html"));
});

/**
 * 🔍 RUTA DE HEALTH CHECK
 */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    mensaje: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || "1.0.0",
    environment: process.env.NODE_ENV || "development"
  });
});

/**
 * ⚠️ MANEJO DE ERRORES 404
 */
app.use((req, res) => {
  // Si es una petición a la API
  if (req.path.startsWith('/api/')) {
    res.status(404).json({
      success: false,
      mensaje: "Endpoint no encontrado",
      path: req.path
    });
  } else {
    // Para otras rutas, servir la página principal (SPA)
    res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
  }
});

/**
 * 🚨 MANEJO GLOBAL DE ERRORES
 */
app.use((error, req, res, next) => {
  console.error('❌ Error no manejado:', error);
  
  // No enviar stack trace en producción
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    success: false,
    mensaje: isDevelopment ? error.message : 'Error interno del servidor',
    ...(isDevelopment && { stack: error.stack })
  });
});

/**
 * 🎯 MANEJO DE SEÑALES DEL SISTEMA
 */
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recibido, cerrando servidor...');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  console.error('En promesa:', promise);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error);
  process.exit(1);
});

/**
 * 🚀 INICIO DEL SERVIDOR
 */
const PORT = settings.port || process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Base de datos: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`🔐 JWT configurado: ${!!process.env.JWT_SECRET}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('📝 Rutas disponibles:');
    console.log('   GET  / - Página principal');
    console.log('   GET  /private/auth/login - Login');
    console.log('   GET  /private/auth/registro - Registro');
    console.log('   POST /api/auth/register - Registro API');
    console.log('   POST /api/auth/login - Login API');
    console.log('   GET  /api/auth/profile - Perfil usuario');
    console.log('   GET  /api/health - Health check');
  }
});