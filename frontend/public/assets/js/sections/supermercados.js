/**
 * ===============================================
 * SECCIÓN SUPERMERCADOS - supermercados.js
 * ===============================================
 * 
 * Maneja la lógica específica de la sección de supermercados
 * Integra el componente SupermercadoSelector con la UI
 */

/**
 * Clase principal para manejar la sección de supermercados
 */
class SeccionSupermercados {
  constructor() {
    this.selector = null;
    this.datos = {
      supermercados: [
        {
          id: 'carrefour',
          nombre: 'Carrefour',
          descripcion: 'Hipermercados y supermercados',
          logo: 'assets/images/logos/carrefour_logo.png',
          activo: true
        },
        {
          id: 'disco',
          nombre: 'Disco',
          descripcion: 'Supermercados premium',
          logo: 'assets/images/logos/disco_logo.png',
          activo: true
        },
        {
          id: 'jumbo',
          nombre: 'Jumbo',
          descripcion: 'Hipermercados',
          logo: 'assets/images/logos/jumbo_logo.png',
          activo: true
        },
        {
          id: 'vea',
          nombre: 'Vea',
          descripcion: 'Supermercados de cercanía',
          logo: 'assets/images/logos/vea_logo.png',
          activo: true
        },
        {
          id: 'dia',
          nombre: 'Día',
          descripcion: 'Supermercados económicos',
          logo: 'assets/images/logos/día_logo.png',
          activo: true
        }
      ]
    };
    
    this.inicializar();
  }

  /**
   * Inicializa la sección
   */
  inicializar() {
    console.log('🛒 Inicializando Sección de Supermercados...');
    
    this.configurarSelector();
    this.configurarBotones();
    this.configurarEventListeners();
    this.aplicarAccesibilidad();
    
    console.log('✅ Sección de Supermercados inicializada');
  }

  /**
   * Configura el selector de supermercados
   */
  configurarSelector() {
    if (typeof SupermercadoSelector !== 'undefined') {
      this.selector = new SupermercadoSelector({
        containerId: 'supermercados-grid',
        storageKey: 'caminando_v2_supermercados',
        minSeleccion: 1,
        maxSeleccion: 5,
        autoSave: true
      });

      // Registrar callbacks
      this.selector.onSelectionChange((data) => {
        this.manejarCambioSeleccion(data);
      });
    } else {
      console.error('❌ SupermercadoSelector no disponible');
    }
  }

  /**
   * Configura los botones de la sección
   */
  configurarBotones() {
    const btnLimpiar = document.getElementById('btn-limpiar-seleccion');
    const btnContinuar = document.getElementById('btn-continuar-productos');

    if (btnLimpiar) {
      btnLimpiar.addEventListener('click', () => {
        this.mostrarConfirmacion(
          '¿Limpiar selección?',
          '¿Estás seguro de que querés limpiar todos los supermercados seleccionados?',
          () => {
            if (this.selector) {
              this.selector.limpiarSeleccion();
            }
          }
        );
      });
    }

    if (btnContinuar) {
      btnContinuar.addEventListener('click', () => {
        this.continuarAProductos();
      });
    }
  }

  /**
   * Configura event listeners adicionales
   */
  configurarEventListeners() {
    // Escuchar eventos personalizados
    document.addEventListener('supermercadoSelectionChanged', (event) => {
      console.log('🔄 Selección cambiada:', event.detail);
    });

    // Atajos de teclado
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + A para seleccionar todos
      if ((event.ctrlKey || event.metaKey) && event.key === 'a' && this.estaEnSeccion()) {
        event.preventDefault();
        if (this.selector) {
          this.selector.seleccionarTodos();
        }
      }

      // Escape para limpiar selección
      if (event.key === 'Escape' && this.estaEnSeccion()) {
        if (this.selector) {
          this.selector.limpiarSeleccion();
        }
      }
    });

    // Monitorear cambios de viewport para responsive
    window.addEventListener('resize', this.debounce(() => {
      this.actualizarResponsive();
    }, 250));
  }

  /**
   * Aplica configuraciones de accesibilidad
   */
  aplicarAccesibilidad() {
    // Configurar ARIA labels
    const grid = document.getElementById('supermercados-grid');
    if (grid) {
      grid.setAttribute('role', 'group');
      grid.setAttribute('aria-label', 'Selección de supermercados');
    }

    // Configurar tarjetas como botones accesibles
    const cards = document.querySelectorAll('.supermercado-card');
    cards.forEach((card, index) => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-selected', 'false');
      card.setAttribute('aria-label', 
        `Seleccionar supermercado ${card.querySelector('.supermercado-nombre')?.textContent || 'desconocido'}`
      );
    });

    // Focus trap en la sección si es necesario
    this.configurarFocusManagement();
  }

  /**
   * Configura manejo del focus
   */
  configurarFocusManagement() {
    const seccion = document.getElementById('seccion-supermercados');
    if (seccion) {
      seccion.addEventListener('focusin', () => {
        console.log('📍 Focus en sección de supermercados');
      });
    }
  }

  /**
   * Maneja cambios en la selección
   * @param {Object} data - Datos de la selección
   */
  manejarCambioSeleccion(data) {
    console.log('🔄 Procesando cambio de selección:', data);
    
    // Actualizar estado de la aplicación
    this.actualizarEstadoGlobal(data);
    
    // Actualizar analytics si está disponible
    this.registrarEventoAnalytics('supermercado_selection_changed', {
      cantidad: data.cantidad,
      supermercados: data.seleccionados,
      es_valido: data.esValido
    });
  }

  /**
   * Actualiza el estado global de la aplicación
   * @param {Object} selectionData - Datos de selección
   */
  actualizarEstadoGlobal(selectionData) {
    // Actualizar estado en localStorage para otras secciones
    try {
      localStorage.setItem('caminando_v2_estado', JSON.stringify({
        seccion_actual: 'supermercados',
        supermercados: selectionData.seleccionados,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.warn('⚠️ No se pudo actualizar el estado global:', error);
    }
  }

  /**
   * Continúa a la sección de productos
   */
  continuarAProductos() {
    if (!this.selector || !this.selector.esSeleccionValida()) {
      this.mostrarNotificacion(
        'Seleccioná al menos un supermercado antes de continuar',
        'warning'
      );
      return;
    }

    const seleccionados = this.selector.obtenerSeleccion();
    console.log('➡️ Continuando a productos con:', seleccionados);

    // Guardar estado antes de continuar
    this.guardarProgreso();

    // Animar transición
    this.animarTransicion();

    // Registrar evento
    this.registrarEventoAnalytics('continue_to_productos', {
      supermercados_seleccionados: seleccionados.length,
      supermercados: seleccionados
    });

    // Scroll a la siguiente sección (temporal - hasta implementar navegación real)
    setTimeout(() => {
      const siguienteSeccion = document.getElementById('seccion-productos');
      if (siguienteSeccion) {
        siguienteSeccion.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 300);
  }

  /**
   * Guarda el progreso de la sección
   */
  guardarProgreso() {
    if (this.selector) {
      const progreso = {
        seccion: 'supermercados',
        completada: true,
        seleccionados: this.selector.obtenerSeleccion(),
        timestamp: new Date().toISOString()
      };

      try {
        localStorage.setItem('caminando_v2_progreso', JSON.stringify(progreso));
        console.log('💾 Progreso guardado:', progreso);
      } catch (error) {
        console.error('❌ Error guardando progreso:', error);
      }
    }
  }

  /**
   * Anima la transición entre secciones
   */
  animarTransicion() {
    const seccionActual = document.getElementById('seccion-supermercados');
    if (seccionActual) {
      seccionActual.style.transition = 'opacity 0.3s ease-out';
      seccionActual.style.opacity = '0.7';
      
      setTimeout(() => {
        seccionActual.style.opacity = '1';
      }, 300);
    }
  }

  /**
   * Verifica si el usuario está en esta sección
   * @returns {boolean}
   */
  estaEnSeccion() {
    const seccion = document.getElementById('seccion-supermercados');
    if (!seccion) return false;

    const rect = seccion.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    return rect.top < viewportHeight * 0.5 && rect.bottom > viewportHeight * 0.5;
  }

  /**
   * Actualiza comportamiento responsive
   */
  actualizarResponsive() {
    const isMobile = window.innerWidth < 768;
    const grid = document.getElementById('supermercados-grid');
    
    if (grid) {
      grid.classList.toggle('mobile-layout', isMobile);
    }
  }

  /**
   * Muestra confirmación con modal personalizado
   * @param {string} titulo - Título del modal
   * @param {string} mensaje - Mensaje del modal
   * @param {Function} onConfirm - Callback de confirmación
   */
  mostrarConfirmacion(titulo, mensaje, onConfirm) {
    // Crear modal dinámico si no existe
    let modal = document.getElementById('confirmacion-modal');
    
    if (!modal) {
      modal = this.crearModalConfirmacion();
    }

    // Actualizar contenido
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const btnConfirmar = modal.querySelector('#btn-confirmar');

    if (modalTitle) modalTitle.textContent = titulo;
    if (modalBody) modalBody.textContent = mensaje;

    // Configurar callback
    const handleConfirm = () => {
      onConfirm();
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) bsModal.hide();
    };

    if (btnConfirmar) {
      btnConfirmar.removeEventListener('click', btnConfirmar._handleConfirm);
      btnConfirmar._handleConfirm = handleConfirm;
      btnConfirmar.addEventListener('click', handleConfirm);
    }

    // Mostrar modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  }

  /**
   * Crea modal de confirmación dinámico
   * @returns {HTMLElement}
   */
  crearModalConfirmacion() {
    const modalHTML = `
      <div class="modal fade" id="confirmacion-modal" tabindex="-1" aria-labelledby="confirmacion-modal-label" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="confirmacion-modal-label">Confirmar acción</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ¿Estás seguro de realizar esta acción?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" id="btn-confirmar">Confirmar</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    return document.getElementById('confirmacion-modal');
  }

  /**
   * Muestra notificación toast
   * @param {string} mensaje - Mensaje a mostrar
   * @param {string} tipo - Tipo de notificación
   */
  mostrarNotificacion(mensaje, tipo = 'info') {
    if (this.selector && typeof this.selector.mostrarNotificacion === 'function') {
      this.selector.mostrarNotificacion(mensaje, tipo);
    } else {
      // Fallback básico
      console.log(`📢 ${tipo.toUpperCase()}: ${mensaje}`);
    }
  }

  /**
   * Registra eventos de analytics
   * @param {string} evento - Nombre del evento
   * @param {Object} datos - Datos del evento
   */
  registrarEventoAnalytics(evento, datos = {}) {
    // Integración con analytics (Google Analytics, etc.)
    if (typeof gtag !== 'undefined') {
      gtag('event', evento, {
        custom_parameter: datos,
        event_category: 'supermercados_selection',
        event_label: 'seccion_supermercados'
      });
    }

    // Log local para desarrollo
    console.log('📊 Analytics:', evento, datos);
  }

  /**
   * Función debounce para optimización
   * @param {Function} func - Función a debounce
   * @param {number} wait - Tiempo de espera
   * @returns {Function}
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Obtiene información de los supermercados seleccionados
   * @returns {Array}
   */
  obtenerSupermercadosSeleccionados() {
    if (!this.selector) return [];
    
    const seleccionados = this.selector.obtenerSeleccion();
    return this.datos.supermercados.filter(s => seleccionados.includes(s.id));
  }

  /**
   * Exporta la selección actual
   * @returns {Object}
   */
  exportarSeleccion() {
    return {
      seleccionados: this.selector ? this.selector.obtenerSeleccion() : [],
      timestamp: new Date().toISOString(),
      version: '2.0'
    };
  }

  /**
   * Importa una selección
   * @param {Object} seleccionData - Datos de selección a importar
   */
  importarSeleccion(seleccionData) {
    if (this.selector && seleccionData.seleccionados) {
      this.selector.establecerSeleccion(seleccionData.seleccionados);
      console.log('📥 Selección importada:', seleccionData);
    }
  }

  /**
   * Resetea la sección a su estado inicial
   */
  resetear() {
    if (this.selector) {
      this.selector.establecerSeleccion([]);
    }
    
    // Limpiar storage
    localStorage.removeItem('caminando_v2_supermercados');
    localStorage.removeItem('caminando_v2_progreso');
    
    console.log('🔄 Sección de supermercados reseteada');
  }

  /**
   * Destruye la instancia y limpia listeners
   */
  destruir() {
    if (this.selector) {
      this.selector.destruir();
    }

    // Remover event listeners
    document.removeEventListener('supermercadoSelectionChanged', this.manejarCambioSeleccion);
    
    console.log('🗑️ Sección de supermercados destruida');
  }
}

/**
 * ===============================================
 * INICIALIZACIÓN AUTOMÁTICA
 * ===============================================
 */

// Variable global para acceso desde otros módulos
window.seccionSupermercados = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Solo inicializar si estamos en la página correcta
  const seccion = document.getElementById('seccion-supermercados');
  
  if (seccion) {
    console.log('🎯 Detectada sección de supermercados, inicializando...');
    
    // Esperar a que SupermercadoSelector esté disponible
    const inicializarCuandoEsteDisponible = () => {
      if (typeof SupermercadoSelector !== 'undefined') {
        window.seccionSupermercados = new SeccionSupermercados();
      } else {
        setTimeout(inicializarCuandoEsteDisponible, 100);
      }
    };
    
    inicializarCuandoEsteDisponible();
  }
});

/**
 * ===============================================
 * UTILIDADES GLOBALES
 * ===============================================
 */

/**
 * Función global para obtener selección desde otros módulos
 * @returns {Array}
 */
window.obtenerSupermercadosSeleccionados = function() {
  return window.seccionSupermercados ? 
    window.seccionSupermercados.obtenerSupermercadosSeleccionados() : 
    [];
};

/**
 * Función global para establecer selección desde otros módulos
 * @param {Array} ids - IDs de supermercados a seleccionar
 */
window.establecerSupermercadosSeleccionados = function(ids) {
  if (window.seccionSupermercados && window.seccionSupermercados.selector) {
    window.seccionSupermercados.selector.establecerSeleccion(ids);
  }
};

console.log('📦 Módulo de Sección Supermercados cargado');