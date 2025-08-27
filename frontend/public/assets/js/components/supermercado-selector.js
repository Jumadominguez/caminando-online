/**
 * ===============================================
 * SUPERMERCADO SELECTOR - COMPONENTE REUTILIZABLE
 * ===============================================
 * 
 * Componente para manejar la selección de supermercados
 * con validación, persistencia y efectos visuales
 */

class SupermercadoSelector {
  /**
   * Constructor del selector de supermercados
   * @param {Object} config - Configuración del componente
   */
  constructor(config = {}) {
    this.config = {
      containerId: 'supermercados-grid',
      storageKey: 'caminando_supermercados_seleccionados',
      minSeleccion: 1,
      maxSeleccion: 5,
      autoSave: true,
      ...config
    };
    
    this.seleccionados = new Set();
    this.container = null;
    this.callbacks = {
      onSelectionChange: [],
      onValidationChange: []
    };
    
    this.inicializar();
  }

  /**
   * Inicializa el componente
   */
  inicializar() {
    console.log('🛒 Inicializando SupermercadoSelector...');
    
    this.container = document.getElementById(this.config.containerId);
    if (!this.container) {
      console.error('❌ Container no encontrado:', this.config.containerId);
      return;
    }
    
    this.cargarSeleccionPersistida();
    this.configurarEventListeners();
    this.actualizarUI();
    
    console.log('✅ SupermercadoSelector inicializado');
  }

  /**
   * Configura los event listeners
   */
  configurarEventListeners() {
    // Click en tarjetas de supermercado
    this.container.addEventListener('click', (event) => {
      const card = event.target.closest('.supermercado-card');
      if (card) {
        this.toggleSupermercado(card, event);
      }
    });

    // Keyboard navigation
    this.container.addEventListener('keydown', (event) => {
      const card = event.target.closest('.supermercado-card');
      if (card && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        this.toggleSupermercado(card, event);
      }
    });

    // Touch events para móviles
    this.container.addEventListener('touchstart', (event) => {
      const card = event.target.closest('.supermercado-card');
      if (card) {
        card.classList.add('touching');
      }
    });

    this.container.addEventListener('touchend', (event) => {
      const card = event.target.closest('.supermercado-card');
      if (card) {
        card.classList.remove('touching');
      }
    });
  }

  /**
   * Toggle de selección de supermercado
   * @param {HTMLElement} card - Elemento de la tarjeta
   * @param {Event} event - Evento del click
   */
  toggleSupermercado(card, event) {
    const supermercadoId = card.dataset.supermercado;
    
    if (!supermercadoId) {
      console.warn('⚠️ ID de supermercado no encontrado');
      return;
    }

    const estaSeleccionado = this.seleccionados.has(supermercadoId);
    
    // Verificar límites antes de seleccionar
    if (!estaSeleccionado && this.seleccionados.size >= this.config.maxSeleccion) {
      this.mostrarNotificacion(
        `Máximo ${this.config.maxSeleccion} supermercados permitidos`,
        'warning'
      );
      return;
    }

    // Realizar toggle
    if (estaSeleccionado) {
      this.deseleccionar(supermercadoId);
    } else {
      this.seleccionar(supermercadoId);
    }

    // Efectos visuales
    this.aplicarEfectoRipple(card, event);
    this.aplicarAnimacionSeleccion(card, !estaSeleccionado);
    
    // Actualizar UI y persistir
    this.actualizarUI();
    if (this.config.autoSave) {
      this.guardarSeleccion();
    }

    // Notificar cambios
    this.notificarCambioSeleccion();
  }

  /**
   * Selecciona un supermercado
   * @param {string} supermercadoId - ID del supermercado
   */
  seleccionar(supermercadoId) {
    this.seleccionados.add(supermercadoId);
    const card = this.obtenerCard(supermercadoId);
    if (card) {
      card.classList.add('seleccionado');
      card.setAttribute('aria-selected', 'true');
    }
    
    console.log(`✅ Supermercado seleccionado: ${supermercadoId}`);
  }

  /**
   * Deselecciona un supermercado
   * @param {string} supermercadoId - ID del supermercado
   */
  deseleccionar(supermercadoId) {
    // Verificar mínimo antes de deseleccionar
    if (this.seleccionados.size <= this.config.minSeleccion && this.seleccionados.has(supermercadoId)) {
      this.mostrarNotificacion(
        `Debe mantener al menos ${this.config.minSeleccion} supermercado seleccionado`,
        'warning'
      );
      return false;
    }

    this.seleccionados.delete(supermercadoId);
    const card = this.obtenerCard(supermercadoId);
    if (card) {
      card.classList.remove('seleccionado');
      card.setAttribute('aria-selected', 'false');
    }
    
    console.log(`❌ Supermercado deseleccionado: ${supermercadoId}`);
    return true;
  }

  /**
   * Obtiene la tarjeta por ID de supermercado
   * @param {string} supermercadoId - ID del supermercado
   * @returns {HTMLElement|null}
   */
  obtenerCard(supermercadoId) {
    return this.container.querySelector(`[data-supermercado="${supermercadoId}"]`);
  }

  /**
   * Actualiza la interfaz de usuario
   */
  actualizarUI() {
    this.actualizarContador();
    this.actualizarValidacion();
    this.actualizarBotones();
  }

  /**
   * Actualiza el contador de seleccionados
   */
  actualizarContador() {
    const contador = document.getElementById('contador-seleccionados');
    if (contador) {
      const numero = this.seleccionados.size;
      if (contador.textContent !== numero.toString()) {
        contador.textContent = numero;
        contador.classList.add('actualizado');
        setTimeout(() => contador.classList.remove('actualizado'), 300);
      }
    }
  }

  /**
   * Actualiza el mensaje de validación
   */
  actualizarValidacion() {
    const validacion = document.getElementById('mensaje-validacion');
    if (!validacion) return;

    const cantidad = this.seleccionados.size;
    let mensaje = '';
    let clase = '';

    if (cantidad === 0) {
      mensaje = 'Seleccioná al menos un supermercado para continuar';
      clase = 'error';
    } else if (cantidad >= this.config.minSeleccion) {
      mensaje = `¡Perfecto! ${cantidad} supermercado${cantidad > 1 ? 's' : ''} seleccionado${cantidad > 1 ? 's' : ''}`;
      clase = 'success';
    }

    const span = validacion.querySelector('span');
    const icon = validacion.querySelector('i');
    
    if (span) span.textContent = mensaje;
    if (icon) {
      icon.className = clase === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle';
    }
    
    validacion.className = `seleccion-validacion ${clase}`;
  }

  /**
   * Actualiza el estado de los botones
   */
  actualizarBotones() {
    const btnContinuar = document.getElementById('btn-continuar-productos');
    const btnLimpiar = document.getElementById('btn-limpiar-seleccion');
    
    const esValido = this.esSeleccionValida();
    
    if (btnContinuar) {
      btnContinuar.disabled = !esValido;
      btnContinuar.classList.toggle('btn-success', esValido);
    }
    
    if (btnLimpiar) {
      btnLimpiar.disabled = this.seleccionados.size === 0;
    }
  }

  /**
   * Verifica si la selección es válida
   * @returns {boolean}
   */
  esSeleccionValida() {
    const cantidad = this.seleccionados.size;
    return cantidad >= this.config.minSeleccion && cantidad <= this.config.maxSeleccion;
  }

  /**
   * Aplica efecto ripple en la tarjeta
   * @param {HTMLElement} card - Tarjeta
   * @param {Event} event - Evento del click
   */
  aplicarEfectoRipple(card, event) {
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = (event.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
    const y = (event.clientY || rect.top + rect.height / 2) - rect.top - size / 2;

    const ripple = document.createElement('div');
    ripple.className = 'supermercado-ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    // Remover ripples anteriores
    const existingRipples = card.querySelectorAll('.supermercado-ripple');
    existingRipples.forEach(r => r.remove());

    card.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }

  /**
   * Aplica animación de selección
   * @param {HTMLElement} card - Tarjeta
   * @param {boolean} seleccionando - Si se está seleccionando o deseleccionando
   */
  aplicarAnimacionSeleccion(card, seleccionando) {
    card.classList.add('selecting');
    setTimeout(() => card.classList.remove('selecting'), 200);
    
    if (seleccionando) {
      card.classList.add('selected-animation');
      setTimeout(() => card.classList.remove('selected-animation'), 400);
    }
  }

  /**
   * Limpia toda la selección
   */
  limpiarSeleccion() {
    const seleccionados = Array.from(this.seleccionados);
    
    // Mantener al menos uno si es requerido
    if (this.config.minSeleccion > 0) {
      seleccionados.slice(1).forEach(id => this.deseleccionar(id));
    } else {
      seleccionados.forEach(id => this.deseleccionar(id));
    }
    
    this.actualizarUI();
    this.guardarSeleccion();
    this.notificarCambioSeleccion();
    
    this.mostrarNotificacion('Selección limpiada', 'info');
  }

  /**
   * Selecciona todos los supermercados (hasta el máximo)
   */
  seleccionarTodos() {
    const cards = Array.from(this.container.querySelectorAll('.supermercado-card'));
    const cantidad = Math.min(cards.length, this.config.maxSeleccion);
    
    cards.slice(0, cantidad).forEach(card => {
      const id = card.dataset.supermercado;
      if (id && !this.seleccionados.has(id)) {
        this.seleccionar(id);
      }
    });
    
    this.actualizarUI();
    this.guardarSeleccion();
    this.notificarCambioSeleccion();
    
    this.mostrarNotificacion(`${cantidad} supermercados seleccionados`, 'success');
  }

  /**
   * Carga la selección persistida desde localStorage
   */
  cargarSeleccionPersistida() {
    try {
      const seleccionados = localStorage.getItem(this.config.storageKey);
      if (seleccionados) {
        const ids = JSON.parse(seleccionados);
        if (Array.isArray(ids)) {
          ids.forEach(id => {
            if (this.obtenerCard(id)) {
              this.seleccionar(id);
            }
          });
          console.log('✅ Selección cargada desde localStorage:', ids);
        }
      }
    } catch (error) {
      console.warn('⚠️ Error cargando selección persistida:', error);
    }
  }

  /**
   * Guarda la selección en localStorage
   */
  guardarSeleccion() {
    try {
      const seleccionados = Array.from(this.seleccionados);
      localStorage.setItem(this.config.storageKey, JSON.stringify(seleccionados));
      console.log('💾 Selección guardada:', seleccionados);
    } catch (error) {
      console.error('❌ Error guardando selección:', error);
    }
  }

  /**
   * Registra callback para cambios de selección
   * @param {Function} callback - Función callback
   */
  onSelectionChange(callback) {
    if (typeof callback === 'function') {
      this.callbacks.onSelectionChange.push(callback);
    }
  }

  /**
   * Registra callback para cambios de validación
   * @param {Function} callback - Función callback
   */
  onValidationChange(callback) {
    if (typeof callback === 'function') {
      this.callbacks.onValidationChange.push(callback);
    }
  }

  /**
   * Notifica cambios en la selección
   */
  notificarCambioSeleccion() {
    const data = {
      seleccionados: Array.from(this.seleccionados),
      cantidad: this.seleccionados.size,
      esValido: this.esSeleccionValida()
    };
    
    this.callbacks.onSelectionChange.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('❌ Error en callback de selección:', error);
      }
    });

    // Evento personalizado
    document.dispatchEvent(new CustomEvent('supermercadoSelectionChanged', {
      detail: data
    }));
  }

  /**
   * Muestra notificación toast
   * @param {string} mensaje - Mensaje a mostrar
   * @param {string} tipo - Tipo de notificación (success, warning, error, info)
   */
  mostrarNotificacion(mensaje, tipo = 'info') {
    const toast = document.getElementById('notification-toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
      toastMessage.textContent = mensaje;
      
      // Remover clases anteriores
      toast.classList.remove('bg-success', 'bg-warning', 'bg-danger', 'bg-info');
      
      // Agregar clase según tipo
      switch (tipo) {
        case 'success':
          toast.classList.add('bg-success', 'text-white');
          break;
        case 'warning':
          toast.classList.add('bg-warning', 'text-dark');
          break;
        case 'error':
          toast.classList.add('bg-danger', 'text-white');
          break;
        default:
          toast.classList.add('bg-info', 'text-white');
      }
      
      const bsToast = new bootstrap.Toast(toast);
      bsToast.show();
    }
  }

  /**
   * Obtiene la selección actual
   * @returns {Array} Array con IDs de supermercados seleccionados
   */
  obtenerSeleccion() {
    return Array.from(this.seleccionados);
  }

  /**
   * Establece una selección específica
   * @param {Array} ids - Array de IDs de supermercados
   */
  establecerSeleccion(ids) {
    // Limpiar selección actual
    this.seleccionados.clear();
    
    // Remover clases de todas las tarjetas
    this.container.querySelectorAll('.supermercado-card').forEach(card => {
      card.classList.remove('seleccionado');
      card.setAttribute('aria-selected', 'false');
    });
    
    // Aplicar nueva selección
    ids.forEach(id => {
      if (this.obtenerCard(id)) {
        this.seleccionar(id);
      }
    });
    
    this.actualizarUI();
    if (this.config.autoSave) {
      this.guardarSeleccion();
    }
    this.notificarCambioSeleccion();
  }

  /**
   * Destruye el componente y limpia listeners
   */
  destruir() {
    if (this.container) {
      this.container.replaceWith(this.container.cloneNode(true));
    }
    this.callbacks = { onSelectionChange: [], onValidationChange: [] };
    console.log('🗑️ SupermercadoSelector destruido');
  }
}

// Exportar para uso global
window.SupermercadoSelector = SupermercadoSelector;