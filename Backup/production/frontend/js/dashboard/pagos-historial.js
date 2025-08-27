// ===============================================
// PAGOS E HISTORIAL MANAGER - pagos-historial.js
// ===============================================

/**
 * Módulo para gestionar métodos de pago e historial de compras
 * Incluye funcionalidad para mostrar datos en formato horizontal
 */

// ===============================================
// DATOS DE EJEMPLO
// ===============================================

const PAYMENT_METHODS_EJEMPLO = [
  {
    id: 'pm_001',
    tipo: 'tarjeta',
    alias: 'Visa Personal',
    numero: '**** **** **** 1234',
    titular: 'Juan Pérez',
    vencimiento: '12/27',
    banco: 'Santander',
    esPrincipal: true,
    activa: true
  },
  {
    id: 'pm_002',
    tipo: 'mercadopago',
    alias: 'MercadoPago Principal',
    email: 'juan@email.com',
    esPrincipal: false,
    activa: true
  },
  {
    id: 'pm_003',
    tipo: 'modo',
    alias: 'MODO Banco Nación',
    cbu: '****-****-**0001',
    esPrincipal: false,
    activa: true
  }
];

const PURCHASES_EJEMPLO = [
  {
    id: 'pur_001',
    fecha: '2025-08-15',
    supermercados: ['Carrefour', 'Disco'],
    productos: 15,
    total: 45250,
    ahorro: 8300,
    estado: 'entregado',
    metodo_pago: 'Visa Personal'
  },
  {
    id: 'pur_002',
    fecha: '2025-08-12',
    supermercados: ['Jumbo'],
    productos: 8,
    total: 22100,
    ahorro: 3400,
    estado: 'entregado',
    metodo_pago: 'MercadoPago Principal'
  },
  {
    id: 'pur_003',
    fecha: '2025-08-10',
    supermercados: ['Vea', 'Día', 'Disco'],
    productos: 22,
    total: 67890,
    ahorro: 12560,
    estado: 'confirmado',
    metodo_pago: 'Visa Personal'
  },
  {
    id: 'pur_004',
    fecha: '2025-08-08',
    supermercados: ['Carrefour'],
    productos: 5,
    total: 18750,
    ahorro: 2100,
    estado: 'procesando',
    metodo_pago: 'MODO Banco Nación'
  },
  {
    id: 'pur_005',
    fecha: '2025-08-05',
    supermercados: ['Disco', 'Vea'],
    productos: 12,
    total: 35480,
    ahorro: 6200,
    estado: 'entregado',
    metodo_pago: 'MercadoPago Principal'
  }
];

const ESTADISTICAS_EJEMPLO = {
  totalGastado: 189470,
  totalAhorrado: 32560,
  comprasMes: 5,
  promedioAhorro: 17.2
};

// ===============================================
// INICIALIZACIÓN
// ===============================================

/**
 * Inicializa el módulo de pagos e historial
 */
function inicializarPagosHistorial() {
  console.log("💳 Inicializando módulo de pagos e historial...");
  
  // Cargar estadísticas
  cargarEstadisticas();
  
  // Cargar métodos de pago
  cargarMetodosPago();
  
  // Cargar historial de compras
  cargarHistorialCompras();
  
  // Configurar event listeners
  configurarEventListeners();
  
  console.log("✅ Módulo de pagos e historial inicializado");
}

// ===============================================
// ESTADÍSTICAS
// ===============================================

/**
 * Carga las estadísticas de pagos
 */
function cargarEstadisticas() {
  console.log("📊 Cargando estadísticas...");
  
  const stats = ESTADISTICAS_EJEMPLO;
  
  // Actualizar elementos
  actualizarElemento('total-gastado', formatearMoneda(stats.totalGastado));
  actualizarElemento('total-ahorrado', formatearMoneda(stats.totalAhorrado));
  actualizarElemento('compras-mes', stats.comprasMes);
  actualizarElemento('promedio-ahorro', `${stats.promedioAhorro}%`);
  
  console.log("✅ Estadísticas cargadas");
}

// ===============================================
// MÉTODOS DE PAGO
// ===============================================

/**
 * Carga los métodos de pago en formato horizontal
 */
function cargarMetodosPago() {
  console.log("💳 Cargando métodos de pago...");
  
  const container = document.getElementById('payment-methods-list');
  
  if (!container) {
    console.warn("⚠️ Contenedor de métodos de pago no encontrado");
    return;
  }
  
  if (PAYMENT_METHODS_EJEMPLO.length === 0) {
    mostrarEstadoVacio(container, 'metodos-pago');
    return;
  }
  
  // Generar HTML de métodos de pago
  const metodosHTML = PAYMENT_METHODS_EJEMPLO.map(metodo => generarHTMLMetodoPago(metodo)).join('');
  
  container.innerHTML = metodosHTML;
  
  console.log("✅ Métodos de pago cargados");
}

/**
 * Genera HTML para un método de pago
 */
function generarHTMLMetodoPago(metodo) {
  const icono = obtenerIconoMetodoPago(metodo.tipo);
  const descripcion = obtenerDescripcionMetodoPago(metodo);
  const esPrincipalBadge = metodo.esPrincipal ? '<span class="badge bg-primary ms-2">Principal</span>' : '';
  
  return `
    <div class="payment-method-item ${metodo.esPrincipal ? 'is-default' : ''}" data-payment-id="${metodo.id}">
      <div class="payment-method-info">
        <div class="payment-method-icon">
          ${icono}
        </div>
        <div class="payment-method-details">
          <div class="payment-method-name">
            ${metodo.alias}
            ${esPrincipalBadge}
          </div>
          <div class="payment-method-desc">
            ${descripcion}
          </div>
        </div>
      </div>
      <div class="payment-method-actions">
        <button class="btn btn-sm btn-outline-primary" onclick="editarMetodoPago('${metodo.id}')">
          ✏️
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarMetodoPago('${metodo.id}')">
          🗑️
        </button>
      </div>
    </div>
  `;
}

/**
 * Obtiene el icono apropiado para el tipo de método de pago
 */
function obtenerIconoMetodoPago(tipo) {
  switch (tipo) {
    case 'tarjeta':
      return '💳';
    case 'mercadopago':
      return '🔵';
    case 'modo':
      return '🟣';
    default:
      return '💰';
  }
}

/**
 * Obtiene la descripción del método de pago
 */
function obtenerDescripcionMetodoPago(metodo) {
  switch (metodo.tipo) {
    case 'tarjeta':
      return `${metodo.numero} • ${metodo.banco} • Vence ${metodo.vencimiento}`;
    case 'mercadopago':
      return `${metodo.email}`;
    case 'modo':
      return `CBU ${metodo.cbu}`;
    default:
      return 'Método de pago';
  }
}

// ===============================================
// HISTORIAL DE COMPRAS
// ===============================================

/**
 * Carga el historial de compras en formato horizontal
 */
function cargarHistorialCompras() {
  console.log("🛍️ Cargando historial de compras...");
  
  const container = document.getElementById('purchases-list');
  
  if (!container) {
    console.warn("⚠️ Contenedor de historial no encontrado");
    return;
  }
  
  if (PURCHASES_EJEMPLO.length === 0) {
    mostrarEstadoVacio(container, 'historial');
    return;
  }
  
  // Generar HTML del historial
  const historialHTML = PURCHASES_EJEMPLO.map(compra => generarHTMLCompra(compra)).join('');
  
  container.innerHTML = historialHTML;
  
  console.log("✅ Historial de compras cargado");
}

/**
 * Genera HTML para una compra
 */
function generarHTMLCompra(compra) {
  const fechaFormateada = formatearFecha(compra.fecha);
  const supermercadosTexto = compra.supermercados.join(', ');
  const estadoClase = `status-${compra.estado}`;
  const estadoTexto = formatearEstado(compra.estado);
  
  return `
    <div class="purchase-item" data-purchase-id="${compra.id}" onclick="verDetallesCompra('${compra.id}')">
      <div class="purchase-icon">
        🛒
      </div>
      <div class="purchase-info">
        <div class="purchase-title">
          ${compra.productos} productos • ${supermercadosTexto}
        </div>
        <div class="purchase-subtitle">
          ${compra.metodo_pago} • Ahorro: ${formatearMoneda(compra.ahorro)}
        </div>
      </div>
      <div class="purchase-date">
        ${fechaFormateada}
      </div>
      <div class="purchase-amount">
        ${formatearMoneda(compra.total)}
      </div>
      <div class="purchase-status ${estadoClase}">
        ${estadoTexto}
      </div>
    </div>
  `;
}

// ===============================================
// UTILIDADES
// ===============================================

/**
 * Actualiza el contenido de un elemento
 */
function actualizarElemento(id, contenido) {
  const elemento = document.getElementById(id);
  if (elemento) {
    elemento.textContent = contenido;
  }
}

/**
 * Formatea una cantidad como moneda argentina
 */
function formatearMoneda(cantidad) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(cantidad);
}

/**
 * Formatea una fecha
 */
function formatearFecha(fecha) {
  const date = new Date(fecha);
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).format(date);
}

/**
 * Formatea el estado de una compra
 */
function formatearEstado(estado) {
  const estados = {
    'pendiente': 'Pendiente',
    'procesando': 'Procesando',
    'confirmado': 'Confirmado',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado'
  };
  
  return estados[estado] || estado;
}

/**
 * Muestra el estado vacío apropiado
 */
function mostrarEstadoVacio(container, tipo) {
  const estados = {
    'metodos-pago': {
      icono: '💳',
      titulo: 'No hay métodos de pago guardados',
      subtitulo: 'Agregá una tarjeta o cuenta para realizar compras',
      boton: 'Agregar método de pago'
    },
    'historial': {
      icono: '🛍️',
      titulo: 'No hay compras registradas',
      subtitulo: '¡Realizá tu primera compra para ver el historial aquí!',
      boton: 'Comparar productos'
    }
  };
  
  const config = estados[tipo];
  
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">${config.icono}</div>
      <div class="empty-text">
        <div class="empty-title">${config.titulo}</div>
        <div class="empty-subtitle">${config.subtitulo}</div>
      </div>
      <button class="btn btn-outline-primary btn-sm" onclick="${tipo === 'metodos-pago' ? 'abrirModalPago()' : 'irAComparar()'}">
        ${config.boton}
      </button>
    </div>
  `;
}

// ===============================================
// ACCIONES
// ===============================================

/**
 * Edita un método de pago
 */
function editarMetodoPago(id) {
  console.log("✏️ Editando método de pago:", id);
  alert('Función en desarrollo: Editar método de pago');
}

/**
 * Elimina un método de pago
 */
function eliminarMetodoPago(id) {
  console.log("🗑️ Eliminando método de pago:", id);
  if (confirm('¿Estás seguro de que querés eliminar este método de pago?')) {
    alert('Función en desarrollo: Eliminar método de pago');
  }
}

/**
 * Ve los detalles de una compra
 */
function verDetallesCompra(id) {
  console.log("👁️ Viendo detalles de compra:", id);
  alert('Función en desarrollo: Ver detalles de compra');
}

/**
 * Abre el modal de agregar método de pago
 */
function abrirModalPago() {
  const modal = document.getElementById('paymentMethodModal');
  if (modal) {
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  }
}

/**
 * Va a la página de comparar productos
 */
function irAComparar() {
  window.location.href = '/index.html';
}

// ===============================================
// EVENT LISTENERS
// ===============================================

/**
 * Configura los event listeners
 */
function configurarEventListeners() {
  console.log("🔗 Configurando event listeners de pagos...");
  
  // Botón de agregar método de pago
  const addPaymentBtns = document.querySelectorAll('#add-payment-method-btn, #add-first-payment-btn');
  addPaymentBtns.forEach(btn => {
    btn.addEventListener('click', abrirModalPago);
  });
  
  // Formulario de filtros
  const filtersForm = document.getElementById('filters-form');
  if (filtersForm) {
    filtersForm.addEventListener('submit', function(e) {
      e.preventDefault();
      aplicarFiltros();
    });
  }
  
  // Botón de limpiar filtros
  const clearFiltersBtn = document.getElementById('clear-filters-btn');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', limpiarFiltros);
  }
  
  console.log("✅ Event listeners de pagos configurados");
}

/**
 * Aplica filtros al historial
 */
function aplicarFiltros() {
  console.log("🔍 Aplicando filtros...");
  alert('Función en desarrollo: Aplicar filtros');
}

/**
 * Limpia los filtros
 */
function limpiarFiltros() {
  console.log("🧹 Limpiando filtros...");
  const form = document.getElementById('filters-form');
  if (form) {
    form.reset();
  }
}

// ===============================================
// INICIALIZACIÓN AUTOMÁTICA
// ===============================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('💳 DEBUG: Verificando si se debe inicializar pagos-historial...');
  
  // FORZAR INICIALIZACIÓN EN LA PÁGINA DE PAGOS
  if (window.location.pathname.includes('/pagos.html')) {
    console.log('💳 Página de pagos detectada, inicializando mockups...');
    inicializarPagosHistorial();
  } else if (document.getElementById('payment-methods-list') || document.getElementById('purchases-list')) {
    console.log('💳 Elementos encontrados, inicializando...');
    inicializarPagosHistorial();
  } else {
    console.log('⚠️ Elementos no encontrados, no se inicializa pagos-historial');
  }
});

console.log("📦 PagosHistorialManager cargado");
