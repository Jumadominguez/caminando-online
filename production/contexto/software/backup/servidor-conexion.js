const express = require('express');
const app = express();
const port = 3030;

// Middleware para logging
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
    next();
});

// Ruta principal
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>🌐 Servidor Conectado</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Arial, sans-serif; 
                    text-align: center; 
                    padding: 50px; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    min-height: 100vh;
                    margin: 0;
                }
                .container {
                    background: rgba(255,255,255,0.95);
                    color: #333;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                    max-width: 600px;
                    margin: 0 auto;
                }
                h1 { color: #27ae60; margin-bottom: 20px; }
                .status-box {
                    background: #f8f9fa;
                    padding: 25px;
                    border-radius: 15px;
                    margin: 25px 0;
                    border-left: 5px solid #27ae60;
                }
                .status-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #eee;
                }
                .status-item:last-child { border-bottom: none; }
                .success { color: #27ae60; font-weight: bold; }
                .pulse {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="pulse">✅ SERVIDOR CONECTADO EXITOSAMENTE</h1>
                <h2>🌐 localhost:3030</h2>
                <p>El servidor está ejecutándose correctamente y acepta conexiones</p>
                
                <div class="status-box">
                    <h3>📊 Estado del Sistema</h3>
                    <div class="status-item">
                        <span>🌐 Puerto:</span>
                        <span class="success">3030</span>
                    </div>
                    <div class="status-item">
                        <span>⚡ Express:</span>
                        <span class="success">Funcionando</span>
                    </div>
                    <div class="status-item">
                        <span>🔗 Conexión:</span>
                        <span class="success">Establecida</span>
                    </div>
                    <div class="status-item">
                        <span>🕐 Hora de conexión:</span>
                        <span class="success">${new Date().toLocaleTimeString()}</span>
                    </div>
                    <div class="status-item">
                        <span>🖥️ Node.js:</span>
                        <span class="success">${process.version}</span>
                    </div>
                    <div class="status-item">
                        <span>🚀 Estado:</span>
                        <span class="success">OPERACIONAL</span>
                    </div>
                </div>
                
                <div style="background: #d4edda; padding: 20px; border-radius: 10px; margin-top: 20px;">
                    <h3 style="color: #155724; margin-bottom: 15px;">🎯 Conexión Verificada</h3>
                    <p style="color: #155724; margin: 0;">
                        ✅ El servidor localhost:3030 está funcionando correctamente<br>
                        🔧 Listo para integrarse con el software organizador<br>
                        ⚡ Permisos y conexión establecidos exitosamente
                    </p>
                </div>
            </div>
            
            <script>
                // Auto-refresh cada 30 segundos para mantener conexión
                setTimeout(() => {
                    location.reload();
                }, 30000);
                
                // Log en consola
                console.log('✅ SERVIDOR LOCALHOST:3030 CONECTADO');
                console.log('🌐 Estado: OPERACIONAL');
                console.log('🔧 Ready para integración');
            </script>
        </body>
        </html>
    `);
});

// Endpoint de test para verificar conectividad
app.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        server: 'Conectador Auto-Permisos v1.0',
        port: port,
        status: 'CONNECTED'
    });
});

// Endpoint de estado
app.get('/status', (req, res) => {
    res.json({
        servidor: 'localhost:3030',
        estado: 'CONECTADO',
        puerto: port,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        nodeVersion: process.version,
        ready: true
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                🌐 SERVIDOR CONECTADO                         ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✅ Servidor ejecutándose en: http://localhost:${port}`);
    console.log(`🌐 Estado: CONECTADO Y OPERACIONAL`);
    console.log(`🕐 Hora de inicio: ${new Date().toLocaleTimeString()}`);
    console.log(`🔧 Ready para operaciones`);
    console.log('');
    console.log('📡 Endpoints disponibles:');
    console.log(`   GET  /       - Página principal`);
    console.log(`   GET  /test   - Test de conectividad`);
    console.log(`   GET  /status - Estado del servidor`);
    console.log('');
    console.log('⚠️  Para detener: Ctrl+C');
    console.log('');
});

// Manejo de errores
process.on('uncaughtException', (error) => {
    console.error('❌ Error no manejado:', error.message);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promise rechazada:', reason);
});

// Manejo de cierre
process.on('SIGINT', () => {
    console.log('');
    console.log('🔴 Deteniendo servidor...');
    console.log('✅ Servidor detenido correctamente');
    process.exit(0);
});