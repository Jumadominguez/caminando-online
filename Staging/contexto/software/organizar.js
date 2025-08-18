const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

class TerminalFileOrganizer {
    constructor() {
        this.baseDir = 'E:/caminando-online';
        this.contextDir = 'E:/caminando-online/contexto';
        this.ignoredFolders = ['env', 'node_modules', 'data/db', 'contexto', 'legacy'];
        this.targetExtensions = ['.js', '.html', '.css', '.json'];
        this.stats = {
            total: 0,
            backend: 0,
            frontend: 0,
            configuracion: 0,
            duplicates: 0,
            errors: 0
        };
        this.duplicateMap = new Map();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    // Colores para terminal
    colors = {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m'
    };

    colorLog(message, color = 'white') {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`${this.colors[color]}[${timestamp}] ${message}${this.colors.reset}`);
    }

    async showHeader() {
        console.clear();
        console.log(`${this.colors.cyan}${this.colors.bright}`);
        console.log('╔══════════════════════════════════════════════════════════════╗');
        console.log('║                🗂️  ORGANIZADOR DE ARCHIVOS                   ║');
        console.log('║                   Caminando Online v1.0                     ║');
        console.log('║                    Terminal Interactiva                     ║');
        console.log('╚══════════════════════════════════════════════════════════════╝');
        console.log(`${this.colors.reset}`);
        console.log();
    }

    async showConfiguration() {
        this.colorLog('📋 CONFIGURACIÓN ACTUAL:', 'yellow');
        console.log(`   📁 Carpeta origen: ${this.colors.blue}${this.baseDir}${this.colors.reset}`);
        console.log(`   📁 Carpeta destino: ${this.colors.blue}${this.contextDir}${this.colors.reset}`);
        console.log(`   📄 Extensiones: ${this.colors.green}${this.targetExtensions.join(', ')}${this.colors.reset}`);
        console.log(`   🚫 Ignorar carpetas: ${this.colors.red}${this.ignoredFolders.join(', ')}${this.colors.reset}`);
        console.log();
    }

    async confirmExecution() {
        return new Promise((resolve) => {
            this.rl.question(`${this.colors.yellow}¿Continuar con la organización? (s/n): ${this.colors.reset}`, (answer) => {
                resolve(answer.toLowerCase() === 's' || answer.toLowerCase() === 'si' || answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
            });
        });
    }

    async showProgress(current, total, action) {
        const percent = Math.round((current / total) * 100);
        const barLength = 30;
        const filled = Math.round((barLength * percent) / 100);
        const empty = barLength - filled;
        
        const bar = '█'.repeat(filled) + '░'.repeat(empty);
        
        process.stdout.write(`\r${this.colors.cyan}[${bar}] ${percent}% ${this.colors.yellow}${action}${this.colors.reset}`);
        
        if (current === total) {
            console.log(); // Nueva línea al completar
        }
    }

    async createDirectories() {
        const dirs = [
            path.join(this.contextDir, 'backend'),
            path.join(this.contextDir, 'frontend'),
            path.join(this.contextDir, 'configuracion')
        ];

        this.colorLog('📁 Creando directorios...', 'blue');
        for (const dir of dirs) {
            try {
                await fs.mkdir(dir, { recursive: true });
                this.colorLog(`   ✅ ${path.basename(dir)}`, 'green');
            } catch (error) {
                this.colorLog(`   ❌ Error en ${dir}: ${error.message}`, 'red');
            }
        }
        console.log();
    }

    shouldIgnoreFolder(folderPath) {
        const relativePath = path.relative(this.baseDir, folderPath);
        return this.ignoredFolders.some(ignored => 
            relativePath.includes(ignored) || relativePath.startsWith(ignored)
        );
    }

    classifyFile(filePath, fileName) {
        const extension = path.extname(fileName).toLowerCase();
        const relativePath = path.relative(this.baseDir, filePath).toLowerCase();

        // Detectar backend
        if (relativePath.includes('backend') || 
            relativePath.includes('server') || 
            relativePath.includes('api') || 
            relativePath.includes('controller') || 
            relativePath.includes('service') || 
            relativePath.includes('model') ||
            fileName.includes('server.js') ||
            fileName.includes('app.js')) {
            return 'backend';
        }

        // Detectar frontend
        if (relativePath.includes('frontend') || 
            relativePath.includes('public') || 
            relativePath.includes('css') || 
            relativePath.includes('js') || 
            relativePath.includes('html') ||
            extension === '.html' ||
            extension === '.css') {
            return 'frontend';
        }

        // Detectar configuración
        if (relativePath.includes('config') ||
            fileName.includes('package.json') ||
            fileName.includes('.env') ||
            fileName.includes('tsconfig') ||
            fileName.includes('webpack') ||
            fileName.includes('babel') ||
            fileName.includes('.config.')) {
            return 'configuracion';
        }

        // Por defecto según extensión
        if (extension === '.js') return 'backend';
        if (extension === '.css' || extension === '.html') return 'frontend';
        if (extension === '.json') return 'configuracion';

        return 'configuracion';
    }

    async handleDuplicate(destPath, fileName, sourceFolder) {
        const duplicateFolder = `duplicado-${path.basename(sourceFolder)}`;
        const duplicateDir = path.join(path.dirname(destPath), duplicateFolder);
        
        await fs.mkdir(duplicateDir, { recursive: true });
        
        const newDestPath = path.join(duplicateDir, fileName);
        this.stats.duplicates++;
        this.colorLog(`   📋 Duplicado: ${fileName} → ${duplicateFolder}`, 'yellow');
        
        return newDestPath;
    }

    async copyFile(sourcePath, category, index, total) {
        try {
            const fileName = path.basename(sourcePath);
            const sourceFolder = path.dirname(sourcePath);
            let destPath = path.join(this.contextDir, category, fileName);

            // Verificar si ya existe
            try {
                await fs.access(destPath);
                destPath = await this.handleDuplicate(destPath, fileName, sourceFolder);
            } catch {
                // El archivo no existe, continuar normalmente
            }

            // Copiar archivo
            await fs.copyFile(sourcePath, destPath);
            this.stats[category]++;
            this.stats.total++;
            
            const relativePath = path.relative(this.baseDir, sourcePath);
            this.colorLog(`   ✅ ${relativePath} → ${category}`, 'green');
            
            return true;
        } catch (error) {
            this.stats.errors++;
            this.colorLog(`   ❌ Error: ${path.relative(this.baseDir, sourcePath)}`, 'red');
            return false;
        }
    }

    async scanDirectory(dirPath) {
        try {
            const entries = await fs.readdir(dirPath, { withFileTypes: true });
            const files = [];

            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);

                if (entry.isDirectory()) {
                    if (!this.shouldIgnoreFolder(fullPath)) {
                        const subFiles = await this.scanDirectory(fullPath);
                        files.push(...subFiles);
                    }
                } else if (entry.isFile()) {
                    const extension = path.extname(entry.name).toLowerCase();
                    if (this.targetExtensions.includes(extension)) {
                        files.push(fullPath);
                    }
                }
            }

            return files;
        } catch (error) {
            this.colorLog(`❌ Error escaneando: ${dirPath}`, 'red');
            return [];
        }
    }

    async showFinalStats() {
        console.log();
        console.log(`${this.colors.cyan}${this.colors.bright}╔═══════════════════════════════════════╗${this.colors.reset}`);
        console.log(`${this.colors.cyan}${this.colors.bright}║           📈 ESTADÍSTICAS             ║${this.colors.reset}`);
        console.log(`${this.colors.cyan}${this.colors.bright}╚═══════════════════════════════════════╝${this.colors.reset}`);
        console.log();
        
        console.log(`   📄 Total procesados: ${this.colors.bright}${this.stats.total}${this.colors.reset} archivos`);
        console.log(`   ⚙️  Backend: ${this.colors.blue}${this.stats.backend}${this.colors.reset} archivos`);
        console.log(`   🎨 Frontend: ${this.colors.green}${this.stats.frontend}${this.colors.reset} archivos`);
        console.log(`   🔧 Configuración: ${this.colors.yellow}${this.stats.configuracion}${this.colors.reset} archivos`);
        console.log(`   📋 Duplicados: ${this.colors.magenta}${this.stats.duplicates}${this.colors.reset} archivos`);
        
        if (this.stats.errors > 0) {
            console.log(`   ❌ Errores: ${this.colors.red}${this.stats.errors}${this.colors.reset} archivos`);
        }
        
        console.log();
        
        if (this.stats.errors === 0) {
            this.colorLog('✅ ¡Organización completada exitosamente!', 'green');
        } else {
            this.colorLog('⚠️  Organización completada con algunos errores', 'yellow');
        }
        
        console.log();
        this.colorLog('📁 Archivos organizados en:', 'blue');
        console.log(`   • ${this.contextDir}/backend`);
        console.log(`   • ${this.contextDir}/frontend`);
        console.log(`   • ${this.contextDir}/configuracion`);
        console.log();
    }

    async waitForExit() {
        return new Promise((resolve) => {
            this.rl.question(`${this.colors.cyan}Presiona Enter para salir...${this.colors.reset}`, () => {
                resolve();
            });
        });
    }

    async organize() {
        await this.showHeader();
        await this.showConfiguration();
        
        const confirmed = await this.confirmExecution();
        if (!confirmed) {
            this.colorLog('❌ Operación cancelada por el usuario', 'red');
            await this.waitForExit();
            this.rl.close();
            return;
        }
        
        console.log();
        this.colorLog('🚀 Iniciando organización...', 'cyan');
        console.log();
        
        // Crear directorios de destino
        await this.createDirectories();
        
        // Escanear archivos
        this.colorLog('🔍 Escaneando archivos...', 'blue');
        const allFiles = await this.scanDirectory(this.baseDir);
        
        this.colorLog(`📊 Encontrados ${allFiles.length} archivos para procesar`, 'blue');
        console.log();
        
        if (allFiles.length === 0) {
            this.colorLog('⚠️  No se encontraron archivos para procesar', 'yellow');
            await this.waitForExit();
            this.rl.close();
            return;
        }
        
        // Procesar cada archivo
        this.colorLog('📂 Procesando archivos...', 'blue');
        for (let i = 0; i < allFiles.length; i++) {
            const filePath = allFiles[i];
            const fileName = path.basename(filePath);
            const category = this.classifyFile(filePath, fileName);
            
            await this.copyFile(filePath, category, i + 1, allFiles.length);
        }
        
        // Mostrar estadísticas finales
        await this.showFinalStats();
        await this.waitForExit();
        this.rl.close();
    }

    async run() {
        try {
            await this.organize();
        } catch (error) {
            this.colorLog(`❌ Error crítico: ${error.message}`, 'red');
            await this.waitForExit();
            this.rl.close();
            process.exit(1);
        }
    }
}

// Ejecutar
const organizer = new TerminalFileOrganizer();
organizer.run();