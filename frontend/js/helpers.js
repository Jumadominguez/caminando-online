// js/helpers.js - Funciones auxiliares para Caminando Online

/**
 * Renderiza los botones de supermercados
 */
export function renderSupermercadoButtons(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const supermercados = [
    { nombre: 'Carrefour', logo: '/assets/img/logos/carrefour_logo.png' },
    { nombre: 'Disco', logo: '/assets/img/logos/disco_logo.png' },
    { nombre: 'Jumbo', logo: '/assets/img/logos/jumbo_logo.png' },
    { nombre: 'Vea', logo: '/assets/img/logos/vea_logo.png' },
    { nombre: 'Día', logo: '/assets/img/logos/día_logo.png' }
  ];

  container.innerHTML = supermercados.map(supermercado => `
    <button class="supermercado-btn" data-supermercado="${supermercado.nombre.toLowerCase()}">
      <img src="${supermercado.logo}" alt="Logo ${supermercado.nombre}" />
    </button>
  `).join('');

  // Agregar event listeners
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.supermercado-btn');
    if (btn) {
      btn.classList.toggle('selected');
      console.log(`Supermercado ${btn.dataset.supermercado} ${btn.classList.contains('selected') ? 'seleccionado' : 'deseleccionado'}`);
    }
  });
}

/**
 * Utilidades generales
 */
export const Utils = {
  /**
   * Debounce function
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
  },

  /**
   * Formatea precio
   */
  formatPrice(price) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  },

  /**
   * Almacenamiento local
   */
  storage: {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('Error guardando en localStorage:', e);
      }
    },

    get(key) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.warn('Error leyendo de localStorage:', e);
        return null;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('Error removiendo de localStorage:', e);
      }
    }
  }
};