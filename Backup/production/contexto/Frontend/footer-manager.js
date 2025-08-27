/**
 * FOOTER MANAGER - CAMINANDO.ONLINE
 * ===============================================
 * Gestiona la inserción dinámica del footer en todas las páginas
 * Autor: Juan + Claude
 * Fecha: 17/08/2025
 * ===============================================
 */

class FooterManager {
  
  /**
   * Configuración del Footer Manager
   */
  static config = {
    templatePath: '/templates/footer.html',
    targetSelector: 'body',
    insertMethod: 'append', // 'append' o 'insertBefore'
    autoInit: true,
    debug: false
  };

  /**
   * Inicialización automática del footer
   */
  static async init() {
    try {
      if (this.config.debug) {
        console.log('🦶 FooterManager: Iniciando...');
      }

      // Verificar si ya existe un footer
      if (this.footerExists()) {
        if (this.config.debug) {
          console.log('🦶 FooterManager: Footer ya existe, saltando inserción');
        }
        return;
      }

      // Cargar el footer
      await this.loadFooter();

      if (this.config.debug) {
        console.log('🦶 FooterManager: Footer cargado exitosamente');
      }

    } catch (error) {
      console.error('🦶 FooterManager Error:', error);
      this.createFallbackFooter();
    }
  }

  /**
   * Verificar si ya existe un footer en la página
   */
  static footerExists() {
    return document.querySelector('footer') !== null;
  }

  /**
   * Cargar el footer desde el template
   */
  static async loadFooter() {
    try {
      // Hacer fetch del template
      const response = await fetch(this.config.templatePath);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const footerHTML = await response.text();
      
      // Insertar el footer en el DOM
      this.insertFooter(footerHTML);

      // Inicializar funcionalidades del footer
      this.initFooterFeatures();

    } catch (error) {
      throw error;
    }
  }

  /**
   * Insertar el footer en el DOM
   */
  static insertFooter(footerHTML) {
    const targetElement = document.querySelector(this.config.targetSelector);
    
    if (!targetElement) {
      throw new Error(`Elemento target no encontrado: ${this.config.targetSelector}`);
    }

    if (this.config.insertMethod === 'append') {
      targetElement.insertAdjacentHTML('beforeend', footerHTML);
    } else {
      // insertBefore - insertar antes del último elemento
      targetElement.insertAdjacentHTML('beforeend', footerHTML);
    }
  }

  /**
   * Inicializar funcionalidades interactivas del footer
   */
  static initFooterFeatures() {
    // Actualizar año en copyright
    this.updateCopyright();
    
    // Agregar event listeners
    this.addEventListeners();
    
    // Inicializar estadísticas dinámicas (si está habilitado)
    if (this.config.dynamicStats) {
      this.initDynamicStats();
    }
  }

  /**
   * Actualizar el año en el copyright
   */
  static updateCopyright() {
    const copyrightElement = document.querySelector('.footer-copyright');
    if (copyrightElement) {
      const currentYear = new Date().getFullYear();
      copyrightElement.textContent = `© ${currentYear} Caminando.Online. Todos los derechos reservados.`;
    }
  }

  /**
   * Agregar event listeners para elementos del footer
   */
  static addEventListeners() {
    // Links de navegación
    document.querySelectorAll('.footer-links a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          this.handleFooterNavigation(link.getAttribute('href'));
        }
      });
    });

    // Links legales
    document.querySelectorAll('.footer-legal a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          this.handleLegalLink(link.getAttribute('href'));
        }
      });
    });

    // Redes sociales
    document.querySelectorAll('.footer-red').forEach(socialLink => {
      socialLink.addEventListener('click', (e) => {
        if (socialLink.getAttribute('href') === '#') {
          e.preventDefault();
          this.handleSocialLink(socialLink);
        }
      });
    });
  }

  /**
   * Manejar navegación desde el footer
   */
  static handleFooterNavigation(href) {
    const section = href.replace('#', '');
    
    if (this.config.debug) {
      console.log(`🦶 FooterManager: Navegando a sección: ${section}`);
    }

    // Aquí puedes agregar lógica específica para cada sección
    switch (section) {
      case 'productos':
        // Lógica para mostrar productos
        this.showToast('Navegando a Productos...');
        break;
      case 'promociones':
        // Lógica para mostrar promociones
        this.showToast('Navegando a Promociones...');
        break;
      case 'ayuda':
        // Lógica para mostrar ayuda
        this.showToast('Navegando a Ayuda...');
        break;
      default:
        this.showToast(`Función "${section}" próximamente`);
    }
  }

  /**
   * Manejar links legales
   */
  static handleLegalLink(href) {
    const page = href.replace('#', '');
    
    if (this.config.debug) {
      console.log(`🦶 FooterManager: Abriendo página legal: ${page}`);
    }

    this.showToast(`Abriendo ${page}...`);
  }

  /**
   * Manejar links de redes sociales
   */
  static handleSocialLink(socialElement) {
    const socialNetwork = socialElement.classList[1]; // 'facebook', 'twitter', etc.
    
    if (this.config.debug) {
      console.log(`🦶 FooterManager: Abriendo red social: ${socialNetwork}`);
    }

    this.showToast(`Próximamente: ${socialNetwork.charAt(0).toUpperCase() + socialNetwork.slice(1)}`);
  }

  /**
   * Inicializar estadísticas dinámicas (opcional)
   */
  static initDynamicStats() {
    setInterval(() => {
      this.updateStats();
    }, 30000); // Actualizar cada 30 segundos
  }

  /**
   * Actualizar estadísticas del footer
   */
  static updateStats() {
    // Simular datos actualizados
    const stats = {
      supermercados: 5,
      productos: Math.floor(Math.random() * 100) + 1000,
      actualizacion: '24/7'
    };

    const statNumbers = document.querySelectorAll('.footer-stat-number');
    if (statNumbers.length >= 2) {
      statNumbers[1].textContent = stats.productos + '+';
    }
  }

  /**
   * Mostrar toast de notificación
   */
  static showToast(message, type = 'info') {
    // Crear toast simple
    const toast = document.createElement('div');
    toast.className = `footer-toast footer-toast-${type}`;
    toast.textContent = message;
    
    // Estilos del toast
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--color-primary);
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-size: 14px;
      transform: translateX(400px);
      transition: transform 0.3s ease;
    `;

    document.body.appendChild(toast);

    // Animar entrada
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);

    // Remover después de 3 segundos
    setTimeout(() => {
      toast.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  /**
   * Crear footer de fallback en caso de error
   */
  static createFallbackFooter() {
    if (this.config.debug) {
      console.log('🦶 FooterManager: Creando footer de fallback');
    }

    const fallbackHTML = `
      <footer style="background: #2d3748; color: white; text-align: center; padding: 2rem;">
        <div>
          <h3>🛒 Caminando.Online</h3>
          <p>Comparamos precios para que ahorres en tus compras</p>
          <p>© 2025 Caminando.Online. Todos los derechos reservados.</p>
        </div>
      </footer>
    `;

    this.insertFooter(fallbackHTML);
  }

  /**
   * Configurar opciones del Footer Manager
   */
  static configure(options = {}) {
    this.config = { ...this.config, ...options };
  }

  /**
   * Destruir footer actual (útil para SPA)
   */
  static destroy() {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.remove();
    }
  }

  /**
   * Recargar footer
   */
  static async reload() {
    this.destroy();
    await this.init();
  }
}

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (FooterManager.config.autoInit) {
      FooterManager.init();
    }
  });
} else {
  // DOM ya está listo
  if (FooterManager.config.autoInit) {
    FooterManager.init();
  }
}

// Exportar para uso global
window.FooterManager = FooterManager;
