// ===============================================
// SECCIÓN PRODUCTOS - SCRIPT SIMPLIFICADO
// ===============================================

/**
 * Script simplificado para la funcionalidad básica de la sección productos
 * - Maneja botones de acción de la sección
 * - Contador de productos agregados
 * - Integración con sistema de supermercados
 */

// Variables globales simplificadas
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
    btnLimpiarFiltros: document.getElementById('btn-limpiar-filtros'),
    btnContinuarComparacion: document.getElementById('btn-continuar-comparacion'),
    contadorProductos: document.getElementById('contador-productos'),
    seccionProductos: document.getElementById('seccion-productos')
  };
}

function configurarEventListenersSeccion() {
  if (elementosSeccion.btnLimpiarFiltros) {
    elementosSeccion.btnLimpiarFiltros.addEventListener('click', function() {
      console.log("🧹 Limpiando filtros...");
      document.dispatchEvent(new CustomEvent('resetearFiltros'));
      productosAgregados = [];
      actualizarContadorProductos();
    });
  }
  
  if (elementosSeccion.btnContinuarComparacion) {
    elementosSeccion.btnContinuarComparacion.addEventListener('click', function() {
      console.log("🛒 Botón continuar clickeado");
      // Funcionalidad futura
    });
  }
}

function actualizarContadorProductos() {
  if (elementosSeccion.contadorProductos) {
    elementosSeccion.contadorProductos.textContent = productosAgregados.length;
  }
  
  if (elementosSeccion.btnContinuarComparacion) {
    elementosSeccion.btnContinuarComparacion.disabled = productosAgregados.length === 0;
  }
}

console.log("📦 Sección Productos simplificada cargada");
