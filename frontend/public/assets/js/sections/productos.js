// ===============================================
// SECCIÓN PRODUCTOS - SCRIPT ESPECÍFICO V2
// ===============================================

/**
 * Script específico para la funcionalidad de la sección productos
 * - Maneja botones de acción de la sección
 * - Contador de productos agregados
 * - Sistema de notificaciones (toasts)
 * - Integración con sistema de supermercados
 */

// ===============================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ===============================================

const ProductosConfig = {
  // Configuración general
  debug: true,
  
  // Configuración de animaciones
  animaciones: {
    duracion_toast: 3000,
    duracion_boton: 1500
  },
  
  // Textos de interfaz
  textos: {
    producto_agregado: 'Producto agregado a tu lista',
    filtros_limpiados: '¡Filtros limpiados!',
    continuar_comparacion: 'Continuando con {count} productos',
    minimo_productos: 'Agregá al menos un producto para continuar'
  }
};

// Variables globales de la sección
let productosAgregados = [];
let elementosSeccion = {};

// ===============================================
// INICIALIZACIÓN DE LA SECCIÓN PRODUCTOS
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log("🛒 Inicializando sección de productos...");
  inicializarSeccionProductos();
});

/**
 * Inicializa todos los componentes de la sección productos
 */
function inicializarSeccionProductos() {
  // Obtener elementos del DOM
  obtenerElementosSeccionProductos();
  
  // Configurar event listeners
  configurarEventListenersSeccion();
  
  // Configurar integración con otros módulos
  configurarIntegraciones();
  
  // Crear estilos dinámicos para toasts
  crearEstilosToasts();
  
  console.log("✅ Sección de productos inicializada");
}

/**
 * Obtiene las referencias a elementos específicos de la sección
 */
function obtenerElementosSeccionProductos() {
  elementosSeccion = {
    // Botones principales de la sección
    btnLimpiarFiltros: document.getElementById('btn-limpiar-filtros'),
    btnContinuarComparacion: document.getElementById('btn-continuar-comparacion'),
    
    // Elementos de UI
    contadorProductos: document.getElementById('contador-productos'),
    seccionProductos: document.getElementById('seccion-productos'),
    
    // Elementos de filtros (para integración)
    filtrosContainer: document.querySelector('.filtros-container'),
    productosTabla: document.querySelector('.productos-tabla')
  };
  
  if (ProductosConfig.debug) {
    console.log("🔍 Elementos de sección productos obtenidos:", Object.keys(elementosSeccion));
  }
}

// ===============================================
// CONFIGURACIÓN DE EVENT LISTENERS
// ===============================================

/**
 * Configura todos los event listeners de la sección
 */
function configurarEventListenersSeccion() {
  // Botón limpiar filtros
  if (elementosSeccion.btnLimpiarFiltros) {
    elementosSeccion.btnLimpiarFiltros.addEventListener('click', manejarLimpiarFiltros);
  }
  
  // Botón continuar a comparación
  if (elementosSeccion.btnContinuarComparacion) {
    elementosSeccion.btnContinuarComparacion.addEventListener('click', manejarContinuarComparacion);
  }
  
  // Event listener para productos agregados (desde filtros-manager)
  document.addEventListener('productoAgregado', manejarProductoAgregado);
  
  // Event listener para cambios de filtros
  document.addEventListener('filtrosCambiados', manejarCambioFiltros);
  
  // Event listener para conexión con supermercados
  document.addEventListener('supermercadosActualizados', manejarCambioSupermercados);
  
  if (ProductosConfig.debug) {
    console.log("🔗 Event listeners de sección configurados");
  }
}

// ===============================================
// MANEJADORES DE EVENTOS PRINCIPALES
// ===============================================

/**
 * Maneja el click en el botón "Limpiar filtros"
 */
function manejarLimpiarFiltros(event) {
  console.log("🧹 Limpiando filtros...");
  
  // Disparar evento para resetear filtros
  document.dispatchEvent(new CustomEvent('resetearFiltros'));
  
  // Resetear contador de productos de esta sección
  productosAgregados = [];
  actualizarContadorProductos();
  
  // Efecto visual en el botón
  aplicarEfectoBoton(event.target, ProductosConfig.textos.filtros_limpiados, 'btn-success');
  
  // Mostrar toast de confirmación
  mostrarToast(ProductosConfig.textos.filtros_limpiados, 'success');
  
  if (ProductosConfig.debug) {
    console.log("✅ Filtros limpiados desde sección productos");
  }
}

/**
 * Maneja el click en el botón "Continuar a comparación"
 */
function manejarContinuarComparacion(event) {
  if (productosAgregados.length === 0) {
    mostrarToast(ProductosConfig.textos.minimo_productos, 'warning');
    
    // Efecto de shake en el botón
    event.target.classList.add('shake-animation');
    setTimeout(() => {
      event.target.classList.remove('shake-animation');
    }, 500);
    
    return;
  }
  
  console.log(`🛒 Continuando a comparación con ${productosAgregados.length} productos`);
  
  // Mostrar mensaje de éxito
  const mensaje = ProductosConfig.textos.continuar_comparacion.replace('{count}', productosAgregados.length);
  mostrarToast(mensaje, 'success');
  
  // Efecto visual en el botón
  aplicarEfectoBoton(event.target, '¡Continuando!', 'btn-success');
  
  // En el futuro: navegar a la sección de comparación
  setTimeout(() => {
    navegarASeccionComparacion();
  }, 1000);
}

/**
 * Maneja cuando se agrega un producto (evento desde filtros-manager)
 */
function manejarProductoAgregado(event) {
  const { index, productoId } = event.detail;
  
  console.log(`➕ Producto agregado: ${productoId}`);
  
  // Verificar si el producto ya existe
  const productoExistente = productosAgregados.find(p => p.id === productoId);
  if (productoExistente) {
    console.log("⚠️ Producto ya existe en la lista");
    return;
  }
  
  // Agregar a la lista
  productosAgregados.push({
    id: productoId,
    index: index,
    timestamp: Date.now()
  });
  
  // Actualizar contador
  actualizarContadorProductos();
  
  // Mostrar toast de confirmación
  mostrarToast(ProductosConfig.textos.producto_agregado, 'success');
  
  // Activar animación del botón continuar si es el primer producto
  if (productosAgregados.length === 1) {
    activarBotonContinuar();
  }
  
  if (ProductosConfig.debug) {
    console.log(`📊 Total productos agregados: ${productosAgregados.length}`, productosAgregados);
  }
}

/**
 * Maneja cambios en los filtros para actualizar la UI
 */
function manejarCambioFiltros(event) {
  const { campo, valor, estadoCompleto } = event.detail;
  
  if (ProductosConfig.debug) {
    console.log(`🎯 Cambio de filtro detectado en sección: ${campo} = ${valor}`);
  }
  
  // Si se resetean los filtros, limpiar productos agregados
  if (campo === 'reset') {
    productosAgregados = [];
    actualizarContadorProductos();
  }
  
  // Agregar efecto visual al contenedor de filtros
  if (elementosSeccion.filtrosContainer) {
    elementosSeccion.filtrosContainer.classList.add('filtros-actualizando');
    setTimeout(() => {
      elementosSeccion.filtrosContainer.classList.remove('filtros-actualizando');
    }, 300);
  }
}

/**
 * Maneja cambios en la selección de supermercados
 */
function manejarCambioSupermercados(event) {
  const { supermercados, total } = event.detail;
  
  console.log(`🏪 Supermercados actualizados: ${total} seleccionados`);
  
  // Si no hay supermercados seleccionados, deshabilitar funcionalidades
  if (total === 0) {
    deshabilitarSeccionProductos();
  } else {
    habilitarSeccionProductos();
  }
}

// ===============================================
// FUNCIONES DE ACTUALIZACIÓN DE UI
// ===============================================

/**
 * Actualiza el contador visual de productos agregados
 */
function actualizarContadorProductos() {
  if (elementosSeccion.contadorProductos) {
    const count = productosAgregados.length;
    elementosSeccion.contadorProductos.textContent = count;
    
    // Efecto de animación al cambiar
    elementosSeccion.contadorProductos.classList.add('contador-update');
    setTimeout(() => {
      elementosSeccion.contadorProductos.classList.remove('contador-update');
    }, 300);
  }
  
  // Actualizar estado del botón continuar
  if (elementosSeccion.btnContinuarComparacion) {
    elementosSeccion.btnContinuarComparacion.disabled = productosAgregados.length === 0;
    
    if (productosAgregados.length > 0) {
      elementosSeccion.btnContinuarComparacion.classList.add('btn-pulse');
    } else {
      elementosSeccion.btnContinuarComparacion.classList.remove('btn-pulse');
    }
  }
}

/**
 * Activa visualmente el botón de continuar
 */
function activarBotonContinuar() {
  if (elementosSeccion.btnContinuarComparacion) {
    elementosSeccion.btnContinuarComparacion.disabled = false;
    elementosSeccion.btnContinuarComparacion.classList.add('btn-pulse');
    
    // Efecto de "glow" temporal
    elementosSeccion.btnContinuarComparacion.classList.add('btn-glow');
    setTimeout(() => {
      elementosSeccion.btnContinuarComparacion.classList.remove('btn-glow');
    }, 2000);
  }
}

/**
 * Aplica un efecto visual temporal a un botón
 */
function aplicarEfectoBoton(boton, textoTemporal, claseExtra) {
  const textoOriginal = boton.innerHTML;
  const clasesOriginales = boton.className;
  
  // Aplicar cambios temporales
  boton.innerHTML = `<i class="fas fa-check"></i> ${textoTemporal}`;
  boton.classList.add(claseExtra);
  boton.disabled = true;
  
  // Restaurar después del tiempo configurado
  setTimeout(() => {
    boton.innerHTML = textoOriginal;
    boton.className = clasesOriginales;
    boton.disabled = false;
  }, ProductosConfig.animaciones.duracion_boton);
}

// ===============================================
// SISTEMA DE NOTIFICACIONES (TOASTS)
// ===============================================

/**
 * Muestra un toast de notificación
 */
function mostrarToast(mensaje, tipo = 'info', duracion = null) {
  const toastDuracion = duracion || ProductosConfig.animaciones.duracion_toast;
  
  // Crear elemento toast
  const toast = document.createElement('div');
  toast.className = `toast-custom toast-${tipo}`;
  
  // Contenido del toast
  const icono = obtenerIconoTipo(tipo);
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas fa-${icono}"></i>
      <span class="toast-message">${mensaje}</span>
      <button class="toast-close" onclick="cerrarToast(this.parentElement)">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  // Agregar al DOM
  document.body.appendChild(toast);
  
  // Mostrar con animación
  setTimeout(() => {
    toast.classList.add('toast-show');
  }, 100);
  
  // Auto-remover después del tiempo especificado
  setTimeout(() => {
    cerrarToast(toast);
  }, toastDuracion);
  
  if (ProductosConfig.debug) {
    console.log(`📢 Toast mostrado [${tipo}]: ${mensaje}`);
  }
}

/**
 * Cierra un toast específico
 */
function cerrarToast(toast) {
  if (!toast || !toast.classList.contains('toast-custom')) return;
  
  toast.classList.add('toast-hide');
  
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}

/**
 * Obtiene el icono apropiado según el tipo de toast
 */
function obtenerIconoTipo(tipo) {
  const iconos = {
    success: 'check-circle',
    warning: 'exclamation-triangle', 
    error: 'exclamation-circle',
    info: 'info-circle'
  };
  
  return iconos[tipo] || iconos.info;
}

// ===============================================
// INTEGRACIÓN CON OTROS MÓDULOS
// ===============================================

/**
 * Configura la integración con otros módulos del sistema
 */
function configurarIntegraciones() {
  // Verificar si hay supermercados seleccionados al cargar
  if (window.SupermercadoSelector) {
    const estadoSupermercados = window.SupermercadoSelector.obtenerSeleccionados();
    if (estadoSupermercados.length === 0) {
      deshabilitarSeccionProductos();
    }
  }
  
  // Configurar callbacks con FiltrosManager si existe
  if (window.FiltrosManager) {
    window.FiltrosManager.configurarCallbacks({
      onProductoAgregado: manejarProductoAgregado,
      onFiltrosCambiados: manejarCambioFiltros
    });
  }
  
  if (ProductosConfig.debug) {
    console.log("🔄 Integraciones con otros módulos configuradas");
  }
}

/**
 * Deshabilita la funcionalidad de la sección cuando no hay supermercados
 */
function deshabilitarSeccionProductos() {
  console.log("⚠️ Deshabilitando sección productos - sin supermercados seleccionados");
  
  if (elementosSeccion.seccionProductos) {
    elementosSeccion.seccionProductos.classList.add('seccion-deshabilitada');
  }
  
  // Mostrar overlay informativo
  mostrarOverlaySupermercados();
}

/**
 * Habilita la funcionalidad de la sección cuando hay supermercados
 */
function habilitarSeccionProductos() {
  console.log("✅ Habilitando sección productos - supermercados seleccionados");
  
  if (elementosSeccion.seccionProductos) {
    elementosSeccion.seccionProductos.classList.remove('seccion-deshabilitada');
  }
  
  // Ocultar overlay informativo
  ocultarOverlaySupermercados();
}

// ===============================================
// NAVEGACIÓN Y FLUJO DE LA APLICACIÓN
// ===============================================

/**
 * Navega a la sección de comparación (futuro)
 */
function navegarASeccionComparacion() {
  console.log("🔄 Navegando a sección de comparación...");
  
  // En el futuro, aquí se implementará la lógica para:
  // 1. Ocultar sección actual
  // 2. Mostrar sección de comparación
  // 3. Pasar datos de productos agregados
  // 4. Actualizar URL/estado de la aplicación
  
  // Por ahora, solo simular
  mostrarToast("Función de comparación en desarrollo", 'info');
}

/**
 * Muestra overlay cuando no hay supermercados seleccionados
 */
function mostrarOverlaySupermercados() {
  let overlay = document.getElementById('overlay-supermercados');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'overlay-supermercados';
    overlay.className = 'overlay-supermercados';
    overlay.innerHTML = `
      <div class="overlay-content">
        <i class="fas fa-store fa-3x"></i>
        <h4>Seleccioná tus supermercados</h4>
        <p>Primero elegí los supermercados donde querés comparar precios</p>
        <button class="btn btn-primary" onclick="scrollToSupermercados()">
          <i class="fas fa-arrow-up"></i>
          Ir a supermercados
        </button>
      </div>
    `;
    
    if (elementosSeccion.seccionProductos) {
      elementosSeccion.seccionProductos.appendChild(overlay);
    }
  }
  
  overlay.classList.add('overlay-show');
}

/**
 * Oculta el overlay de supermercados
 */
function ocultarOverlaySupermercados() {
  const overlay = document.getElementById('overlay-supermercados');
  if (overlay) {
    overlay.classList.remove('overlay-show');
  }
}

/**
 * Scroll suave hacia la sección de supermercados
 */
function scrollToSupermercados() {
  const seccionSupermercados = document.getElementById('seccion-supermercados');
  if (seccionSupermercados) {
    seccionSupermercados.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
}

// ===============================================
// ESTILOS DINÁMICOS Y CSS
// ===============================================

/**
 * Crea estilos CSS dinámicos para toasts y animaciones
 */
function crearEstilosToasts() {
  if (document.getElementById('estilos-productos-dinamicos')) return;
  
  const style = document.createElement('style');
  style.id = 'estilos-productos-dinamicos';
  style.textContent = `
    /* Toasts personalizados */
    .toast-custom {
      position: fixed;
      top: 2rem;
      right: 2rem;
      min-width: 320px;
      max-width: 400px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      z-index: 9999;
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-left: 4px solid;
    }
    
    .toast-custom.toast-show {
      transform: translateX(0);
    }
    
    .toast-custom.toast-hide {
      transform: translateX(100%);
    }
    
    .toast-success {
      border-left-color: #28a745;
    }
    
    .toast-warning {
      border-left-color: #ffc107;
    }
    
    .toast-error {
      border-left-color: #dc3545;
    }
    
    .toast-info {
      border-left-color: #17a2b8;
    }
    
    .toast-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
    }
    
    .toast-content i:first-child {
      font-size: 1.2rem;
      opacity: 0.9;
    }
    
    .toast-success i:first-child {
      color: #28a745;
    }
    
    .toast-warning i:first-child {
      color: #ffc107;
    }
    
    .toast-error i:first-child {
      color: #dc3545;
    }
    
    .toast-info i:first-child {
      color: #17a2b8;
    }
    
    .toast-message {
      flex: 1;
      font-weight: 500;
      color: #333;
    }
    
    .toast-close {
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: all 0.2s;
    }
    
    .toast-close:hover {
      background: rgba(0,0,0,0.1);
      color: #666;
    }
    
    /* Animaciones para botones */
    .btn-glow {
      animation: glow 2s ease-in-out;
    }
    
    @keyframes glow {
      0%, 100% {
        box-shadow: 0 0 5px rgba(255, 107, 53, 0.5);
      }
      50% {
        box-shadow: 0 0 20px rgba(255, 107, 53, 0.8);
      }
    }
    
    .shake-animation {
      animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
      0%, 100% {
        transform: translateX(0);
      }
      25% {
        transform: translateX(-5px);
      }
      75% {
        transform: translateX(5px);
      }
    }
    
    .contador-update {
      animation: counter-bounce 0.3s ease;
    }
    
    @keyframes counter-bounce {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
    }
    
    /* Efectos para filtros */
    .filtros-actualizando {
      position: relative;
    }
    
    .filtros-actualizando::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
      animation: loading-bar 0.6s ease;
    }
    
    @keyframes loading-bar {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(100%);
      }
    }
    
    /* Overlay para supermercados */
    .overlay-supermercados {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 100;
    }
    
    .overlay-supermercados.overlay-show {
      opacity: 1;
      visibility: visible;
    }
    
    .overlay-content {
      text-align: center;
      padding: 3rem 2rem;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      max-width: 400px;
    }
    
    .overlay-content i {
      color: var(--primary-color);
      margin-bottom: 1.5rem;
    }
    
    .overlay-content h4 {
      color: var(--text-dark);
      margin-bottom: 1rem;
      font-weight: 600;
    }
    
    .overlay-content p {
      color: var(--text-light);
      margin-bottom: 2rem;
    }
    
    /* Sección deshabilitada */
    .seccion-deshabilitada {
      position: relative;
      pointer-events: none;
      opacity: 0.7;
    }
    
    .seccion-deshabilitada .filtros-container,
    .seccion-deshabilitada .productos-tabla {
      filter: blur(1px);
    }
    
    /* Responsive para toasts */
    @media (max-width: 768px) {
      .toast-custom {
        left: 1rem;
        right: 1rem;
        min-width: auto;
        max-width: none;
      }
      
      .overlay-content {
        margin: 1rem;
        padding: 2rem 1.5rem;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// ===============================================
// API PÚBLICA DEL MÓDULO
// ===============================================

/**
 * API pública para interacción con otros módulos
 */
window.SeccionProductos = {
  // Métodos principales
  obtenerProductosAgregados: () => [...productosAgregados],
  limpiarProductosAgregados: () => {
    productosAgregados = [];
    actualizarContadorProductos();
  },
  
  // Notificaciones
  mostrarToast: mostrarToast,
  cerrarToast: cerrarToast,
  
  // Estado de la sección
  estaDeshabilitada: () => elementosSeccion.seccionProductos?.classList.contains('seccion-deshabilitada') || false,
  habilitar: habilitarSeccionProductos,
  deshabilitar: deshabilitarSeccionProductos,
  
  // Navegación
  irAComparacion: navegarASeccionComparacion,
  irASupermercados: scrollToSupermercados,
  
  // Utilidades
  debug: () => ({
    productosAgregados: productosAgregados.length,
    elementos: Object.keys(elementosSeccion),
    configuracion: ProductosConfig
  })
};

// ===============================================
// FUNCIONES GLOBALES EXPUESTAS
// ===============================================

/**
 * Función global para cerrar toasts (llamada desde HTML)
 */
window.cerrarToast = cerrarToast;

/**
 * Función global para scroll a supermercados (llamada desde overlay)
 */
window.scrollToSupermercados = scrollToSupermercados;

console.log("📦 Sección Productos V2 cargada - Funcionalidad específica lista");
