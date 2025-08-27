/**
 * CAMINANDO ONLINE V2 - APP PRINCIPAL
 * ===============================================
 * Archivo principal de la aplicación
 * Inicializa todos los managers y controladores
 * Autor: Juan + Claude
 * Fecha: 27/08/2025
 * =============================================== */

// Configuración de la aplicación
const app = {
  version: '2.0.0',
  debug: true,
  
  // Estado global
  state: {
    supermercados: [],
    productos: [],
    usuario: null
  },

  // Inicializar aplicación
  init() {
    console.log('🚀 Caminando Online v' + this.version + ' - Iniciando...');
    
    // Inicializar componentes
    this.setupEventListeners();
    
    console.log('✅ Aplicación inicializada correctamente');
  },

  // Configurar event listeners
  setupEventListeners() {
    // Manejar clicks en navegación
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        this.handleNavigation(e, link);
      }
    });
  },

  // Manejar navegación
  handleNavigation(event, link) {
    const href = link.getAttribute('href');
    
    if (href === '#perfil' || href === '#registro') {
      event.preventDefault();
      this.showNotification(href === '#perfil' ? 'Login próximamente' : 'Registro próximamente', 'info');
    }
  },

  // Mostrar notificación
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'app-notification';
    notification.textContent = message;
    
    const colors = {
      info: '#ff6b35',
      success: '#28a745',
      error: '#dc3545',
      warning: '#ffc107'
    };
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-size: 14px;
      transform: translateX(400px);
      transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});

// Exportar para uso global
window.CaminandoApp = app;