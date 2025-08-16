// ===============================================
// STORAGE.JS - Gestión de almacenamiento local
// ===============================================

/**
 * 💾 Gestión de almacenamiento (igual que en legacy)
 */
export const Storage = {

  // ===============================================
  // PRODUCTOS COMPARADOS (sessionStorage)
  // ===============================================
  
  /**
   * Guarda productos para comparar
   */
  guardarProductosComparados(productos) {
    try {
      sessionStorage.setItem("productosComparados", JSON.stringify(productos));
      console.log("💾 Productos guardados:", productos.length);
    } catch (error) {
      console.error("❌ Error guardando productos:", error);
    }
  },

  /**
   * Obtiene productos a comparar
   */
  obtenerProductosComparados() {
    try {
      const productos = sessionStorage.getItem("productosComparados");
      return productos ? JSON.parse(productos) : [];
    } catch (error) {
      console.error("❌ Error obteniendo productos:", error);
      return [];
    }
  },

  /**
   * Guarda supermercados seleccionados
   */
  guardarSupermercados(supermercados) {
    try {
      sessionStorage.setItem("supermercadosSeleccionados", JSON.stringify(supermercados));
      console.log("🏪 Supermercados guardados:", supermercados);
    } catch (error) {
      console.error("❌ Error guardando supermercados:", error);
    }
  },

  /**
   * Obtiene supermercados seleccionados
   */
  obtenerSupermercados() {
    try {
      const supermercados = sessionStorage.getItem("supermercadosSeleccionados");
      return supermercados ? JSON.parse(supermercados) : [];
    } catch (error) {
      console.error("❌ Error obteniendo supermercados:", error);
      return [];
    }
  },

  /**
   * Limpia datos de comparación
   */
  limpiarComparacion() {
    try {
      sessionStorage.removeItem("productosComparados");
      sessionStorage.removeItem("supermercadosSeleccionados");
      console.log("🧹 Datos de comparación limpiados");
    } catch (error) {
      console.error("❌ Error limpiando comparación:", error);
    }
  },

  // ===============================================
  // CONFIGURACIONES USUARIO (localStorage)
  // ===============================================

  /**
   * Guarda configuración del usuario
   */
  guardarConfiguracion(key, value) {
    try {
      localStorage.setItem(`caminando_${key}`, JSON.stringify(value));
    } catch (error) {
      console.error("❌ Error guardando configuración:", error);
    }
  },

  /**
   * Obtiene configuración del usuario
   */
  obtenerConfiguracion(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(`caminando_${key}`);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error("❌ Error obteniendo configuración:", error);
      return defaultValue;
    }
  },

  /**
   * Elimina configuración del usuario
   */
  eliminarConfiguracion(key) {
    try {
      localStorage.removeItem(`caminando_${key}`);
    } catch (error) {
      console.error("❌ Error eliminando configuración:", error);
    }
  },

  // ===============================================
  // HISTORIAL DE BÚSQUEDAS
  // ===============================================

  /**
   * Guarda búsqueda en historial
   */
  guardarBusqueda(termino) {
    try {
      let historial = this.obtenerHistorialBusquedas();
      
      // Remover si ya existe para evitar duplicados
      historial = historial.filter(item => item !== termino);
      
      // Agregar al inicio
      historial.unshift(termino);
      
      // Mantener solo los últimos 10
      historial = historial.slice(0, 10);
      
      this.guardarConfiguracion('historial_busquedas', historial);
    } catch (error) {
      console.error("❌ Error guardando búsqueda:", error);
    }
  },

  /**
   * Obtiene historial de búsquedas
   */
  obtenerHistorialBusquedas() {
    return this.obtenerConfiguracion('historial_busquedas', []);
  },

  /**
   * Limpia historial de búsquedas
   */
  limpiarHistorialBusquedas() {
    this.eliminarConfiguracion('historial_busquedas');
  },

  // ===============================================
  // FILTROS GUARDADOS
  // ===============================================

  /**
   * Guarda filtros aplicados
   */
  guardarFiltros(filtros) {
    this.guardarConfiguracion('filtros_aplicados', filtros);
  },

  /**
   * Obtiene filtros guardados
   */
  obtenerFiltros() {
    return this.obtenerConfiguracion('filtros_aplicados', {
      marca: '',
      contenido: '',
      variedad: ''
    });
  },

  // ===============================================
  // ESTADÍSTICAS DE USO
  // ===============================================

  /**
   * Incrementa contador de visitas
   */
  incrementarVisitas() {
    const visitas = this.obtenerConfiguracion('total_visitas', 0);
    this.guardarConfiguracion('total_visitas', visitas + 1);
  },

  /**
   * Guarda estadística de comparación
   */
  guardarEstadisticaComparacion(productos, ahorro) {
    try {
      const estadisticas = this.obtenerConfiguracion('estadisticas_comparaciones', []);
      
      estadisticas.push({
        fecha: new Date().toISOString(),
        productos: productos.length,
        ahorro: ahorro,
        timestamp: Date.now()
      });
      
      // Mantener solo las últimas 50 comparaciones
      const estadisticasLimitadas = estadisticas.slice(-50);
      
      this.guardarConfiguracion('estadisticas_comparaciones', estadisticasLimitadas);
    } catch (error) {
      console.error("❌ Error guardando estadística:", error);
    }
  },

  /**
   * Obtiene estadísticas de comparaciones
   */
  obtenerEstadisticasComparaciones() {
    return this.obtenerConfiguracion('estadisticas_comparaciones', []);
  },

  // ===============================================
  // UTILIDADES
  // ===============================================

  /**
   * Verifica si el navegador soporta localStorage
   */
  soportaLocalStorage() {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Verifica si el navegador soporta sessionStorage
   */
  soportaSessionStorage() {
    try {
      const test = 'test';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Obtiene el tamaño usado en localStorage
   */
  obtenerTamanoUsado() {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      return 0;
    }
  },

  /**
   * Limpia todos los datos de Caminando Online
   */
  limpiarTodosDatos() {
    try {
      // Limpiar sessionStorage
      this.limpiarComparacion();
      
      // Limpiar localStorage específico de Caminando
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('caminando_')) {
          localStorage.removeItem(key);
        }
      });
      
      console.log("🧹 Todos los datos limpiados");
    } catch (error) {
      console.error("❌ Error limpiando datos:", error);
    }
  }
};