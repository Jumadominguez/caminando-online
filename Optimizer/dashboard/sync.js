// Utility to sync with PROJECT_CHECKLIST.md
class ChecklistSync {
    constructor() {
        this.checklistPath = '../PROJECT_CHECKLIST.md';
        this.lastSync = null;
    }

    // Parse PROJECT_CHECKLIST.md content
    parseChecklist(content) {
        const data = {
            projectInfo: {},
            stats: {},
            phases: [],
            tasks: [],
            currentFocus: {}
        };

        try {
            // Extract project info
            data.projectInfo = this.extractProjectInfo(content);
            
            // Extract stats
            data.stats = this.extractStats(content);
            
            // Extract phases
            data.phases = this.extractPhases(content);
            
            // Extract tasks
            data.tasks = this.extractTasks(content);
            
            // Extract current focus
            data.currentFocus = this.extractCurrentFocus(content);
            
        } catch (error) {
            console.error('Error parsing checklist:', error);
        }

        return data;
    }

    extractProjectInfo(content) {
        const info = {};
        
        // Extract last update
        const updateMatch = content.match(/\*\*Última actualización\*\*:\s*(.+)/);
        if (updateMatch) {
            info.lastUpdate = updateMatch[1].trim();
        }
        
        // Extract global status
        const statusMatch = content.match(/\*\*Estado global\*\*:\s*(.+)/);
        if (statusMatch) {
            info.globalStatus = statusMatch[1].trim();
        }
        
        // Extract progress percentage
        const progressMatch = content.match(/\*\*Progreso total\*\*:\s*[█░]*\s*(\d+)%/);
        if (progressMatch) {
            info.totalProgress = parseInt(progressMatch[1]);
        }
        
        return info;
    }

    extractStats(content) {
        const stats = {};
        
        // Extract task counts
        const totalTasksMatch = content.match(/\*\*Total de tareas\*\*:\s*(\d+)/);
        if (totalTasksMatch) {
            stats.totalTasks = parseInt(totalTasksMatch[1]);
        }
        
        const completedMatch = content.match(/\*\*Completadas\*\*:\s*(\d+)/);
        if (completedMatch) {
            stats.completedTasks = parseInt(completedMatch[1]);
        }
        
        const progressMatch = content.match(/\*\*En progreso\*\*:\s*(\d+)/);
        if (progressMatch) {
            stats.inProgressTasks = parseInt(progressMatch[1]);
        }
        
        const pendingMatch = content.match(/\*\*Pendientes\*\*:\s*(\d+)/);
        if (pendingMatch) {
            stats.pendingTasks = parseInt(pendingMatch[1]);
        }
        
        const blockedMatch = content.match(/\*\*Bloqueadas\*\*:\s*(\d+)/);
        if (blockedMatch) {
            stats.blockedTasks = parseInt(blockedMatch[1]);
        }
        
        // Extract time estimates
        const timeMatch = content.match(/\*\*Restante\*\*:\s*([\d\-~]+\s*horas?)/);
        if (timeMatch) {
            stats.estimatedTime = timeMatch[1];
        }
        
        // Extract velocity
        const velocityMatch = content.match(/\*\*Velocidad actual\*\*:\s*(.+)/);
        if (velocityMatch) {
            stats.velocity = velocityMatch[1].trim();
        }
        
        return stats;
    }

    extractPhases(content) {
        const phases = [];
        const phaseRegex = /##\s*(📂|🎨|💻|🧪|📊)\s*FASE\s*(\d+):\s*(.+?)\n\*\*Estado\*\*:\s*(.+?)\s*\|\s*\*\*Progreso\*\*:\s*(\d+)%(?:\s*\|\s*\*\*ETA\*\*:\s*(.+?))?/g;
        
        let match;
        while ((match = phaseRegex.exec(content)) !== null) {
            const [, icon, phaseNum, name, status, progress, eta] = match;
            
            phases.push({
                id: parseInt(phaseNum),
                name: `Fase ${phaseNum}: ${name.trim()}`,
                status: this.normalizeStatus(status.trim()),
                progress: parseInt(progress),
                eta: eta ? eta.trim() : 'Por definir',
                tasks: 0, // This would need more parsing
                completedTasks: 0 // This would need more parsing
            });
        }
        
        return phases;
    }

    extractTasks(content) {
        const tasks = [];
        
        // Extract tasks from different sections
        const taskSections = content.split(/#{2,4}/);
        
        taskSections.forEach(section => {
            const taskMatches = section.matchAll(/####?\s*(.+?)\n.*?Estado.*?:\s*(.+?)\s*\n.*?Prioridad.*?:\s*(.+?)\s*\n.*?Tiempo.*?:\s*(.+?)(?:\n|$)/g);
            
            for (let match of taskMatches) {
                const [, title, status, priority, time] = match;
                
                tasks.push({
                    id: this.generateTaskId(title),
                    title: title.trim(),
                    status: this.normalizeStatus(status.trim()),
                    priority: this.normalizePriority(priority.trim()),
                    estimatedTime: time.trim(),
                    phase: this.extractPhaseFromTitle(title)
                });
            }
        });
        
        return tasks;
    }

    extractCurrentFocus(content) {
        const focus = {};
        
        // Extract current task
        const currentTaskMatch = content.match(/📍\s*(.+?)\n/);
        if (currentTaskMatch) {
            focus.task = currentTaskMatch[1].trim();
        }
        
        // Extract description
        const descMatch = content.match(/└──\s*Acción:\s*(.+?)\n/);
        if (descMatch) {
            focus.description = descMatch[1].trim();
        }
        
        // Extract next step
        const nextMatch = content.match(/└──\s*Siguiente:\s*(.+?)\n/);
        if (nextMatch) {
            focus.nextStep = nextMatch[1].trim();
        }
        
        // Extract time
        const timeMatch = content.match(/└──\s*Tiempo estimado:\s*(.+?)\n/);
        if (timeMatch) {
            focus.estimatedTime = timeMatch[1].trim();
        }
        
        return focus;
    }

    normalizeStatus(status) {
        const statusMap = {
            '✅ COMPLETADA': 'completed',
            'COMPLETADA': 'completed',
            '🔄 EN PROGRESO': 'progress',
            'EN PROGRESO': 'progress',
            '🟡 PENDIENTE': 'pending',
            'PENDIENTE': 'pending',
            '🔴 BLOQUEADA': 'blocked',
            'BLOQUEADA': 'blocked',
            '⏸️ EN PAUSA': 'paused',
            'EN PAUSA': 'paused',
            '❌ CANCELADA': 'cancelled',
            'CANCELADA': 'cancelled',
            '🔍 EN REVISIÓN': 'review',
            'EN REVISIÓN': 'review'
        };
        
        return statusMap[status.toUpperCase()] || 'pending';
    }

    normalizePriority(priority) {
        const priorityMap = {
            '🔥 CRÍTICA': 'critical',
            'CRÍTICA': 'critical',
            '⭐ ALTA': 'high',
            'ALTA': 'high',
            '💡 MEDIA': 'medium',
            'MEDIA': 'medium',
            '📌 BAJA': 'low',
            'BAJA': 'low'
        };
        
        return priorityMap[priority.toUpperCase()] || 'medium';
    }

    generateTaskId(title) {
        // Generate a simple ID based on the title
        return title.toLowerCase()
                   .replace(/[^a-z0-9\s]/g, '')
                   .replace(/\s+/g, '-')
                   .substring(0, 20);
    }

    extractPhaseFromTitle(title) {
        // Try to extract phase number from task titles
        const phaseMatch = title.match(/(\d+)\.(\d+)\.(\d+)/);
        if (phaseMatch) {
            return parseInt(phaseMatch[1]);
        }
        return 1; // Default to phase 1
    }

    // Method to load and parse the checklist file
    async loadChecklist() {
        try {
            // In a real browser environment, you'd need to use fetch or file API
            // For now, this is a placeholder for the integration
            const response = await fetch(this.checklistPath);
            const content = await response.text();
            return this.parseChecklist(content);
        } catch (error) {
            console.error('Error loading checklist:', error);
            return null;
        }
    }

    // Method to sync dashboard with checklist
    async syncDashboard(dashboard) {
        try {
            const checklistData = await this.loadChecklist();
            if (checklistData) {
                // Update dashboard data
                dashboard.data = { ...dashboard.data, ...checklistData };
                
                // Re-render components
                dashboard.updateBasicStats();
                dashboard.renderPhases();
                dashboard.renderTasks();
                dashboard.initializeChart();
                
                this.lastSync = new Date();
                console.log('Dashboard synchronized with checklist at', this.lastSync);
                
                return true;
            }
        } catch (error) {
            console.error('Sync failed:', error);
        }
        return false;
    }

    // Auto-sync functionality
    startAutoSync(dashboard, intervalMinutes = 5) {
        setInterval(async () => {
            const success = await this.syncDashboard(dashboard);
            if (success) {
                showNotification('🔄 Dashboard sincronizado con checklist', 'info');
            }
        }, intervalMinutes * 60 * 1000);
    }
}

// Export for use in main dashboard
window.ChecklistSync = ChecklistSync;