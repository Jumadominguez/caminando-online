// ===============================================
// SUPERMERCADOS MANAGER - supermercados-manager.js
// ===============================================

/**
 * Módulo para gestionar conexiones con supermercados
 * Incluye funcionalidad para mostrar estado de conexiones organizadamente
 */

// ===============================================
// DATOS DE EJEMPLO
// ===============================================

const SUPERMERCADOS_DATA = [
  {
    id: 'carrefour',
    nombre: 'Carrefour',
    logo: '/assets/img/logos/carrefour_logo.png',
    url: 'https://www.carrefour.com.ar',
    estado: 'connected',
    ultimaSync: '2025-08-16T10:30:00',
    autoCompra: true,
    promociones: true,
    credenciales: {
      email: 'juan@email.com',
      conectadoDesde: '2025-07-15'
    }
  },
  {
    id: 'disco',
    nombre: 'Disco',
    logo: '/assets/img/logos/disco_logo.png',
    url: 'https://www.disco.com.ar',
    estado: 'connected',
    ultimaSync: '2025-08-16T09:45:00',
    autoCompra: true,
    promociones: true,
    credenciales: {
      email: 'juan@email.com',
      conectadoDesde: '2025-07-20'
    }
  },
  {
    id: 'jumbo',
    nombre: 'Jumbo',
    logo: '/assets/img/logos/jumbo_logo.png',
    url: 'https://www.jumbo.com.ar',
    estado: 'error',
    ultimaSync: '2025-08-14T16:20:00',
    autoCompra: false,
    promociones: false,
    error: 'Credenciales expiradas',
    credenciales: {
      email: 'juan@email.com',
      conectadoDesde: '2025-08-01'
    }
  },
  {
    id: 'vea',
    nombre: 'Vea',
    logo: '/assets/img/logos/vea_logo.png',
    url: 'https://www.vea.com.ar',
    estado: 'disconnected',
    ultimaSync: null,
    autoCompra: false,
    promociones: false
  },
  {
    id: 'dia',
    nombre: 'Día',
    logo: '/assets/img/logos/día_logo.png',
    url: 'https://diaonline.supermercadosdia.com.ar',
    estado: 'disconnected',
    ultimaSync: null,
    autoCompra: false,
    promociones: false
  }
];

const ACTIVIDAD_EJEMPLO = [
  {
    id: 'act_001',
    fecha: '2025-08-16T10:30:00',
    tipo: 'sincronizacion',
    supermercado: 'Carrefour',
    mensaje: 'Sincronización de precios completada',
    estado: 'success'
  },
  {
    id: 'act_002',
    fecha: '2025-08-16T09:45:00',
    tipo: 'sincronizacion',
    supermercado: 'Disco',
    mensaje: 'Promociones actualizadas',
    estado: 'success'
  },
  {
    id: 'act_003',
    fecha: '2025-08-15T18:22:00',
    tipo: 'error',
    supermercado: 'Jumbo',
    mensaje: 'Error de autenticación - Credenciales expiradas',
    estado: 'error'
  },
  {
    id: 'act_004',
    fecha: '2025-08-15T14:15:00',
    tipo: 'conexion',
    supermercado: 'Disco',
    mensaje: 'Cuenta conectada exitosamente',
    estado: 'success'
  },
  {
    id: 'act_005',
    fecha: '2025-08-15T10:00:00',
    tipo: 'compra',
    supermercado: 'Carrefour',
    mensaje: 'Compra automática procesada - $45.250',
    estado: 'success'
  }
];

// ===============================================
// INICIALIZACIÓN
// ===============================================

/**
 * Inicializa el módulo de supermercados
 */
function inicializarSupermercadosManager() {
  console.log("🛒 Inicializando módulo de supermercados...");
  
  // Cargar estadísticas generales
  cargarEstadisticasConexiones();
  
  // Cargar lista de supermercados
  cargarListaSupermercados();
  
  // Cargar actividad reciente
  cargarActividadReciente();
  
  // Configurar event listeners
  configurarEventListeners();
  
  console.log("✅ Módulo de supermercados inicializado");
}

// ===============================================
// ESTADÍSTICAS DE CONEXIONES
// ===============================================

/**
 * Carga las estadísticas de conexiones
 */
function cargarEstadisticasConexiones() {
  console.log("📊 Cargando estadísticas de conexiones...");
  
  const conectados = SUPERMERCADOS_DATA.filter(s => s.estado === 'connected').length;
  const autoCompraActiva = SUPERMERCADOS_DATA.filter(s => s.autoCompra).length;
  const ultimaSync = obtenerUltimaSync();
  
  // Actualizar elementos
  actualizarElemento('connected-count', conectados);
  actualizarElemento('auto-buy-enabled', autoCompraActiva);
  actualizarElemento('last-sync', ultimaSync);
  
  console.log("✅ Estadísticas de conexiones cargadas");
}

/**
 * Obtiene la fecha de la última sincronización
 */
function obtenerUltimaSync() {
  const ultimasSync = SUPERMERCADOS_DATA
    .filter(s => s.ultimaSync)
    .map(s => new Date(s.ultimaSync))
    .sort((a, b) => b - a);
  
  if (ultimasSync.length === 0) {
    return 'Nunca';
  }
  
  const ultima = ultimasSync[0];
  const ahora = new Date();
  const diffMinutos = Math.floor((ahora - ultima) / (1000 * 60));
  
  if (diffMinutos < 60) {
    return `Hace ${diffMinutos} min`;
  } else if (diffMinutos < 1440) {
    const horas = Math.floor(diffMinutos / 60);
    return `Hace ${horas}h`;
  } else {
    const dias = Math.floor(diffMinutos / 1440);
    return `Hace ${dias}d`;
  }
}

// ===============================================
// LISTA DE SUPERMERCADOS
// ===============================================

/**
 * Carga la lista de supermercados con su estado
 */
function cargarListaSupermercados() {
  console.log("🏪 Cargando lista de supermercados...");
  
  const container = document.getElementById('supermarkets-list');
  
  if (!container) {
    console.warn("⚠️ Contenedor de supermercados no encontrado");
    return;
  }
  
  // Generar HTML de supermercados
  const supermercadosHTML = SUPERMERCADOS_DATA.map(supermercado => generarHTMLSupermercado(supermercado)).join('');
  
  container.innerHTML = supermercadosHTML;
  
  console.log("✅ Lista de supermercados cargada");
}

/**
 * Genera HTML para un supermercado
 */
function generarHTMLSupermercado(supermercado) {
  const estadoClase = supermercado.estado;
  const estadoBadge = generarBadgeEstado(supermercado.estado, supermercado.error);
  const ultimaSyncTexto = supermercado.ultimaSync ? formatearFechaRelativa(supermercado.ultimaSync) : 'Nunca';
  const botonAccion = generarBotonAccion(supermercado);
  
  return `
    <div class="supermarket-item ${estadoClase}" data-supermarket-id="${supermercado.id}">
      <div class="supermarket-info">
        <img src="${supermercado.logo}" alt="Logo ${supermercado.nombre}" class="supermarket-logo" />
        <div class="supermarket-details">
          <div class="supermarket-name">${supermercado.nombre}</div>
          <div class="supermarket-status">
            ${estadoBadge}
            <span class="status-text">Última sync: ${ultimaSyncTexto}</span>
          </div>
          <div class="supermarket-features">
            ${supermercado.autoCompra ? '<span class="feature-badge">🤖 Auto-compra</span>' : ''}
            ${supermercado.promociones ? '<span class="feature-badge">🎯 Promociones</span>' : ''}
          </div>
        </div>
      </div>
      <div class="supermarket-actions">
        ${botonAccion}
        ${supermercado.estado === 'connected' ? `
          <button class="btn btn-sm btn-outline-secondary" onclick="sincronizarSupermercado('${supermercado.id}')">
            🔄
          </button>
          <button class="btn btn-sm btn-outline-primary" onclick="configurarSupermercado('${supermercado.id}')">
            ⚙️
          </button>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Genera el badge de estado
 */
function generarBadgeEstado(estado, error = null) {
  switch (estado) {
    case 'connected':
      return '<span class="status-badge status-connected">✓ Conectado</span>';
    case 'disconnected':
      return '<span class="status-badge status-disconnected">○ Desconectado</span>';
    case 'error':
      return `<span class="status-badge status-error">⚠ Error${error ? ': ' + error : ''}</span>`;
    default:
      return '<span class="status-badge">? Desconocido</span>';
  }
}

/**
 * Genera el botón de acción según el estado
 */
function generarBotonAccion(supermercado) {
  switch (supermercado.estado) {
    case 'connected':
      return `
        <button class="btn btn-sm btn-outline-danger" onclick="desconectarSupermercado('${supermercado.id}')">
          🔗
          Desconectar
        </button>
      `;
    case 'disconnected':
      return `
        <button class="btn btn-sm btn-primary" onclick="conectarSupermercado('${supermercado.id}')">
          🔗
          Conectar
        </button>
      `;
    case 'error':
      return `
        <button class="btn btn-sm btn-warning" onclick="reconectarSupermercado('${supermercado.id}')">
          🔄
          Reconectar
        </button>
      `;
    default:
      return '';
  }
}

// ===============================================
// ACTIVIDAD RECIENTE
// ===============================================

/**
 * Carga la actividad reciente
 */
function cargarActividadReciente() {
  console.log("📋 Cargando actividad reciente...");
  
  const container = document.getElementById('activity-log');
  
  if (!container) {
    console.warn("⚠️ Contenedor de actividad no encontrado");
    return;
  }
  
  if (ACTIVIDAD_EJEMPLO.length === 0) {
    mostrarEstadoVacioActividad(container);
    return;
  }
  
  // Generar HTML de actividad
  const actividadHTML = ACTIVIDAD_EJEMPLO.map(actividad => generarHTMLActividad(actividad)).join('');
  
  container.innerHTML = `
    <div class="activity-list">
      ${actividadHTML}
    </div>
  `;
  
  console.log("✅ Actividad reciente cargada");
}

/**
 * Genera HTML para una actividad
 */
function generarHTMLActividad(actividad) {
  const fechaFormateada = formatearFechaRelativa(actividad.fecha);
  const iconoTipo = obtenerIconoTipoActividad(actividad.tipo);
  const claseEstado = actividad.estado === 'error' ? 'text-danger' : 'text-success';
  
  return `
    <div class="activity-item">
      <div class="activity-icon ${claseEstado}">
        ${iconoTipo}
      </div>
      <div class="activity-content">
        <div class="activity-title">${actividad.supermercado}</div>
        <div class="activity-message">${actividad.mensaje}</div>
        <div class="activity-time text-muted">${fechaFormateada}</div>
      </div>
    </div>
  `;
}

/**
 * Obtiene el icono según el tipo de actividad
 */
function obtenerIconoTipoActividad(tipo) {
  switch (tipo) {
    case 'sincronizacion':
      return '🔄';
    case 'conexion':
      return '🔗';
    case 'error':
      return '⚠️';
    case 'compra':
      return '🛒';
    default:
      return 'ℹ️';
  }
}

/**
 * Muestra estado vacío para actividad
 */
function mostrarEstadoVacioActividad(container) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">📋</div>
      <div class="empty-text">
        <div class="empty-title">No hay actividad reciente</div>
        <div class="empty-subtitle">Las conexiones y sincronizaciones aparecerán aquí</div>
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
 * Formatea una fecha de manera relativa
 */
function formatearFechaRelativa(fecha) {
  const date = new Date(fecha);
  const ahora = new Date();
  const diffMinutos = Math.floor((ahora - date) / (1000 * 60));
  
  if (diffMinutos < 1) {
    return 'Ahora';
  } else if (diffMinutos < 60) {
    return `Hace ${diffMinutos} min`;
  } else if (diffMinutos < 1440) {
    const horas = Math.floor(diffMinutos / 60);
    return `Hace ${horas}h`;
  } else {
    const dias = Math.floor(diffMinutos / 1440);
    return `Hace ${dias}d`;
  }
}

// ===============================================
// ACCIONES DE SUPERMERCADOS
// ===============================================

/**
 * Conecta un supermercado
 */
function conectarSupermercado(id) {
  console.log("🔗 Conectando supermercado:", id);
  alert('Función en desarrollo: Conectar supermercado');
}

/**
 * Desconecta un supermercado
 */
function desconectarSupermercado(id) {
  console.log("🔌 Desconectando supermercado:", id);
  if (confirm('¿Estás seguro de que querés desconectar este supermercado?')) {
    alert('Función en desarrollo: Desconectar supermercado');
  }
}

/**
 * Reconecta un supermercado con error
 */
function reconectarSupermercado(id) {
  console.log("🔄 Reconectando supermercado:", id);
  alert('Función en desarrollo: Reconectar supermercado');
}

/**
 * Sincroniza un supermercado
 */
function sincronizarSupermercado(id) {
  console.log("🔄 Sincronizando supermercado:", id);
  alert('Función en desarrollo: Sincronizar supermercado');
}

/**
 * Configura un supermercado
 */
function configurarSupermercado(id) {
  console.log("⚙️ Configurando supermercado:", id);
  alert('Función en desarrollo: Configurar supermercado');
}

// ===============================================
// EVENT LISTENERS
// ===============================================

/**
 * Configura los event listeners
 */
function configurarEventListeners() {
  console.log("🔗 Configurando event listeners de supermercados...");
  console.log("✅ Event listeners de supermercados configurados");
}

// ===============================================
// INICIALIZACIÓN AUTOMÁTICA
// ===============================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // FORZAR INICIALIZACIÓN EN LA PÁGINA DE SUPERMERCADOS
  if (window.location.pathname.includes('/supermercados.html')) {
    console.log('🛍️ Página de supermercados detectada, inicializando mockups...');
    inicializarSupermercadosManager();
  } else if (document.getElementById('supermarkets-list')) {
    inicializarSupermercadosManager();
  }
});

console.log("📦 SupermercadosManager cargado");
