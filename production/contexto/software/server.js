const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const FileOrganizer = require('./file-organizer');

class FileOrganizerServer {
    constructor() {
        this.app = express();
        this.port = 3030;
        this.debug = true; // Activar debugging
        this.autoStart = true; // Auto-conexión activada
        this.setupMiddleware();
        this.setupRoutes();
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : '🔍';
        console.log(`[${timestamp}] ${prefix} ${message}`);
    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.static(__dirname));
        
        // CORS para desarrollo
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });

        // Middleware de logging
        this.app.use((req, res, next) => {
            this.log(`${req.method} ${req.path} - ${req.ip}`);
            next();
        });
    }

    setupRoutes() {
        // Servir la interfaz gráfica
        this.app.get('/', (req, res) => {
            this.log('Sirviendo interfaz gráfica');
            res.sendFile(path.join(__dirname, 'file-organizer-gui.html'));
        });

        // Test endpoint para verificar conexión
        this.app.get('/test', (req, res) => {
            this.log('Test endpoint llamado');
            res.json({
                success: true,
                message: 'Servidor funcionando correctamente',
                timestamp: new Date().toISOString(),
                server: 'FileOrganizerServer v2.0',
                status: 'CONNECTED',
                autoConnected: this.autoStart
            });
        });

        // Endpoint de estado para auto-conexión
        this.app.get('/status', (req, res) => {
            res.json({
                servidor: 'localhost:3030',
                estado: 'CONECTADO',
                puerto: this.port,
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                nodeVersion: process.version,
                ready: true,
                organizador: 'FileOrganizerServer v2.0',
                autoConnected: this.autoStart
            });
        });

        // Endpoint para ejecutar la organización
        this.app.post('/organize', async (req, res) => {
            try {
                const config = req.body;
                this.log('='.repeat(50));
                this.log('INICIANDO ORGANIZACIÓN CON CONFIGURACIÓN:');
                this.log(`📁 Origen: ${config.sourceDir}`);
                this.log(`📁 Destino: ${config.targetDir}`);
                this.log(`📄 Extensiones: ${config.extensions?.join(', ')}`);
                this.log(`🚫 Ignorar: ${config.ignoredFolders?.join(', ')}`);
                this.log('='.repeat(50));

                // Validar configuración
                const validation = this.validateConfig(config);
                if (!validation.valid) {
                    this.log(`❌ Validación fallida: ${validation.error}`, 'error');
                    return res.status(400).json({
                        success: false,
                        error: validation.error,
                        debug: 'Validación de configuración falló'
                    });
                }

                this.log('✅ Configuración válida');

                // Crear instancia del organizador con configuración personalizada
                this.log('🔧 Creando instancia del organizador...');
                const organizer = new FileOrganizer();
                
                // Configurar organizador
                organizer.sourceDir = config.sourceDir;
                organizer.targetDir = config.targetDir;
                organizer.targetExtensions = config.extensions;
                organizer.ignoredFolders = config.ignoredFolders;

                this.log('📋 Configuración del organizador aplicada');
                this.log(`- sourceDir: ${organizer.sourceDir}`);
                this.log(`- targetDir: ${organizer.targetDir}`);
                this.log(`- extensions: ${organizer.targetExtensions.join(', ')}`);

                // Verificar acceso a directorios
                this.log('🔍 Verificando acceso a directorios...');
                
                if (!fs.existsSync(organizer.sourceDir)) {
                    throw new Error(`Directorio origen no existe: ${organizer.sourceDir}`);
                }

                // Crear directorio destino si no existe
                if (!fs.existsSync(organizer.targetDir)) {
                    this.log(`📁 Creando directorio destino: ${organizer.targetDir}`);
                    fs.mkdirSync(organizer.targetDir, { recursive: true });
                }

                this.log('✅ Directorios verificados');

                // Crear callback de progreso
                const progressCallback = (progress) => {
                    this.log(`⚡ Progreso: ${progress.progress}% - ${progress.message}`);
                    // Aquí podrías emitir eventos WebSocket para progreso en tiempo real
                };

                this.log('🚀 EJECUTANDO ORGANIZACIÓN...');
                
                // Verificar si se debe limpiar primero
                const cleanFirst = config.cleanFirst || false;
                if (cleanFirst) {
                    this.log('🧹 Limpieza de archivos anteriores activada');
                }
                
                // Ejecutar organización con parámetro de limpieza
                const result = await organizer.organize(progressCallback, cleanFirst);

                this.log('✅ ORGANIZACIÓN COMPLETADA', 'success');
                this.log(`📊 Estadísticas finales:`);
                this.log(`   - Total: ${result.stats.totalProcessed}`);
                this.log(`   - Backend: ${result.stats.backend}`);
                this.log(`   - Frontend: ${result.stats.frontend}`);
                this.log(`   - Config: ${result.stats.configuration}`);
                this.log(`   - Duplicados: ${result.stats.duplicates}`);
                this.log(`   - Errores: ${result.stats.errors}`);

                res.json({
                    success: true,
                    stats: result.stats,
                    message: 'Organización completada exitosamente',
                    debug: {
                        sourceScanned: true,
                        targetCreated: true,
                        filesProcessed: result.stats.totalProcessed
                    }
                });

            } catch (error) {
                this.log(`❌ ERROR DURANTE LA ORGANIZACIÓN: ${error.message}`, 'error');
                this.log(`Stack trace: ${error.stack}`, 'error');
                
                res.status(500).json({
                    success: false,
                    error: error.message,
                    debug: {
                        errorType: error.constructor.name,
                        errorStack: error.stack
                    }
                });
            }
        });

        // Endpoint para validar directorios
        this.app.post('/validate', (req, res) => {
            try {
                const { sourceDir, targetDir } = req.body;
                this.log(`🔍 Validando directorios:`);
                this.log(`   - Origen: ${sourceDir}`);
                this.log(`   - Destino: ${targetDir}`);
                
                const validation = {
                    sourceExists: fs.existsSync(sourceDir),
                    targetExists: fs.existsSync(targetDir),
                    sourceReadable: false,
                    targetWritable: false
                };

                try {
                    // Verificar permisos de lectura en origen
                    fs.accessSync(sourceDir, fs.constants.R_OK);
                    validation.sourceReadable = true;
                    this.log('✅ Directorio origen legible');
                } catch (error) {
                    this.log(`❌ Directorio origen no legible: ${error.message}`, 'error');
                    validation.sourceReadable = false;
                }

                try {
                    // Verificar permisos de escritura en destino
                    if (!validation.targetExists) {
                        // Intentar crear el directorio si no existe
                        this.log(`📁 Creando directorio destino: ${targetDir}`);
                        fs.mkdirSync(targetDir, { recursive: true });
                        validation.targetExists = true;
                    }
                    fs.accessSync(targetDir, fs.constants.W_OK);
                    validation.targetWritable = true;
                    this.log('✅ Directorio destino escribible');
                } catch (error) {
                    this.log(`❌ Directorio destino no escribible: ${error.message}`, 'error');
                    validation.targetWritable = false;
                }

                this.log(`📋 Resultado validación: ${JSON.stringify(validation)}`);
                res.json(validation);

            } catch (error) {
                this.log(`❌ Error en validación: ${error.message}`, 'error');
                res.status(500).json({
                    error: error.message,
                    sourceExists: false,
                    targetExists: false,
                    sourceReadable: false,
                    targetWritable: false
                });
            }
        });

        // Endpoint para iniciar servidor desde GUI
        this.app.post('/start-server', (req, res) => {
            try {
                const { showConsole } = req.body;
                this.log('🚀 Solicitud de inicio de servidor desde GUI');
                this.log(`Console mode: ${showConsole ? 'visible' : 'hidden'}`);
                
                // Si este endpoint es llamado, significa que ya estamos ejecutándonos
                res.json({
                    success: true,
                    message: 'Servidor ya está ejecutándose',
                    status: 'already_running',
                    port: this.port
                });
                
            } catch (error) {
                this.log(`❌ Error en start-server: ${error.message}`, 'error');
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // Endpoint de debug para verificar estado
        this.app.get('/debug', (req, res) => {
            const debugInfo = {
                server: 'FileOrganizerServer v2.0',
                status: 'running',
                timestamp: new Date().toISOString(),
                workingDirectory: __dirname,
                nodeVersion: process.version,
                platform: process.platform,
                fileOrganizerExists: fs.existsSync(path.join(__dirname, 'file-organizer.js')),
                guiExists: fs.existsSync(path.join(__dirname, 'file-organizer-gui.html'))
            };

            this.log('🔍 Info de debug solicitada');
            this.log(JSON.stringify(debugInfo, null, 2));
            
            res.json(debugInfo);
        });
    }

    validateConfig(config) {
        this.log('🔍 Validando configuración...');
        
        if (!config) {
            return { valid: false, error: 'No se recibió configuración' };
        }

        if (!config.sourceDir || !config.targetDir) {
            return {
                valid: false,
                error: 'Carpetas origen y destino son requeridas'
            };
        }

        if (!config.extensions || config.extensions.length === 0) {
            return {
                valid: false,
                error: 'Debe seleccionar al menos un tipo de archivo'
            };
        }

        if (config.sourceDir === config.targetDir) {
            return {
                valid: false,
                error: 'Las carpetas origen y destino no pueden ser iguales'
            };
        }

        if (!fs.existsSync(config.sourceDir)) {
            return {
                valid: false,
                error: `La carpeta origen no existe: ${config.sourceDir}`
            };
        }

        this.log('✅ Configuración válida');
        return { valid: true };
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`
============================================
   ORGANIZADOR DE ARCHIVOS v2.0
   Servidor con Auto-Conexion
============================================

Servidor ejecutandose en: http://localhost:${this.port}
Directorio de trabajo: ${__dirname}
Debugging: ACTIVADO
Auto-Conexion: ${this.autoStart ? 'ACTIVADA' : 'DESACTIVADA'}
Listo para organizar archivos

Endpoints disponibles:
   GET  /           - Interfaz grafica
   GET  /test       - Test de conexion
   GET  /status     - Estado del servidor
   GET  /debug      - Informacion de debug
   POST /organize   - Ejecutar organizacion
   POST /validate   - Validar directorios

Para debugging:
   - Abre la consola del navegador (F12)
   - Revisa los logs del servidor aqui
   - Usa /debug para informacion del sistema

============================================
CONEXION ESTABLECIDA - READY PARA OPERACIONES
============================================
`);
            this.log('Servidor iniciado correctamente', 'success');
            
            // Auto-abrir navegador si está configurado Y no se deshabilitó
            if (this.autoStart && !process.env.DISABLE_AUTO_BROWSER) {
                this.log('Auto-abriendo navegador...', 'info');
                const { spawn } = require('child_process');
                spawn('start', ['""', `http://localhost:${this.port}`], { shell: true });
            } else if (process.env.DISABLE_AUTO_BROWSER) {
                this.log('Auto-apertura de navegador deshabilitada por variable de entorno', 'info');
            }
        });
    }
}

// Ejecutar servidor si se llama directamente
if (require.main === module) {
    const server = new FileOrganizerServer();
    server.start();
}

module.exports = FileOrganizerServer;