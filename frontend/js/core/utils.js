// ===============================================
// UTILS.JS - Utilidades centrales del proyecto
// ===============================================

/**
 * 🔧 Utilidades generales
 */
export const Utils = {
  
  /**
   * Muestra un mensaje temporal
   */
  showMessage(mensaje, tipo = "info", duracion = 3000) {
    // Crear toast o alert temporal (igual que en legacy)
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 350px;';
    alertDiv.innerHTML = `
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove después de la duración especificada
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, duracion);
  },

  /**
   * Muestra un error
   */
  showError(mensaje) {
    console.error("❌ Error:", mensaje);
    this.showMessage(mensaje, "danger");
  },

  /**
   * Muestra loading en un botón
   */
  showButtonLoading(buttonId, show = true) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    if (show) {
      button.disabled = true;
      button.dataset.originalText = button.innerHTML;
      button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Cargando...';
    } else {
      button.disabled = false;
      button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
  },

  /**
   * Valida un email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Formatea un precio en pesos argentinos
   */
  formatPrice(price) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  },

  /**
   * Capitaliza la primera letra de cada palabra
   */
  capitalize(str) {
    return str.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  /**
   * Genera un ID único
   */
  generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
  },

  /**
   * Debounce function para optimizar búsquedas
   */
  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  /**
   * Convierte FormData a objeto JavaScript
   */
  formDataToObject(formData) {
    const obj = {};
    for (let [key, value] of formData.entries()) {
      obj[key] = value;
    }
    return obj;
  },

  /**
   * Crea un elemento HTML con clases y contenido
   */
  createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  },

  /**
   * Escapa HTML para prevenir XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Parsea parámetros de URL
   */
  getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (let [key, value] of params.entries()) {
      result[key] = value;
    }
    return result;
  },

  /**
   * Detecta si es mobile
   */
  isMobile() {
    return window.innerWidth <= 768;
  },

  /**
   * Scroll suave a un elemento
   */
  scrollTo(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
      const top = element.offsetTop - offset;
      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    }
  }
};