const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Script para auto-iniciar el servidor cuando se detecte que se necesita
class AutoStarter {
    constructor() {
        this.serverProcess = null;
        this.port = 3030;
    }

    async checkServerStatus() {
        try {
            const response = await fetch(`http://localhost:${this.port}/test`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    startServer() {
        return new Promise((resolve, reject) => {
            try {
                console.log('🚀 Iniciando servidor automáticamente...');
                
                this.serverProcess = spawn('node', ['server.js'], {
                    cwd: __dirname,
                    stdio: 'inherit'
                });

                this.serverProcess.on('error', (error) => {
                    console.error('❌ Error iniciando servidor:', error.message);
                    reject(error);
                });

                // Esperar un momento para que el servidor inicie
                setTimeout(async () => {
                    const isRunning = await this.checkServerStatus();
                    if (isRunning) {
                        console.log('✅ Servidor iniciado correctamente');
                        resolve(true);
                    } else {
                        reject(new Error('Servidor no respondió después del inicio'));
                    }
                }, 3000);

            } catch (error) {
                reject(error);
            }
        });
    }

    stop() {
        if (this.serverProcess) {
            this.serverProcess.kill();
            this.serverProcess = null;
        }
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const autoStarter = new AutoStarter();
    autoStarter.startServer().catch(console.error);
}

module.exports = AutoStarter;