// DASHBOARD MINIMALISTA PARA DEBUGGING
// Esta versión SOLO hace lo mínimo indispensable

class OptimizerDashboardMini {
    constructor() {
        console.log('🔍 Dashboard Mini constructor iniciado');
        
        this.isInitialized = false;
        this.phasesRendered = false;
        this.tasksRendered = false;
        
        // Datos básicos
        this.data = {
            phases: [
                { id: 0, name: "Fase 0: Preparación", status: "completed", progress: 100 },
                { id: 1, name: "Fase 1: Frontend Base", status: "progress", progress: 15 },
                { id: 2, name: "Fase 2: Diseño UI", status: "pending", progress: 0 }
            ],
            tasks: [
                { id: "1.1.1", title: "Crear Repositorio en GitHub", status: "progress", phase: 1 },
                { id: "0.1", title: "Crear carpeta Optimizer/", status: "completed", phase: 0 }
            ]
        };
        
        console.log('🔍 Dashboard Mini constructor completado (sin init)');
    }

    manualInit() {
        if (this.isInitialized) {
            console.log('🔍 Dashboard ya inicializado');
            return;
        }
        
        console.log('🔍 Iniciando dashboard manualmente...');
        
        // SOLO actualizar stats básicos
        this.updateBasicStatsOnly();
        
        this.isInitialized = true;
        console.log('🔍 Dashboard inicializado correctamente');
    }

    updateBasicStatsOnly() {
        console.log('🔍 Actualizando stats básicos...');
        
        // Solo actualizar elementos que existen
        const totalProgress = document.getElementById('totalProgress');
        if (totalProgress) {
            totalProgress.style.width = '4%';
            console.log('✅ Progress bar actualizado');
        }
        
        const totalPercentage = document.getElementById('totalPercentage');
        if (totalPercentage) {
            totalPercentage.textContent = '4%';
            console.log('✅ Percentage text actualizado');
        }
        
        const completedTasks = document.getElementById('completedTasks');
        if (completedTasks) {
            completedTasks.textContent = '2';
            console.log('✅ Completed tasks actualizado');
        }
        
        console.log('🔍 Stats básicos actualizados completamente');
    }

    // MÉTODO SOSPECHOSO 1: createPhaseCard
    testCreatePhaseCard() {
        console.log('🧪 TESTING: createPhaseCard');
        
        const phase = this.data.phases[0];
        const card = document.createElement('div');
        card.className = 'phase-card';
        
        const statusClass = phase.status === 'completed' ? 'completed' : 
                           phase.status === 'progress' ? 'progress' : 'pending';
        
        const statusText = phase.status === 'completed' ? '✅ COMPLETADA' :
                          phase.status === 'progress' ? '🔄 EN PROGRESO' : '🟡 PENDIENTE';

        card.innerHTML = `
            <div class="phase-header">
                <div class="phase-title">${phase.name}</div>
                <div class="phase-status ${statusClass}">${statusText}</div>
            </div>
            <div class="phase-body">
                <div class="phase-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${phase.progress}%"></div>
                    </div>
                </div>
            </div>
        `;
        
        console.log('✅ Phase card creado:', card);
        return card;
    }

    // MÉTODO SOSPECHOSO 2: renderPhases (versión controlada)
    testRenderPhases() {
        console.log('🧪 TESTING: renderPhases');
        
        const phasesGrid = document.getElementById('phasesGrid');
        if (!phasesGrid) {
            console.warn('phasesGrid no encontrado');
            return;
        }
        
        if (this.phasesRendered) {
            console.log('⚠️ Fases ya renderizadas, evitando re-render');
            return;
        }
        
        console.log('🔄 Renderizando 1 fase de prueba...');
        
        // SOLO CREAR UNA FASE PARA PROBAR
        const testPhase = this.testCreatePhaseCard();
        
        // AGREGAR AL FINAL en lugar de limpiar
        phasesGrid.appendChild(testPhase);
        
        this.phasesRendered = true;
        console.log('✅ 1 fase de prueba renderizada');
    }

    // MÉTODO SOSPECHOSO 3: createTaskItem
    testCreateTaskItem() {
        console.log('🧪 TESTING: createTaskItem');
        
        const task = this.data.tasks[0];
        const item = document.createElement('div');
        item.className = `task-item ${task.status}`;
        item.dataset.taskId = task.id;
        
        item.innerHTML = `
            <div class="task-header">
                <div class="task-title">${task.title}</div>
                <div class="task-status ${task.status}">🔄 EN PROGRESO</div>
            </div>
            <div class="task-meta">
                <span>Fase ${task.phase}</span>
            </div>
        `;
        
        console.log('✅ Task item creado:', item);
        return item;
    }

    // MÉTODO SOSPECHOSO 4: renderTasks (versión controlada)
    testRenderTasks() {
        console.log('🧪 TESTING: renderTasks');
        
        const tasksContainer = document.getElementById('tasksContainer');
        if (!tasksContainer) {
            console.warn('tasksContainer no encontrado');
            return;
        }
        
        if (this.tasksRendered) {
            console.log('⚠️ Tareas ya renderizadas, evitando re-render');
            return;
        }
        
        console.log('🔄 Renderizando 1 tarea de prueba...');
        
        // SOLO CREAR UNA TAREA PARA PROBAR
        const testTask = this.testCreateTaskItem();
        
        // AGREGAR AL FINAL en lugar de limpiar
        tasksContainer.appendChild(testTask);
        
        this.tasksRendered = true;
        console.log('✅ 1 tarea de prueba renderizada');
    }

    // Método de prueba para verificar que funciona
    testMethod() {
        console.log('🧪 Método de prueba ejecutado correctamente');
        return 'Dashboard Mini funcionando';
    }
}

// Función global para crear dashboard manualmente
function createDashboardMini() {
    console.log('🔍 Creando dashboard mini...');
    window.dashboardMini = new OptimizerDashboardMini();
    console.log('🔍 Dashboard mini creado, usar dashboardMini.manualInit() para inicializar');
}

// Función global para inicializar manualmente
function initDashboardMini() {
    if (window.dashboardMini) {
        window.dashboardMini.manualInit();
    } else {
        console.log('🚨 Dashboard mini no existe, crear primero con createDashboardMini()');
    }
}

// NO EJECUTAR NADA AUTOMÁTICAMENTE
console.log('📋 Dashboard Mini JS cargado. Comandos disponibles:');
console.log('   - createDashboardMini() - Crear instancia');
console.log('   - initDashboardMini() - Inicializar dashboard');
console.log('   - dashboardMini.testMethod() - Probar que funciona');
console.log('   🧪 TESTING INDIVIDUAL:');
console.log('   - testPhaseCreation() - Probar creación de fases');
console.log('   - testTaskCreation() - Probar creación de tareas');
console.log('   - testPhaseRender() - Probar renderizado de fases');
console.log('   - testTaskRender() - Probar renderizado de tareas');

// Función global para testing de fases
function testPhaseCreation() {
    if (window.dashboardMini) {
        console.log('🧪 TESTING: Phase Creation');
        const result = window.dashboardMini.testCreatePhaseCard();
        console.log('✅ Phase creation test completed');
        return result;
    } else {
        console.log('🚨 Dashboard mini no existe');
    }
}

// Función global para testing de tareas
function testTaskCreation() {
    if (window.dashboardMini) {
        console.log('🧪 TESTING: Task Creation');
        const result = window.dashboardMini.testCreateTaskItem();
        console.log('✅ Task creation test completed');
        return result;
    } else {
        console.log('🚨 Dashboard mini no existe');
    }
}

// Función global para testing de renderizado de fases
function testPhaseRender() {
    if (window.dashboardMini) {
        console.log('🧪 TESTING: Phase Rendering');
        window.dashboardMini.testRenderPhases();
        console.log('✅ Phase render test completed');
    } else {
        console.log('🚨 Dashboard mini no existe');
    }
}

// Función global para testing de renderizado de tareas
function testTaskRender() {
    if (window.dashboardMini) {
        console.log('🧪 TESTING: Task Rendering');
        window.dashboardMini.testRenderTasks();
        console.log('✅ Task render test completed');
    } else {
        console.log('🚨 Dashboard mini no existe');
    }
}

// 🚨 TESTING MÁS PELIGROSO: AUTO-INICIALIZACIÓN
function testAutoInit() {
    console.log('🚨 TESTING: Auto-inicialización como dashboard original');
    
    // Simular exactamente lo que hace el dashboard original
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🔄 DOMContentLoaded ejecutado (simulado)');
        
        // Crear dashboard automáticamente
        window.dashboardMini = new OptimizerDashboardMini();
        console.log('🔄 Dashboard creado automáticamente');
        
        // Inicializar automáticamente
        window.dashboardMini.manualInit();
        console.log('🔄 Dashboard inicializado automáticamente');
        
        console.log('⚠️ Auto-inicialización completada - observar si crece');
    });
    
    // Disparar el evento manualmente
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);
}

// 🚨 TESTING SUPER PELIGROSO: Renderizado en LOOP
function testRenderLoop() {
    console.log('🚨 TESTING: Renderizado en loop (PELIGROSO)');
    
    if (!window.dashboardMini) {
        console.log('🚨 Crear dashboard primero');
        return;
    }
    
    let count = 0;
    const maxIterations = 5;
    
    const renderLoop = () => {
        count++;
        console.log(`🔄 Loop iteration ${count}/${maxIterations}`);
        
        // Forzar re-renderizado (resetear flags)
        window.dashboardMini.phasesRendered = false;
        window.dashboardMini.tasksRendered = false;
        
        // Re-renderizar
        window.dashboardMini.testRenderPhases();
        window.dashboardMini.testRenderTasks();
        
        if (count < maxIterations) {
            setTimeout(renderLoop, 100); // Continuar loop
        } else {
            console.log('🛑 Loop detenido después de 5 iteraciones');
        }
    };
    
    renderLoop();
}

console.log('🆕 Nuevos comandos de testing:');
console.log('   - testAutoInit() - 🚨 Probar auto-inicialización');
console.log('   - testRenderLoop() - 🚨 Probar renderizado en loop (PELIGROSO)');
