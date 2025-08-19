// Dashboard V2 - Mejorado y Estable
class OptimizerDashboardV2 {
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
                    description: "Estructura base del proyecto"
                },
                {
                    id: 1,
                    name: "Fase 1: Frontend Base",
                    status: "progress",
                    progress: 15,
                    eta: "3-5 días",
                    description: "Configuración y herramientas"
                },
                {
                    id: 2,
                    name: "Fase 2: Diseño UI",
                    status: "pending",
                    progress: 0,
                    eta: "1 semana",
                    description: "Mockups y sistema de diseño"
                },
                {
                    id: 3,
                    name: "Fase 3: Implementación",
                    status: "pending",
                    progress: 0,
                    eta: "2 semanas",
                    description: "Desarrollo de componentes"
                },
                {
                    id: 4,
                    name: "Fase 4: Prototipo",
                    status: "pending",
                    progress: 0,
                    eta: "1 semana",
                    description: "Integración y pruebas"
                },
                {
                    id: 5,
                    name: "Fase 5: Optimización",
                    status: "pending",
                    progress: 0,
                    eta: "1 semana",
                    description: "Performance y mejoras"
                }
            ],
            tasks: [
                {
                    id: "1.1.1",
                    title: "Crear Repositorio en GitHub",
                    status: "progress",
                    priority: "critical",
                    phase: 1,
                    estimatedTime: "2-3 horas",
                    assignee: "En Asana",
                    description: "Configurar repositorio principal del proyecto con branch protection y templates",
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
                    description: "Crear documentación inicial del proyecto con badges y estructura",
                    dependencies: ["1.1.1"],
                    tags: ["🔴 BLOQUEADA", "📝 DOCUMENTACIÓN"]
                },
                {
                    id: "1.1.3",
                    title: "Configurar .gitignore",
                    status: "pending",
                    priority: "medium",
                    phase: 1,
                    estimatedTime: "30 min",
                    description: "Configurar archivos a ignorar en el repositorio",
                    tags: ["⚡ QUICK WIN"]
                },
                {
                    id: "1.1.4",
                    title: "Establecer Política de Ramas",
                    status: "pending",
                    priority: "high",
                    phase: 1,
                    estimatedTime: "1-2 horas",
                    description: "Definir estrategia de branching y reglas de protección",
                    tags: ["📝 DOCUMENTACIÓN"]
                },
                {
                    id: "1.2.1",
                    title: "Seleccionar Framework Frontend",
                    status: "pending",
                    priority: "critical",
                    phase: 1,
                    estimatedTime: "3-4 horas",
                    description: "Analizar y seleccionar entre React, Vue o Next.js",
                    tags: ["🔥 CRÍTICA", "🔗 DEPENDENCIA"]
                },
                {
                    id: "0.1",
                    title: "Crear carpeta Optimizer/",
                    status: "completed",
                    priority: "critical",
                    phase: 0,
                    estimatedTime: "5 min",
                    description: "Estructura base de directorios del proyecto",
                    completedDate: "19/08/2025"
                },
                {
                    id: "0.2",
                    title: "Crear PROJECT_CHECKLIST.md",
                    status: "completed",
                    priority: "high",
                    phase: 0,
                    estimatedTime: "30 min",
                    description: "Documento maestro de seguimiento del proyecto",
                    completedDate: "19/08/2025"
                }
            ],
            currentFocus: {
                taskId: "1.1.1",
                task: "Crear Repositorio en GitHub (1.1.1)",
                description: "Acción: Ir a GitHub y crear el repo",
                estimatedTime: "30 minutos",
                nextStep: "Configurar branch protection",
                priority: "critical"
            }
        };

        this.currentFilter = 'all';
        this.chart = null;
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        this.updateStats();
        this.renderPhases();
        this.renderTasks();
        this.initializeChart();
        this.bindEvents();
        this.animateProgressBars();
        
        this.isInitialized = true;
        this.showNotification('🚀 Dashboard cargado exitosamente', 'success');
    }

    updateStats() {
        // Update progress
        const progressBar = document.getElementById('totalProgress');
        if (progressBar) {
            setTimeout(() => {
                progressBar.style.width = `${this.data.projectInfo.totalProgress}%`;
            }, 300);
        }

        // Update stat values
        this.updateElement('totalPercentage', `${this.data.projectInfo.totalProgress}%`);
        this.updateElement('completedTasks', this.data.stats.completedTasks);
        this.updateElement('estimatedTime', this.data.stats.estimatedTime);
        this.updateElement('lastUpdate', this.data.projectInfo.lastUpdate);
        this.updateElement('footerLastUpdate', this.data.projectInfo.lastUpdate);
        this.updateElement('globalStatus', this.data.projectInfo.globalStatus);
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    renderPhases() {
        const container = document.getElementById('phasesContainer');
        if (!container) return;

        container.innerHTML = '';

        this.data.phases.forEach(phase => {
            const phaseElement = this.createPhaseElement(phase);
            container.appendChild(phaseElement);
        });
    }

    createPhaseElement(phase) {
        const div = document.createElement('div');
        div.className = `phase-card ${phase.status}`;
        
        const statusText = this.getStatusText(phase.status);
        const statusIcon = this.getStatusIcon(phase.status);

        div.innerHTML = `
            <div class="phase-title">${phase.name}</div>
            <div class="phase-status ${phase.status}">${statusIcon} ${phase.progress}%</div>
        `;

        // Add click event for more details
        div.addEventListener('click', () => {
            this.showPhaseDetails(phase);
        });

        return div;
    }

    renderTasks() {
        const container = document.getElementById('tasksContainer');
        if (!container) return;

        const filteredTasks = this.filterTasks();
        container.innerHTML = '';

        if (filteredTasks.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--gray-500);">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <p>No se encontraron tareas para el filtro seleccionado.</p>
                </div>
            `;
            return;
        }

        filteredTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            container.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const div = document.createElement('div');
        div.className = `task-item ${task.status}`;
        div.dataset.taskId = task.id;
        
        const statusIcon = this.getStatusIcon(task.status);
        const statusText = this.getStatusText(task.status);
        const priorityColor = this.getPriorityColor(task.priority);

        div.innerHTML = `
            <div class="task-header">
                <div class="task-title">${task.title}</div>
                <div class="task-status ${task.status}">${statusIcon}</div>
            </div>
            <div class="task-meta">
                <span><i class="fas fa-layer-group"></i> Fase ${task.phase}</span>
                <span><i class="fas fa-clock"></i> ${task.estimatedTime}</span>
                <span style="color: ${priorityColor}"><i class="fas fa-flag"></i> ${task.priority.toUpperCase()}</span>
                ${task.completedDate ? `<span><i class="fas fa-check"></i> ${task.completedDate}</span>` : ''}
            </div>
        `;

        // Add click event for task details
        div.addEventListener('click', () => {
            this.showTaskDetails(task);
        });

        return div;
    }

    filterTasks() {
        if (this.currentFilter === 'all') {
            return this.data.tasks;
        }
        
        return this.data.tasks.filter(task => task.status === this.currentFilter);
    }

    initializeChart() {
        const canvas = document.getElementById('tasksChart');
        if (!canvas) return;

        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = canvas.getContext('2d');
        
        const taskCounts = {
            completed: this.data.tasks.filter(t => t.status === 'completed').length,
            progress: this.data.tasks.filter(t => t.status === 'progress').length,
            pending: this.data.tasks.filter(t => t.status === 'pending').length,
            blocked: this.data.tasks.filter(t => t.status === 'blocked').length
        };

        this.chart = new Chart(ctx, {
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
                    borderWidth: 3,
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
                            usePointStyle: true,
                            font: {
                                family: 'Inter'
                            }
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
                        window.open('https://github.com/new', '_blank');
                        break;
                }
            }
        });
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`)?.classList.add('active');
        
        // Re-render tasks
        this.renderTasks();
    }

    animateProgressBars() {
        // Animate velocity bar
        setTimeout(() => {
            const velocityBar = document.querySelector('.velocity-bar');
            if (velocityBar) {
                velocityBar.style.width = '15%';
            }
        }, 600);
    }

    showTaskDetails(task) {
        const modal = document.getElementById('taskModal');
        const title = document.getElementById('modalTaskTitle');
        const body = document.getElementById('modalTaskBody');
        
        if (!modal || !title || !body) return;

        title.textContent = task.title;
        
        const statusText = this.getStatusText(task.status);
        const statusIcon = this.getStatusIcon(task.status);
        
        body.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <p><strong>Estado:</strong> ${statusIcon} ${statusText}</p>
                <p><strong>Prioridad:</strong> ${task.priority.toUpperCase()}</p>
                <p><strong>Fase:</strong> ${task.phase}</p>
                <p><strong>Tiempo estimado:</strong> ${task.estimatedTime}</p>
                ${task.assignee ? `<p><strong>Asignado a:</strong> ${task.assignee}</p>` : ''}
                ${task.description ? `<p><strong>Descripción:</strong> ${task.description}</p>` : ''}
            </div>
            ${task.dependencies && task.dependencies.length > 0 ? 
                `<div style="margin-bottom: 1rem;">
                    <p><strong>Dependencias:</strong> ${task.dependencies.join(', ')}</p>
                </div>` : ''}
            ${task.blocks && task.blocks.length > 0 ? 
                `<div style="margin-bottom: 1rem;">
                    <p><strong>Bloquea a:</strong> ${task.blocks.join(', ')}</p>
                </div>` : ''}
            ${task.tags && task.tags.length > 0 ? 
                `<div>
                    <p><strong>Tags:</strong> ${task.tags.join(', ')}</p>
                </div>` : ''}
        `;
        
        modal.classList.remove('hidden');
    }

    showPhaseDetails(phase) {
        const phaseTasks = this.data.tasks.filter(t => t.phase === phase.id);
        const completedTasks = phaseTasks.filter(t => t.status === 'completed').length;
        
        this.showNotification(`📊 ${phase.name}: ${completedTasks}/${phaseTasks.length} tareas completadas`, 'info');
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

    markTaskComplete(taskId) {
        const task = this.data.tasks.find(t => t.id === taskId);
        if (task && task.status !== 'completed') {
            task.status = 'completed';
            task.completedDate = new Date().toLocaleDateString('es-ES');
            
            // Update stats
            this.data.stats.completedTasks++;
            this.data.stats.inProgressTasks = Math.max(0, this.data.stats.inProgressTasks - 1);
            this.data.stats.pendingTasks = Math.max(0, this.data.stats.pendingTasks - 1);
            
            // Recalculate progress
            this.data.projectInfo.totalProgress = Math.round((this.data.stats.completedTasks / this.data.stats.totalTasks) * 100);
            
            // Re-render
            this.updateStats();
            this.renderTasks();
            this.initializeChart();
            
            this.showNotification(`✅ Tarea "${task.title}" marcada como completada`, 'success');
        }
    }

    updateProgress() {
        this.updateStats();
        this.showNotification('🔄 Progreso actualizado', 'info');
    }

    exportData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            project: this.data.projectInfo,
            stats: this.data.stats,
            phases: this.data.phases,
            tasks: this.data.tasks,
            currentFocus: this.data.currentFocus
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `optimizer-dashboard-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('📊 Reporte exportado exitosamente', 'success');
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = type === 'success' ? 'check' : 
                     type === 'warning' ? 'exclamation-triangle' : 
                     type === 'error' ? 'times-circle' : 'info-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; margin-left: auto;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Global functions
function closeModal() {
    const modal = document.getElementById('taskModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function markTaskComplete() {
    const currentTaskId = '1.1.1'; // Current task ID
    if (confirm('¿Marcar la tarea actual como completada?')) {
        window.dashboard.markTaskComplete(currentTaskId);
    }
}

function updateProgress() {
    window.dashboard.updateProgress();
}

function exportReport() {
    window.dashboard.exportData();
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new OptimizerDashboardV2();
});

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('taskModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Prevent modal close when clicking inside modal content
document.addEventListener('click', (e) => {
    if (e.target.closest('.modal-content')) {
        e.stopPropagation();
    }
});