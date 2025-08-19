// ================================
// PHASE DETAIL PAGE JAVASCRIPT
// ================================

document.addEventListener('DOMContentLoaded', function() {
    initializePhaseDetail();
});

function initializePhaseDetail() {
    setupTaskFilters();
    setupBlockToggles();
    setupSubtaskHandlers();
    loadPhaseData();
    updateProgress();
}

// Task Filter Functionality
function setupTaskFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const taskItems = document.querySelectorAll('.task-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterType = button.getAttribute('data-filter');
            
            taskItems.forEach(item => {
                const taskStatus = item.getAttribute('data-status');
                
                if (filterType === 'all') {
                    item.style.display = 'flex';
                } else if (filterType === 'completed' && taskStatus === 'completed') {
                    item.style.display = 'flex';
                } else if (filterType === 'progress' && taskStatus === 'progress') {
                    item.style.display = 'flex';
                } else if (filterType === 'pending' && taskStatus === 'pending') {
                    item.style.display = 'flex';
                } else if (filterType === 'blocked' && taskStatus === 'blocked') {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Block Toggle Functionality
function toggleBlock(blockId) {
    const blockElement = document.getElementById(blockId);
    const toggleButton = blockElement.previousElementSibling.querySelector('.block-expand-btn');
    const icon = toggleButton.querySelector('i');
    
    if (blockElement.style.display === 'none' || blockElement.style.display === '') {
        blockElement.style.display = 'block';
        blockElement.classList.add('expanded');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
        toggleButton.innerHTML = '<i class="fas fa-chevron-up"></i> Ocultar Tareas';
    } else {
        blockElement.style.display = 'none';
        blockElement.classList.remove('expanded');
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
        toggleButton.innerHTML = '<i class="fas fa-chevron-down"></i> Ver Tareas';
    }
}

function setupBlockToggles() {
    // This will be called when block expand buttons are clicked
    // The toggleBlock function is already set up in the HTML onclick attributes
}

// Subtask Handlers
function setupSubtaskHandlers() {
    const subtaskCheckboxes = document.querySelectorAll('.subtask-item input[type="checkbox"]');
    
    subtaskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const subtaskItem = this.closest('.subtask-item');
            const label = subtaskItem.querySelector('label');
            
            if (this.checked) {
                label.style.textDecoration = 'line-through';
                label.style.opacity = '0.7';
                subtaskItem.style.background = 'rgba(16, 185, 129, 0.1)';
            } else {
                label.style.textDecoration = 'none';
                label.style.opacity = '1';
                subtaskItem.style.background = 'rgba(255, 255, 255, 0.1)';
            }
            
            updateTaskProgress();
        });
    });
}

// Progress Updates
function updateTaskProgress() {
    const subtaskCheckboxes = document.querySelectorAll('.subtask-item input[type="checkbox"]');
    const totalSubtasks = subtaskCheckboxes.length;
    const completedSubtasks = Array.from(subtaskCheckboxes).filter(cb => cb.checked).length;
    
    const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
    
    // Update the current task progress if needed
    console.log(`Task progress: ${progressPercentage.toFixed(1)}% (${completedSubtasks}/${totalSubtasks})`);
}

function updateProgress() {
    // Update overall phase progress based on completed tasks
    const allTasks = document.querySelectorAll('.task-item');
    const completedTasks = document.querySelectorAll('.task-item[data-status="completed"]');
    const progressTasks = document.querySelectorAll('.task-item[data-status="progress"]');
    
    const totalTasks = allTasks.length;
    const completed = completedTasks.length;
    const inProgress = progressTasks.length;
    
    // Calculate progress percentage (completed + 50% of in-progress)
    const progressPercentage = totalTasks > 0 ? 
        ((completed + (inProgress * 0.5)) / totalTasks) * 100 : 0;
    
    // Update progress bars
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        bar.style.width = `${progressPercentage}%`;
    });
    
    // Update progress text
    const progressTexts = document.querySelectorAll('.card-value');
    progressTexts[0].textContent = `${Math.round(progressPercentage)}%`;
    
    // Update task counts
    const taskCountElement = document.querySelector('.card-label');
    if (taskCountElement) {
        taskCountElement.textContent = `${completed} de ${totalTasks} tareas`;
    }
}

// Load Phase Data (can be expanded to load from external source)
function loadPhaseData() {
    // Detectar qué fase estamos viendo basándonos en el título de la página
    const pageTitle = document.title;
    let currentPhase = 1; // Default
    
    if (pageTitle.includes('Fase 2')) currentPhase = 2;
    else if (pageTitle.includes('Fase 3')) currentPhase = 3;
    else if (pageTitle.includes('Fase 4')) currentPhase = 4;
    else if (pageTitle.includes('Fase 5')) currentPhase = 5;
    
    const allPhaseData = {
        1: {
            title: "Fase 1: Configuración y Diseño Frontend",
            status: "en-progreso",
            progress: 15,
            eta: "3-5 días",
            blocks: [
                {
                    id: "block-1-1",
                    title: "🏗️ BLOQUE 1.1: Estructura del Proyecto",
                    progress: 20,
                    tasks: 4,
                    timeEstimate: "6-8h",
                    completed: 1,
                    tasks_detail: [
                        {
                            id: "1.1.1",
                            title: "Crear Repositorio en GitHub",
                            status: "progress",
                            priority: "critical",
                            time: "2-3h",
                            subtasks: [
                                "Crear repo en GitHub",
                                "Configurar branch protection",
                                "Setup GitHub Actions",
                                "Configurar templates de issues/PR"
                            ],
                            blocks: ["1.1.2", "1.1.3"]
                        },
                        {
                            id: "1.1.2",
                            title: "Inicializar README Principal",
                            status: "blocked",
                            priority: "high",
                            time: "1-2h",
                            blockedBy: "1.1.1",
                            subtasks: [
                                "Estructura del README",
                                "Badges de estado",
                                "Instrucciones de instalación",
                                "Sección de contribución"
                            ]
                        }
                    ]
                },
                {
                    id: "block-1-2",
                    title: "⚙️ BLOQUE 1.2: Herramientas y Configuración",
                    progress: 0,
                    tasks: 3,
                    timeEstimate: "6-7h",
                    completed: 0,
                    tasks_detail: [
                        {
                            id: "1.2.1",
                            title: "Seleccionar Framework Frontend",
                            status: "pending",
                            priority: "critical",
                            time: "3-4h",
                            decision: "React vs Vue vs Next.js",
                            subtasks: [
                                "Análisis comparativo",
                                "Prueba de concepto",
                                "Documento de decisión técnica",
                                "Setup inicial del framework"
                            ]
                        }
                    ]
                }
            ]
        },
        2: {
            title: "Fase 2: Diseño de Interfaz de Usuario",
            status: "pendiente",
            progress: 0,
            eta: "1 semana",
            blocks: [
                {
                    id: "block-2-1",
                    title: "🎨 BLOQUE 2.1: Diseño Visual",
                    progress: 0,
                    tasks: 5,
                    timeEstimate: "15-20h",
                    completed: 0,
                    tasks_detail: [
                        {
                            id: "2.1.1",
                            title: "Sistema de Diseño",
                            status: "pending",
                            priority: "critical",
                            time: "8-10h",
                            subtasks: [
                                "Wireframes de alta fidelidad",
                                "Definir paleta de colores",
                                "Selección tipográfica",
                                "Componentes reutilizables base",
                                "Guía de diseño documentada"
                            ]
                        }
                    ]
                },
                {
                    id: "block-2-2",
                    title: "📱 BLOQUE 2.2: Mockups de Componentes",
                    progress: 0,
                    tasks: 4,
                    timeEstimate: "10-12h",
                    completed: 0,
                    tasks_detail: [
                        {
                            id: "2.2.1",
                            title: "Mockup CodeAnalyzer",
                            status: "pending",
                            priority: "critical",
                            time: "4-5h",
                            blockedBy: "2.1.1",
                            subtasks: [
                                "Área de input de código",
                                "Botón de análisis",
                                "Diseño de resultados",
                                "Estados de loading y error"
                            ]
                        }
                    ]
                }
            ]
        },
        3: {
            title: "Fase 3: Implementación Frontend",
            status: "pendiente",
            progress: 0,
            eta: "2 semanas",
            blocks: [
                {
                    id: "block-3-1",
                    title: "🔧 BLOQUE 3.1: Arquitectura Base",
                    progress: 0,
                    tasks: 7,
                    timeEstimate: "20-25h",
                    completed: 0,
                    tasks_detail: [
                        {
                            id: "3.1.1",
                            title: "Setup Técnico Completo",
                            status: "pending",
                            priority: "critical",
                            time: "6-8h",
                            subtasks: [
                                "Estructura de componentes React",
                                "Configurar enrutamiento",
                                "Gestión de estado (Context/Redux)",
                                "Setup de testing",
                                "Configuración de desarrollo"
                            ]
                        }
                    ]
                },
                {
                    id: "block-3-2",
                    title: "🧩 BLOQUE 3.2: Desarrollo de Componentes",
                    progress: 0,
                    tasks: 8,
                    timeEstimate: "40-55h",
                    completed: 0,
                    tasks_detail: [
                        {
                            id: "3.2.1",
                            title: "Implementar CodeAnalyzer",
                            status: "pending",
                            priority: "critical",
                            time: "12-15h",
                            blockedBy: "3.1.1",
                            subtasks: [
                                "Función de input de código",
                                "Validación básica",
                                "Preparar área de resultados",
                                "Integración con IA"
                            ]
                        }
                    ]
                }
            ]
        },
        4: {
            title: "Fase 4: Prototipo Funcional",
            status: "pendiente",
            progress: 0,
            eta: "1 semana",
            blocks: [
                {
                    id: "block-4-1",
                    title: "🔗 BLOQUE 4.1: Integración",
                    progress: 0,
                    tasks: 4,
                    timeEstimate: "25-35h",
                    completed: 0,
                    tasks_detail: [
                        {
                            id: "4.1.1",
                            title: "Integración de Componentes",
                            status: "pending",
                            priority: "critical",
                            time: "8-12h",
                            subtasks: [
                                "Conectar CodeAnalyzer con RedundancyDetector",
                                "Integrar LoggingPanel con todos los módulos",
                                "Configurar flujo de datos completo",
                                "Validar comunicación entre componentes",
                                "Resolver conflictos de integración"
                            ]
                        }
                    ]
                }
            ]
        },
        5: {
            title: "Fase 5: Optimización y Mejora",
            status: "pendiente",
            progress: 0,
            eta: "1 semana",
            blocks: [
                {
                    id: "block-5-1",
                    title: "⚡ BLOQUE 5.1: Performance",
                    progress: 0,
                    tasks: 2,
                    timeEstimate: "15-20h",
                    completed: 0,
                    tasks_detail: [
                        {
                            id: "5.1.1",
                            title: "Revisión de Rendimiento",
                            status: "pending",
                            priority: "critical",
                            time: "8-12h",
                            subtasks: [
                                "Análisis de rendimiento con Lighthouse",
                                "Optimización de componentes pesados",
                                "Implementar code splitting",
                                "Optimizar bundle size",
                                "Configurar caching estratégico"
                            ]
                        }
                    ]
                }
            ]
        }
    };
    
    // Populate block tasks dynamically para la fase actual
    const phaseData = allPhaseData[currentPhase];
    if (phaseData) {
        populateBlockTasks(phaseData);
    }
}

// Populate Block Tasks
function populateBlockTasks(phaseData) {
    phaseData.blocks.forEach(block => {
        const blockElement = document.getElementById(block.id);
        if (blockElement) {
            let tasksHTML = '<div class="block-tasks-list">';
            
            block.tasks_detail.forEach(task => {
                const statusIcon = getStatusIcon(task.status);
                const priorityClass = getPriorityClass(task.priority);
                const statusClass = getStatusClass(task.status);
                
                tasksHTML += `
                    <div class="block-task-item ${statusClass}">
                        <div class="block-task-status">
                            ${statusIcon}
                        </div>
                        <div class="block-task-content">
                            <div class="block-task-header">
                                <h5>${task.id} ${task.title}</h5>
                                <div class="block-task-badges">
                                    <span class="priority-badge ${priorityClass}">${getPriorityText(task.priority)}</span>
                                    <span class="status-badge ${statusClass}">${getStatusText(task.status)}</span>
                                </div>
                            </div>
                            <div class="block-task-meta">
                                <span><i class="fas fa-clock"></i> ${task.time}</span>
                                ${task.blockedBy ? `<span><i class="fas fa-lock"></i> Esperando: ${task.blockedBy}</span>` : ''}
                                ${task.blocks ? `<span><i class="fas fa-link"></i> Bloquea: ${task.blocks.join(', ')}</span>` : ''}
                            </div>
                            <div class="block-task-subtasks">
                                <h6>Subtareas:</h6>
                                <ul>
                                    ${task.subtasks.map(subtask => `<li>${subtask}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                        <div class="block-task-actions">
                            <button class="btn-sm primary" onclick="viewTaskDetails('${task.id}')">
                                <i class="fas fa-eye"></i> Ver
                            </button>
                            ${task.status === 'pending' ? `
                                <button class="btn-sm success" onclick="startTask('${task.id}')">
                                    <i class="fas fa-play"></i> Iniciar
                                </button>
                            ` : ''}
                            ${task.status === 'progress' ? `
                                <button class="btn-sm warning" onclick="completeTask('${task.id}')">
                                    <i class="fas fa-check"></i> Completar
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
            
            tasksHTML += '</div>';
            blockElement.innerHTML = tasksHTML;
        }
    });
}

// Helper Functions for Status and Priority
function getStatusIcon(status) {
    const icons = {
        'completed': '<i class="fas fa-check-circle"></i>',
        'progress': '<i class="fas fa-spinner fa-spin"></i>',
        'pending': '<i class="fas fa-circle"></i>',
        'blocked': '<i class="fas fa-lock"></i>',
        'paused': '<i class="fas fa-pause-circle"></i>'
    };
    return icons[status] || '<i class="fas fa-circle"></i>';
}

function getPriorityClass(priority) {
    const classes = {
        'critical': 'critical',
        'high': 'high',
        'medium': 'medium',
        'low': 'low'
    };
    return classes[priority] || 'medium';
}

function getStatusClass(status) {
    return status;
}

function getPriorityText(priority) {
    const texts = {
        'critical': '🔥 CRÍTICA',
        'high': '⭐ ALTA',
        'medium': '💡 MEDIA',
        'low': '📌 BAJA'
    };
    return texts[priority] || '💡 MEDIA';
}

function getStatusText(status) {
    const texts = {
        'completed': '✅ COMPLETADA',
        'progress': '🔄 EN PROGRESO',
        'pending': '🟡 PENDIENTE',
        'blocked': '🔴 BLOQUEADA',
        'paused': '⏸️ EN PAUSA'
    };
    return texts[status] || '🟡 PENDIENTE';
}

// Task Action Functions
function viewTaskDetails(taskId) {
    // Could open a modal or navigate to a detailed task view
    console.log(`Viewing details for task: ${taskId}`);
    
    // For now, we'll scroll to the current task highlight if it matches
    const currentTaskElement = document.querySelector('.current-task-highlight');
    if (currentTaskElement) {
        currentTaskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function startTask(taskId) {
    console.log(`Starting task: ${taskId}`);
    
    // Update task status in the UI
    const taskElements = document.querySelectorAll(`[data-task-id="${taskId}"]`);
    taskElements.forEach(element => {
        element.setAttribute('data-status', 'progress');
        element.classList.remove('pending');
        element.classList.add('progress');
    });
    
    showNotification(`Tarea ${taskId} iniciada`, 'success');
    updateProgress();
}

function completeTask(taskId) {
    console.log(`Completing task: ${taskId}`);
    
    // Show confirmation dialog
    if (confirm(`¿Estás seguro de que quieres marcar la tarea ${taskId} como completada?`)) {
        // Update task status in the UI
        const taskElements = document.querySelectorAll(`[data-task-id="${taskId}"]`);
        taskElements.forEach(element => {
            element.setAttribute('data-status', 'completed');
            element.classList.remove('progress');
            element.classList.add('completed');
        });
        
        showNotification(`Tarea ${taskId} completada`, 'success');
        updateProgress();
        
        // Check if this unblocks other tasks
        checkUnblockedTasks(taskId);
    }
}

function checkUnblockedTasks(completedTaskId) {
    // This would check the data structure to see which tasks were blocked by the completed task
    // and update their status to pending
    console.log(`Checking for tasks unblocked by: ${completedTaskId}`);
}

// Action Button Functions
function markPhaseTaskComplete() {
    const currentTaskId = '1.1.1'; // This would be dynamic
    completeTask(currentTaskId);
}

function addTaskNote() {
    const note = prompt('Añadir nota para la tarea actual:');
    if (note && note.trim()) {
        console.log('Note added:', note);
        showNotification('Nota añadida', 'info');
        
        // Here you would save the note to local storage or send to a server
        saveTaskNote('1.1.1', note);
    }
}

function updateTaskProgress() {
    showNotification('Progreso actualizado', 'info');
    updateProgress();
    
    // Here you would sync with external systems
    syncWithExternalSystems();
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-times' : 'fa-info'}"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function saveTaskNote(taskId, note) {
    // Save to localStorage for now
    const notes = JSON.parse(localStorage.getItem('task_notes') || '{}');
    if (!notes[taskId]) {
        notes[taskId] = [];
    }
    notes[taskId].push({
        note: note,
        timestamp: new Date().toISOString(),
        id: Date.now()
    });
    localStorage.setItem('task_notes', JSON.stringify(notes));
}

function syncWithExternalSystems() {
    // This would sync with Asana, GitHub, etc.
    console.log('Syncing with external systems...');
    
    // Simulate API call
    setTimeout(() => {
        console.log('Sync completed');
    }, 1000);
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializePhaseDetail();
});

// Export functions for use in HTML onclick attributes
window.toggleBlock = toggleBlock;
window.viewTaskDetails = viewTaskDetails;
window.startTask = startTask;
window.completeTask = completeTask;
window.markPhaseTaskComplete = markPhaseTaskComplete;
window.addTaskNote = addTaskNote;
window.updateTaskProgress = updateTaskProgress;