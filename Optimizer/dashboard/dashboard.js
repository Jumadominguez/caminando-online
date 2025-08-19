// Dashboard Data and State Management
class OptimizerDashboard {
    constructor() {
        this.data = {
            projectInfo: {
                name: "Optimizer",
                lastUpdate: "19 de agosto, 2025",
                globalStatus: "🟡 EN PREPARACIÓN",
                currentPhase: "Fase 1 de 5",
                totalProgress: 4
            },
            stats: {
                totalTasks: 45,
                completedTasks: 2,
                inProgressTasks: 1,
                pendingTasks: 42,
                blockedTasks: 1,
                estimatedTime: "80-100h",
                sprintProgress: 15,
                velocity: "1 tarea/día"
            },
            phases: [
                {
                    id: 0,
                    name: "Fase 0: Preparación",
                    status: "completed",
                    progress: 100,
                    eta: "Completada",
                    tasks: 4,
                    completedTasks: 4
                },
                {
                    id: 1,
                    name: "Fase 1: Frontend Base",
                    status: "progress",
                    progress: 15,
                    eta: "3-5 días",
                    tasks: 12,
                    completedTasks: 2
                },
                {
                    id: 2,
                    name: "Fase 2: Diseño UI",
                    status: "pending",
                    progress: 0,
                    eta: "1 semana",
                    tasks: 8,
                    completedTasks: 0
                },
                {
                    id: 3,
                    name: "Fase 3: Implementación",
                    status: "pending",
                    progress: 0,
                    eta: "2 semanas",
                    tasks: 15,
                    completedTasks: 0
                },
                {
                    id: 4,
                    name: "Fase 4: Prototipo",
                    status: "pending",
                    progress: 0,
                    eta: "1 semana",
                    tasks: 4,
                    completedTasks: 0
                },
                {
                    id: 5,
                    name: "Fase 5: Optimización",
                    status: "pending",
                    progress: 0,
                    eta: "1 semana",
                    tasks: 2,
                    completedTasks: 0
                }
            ],
            currentFocus: {
                task: "Crear Repositorio en GitHub (1.1.1)",
                description: "Acción: Ir a GitHub y crear el repo",
                estimatedTime: "30 minutos",
                nextStep: "Configurar branch protection",
                priority: "critical",
                tags: ["🎯 TAREA ACTUAL", "🔥 CRÍTICA"]
            },
            tasks: [
                {
                    id: "1.1.1",
                    title: "Crear Repositorio en GitHub",
                    status: "progress",
                    priority: "critical",
                    phase: 1,
                    estimatedTime: "2-3 horas",
                    assignee: "En Asana",
                    tags: ["🔥 CRÍTICA", "🎯 ACTUAL"],
                    dependencies: [],
                    blocks: ["1.1.2", "1.1.3"]
                },
                {
                    id: "1.1.2",
                    title: "Inicializar README Principal",
                    status: "blocked",
                    priority: "high",
                    phase: 1,
                    estimatedTime: "1-2 horas",
                    dependencies: ["1.1.1"],
                    tags: ["🔴 BLOQUEADA"]
                },
                {
                    id: "1.1.3",
                    title: "Configurar .gitignore",
                    status: "pending",
                    priority: "medium",
                    phase: 1,
                    estimatedTime: "30 min",
                    tags: ["⚡ QUICK WIN"]
                },
                {
                    id: "1.1.4",
                    title: "Establecer Política de Ramas",
                    status: "pending",
                    priority: "high",
                    phase: 1,
                    estimatedTime: "1-2 horas",
                    tags: ["📝 DOCUMENTACIÓN"]
                },
                {
                    id: "0.1",
                    title: "Crear carpeta Optimizer/",
                    status: "completed",
                    priority: "critical",
                    phase: 0,
                    estimatedTime: "5 min",
                    completedDate: "19/08/2025"
                },
                {
                    id: "0.2",
                    title: "Crear PROJECT_CHECKLIST.md",
                    status: "completed",
                    priority: "high",
                    phase: 0,
                    estimatedTime: "30 min",
                    completedDate: "19/08/2025"
                }
            ]
        };

        this.filters = {
            currentFilter: 'all'
        };
        
        // Performance tracking
        this.lastRenderedTasksCount = 0;
        this.lastFilter = 'all';
        this.autoUpdateInterval = null;
        this.isInitialized = false;
        this.phasesRendered = false;
        this.tasksRendered = false;
        this.chartInitialized = false;

        this.init();
    }

    init() {
        if (this.isInitialized) {
            console.log('Dashboard ya inicializado, evitando re-inicialización');
            return;
        }
        
        console.log('Inicializando dashboard...');
        this.updateBasicStats();
        
        // Solo renderizar una vez
        if (!this.phasesRendered) {
            this.renderPhases();
            this.phasesRendered = true;
        }
        
        if (!this.tasksRendered) {
            this.renderTasks();
            this.tasksRendered = true;
        }
        
        if (!this.chartInitialized) {
            // CHART DESHABILITADO PARA DEBUGGING
            console.log('⚠️ Chart.js DESHABILITADO para debugging');
            this.chartInitialized = true;
        }
        
        this.bindEvents();
        
        // HABILITAR AUTO-UPDATE (sin chart)
        this.startAutoUpdate();
        
        this.isInitialized = true;
        console.log('Dashboard inicializado correctamente (sin chart)');
    }

    updateBasicStats() {
        // Update progress percentage
        document.getElementById('totalProgress').style.width = `${this.data.stats.totalProgress}%`;
        document.getElementById('totalPercentage').textContent = `${this.data.stats.totalProgress}%`;
        
        // Update task counts
        document.getElementById('completedTasks').textContent = this.data.stats.completedTasks;
        
        // Update estimated time
        document.getElementById('estimatedTime').textContent = this.data.stats.estimatedTime;
        
        // Update last update dates
        document.getElementById('lastUpdate').textContent = this.data.projectInfo.lastUpdate;
        document.getElementById('footerLastUpdate').textContent = this.data.projectInfo.lastUpdate;
        
        // Update global status
        document.getElementById('globalStatus').textContent = this.data.projectInfo.globalStatus;
    }

    renderPhases() {
        const phasesGrid = document.getElementById('phasesGrid');
        if (!phasesGrid) {
            console.warn('phasesGrid no encontrado');
            return;
        }
        
        console.log('Renderizando fases (vers. original)...');
        
        // VERSIÓN ORIGINAL: Clear only if different data
        const currentPhases = phasesGrid.children.length;
        if (currentPhases !== this.data.phases.length) {
            phasesGrid.innerHTML = '';
            
            this.data.phases.forEach((phase, index) => {
                const phaseCard = this.createPhaseCard(phase);
                phasesGrid.appendChild(phaseCard);
                console.log(`Fase ${index} renderizada:`, phase.name);
            });
        }
        
        console.log('Fases renderizadas completamente');
    }

    createPhaseCard(phase) {
        const card = document.createElement('div');
        card.className = 'phase-card clickable';
        card.dataset.phaseId = phase.id;
        
        const statusClass = phase.status === 'completed' ? 'completed' : 
                           phase.status === 'progress' ? 'progress' : 'pending';
        
        const statusText = phase.status === 'completed' ? '✅ COMPLETADA' :
                          phase.status === 'progress' ? '🔄 EN PROGRESO' : '🟡 PENDIENTE';

        // Determinar si la fase tiene página de detalles
        const hasDetailPage = [1, 2, 3, 4, 5].includes(phase.id); // Todas las fases ahora tienen página
        const clickableClass = hasDetailPage ? 'has-detail-page' : '';
        
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
                <div class="phase-meta">
                    <span>📊 ${phase.progress}% completo</span>
                    <span>⏰ ETA: ${phase.eta}</span>
                </div>
                <div class="phase-meta">
                    <span>✅ ${phase.completedTasks}/${phase.tasks} tareas</span>
                </div>
                ${hasDetailPage ? `
                    <div class="phase-actions">
                        <button class="btn-detail" onclick="navigateToPhaseDetail(${phase.id})">
                            <i class="fas fa-arrow-right"></i> Ver Detalles
                        </button>
                    </div>
                ` : ''}
            </div>
            ${hasDetailPage ? `
                <div class="phase-detail-hint">
                    <i class="fas fa-mouse-pointer"></i> Click para ver detalles completos
                </div>
            ` : ''}
        `;

        // Add click event for navigation
        if (hasDetailPage) {
            card.addEventListener('click', () => {
                navigateToPhaseDetail(phase.id);
            });
        }

        return card;
    }

    renderTasks() {
        const tasksContainer = document.getElementById('tasksContainer');
        if (!tasksContainer) {
            console.warn('tasksContainer no encontrado');
            return;
        }
        
        console.log('Renderizando tareas (vers. original)...');
        
        const filteredTasks = this.filterTasks();
        console.log(`Tareas filtradas: ${filteredTasks.length}`);
        
        // VERSIÓN ORIGINAL: Avoid unnecessary re-renders
        if (this.lastRenderedTasksCount === filteredTasks.length && 
            this.lastFilter === this.filters.currentFilter) {
            console.log('Evitando re-render innecesario');
            return;
        }
        
        this.lastRenderedTasksCount = filteredTasks.length;
        this.lastFilter = this.filters.currentFilter;
        
        // Limpiar completamente
        tasksContainer.innerHTML = '';
        
        if (filteredTasks.length === 0) {
            tasksContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--gray-500);">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <p>No se encontraron tareas para el filtro seleccionado.</p>
                </div>
            `;
            return;
        }

        filteredTasks.forEach((task, index) => {
            const taskItem = this.createTaskItem(task);
            tasksContainer.appendChild(taskItem);
            console.log(`Tarea ${index} renderizada:`, task.title);
        });
        
        console.log('Tareas renderizadas completamente');
    }

    createTaskItem(task) {
        const item = document.createElement('div');
        item.className = `task-item ${task.status}`;
        item.dataset.taskId = task.id;
        
        const statusIcon = this.getStatusIcon(task.status);
        const statusText = this.getStatusText(task.status);
        const priorityColor = this.getPriorityColor(task.priority);
        
        const tagsHtml = task.tags ? task.tags.map(tag => 
            `<span class="task-tag">${tag}</span>`
        ).join('') : '';

        item.innerHTML = `
            <div class="task-header">
                <div class="task-title">${task.title}</div>
                <div class="task-status ${task.status}">${statusIcon} ${statusText}</div>
            </div>
            <div class="task-meta">
                <span><i class="fas fa-layer-group"></i> Fase ${task.phase}</span>
                <span><i class="fas fa-clock"></i> ${task.estimatedTime}</span>
                <span style="color: ${priorityColor}"><i class="fas fa-flag"></i> ${task.priority.toUpperCase()}</span>
                ${task.completedDate ? `<span><i class="fas fa-check"></i> ${task.completedDate}</span>` : ''}
            </div>
            ${tagsHtml ? `<div class="task-tags">${tagsHtml}</div>` : ''}
            ${task.dependencies && task.dependencies.length > 0 ? 
                `<div class="task-dependencies">
                    <i class="fas fa-link"></i> Depende de: ${task.dependencies.join(', ')}
                </div>` : ''
            }
        `;

        return item;
    }

    getStatusIcon(status) {
        const icons = {
            completed: '✅',
            progress: '🔄',
            pending: '🟡',
            blocked: '🔴',
            paused: '⏸️',
            cancelled: '❌',
            review: '🔍'
        };
        return icons[status] || '❓';
    }

    getStatusText(status) {
        const texts = {
            completed: 'COMPLETADA',
            progress: 'EN PROGRESO',
            pending: 'PENDIENTE',
            blocked: 'BLOQUEADA',
            paused: 'EN PAUSA',
            cancelled: 'CANCELADA',
            review: 'EN REVISIÓN'
        };
        return texts[status] || 'DESCONOCIDO';
    }

    getPriorityColor(priority) {
        const colors = {
            critical: '#ef4444',
            high: '#f59e0b',
            medium: '#6b7280',
            low: '#9ca3af'
        };
        return colors[priority] || '#6b7280';
    }

    filterTasks() {
        if (this.filters.currentFilter === 'all') {
            return this.data.tasks;
        }
        
        return this.data.tasks.filter(task => {
            switch (this.filters.currentFilter) {
                case 'completed':
                    return task.status === 'completed';
                case 'progress':
                    return task.status === 'progress';
                case 'pending':
                    return task.status === 'pending';
                case 'blocked':
                    return task.status === 'blocked';
                default:
                    return true;
            }
        });
    }

    initializeChart() {
        const ctx = document.getElementById('tasksChart').getContext('2d');
        
        const taskCounts = {
            completed: this.data.tasks.filter(t => t.status === 'completed').length,
            progress: this.data.tasks.filter(t => t.status === 'progress').length,
            pending: this.data.tasks.filter(t => t.status === 'pending').length,
            blocked: this.data.tasks.filter(t => t.status === 'blocked').length
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completadas', 'En Progreso', 'Pendientes', 'Bloqueadas'],
                datasets: [{
                    data: [taskCounts.completed, taskCounts.progress, taskCounts.pending, taskCounts.blocked],
                    backgroundColor: [
                        '#10b981',
                        '#f59e0b',
                        '#6b7280',
                        '#ef4444'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    bindEvents() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Task items click events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.task-item')) {
                this.handleTaskClick(e.target.closest('.task-item'));
            }
        });
    }

    setFilter(filter) {
        this.filters.currentFilter = filter;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        // Re-render tasks
        this.renderTasks();
    }

    handleTaskClick(taskElement) {
        const taskId = taskElement.dataset.taskId;
        const task = this.data.tasks.find(t => t.id === taskId);
        
        if (task) {
            this.showTaskDetails(task);
        }
    }

    showTaskDetails(task) {
        // Create modal or detailed view
        const modal = document.createElement('div');
        modal.className = 'task-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h3>${task.title}</h3>
                        <button onclick="this.closest('.task-modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Estado:</strong> ${this.getStatusText(task.status)}</p>
                        <p><strong>Prioridad:</strong> ${task.priority.toUpperCase()}</p>
                        <p><strong>Fase:</strong> ${task.phase}</p>
                        <p><strong>Tiempo estimado:</strong> ${task.estimatedTime}</p>
                        ${task.assignee ? `<p><strong>Asignado a:</strong> ${task.assignee}</p>` : ''}
                        ${task.dependencies && task.dependencies.length > 0 ? 
                            `<p><strong>Dependencias:</strong> ${task.dependencies.join(', ')}</p>` : ''}
                        ${task.blocks && task.blocks.length > 0 ? 
                            `<p><strong>Bloquea a:</strong> ${task.blocks.join(', ')}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .task-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
            }
            .modal-overlay {
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }
            .modal-content {
                background: white;
                border-radius: 1rem;
                max-width: 500px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
            }
            .modal-header button {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6b7280;
            }
            .modal-body {
                padding: 1.5rem;
            }
            .modal-body p {
                margin-bottom: 1rem;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);
    }

    startAutoUpdate() {
        // Auto-update every 5 minutes to avoid performance issues
        this.autoUpdateInterval = setInterval(() => {
            this.updateTimestamp();
        }, 300000); // 5 minutes
    }

    stopAutoUpdate() {
        if (this.autoUpdateInterval) {
            clearInterval(this.autoUpdateInterval);
            this.autoUpdateInterval = null;
        }
    }

    updateTimestamp() {
        const now = new Date();
        const timestamp = now.toLocaleString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        document.getElementById('lastUpdate').textContent = timestamp;
        document.getElementById('footerLastUpdate').textContent = timestamp;
    }

    showLoadingComplete() {
        // TEMPORALMENTE DESHABILITADO PARA DEBUGGING
        console.log('Loading complete (sin animaciones)');
    }

    // Public methods for external integration
    markTaskComplete(taskId) {
        const task = this.data.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = 'completed';
            task.completedDate = new Date().toLocaleDateString('es-ES');
            this.updateStats();
            this.renderTasks();
            this.renderPhases();
            this.initializeChart();
        }
    }

    updateTaskStatus(taskId, newStatus) {
        const task = this.data.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            this.updateStats();
            this.renderTasks();
            this.renderPhases();
            this.initializeChart();
        }
    }

    updateStats() {
        this.data.stats.completedTasks = this.data.tasks.filter(t => t.status === 'completed').length;
        this.data.stats.inProgressTasks = this.data.tasks.filter(t => t.status === 'progress').length;
        this.data.stats.pendingTasks = this.data.tasks.filter(t => t.status === 'pending').length;
        this.data.stats.blockedTasks = this.data.tasks.filter(t => t.status === 'blocked').length;
        
        // Update progress
        this.data.stats.totalProgress = Math.round((this.data.stats.completedTasks / this.data.stats.totalTasks) * 100);
        
        this.updateBasicStats();
    }

    exportData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            project: this.data.projectInfo,
            stats: this.data.stats,
            phases: this.data.phases,
            tasks: this.data.tasks
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `optimizer-dashboard-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Navigation Functions
function navigateToPhaseDetail(phaseId) {
    // Map phase IDs to detail pages
    const phaseDetailPages = {
        1: 'phase-1-detail.html',
        2: 'phase-2-detail.html',
        3: 'phase-3-detail.html',
        4: 'phase-4-detail.html',
        5: 'phase-5-detail.html'
    };
    
    const detailPage = phaseDetailPages[phaseId];
    
    if (detailPage) {
        showNotification(`📊 Navegando a detalles de Fase ${phaseId}...`, 'info');
        
        // Small delay for better UX
        setTimeout(() => {
            window.location.href = detailPage;
        }, 500);
    } else {
        showNotification(`⚠️ Página de detalles para Fase ${phaseId} no disponible aún`, 'warning');
    }
}

// Global functions for quick actions
function openGitHub() {
    window.open('https://github.com/new', '_blank');
    showNotification('🚀 Abriendo GitHub para crear repositorio...', 'info');
}

function markTaskComplete() {
    const currentTaskId = '1.1.1'; // Current task
    if (confirm('¿Marcar la tarea actual como completada?')) {
        dashboard.markTaskComplete(currentTaskId);
        showNotification('✅ Tarea marcada como completada', 'success');
    }
}

function updateProgress() {
    dashboard.updateStats();
    dashboard.updateTimestamp();
    showNotification('🔄 Progreso actualizado', 'info');
}

function exportReport() {
    dashboard.exportData();
    showNotification('📊 Reporte exportado exitosamente', 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'warning' ? 'exclamation' : 'info'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: white;
                border-radius: 0.5rem;
                padding: 1rem 1.5rem;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 1000;
                border-left: 4px solid;
                animation: slideIn 0.3s ease;
            }
            .notification.success { border-left-color: #10b981; color: #065f46; }
            .notification.warning { border-left-color: #f59e0b; color: #92400e; }
            .notification.info { border-left-color: #06b6d4; color: #0e7490; }
            .notification button {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                opacity: 0.7;
            }
            .notification button:hover { opacity: 1; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, inicializando dashboard (sin chart)...');
    window.dashboard = new OptimizerDashboard();
    console.log('Dashboard creado e inicializado (sin chart)');
    
    // HABILITAR NOTIFICACIONES
    setTimeout(() => {
        showNotification('🚀 Dashboard de Optimizer cargado (sin chart)', 'success');
    }, 1000);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'e':
                e.preventDefault();
                exportReport();
                break;
            case 'u':
                e.preventDefault();
                updateProgress();
                break;
            case 'g':
                e.preventDefault();
                openGitHub();
                break;
        }
    }
});