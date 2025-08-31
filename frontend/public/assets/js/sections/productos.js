// ===============================================
// SECCIÓN PRODUCTOS - SCRIPT COMPLETO CON LIMPIAR FILTROS
// ===============================================

/**
 * Script para la funcionalidad completa de la sección productos
 * - Maneja botones de acción de la sección
 * - Contador de productos agregados
 * - Integración con sistema de supermercados
 * - ✅ FUNCIONALIDAD COMPLETA PARA LIMPIAR FILTROS
 */

// Variables globales
let elementosSeccion = {};
let productosAgregados = [];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  console.log("🛒 Inicializando sección de productos...");
  inicializarSeccionProductos();
});

function inicializarSeccionProductos() {
  obtenerElementosSeccionProductos();
  configurarEventListenersSeccion();
  console.log("✅ Sección de productos inicializada");
}

function obtenerElementosSeccionProductos() {
  elementosSeccion = {
    // Botones principales
    btnLimpiarFiltros: document.getElementById('btn-limpiar-filtros'),
    btnContinuarComparacion: document.getElementById('btn-continuar-comparacion'),
    contadorProductos: document.getElementById('contador-productos'),
    seccionProductos: document.getElementById('seccion-productos'),
    
    // Filtros principales
    inputProducto: document.getElementById('producto'),
    tipoProductoInput: document.getElementById('tipo-de-producto'),
    tipoProductoTrigger: document.getElementById('tipo-de-producto-trigger'),
    
    // Filtros secundarios - inputs ocultos
    marcaInput: document.getElementById('marca'),
    contenidoInput: document.getElementById('contenido'),
    variedadInput: document.getElementById('variedad'),
    
    // Filtros secundarios - triggers
    marcaTrigger: document.getElementById('marca-trigger'),
    contenidoTrigger: document.getElementById('contenido-trigger'),
    variedadTrigger: document.getElementById('variedad-trigger'),
    
    // Filtros secundarios - wrappers
    marcaWrapper: document.getElementById('marca-wrapper'),
    contenidoWrapper: document.getElementById('contenido-wrapper'),
    variedadWrapper: document.getElementById('variedad-wrapper'),
    
    // Contenedor de tabla
    contenedorTabla: document.getElementById('contenedor-tabla-productos'),
    
    // Menú de categorías
    categoryMenu: document.getElementById('categoryMenu')
  };
}

function configurarEventListenersSeccion() {
  if (elementosSeccion.btnLimpiarFiltros) {
    elementosSeccion.btnLimpiarFiltros.addEventListener('click', function() {
      console.log("🧹 Ejecutando limpieza completa de filtros...");
      ejecutarLimpiezaCompleta();
    });
  }
  
  if (elementosSeccion.btnContinuarComparacion) {
    elementosSeccion.btnContinuarComparacion.addEventListener('click', function() {
      console.log("🛒 Continuando a comparación con", productosAgregados.length, "productos");
      // Funcionalidad futura para ir a sección de comparación
      mostrarSeccionComparacion();
    });
  }
}

/**
 * ✅ FUNCIÓN PRINCIPAL DE LIMPIEZA COMPLETA
 * Limpia todos los filtros y resetea la interfaz completamente
 */
function ejecutarLimpiezaCompleta() {
  console.log("🧽 Iniciando limpieza completa de filtros...");
  
  // PASO 1: Limpiar filtro principal (búsqueda de productos)
  limpiarFiltroPrincipal();
  
  // PASO 2: Limpiar tipo de producto
  limpiarTipoProducto();
  
  // PASO 3: Limpiar filtros secundarios
  limpiarFiltrosSecundarios();
  
  // PASO 4: Ocultar y limpiar tabla de productos
  limpiarTablaProductos();
  
  // PASO 5: Resetear contador de productos
  resetearContadorProductos();
  
  // PASO 6: Emitir evento global de reseteo
  document.dispatchEvent(new CustomEvent('filtrosLimpiados', {
    detail: { timestamp: Date.now() }
  }));
  
  console.log("✅ Limpieza completa finalizada");
  
  // Mostrar feedback visual al usuario
  mostrarNotificacionLimpieza();
}

/**
 * Limpia el input de búsqueda principal y oculta el menú de categorías
 */
function limpiarFiltroPrincipal() {
  console.log("🔍 Limpiando filtro principal...");
  
  if (elementosSeccion.inputProducto) {
    elementosSeccion.inputProducto.value = '';
    elementosSeccion.inputProducto.focus();
  }
  
  // Ocultar menú de categorías
  if (elementosSeccion.categoryMenu) {
    elementosSeccion.categoryMenu.style.display = 'none';
    elementosSeccion.categoryMenu.innerHTML = '';
  }
}

/**
 * Resetea el selector de tipo de producto
 */
function limpiarTipoProducto() {
  console.log("🏷️ Limpiando tipo de producto...");
  
  if (elementosSeccion.tipoProductoInput) {
    elementosSeccion.tipoProductoInput.value = '';
  }
  
  if (elementosSeccion.tipoProductoTrigger) {
    const textSpan = elementosSeccion.tipoProductoTrigger.querySelector('.custom-select-text');
    if (textSpan) {
      textSpan.textContent = 'Elegí una opción...';
    }
    
    // Remover clase de seleccionado si existe
    elementosSeccion.tipoProductoTrigger.classList.remove('selected');
  }
}

/**
 * Limpia todos los filtros secundarios (marca, contenido, variedad)
 */
function limpiarFiltrosSecundarios() {
  console.log("🔧 Limpiando filtros secundarios...");
  
  const filtrosSecundarios = [
    {
      input: elementosSeccion.marcaInput,
      trigger: elementosSeccion.marcaTrigger,
      wrapper: elementosSeccion.marcaWrapper,
      nombre: 'marca',
      placeholder: 'Elegí la marca'
    },
    {
      input: elementosSeccion.contenidoInput,
      trigger: elementosSeccion.contenidoTrigger,
      wrapper: elementosSeccion.contenidoWrapper,
      nombre: 'contenido',
      placeholder: 'Elegí el contenido'
    },
    {
      input: elementosSeccion.variedadInput,
      trigger: elementosSeccion.variedadTrigger,
      wrapper: elementosSeccion.variedadWrapper,
      nombre: 'variedad',
      placeholder: 'Elegí la variedad'
    }
  ];
  
  filtrosSecundarios.forEach(filtro => {
    // Limpiar input oculto
    if (filtro.input) {
      filtro.input.value = '';
    }
    
    // Resetear texto del trigger
    if (filtro.trigger) {
      const textSpan = filtro.trigger.querySelector('.custom-select-text');
      if (textSpan) {
        textSpan.textContent = filtro.placeholder;
      }
      
      // Remover clases de estado
      filtro.trigger.classList.remove('selected', 'active');
    }
    
    // Ocultar wrapper del filtro
    if (filtro.wrapper) {
      filtro.wrapper.classList.add('d-none');
    }
    
    console.log(`   ✓ Filtro ${filtro.nombre} limpiado`);
  });
}

/**
 * Oculta y destruye la tabla de productos
 */
function limpiarTablaProductos() {
  console.log("📋 Limpiando tabla de productos...");
  
  // Ocultar contenedor de tabla
  if (elementosSeccion.contenedorTabla) {
    elementosSeccion.contenedorTabla.style.display = 'none';
    elementosSeccion.contenedorTabla.innerHTML = '';
  }
  
  // Llamar a la función de limpieza de tabla si existe
  if (typeof ocultarTablaProductos === 'function') {
    ocultarTablaProductos();
  }
  
  // Limpiar instancia global si existe
  if (typeof tablaProductosInstance !== 'undefined' && tablaProductosInstance) {
    if (typeof tablaProductosInstance.destruir === 'function') {
      tablaProductosInstance.destruir();
    }
    tablaProductosInstance = null;
  }
}

/**
 * Resetea el contador de productos agregados
 */
function resetearContadorProductos() {
  console.log("🔢 Reseteando contador de productos...");
  
  productosAgregados = [];
  actualizarContadorProductos();
}

/**
 * Actualiza el contador de productos en la UI
 */
function actualizarContadorProductos() {
  if (elementosSeccion.contadorProductos) {
    elementosSeccion.contadorProductos.textContent = productosAgregados.length;
  }
  
  if (elementosSeccion.btnContinuarComparacion) {
    elementosSeccion.btnContinuarComparacion.disabled = productosAgregados.length === 0;
    
    // Actualizar texto del botón basado en cantidad
    const btnText = elementosSeccion.btnContinuarComparacion.querySelector('span:not(.badge)');
    if (btnText) {
      if (productosAgregados.length === 0) {
        btnText.textContent = 'Continuar a comparación';
      } else if (productosAgregados.length === 1) {
        btnText.textContent = 'Comparar 1 producto';
      } else {
        btnText.textContent = `Comparar ${productosAgregados.length} productos`;
      }
    }
  }
}

/**
 * Muestra una notificación de confirmación cuando se limpian los filtros
 */
function mostrarNotificacionLimpieza() {
  // Crear notificación temporal
  const toast = document.getElementById('notification-toast');
  const toastMessage = document.getElementById('toast-message');
  
  if (toast && toastMessage) {
    toastMessage.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="fas fa-check-circle text-success me-2"></i>
        <span>Filtros limpiados correctamente</span>
      </div>
    `;
    
    // Mostrar toast usando Bootstrap
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
  } else {
    // Fallback: console log
    console.log("✅ Filtros limpiados correctamente");
  }
}

/**
 * Función para agregar producto desde la tabla (callback)
 */
function agregarProductoALista(idProducto, nombreProducto, skuProducto) {
  console.log(`🛒 Agregando producto a lista: ${nombreProducto} (${skuProducto})`);
  
  // Verificar si ya existe
  const existe = productosAgregados.find(p => p.id === idProducto);
  if (existe) {
    console.log("⚠️ Producto ya agregado:", nombreProducto);
    return false;
  }
  
  // Agregar producto
  productosAgregados.push({
    id: idProducto,
    nombre: nombreProducto,
    sku: skuProducto,
    fechaAgregado: new Date()
  });
  
  // Actualizar contador
  actualizarContadorProductos();
  
  console.log(`✅ Producto agregado. Total: ${productosAgregados.length}`);
  return true;
}

/**
 * Función placeholder para mostrar sección de comparación
 */
function mostrarSeccionComparacion() {
  console.log("🔍 Navegando a sección de comparación...");
  
  const seccionComparacion = document.getElementById('seccion-comparacion');
  if (seccionComparacion) {
    seccionComparacion.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

/**
 * Event listener para productos agregados desde la tabla
 */
document.addEventListener('productoAgregado', function(event) {
  const { id, nombre, sku } = event.detail;
  agregarProductoALista(id, nombre, sku);
});

/**
 * ✅ Event listener para productos quitados desde la tabla
 */
document.addEventListener('productoQuitado', function(event) {
  const { id, nombre, sku } = event.detail;
  console.log(`🗑️ Procesando quitar producto: ${nombre}`);
  
  // Quitar del array de productos agregados
  const indice = productosAgregados.findIndex(p => p.id === id);
  if (indice !== -1) {
    productosAgregados.splice(indice, 1);
    actualizarContadorProductos();
    console.log(`✅ Producto quitado del contador. Total: ${productosAgregados.length}`);
  }
});

/**
 * Event listener para manejar cambios en supermercados seleccionados
 */
document.addEventListener('supermercadosActualizados', function(event) {
  const supermercadosSeleccionados = event.detail.seleccionados || [];
  console.log(`🏪 Supermercados actualizados: ${supermercadosSeleccionados.length} seleccionados`);
  
  // Habilitar/deshabilitar sección de productos basado en selección
  if (elementosSeccion.seccionProductos) {
    if (supermercadosSeleccionados.length === 0) {
      elementosSeccion.seccionProductos.style.opacity = '0.6';
      elementosSeccion.seccionProductos.style.pointerEvents = 'none';
    } else {
      elementosSeccion.seccionProductos.style.opacity = '1';
      elementosSeccion.seccionProductos.style.pointerEvents = 'auto';
    }
  }
});

// ===============================================
// FUNCIONES GLOBALES PARA INTEGRACIÓN
// ===============================================

/**
 * Función global para limpiar filtros (accesible desde otros scripts)
 */
window.limpiarFiltrosProductos = function() {
  ejecutarLimpiezaCompleta();
};

/**
 * Función global para agregar productos (accesible desde tabla-productos.js)
 */
window.notificarProductoAgregado = function(id, nombre, sku) {
  document.dispatchEvent(new CustomEvent('productoAgregado', {
    detail: { id, nombre, sku }
  }));
};

/**
 * ✅ Función global para quitar productos (accesible desde tabla-productos.js)
 */
window.quitarProductoAgregado = function(id, nombre, sku) {
  console.log(`❌ Quitando producto del sistema: ${nombre} (${id})`);
  
  // Quitar del array de productos agregados
  const indice = productosAgregados.findIndex(p => p.id === id);
  if (indice !== -1) {
    productosAgregados.splice(indice, 1);
    actualizarContadorProductos();
    console.log(`✅ Producto quitado. Total restante: ${productosAgregados.length}`);
  } else {
    console.warn(`⚠️ Producto no encontrado en lista: ${nombre}`);
  }
  
  // Emitir evento para notificar otros componentes
  document.dispatchEvent(new CustomEvent('productoQuitado', {
    detail: { id, nombre, sku }
  }));
};

/**
 * Función global para obtener productos agregados
 */
window.obtenerProductosAgregados = function() {
  return [...productosAgregados]; // Retorna copia
};

/**
 * Función global para limpiar solo la lista de productos agregados
 */
window.limpiarListaProductos = function() {
  productosAgregados = [];
  actualizarContadorProductos();
  console.log("🗑️ Lista de productos limpiada");
};

console.log("📦 Script de productos completamente cargado con funcionalidad de limpieza");