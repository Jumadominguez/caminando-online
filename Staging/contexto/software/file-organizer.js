const fs = require('fs');
const path = require('path');

class FileOrganizer {
    constructor() {
        this.sourceDir = 'E:\\caminando-online';
        this.targetDir = 'E:\\caminando-online\\contexto';
        this.targetExtensions = ['.js', '.html', '.css', '.json'];
        this.ignoredFolders = ['env', 'node_modules', 'data/db', 'contexto', 'legacy'];
        this.stats = {
            totalProcessed: 0,
            backend: 0,
            frontend: 0,
            configuration: 0,
            duplicates: 0,
            errors: 0
        };
        this.duplicateCounters = {};
    }

    // Función para limpiar directorios existentes
    async cleanDirectories(progressCallback = null) {
        console.log('🧹 Limpiando directorios existentes...');
        
        if (progressCallback) {
            progressCallback({
                step: 'limpieza',
                progress: 5,
                message: 'Limpiando archivos anteriores...'
            });
        }
        
        const categories = ['backend', 'frontend', 'configuracion'];
        
        for (const category of categories) {
            const categoryPath = path.join(this.targetDir, category);
            
            if (fs.existsSync(categoryPath)) {
                try {
                    // Leer todos los archivos y directorios en la categoría
                    const items = fs.readdirSync(categoryPath);
                    
                    for (const item of items) {
                        const itemPath = path.join(categoryPath, item);
                        const stat = fs.statSync(itemPath);
                        
                        if (stat.isDirectory()) {
                            // Eliminar directorio recursivamente
                            this.removeDirectoryRecursive(itemPath);
                        } else {
                            // Eliminar archivo
                            fs.unlinkSync(itemPath);
                        }
                    }
                    
                    console.log(`✅ Limpiado: ${category}`);
                } catch (error) {
                    console.error(`❌ Error limpiando ${category}: ${error.message}`);
                }
            }
        }
        
        console.log('✅ Limpieza completada');
    }
    
    // Función para limpiar nombres de archivo para consola
    cleanFileName(fileName) {
        return fileName.replace(/[^\x20-\x7E]/g, '?');
    }
    
    // Función auxiliar para eliminar directorios recursivamente
    removeDirectoryRecursive(dirPath) {
        if (fs.existsSync(dirPath)) {
            const items = fs.readdirSync(dirPath);
            
            for (const item of items) {
                const itemPath = path.join(dirPath, item);
                const stat = fs.statSync(itemPath);
                
                if (stat.isDirectory()) {
                    this.removeDirectoryRecursive(itemPath);
                } else {
                    fs.unlinkSync(itemPath);
                }
            }
            
            fs.rmdirSync(dirPath);
        }
    }

    // Función para verificar si una carpeta debe ser ignorada
    shouldIgnoreFolder(folderPath) {
        const relativePath = path.relative(this.sourceDir, folderPath).replace(/\\/g, '/');
        return this.ignoredFolders.some(ignored => 
            relativePath === ignored || 
            relativePath.startsWith(ignored + '/') ||
            relativePath.includes('/' + ignored + '/') ||
            relativePath.endsWith('/' + ignored)
        );
    }

    // Función para clasificar archivos
    classifyFile(filePath, fileName) {
        const fileExt = path.extname(fileName).toLowerCase();
        const relativePath = path.relative(this.sourceDir, filePath).replace(/\\/g, '/');
        const dirName = path.dirname(relativePath).toLowerCase();
        
        // Patrones para Backend
        const backendPatterns = [
            /backend/i, /server/i, /api/i, /controller/i, /service/i, /model/i,
            /routes/i, /middleware/i, /database/i, /db/i
        ];
        
        // Patrones para Frontend
        const frontendPatterns = [
            /frontend/i, /public/i, /css/i, /js/i, /html/i, /client/i,
            /assets/i, /static/i, /views/i, /components/i
        ];
        
        // Patrones para Configuración
        const configPatterns = [
            /config/i, /configuration/i, /settings/i
        ];
        
        const configFiles = [
            'package.json', 'package-lock.json', 'tsconfig.json', 'webpack.config.js',
            'babel.config.js', 'vite.config.js', 'rollup.config.js', '.env'
        ];

        // Clasificación por configuración específica
        if (configFiles.includes(fileName) || fileName.includes('.config.') || 
            configPatterns.some(pattern => pattern.test(dirName))) {
            return 'configuracion';
        }

        // Clasificación por extensión
        if (fileExt === '.html' || fileExt === '.css') {
            return 'frontend';
        }

        // Clasificación por ubicación de directorio
        if (backendPatterns.some(pattern => pattern.test(dirName))) {
            return 'backend';
        }
        
        if (frontendPatterns.some(pattern => pattern.test(dirName))) {
            return 'frontend';
        }

        // Archivos específicos de backend
        if (['server.js', 'app.js', 'index.js'].includes(fileName) && 
            !frontendPatterns.some(pattern => pattern.test(dirName))) {
            return 'backend';
        }

        // Archivos .json por defecto van a configuración
        if (fileExt === '.json') {
            return 'configuracion';
        }

        // Archivos .js por defecto van a backend (excepto si están en frontend)
        if (fileExt === '.js') {
            return 'backend';
        }

        return 'configuracion'; // Default
    }

    // Función para manejar duplicados
    handleDuplicate(targetPath, sourceDir) {
        const baseName = path.basename(sourceDir);
        const duplicateFolder = `duplicado-${baseName}`;
        const categoryDir = path.dirname(targetPath);
        const duplicateDir = path.join(categoryDir, duplicateFolder);
        
        if (!this.duplicateCounters[duplicateDir]) {
            this.duplicateCounters[duplicateDir] = 1;
        } else {
            this.duplicateCounters[duplicateDir]++;
        }

        if (!fs.existsSync(duplicateDir)) {
            fs.mkdirSync(duplicateDir, { recursive: true });
        }

        return path.join(duplicateDir, path.basename(targetPath));
    }

    // Función para copiar archivo
    async copyFile(sourcePath, targetPath, sourceDir) {
        try {
            // Verificar si el archivo ya existe
            if (fs.existsSync(targetPath)) {
                targetPath = this.handleDuplicate(targetPath, sourceDir);
                this.stats.duplicates++;
            }

            // Crear directorio si no existe
            const targetDir = path.dirname(targetPath);
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            // Copiar archivo
            fs.copyFileSync(sourcePath, targetPath);
            return true;
        } catch (error) {
            console.error(`Error copiando ${this.cleanFileName(sourcePath)}: ${error.message}`);
            this.stats.errors++;
            return false;
        }
    }

    // Función para escanear directorio recursivamente
    async scanDirectory(dir) {
        const files = [];
        
        try {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    if (!this.shouldIgnoreFolder(fullPath)) {
                        const subFiles = await this.scanDirectory(fullPath);
                        files.push(...subFiles);
                    }
                } else if (stat.isFile()) {
                    const ext = path.extname(item).toLowerCase();
                    if (this.targetExtensions.includes(ext)) {
                        files.push(fullPath);
                    }
                }
            }
        } catch (error) {
            console.error(`Error escaneando directorio ${this.cleanFileName(dir)}: ${error.message}`);
        }
        
        return files;
    }

    // Función principal de organización
    async organize(progressCallback = null, cleanFirst = false) {
        console.log('🚀 Iniciando organizacion de archivos...');
        console.log(`📁 Escaneando: ${this.sourceDir}`);
        
        if (progressCallback) {
            progressCallback({
                step: 'inicio',
                progress: 0,
                message: 'Iniciando organización de archivos...'
            });
        }
        
        // Limpiar directorios si se solicita
        if (cleanFirst) {
            await this.cleanDirectories(progressCallback);
        }
        
        // Crear directorios de destino
        const categories = ['backend', 'frontend', 'configuracion'];
        for (const category of categories) {
            const categoryPath = path.join(this.targetDir, category);
            if (!fs.existsSync(categoryPath)) {
                fs.mkdirSync(categoryPath, { recursive: true });
            }
        }

        if (progressCallback) {
            progressCallback({
                step: 'directorios',
                progress: 10,
                message: 'Directorios de destino preparados'
            });
        }

        // Escanear todos los archivos
        const allFiles = await this.scanDirectory(this.sourceDir);
        console.log(`📄 Archivos encontrados: ${allFiles.length}`);

        if (progressCallback) {
            progressCallback({
                step: 'escaneo',
                progress: 20,
                message: `Archivos encontrados: ${allFiles.length}`
            });
        }

        // Procesar cada archivo
        for (let i = 0; i < allFiles.length; i++) {
            const filePath = allFiles[i];
            const fileName = path.basename(filePath);
            const category = this.classifyFile(filePath, fileName);
            
            const targetPath = path.join(this.targetDir, category, fileName);
            const sourceDir = path.dirname(filePath);
            
            const success = await this.copyFile(filePath, targetPath, sourceDir);
            if (success) {
                this.stats.totalProcessed++;
                this.stats[category]++;
                
                // Mostrar progreso y callback
                const progress = Math.round(20 + (i + 1) / allFiles.length * 70);
                
                if (progressCallback && (i % 5 === 0 || i === allFiles.length - 1)) {
                    progressCallback({
                        step: 'procesando',
                        progress: progress,
                        message: `Procesando archivo ${i + 1}/${allFiles.length}: ${fileName}`,
                        stats: { ...this.stats }
                    });
                }
                
                // Mostrar progreso cada 10 archivos en consola
                if (i % 10 === 0 || i === allFiles.length - 1) {
                    console.log(`⚡ Progreso: ${progress}% (${i + 1}/${allFiles.length})`);
                }
            }
        }

        if (progressCallback) {
            progressCallback({
                step: 'completado',
                progress: 100,
                message: 'Organización completada exitosamente',
                stats: { ...this.stats }
            });
        }

        // Mostrar estadísticas finales
        this.showFinalStats();
        
        return {
            success: true,
            stats: this.stats,
            message: 'Organización completada exitosamente'
        };
    }

    // Mostrar estadísticas finales
    showFinalStats() {
        console.log('\n✅ ¡Organizacion completada!');
        console.log('='.repeat(50));
        console.log('📊 ESTADISTICAS FINALES:');
        console.log(`📄 Total procesados: ${this.stats.totalProcessed} archivos`);
        console.log(`⚙️  Backend: ${this.stats.backend} archivos`);
        console.log(`🎨 Frontend: ${this.stats.frontend} archivos`);
        console.log(`🔧 Configuracion: ${this.stats.configuration} archivos`);
        console.log(`📋 Duplicados: ${this.stats.duplicates} archivos`);
        
        if (this.stats.errors > 0) {
            console.log(`❌ Errores: ${this.stats.errors}`);
        }
        
        console.log('='.repeat(50));
        console.log(`📁 Archivos organizados en: ${this.targetDir}`);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const organizer = new FileOrganizer();
    organizer.organize().catch(error => {
        console.error('❌ Error durante la organizacion:', error.message);
        process.exit(1);
    });
}

module.exports = FileOrganizer;