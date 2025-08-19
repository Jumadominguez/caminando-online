// 🔍 DASHBOARD DEBUGGER - Detectar problema de columnas expandiéndose
// Este script ayuda a identificar qué está causando el crecimiento de columnas

class DashboardDebuggerTool {
    constructor() {
        this.initialHeight = 0;
        this.heightChecks = [];
        this.intervalId = null;
        this.mutationObserver = null;
        this.resizeObserver = null;
        this.problematicElements = [];
        this.cssAnimations = [];
        this.jsIntervals = [];
        
        this.init();
    }

    init() {
        console.log('🔍 Dashboard Debugger iniciado');
        this.initialHeight = document.body.scrollHeight;
        
        this.startHeightMonitoring();
        this.monitorDOMChanges();
        this.monitorCSSAnimations();
        this.monitorResizeEvents();
        this.scanForProblematicCSS();
        this.scanForProblematicJS();
        
        // Crear panel de debugging
        this.createDebugPanel();
    }

    startHeightMonitoring() {
        let checkCount = 0;
        this.intervalId = setInterval(() => {
            checkCount++;
            const currentHeight = document.body.scrollHeight;
            const growth = currentHeight - this.initialHeight;
            
            this.heightChecks.push({
                time: new Date().toLocaleTimeString(),
                height: currentHeight,
                growth: growth,
                check: checkCount
            });
            
            // Mantener solo últimos 20 checks
            if (this.heightChecks.length > 20) {
                this.heightChecks.shift();
            }
            
            // Detectar crecimiento anormal
            if (growth > 100 && checkCount > 5) {
                console.warn(`⚠️ CRECIMIENTO DETECTADO: +${growth}px en ${checkCount} checks`);
                this.analyzeGrowthCause();
            }
            
            this.updateDebugPanel();
        }, 500); // Check cada 500ms
    }

    monitorDOMChanges() {
        this.mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            console.log('➕ Elemento añadido:', node.tagName, node.className);
                            this.checkElementForProblems(node);
                        }
                    });
                }
                
                if (mutation.type === 'attributes') {
                    if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
                        console.log('🎨 Estilo cambiado en:', mutation.target.tagName, mutation.target.className);
                    }
                }
            });
        });
        
        this.mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }

    monitorCSSAnimations() {
        // Detectar animaciones CSS que podrían causar problemas
        document.addEventListener('animationstart', (e) => {
            console.log('🎬 Animación CSS iniciada:', e.animationName, e.target);
            this.cssAnimations.push({
                name: e.animationName,
                target: e.target,
                time: Date.now()
            });
        });
        
        document.addEventListener('animationend', (e) => {
            console.log('🏁 Animación CSS terminada:', e.animationName);
        });
    }

    monitorResizeEvents() {
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.target === document.body) {
                        console.log('📏 Body resized:', entry.contentRect.height);
                    }
                });
            });
            
            this.resizeObserver.observe(document.body);
        }
    }

    checkElementForProblems(element) {
        const style = window.getComputedStyle(element);
        const problems = [];
        
        // Verificar propiedades problemáticas
        if (style.height === 'auto' && style.minHeight !== '0px') {
            problems.push('min-height con height auto');
        }
        
        if (style.position === 'absolute' && style.height.includes('%')) {
            problems.push('position absolute con height en %');
        }
        
        if (style.display === 'flex' && style.flexDirection === 'column' && style.height === 'auto') {
            problems.push('flex column con height auto');
        }
        
        if (style.animation !== 'none') {
            problems.push(`animación activa: ${style.animation}`);
        }
        
        if (problems.length > 0) {
            console.warn('🚨 Elemento problemático:', element, problems);
            this.problematicElements.push({
                element: element,
                problems: problems,
                time: Date.now()
            });
        }
    }

    scanForProblematicCSS() {
        const styleSheets = Array.from(document.styleSheets);
        const problematicRules = [];
        
        styleSheets.forEach((sheet) => {
            try {
                const rules = Array.from(sheet.cssRules || sheet.rules || []);
                rules.forEach((rule) => {
                    if (rule.style) {
                        const style = rule.style;
                        
                        // Buscar reglas problemáticas
                        if (style.height && style.height.includes('vh') && style.minHeight) {
                            problematicRules.push(`${rule.selectorText}: height vh + min-height`);
                        }
                        
                        if (style.animation && style.animation.includes('infinite')) {
                            problematicRules.push(`${rule.selectorText}: animación infinita`);
                        }
                        
                        if (style.transform && style.transition) {
                            problematicRules.push(`${rule.selectorText}: transform + transition`);
                        }
                    }
                });
            } catch (e) {
                console.log('No se pudo acceder a stylesheet:', sheet.href);
            }
        });
        
        if (problematicRules.length > 0) {
            console.warn('🎨 CSS problemático encontrado:', problematicRules);
        }
    }

    scanForProblematicJS() {
        // Detectar setInterval activos
        const originalSetInterval = window.setInterval;
        window.setInterval = (...args) => {
            console.log('⏰ setInterval creado:', args[1], 'ms');
            this.jsIntervals.push({
                interval: args[1],
                time: Date.now()
            });
            return originalSetInterval.apply(window, args);
        };
        
        // Detectar addEventListener repetitivos
        const originalAddEventListener = Element.prototype.addEventListener;
        Element.prototype.addEventListener = function(...args) {
            if (args[0] === 'scroll' || args[0] === 'resize') {
                console.log('📡 Event listener añadido:', args[0], this);
            }
            return originalAddEventListener.apply(this, args);
        };
    }

    analyzeGrowthCause() {
        console.group('🔍 ANÁLISIS DE CRECIMIENTO');
        
        // Verificar elementos con height cambiante
        const allElements = document.querySelectorAll('*');
        const growingElements = [];
        
        allElements.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.height > window.innerHeight * 2) {
                growingElements.push({
                    element: el,
                    height: rect.height,
                    tag: el.tagName,
                    classes: el.className
                });
            }
        });
        
        if (growingElements.length > 0) {
            console.warn('📏 Elementos excesivamente altos:', growingElements);
        }
        
        // Verificar animaciones activas
        if (this.cssAnimations.length > 0) {
            console.warn('🎬 Animaciones activas:', this.cssAnimations);
        }
        
        // Verificar intervalos activos
        if (this.jsIntervals.length > 0) {
            console.warn('⏰ Intervalos activos:', this.jsIntervals);
        }
        
        console.groupEnd();
    }

    createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            max-height: 400px;
            background: #1f2937;
            color: #f3f4f6;
            border-radius: 8px;
            padding: 16px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            overflow-y: auto;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        `;
        
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <strong>🔍 Dashboard Debugger</strong>
                <button onclick="this.parentElement.parentElement.remove()" style="background: #ef4444; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer;">×</button>
            </div>
            <div id="debug-content">
                <div>📏 Height inicial: ${this.initialHeight}px</div>
                <div>📊 Checks realizados: 0</div>
                <div>📈 Crecimiento total: 0px</div>
                <div>⚠️ Problemas detectados: 0</div>
            </div>
        `;
        
        document.body.appendChild(panel);
    }

    updateDebugPanel() {
        const content = document.getElementById('debug-content');
        if (!content) return;
        
        const latest = this.heightChecks[this.heightChecks.length - 1];
        if (!latest) return;
        
        content.innerHTML = `
            <div>📏 Height inicial: ${this.initialHeight}px</div>
            <div>📏 Height actual: ${latest.height}px</div>
            <div>📊 Checks realizados: ${latest.check}</div>
            <div>📈 Crecimiento total: ${latest.growth}px</div>
            <div>⚠️ Elementos problemáticos: ${this.problematicElements.length}</div>
            <div>🎬 Animaciones activas: ${this.cssAnimations.length}</div>
            <div>⏰ Intervalos detectados: ${this.jsIntervals.length}</div>
            <hr style="margin: 8px 0; border-color: #374151;">
            <div style="font-size: 10px;">
                <strong>Últimos checks:</strong><br>
                ${this.heightChecks.slice(-3).map(check => 
                    `${check.time}: ${check.height}px (+${check.growth})`
                ).join('<br>')}
            </div>
        `;
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            initialHeight: this.initialHeight,
            finalHeight: document.body.scrollHeight,
            totalGrowth: document.body.scrollHeight - this.initialHeight,
            heightChecks: this.heightChecks,
            problematicElements: this.problematicElements.map(p => ({
                tag: p.element.tagName,
                classes: p.element.className,
                problems: p.problems
            })),
            cssAnimations: this.cssAnimations,
            jsIntervals: this.jsIntervals
        };
        
        console.log('📋 REPORTE COMPLETO:', report);
        return report;
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        console.log('🛑 Debugger detenido');
        this.generateReport();
    }
}

// Auto-iniciar el debugger tool
let debuggerTool;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        debuggerTool = new DashboardDebuggerTool();
    });
} else {
    debuggerTool = new DashboardDebuggerTool();
}

// Función global para detener el debugger
window.stopDebuggerTool = () => {
    if (debuggerTool) {
        debuggerTool.stop();
    }
};

// Función global para generar reporte
window.getDebugReport = () => {
    if (debuggerTool) {
        return debuggerTool.generateReport();
    }
};

console.log(`
🔍 DASHBOARD DEBUGGER ACTIVO
================================
- Monitoreo de height cada 500ms
- Detección de elementos problemáticos
- Tracking de animaciones CSS
- Tracking de intervalos JS
- Panel visual en la esquina superior derecha

Comandos disponibles:
- stopDebugger() - Detener debugging
- getDebugReport() - Obtener reporte completo
`);
