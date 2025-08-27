// ===============================================
// APP MANAGER - ORQUESTADOR PRINCIPAL
// ===============================================

/**
 * Módulo principal que orquesta toda la aplicación
 * Coordina: SupermercadosManager, ProductosManager, FiltrosManager, EventManager
 */

// ===============================================
// CONFIGURACIÓN DE LA APLICACIÓN
// ===============================================

const CONFIG_APP = {
  contenedor_principal: "app-container",
  orden_carga: [
    "supermercados",
    "productos", 
    "filtros",
    "eventos"
  ],
  modulos_requeridos: [
    "SupermercadosManager",
    "ProductosManager", 
    "FiltrosManager",
    "EventManager",
    "DataManager",
    "AuthManager"
  ],
  tiempos_espera: {
    entre_modulos: 50,
    post_render: 100,
    validacion_final: 200
  }
};

// Estado de la aplicación
let estadoApp = {
  inicializada: false,
  modulosListos: [],
  errores: [],
  tiempoInicio: null,
  tiempoFinalizacion: null
};

// ===============================================
// VERIFICACIÓN DE DEPENDENCIAS
// ===============================================

/**
 * Verifica que todos los módulos requeridos estén disponibles
 */
function verificarDependencias() {
  console.log("🔍 Verificando dependencias de la aplicación...");
  
  const modulosFaltantes = CONFIG_APP.modulos_requeridos.filter(modulo => !window[modulo]);
  
  if (modulosFaltantes.length > 0) {
    console.error("❌ Módulos faltantes:", modulosFaltantes);
    estadoApp.errores.push(`Módulos faltantes: ${modulosFaltantes.join(", ")}`);
    return false;
  }
  
  console.log("✅ Todas las dependencias están disponibles");
  return true;
}

/**
 * Verifica que el contenedor principal exista
 */
function verificarContenedorPrincipal() {
  const container = document.getElementById(CONFIG_APP.contenedor_principal);
  
  if (!container) {
    console.error(`❌ Contenedor principal '${CONFIG_APP.contenedor_principal}' no encontrado`);
    estadoApp.errores.push("Contenedor principal no encontrado");
    return false;
  }
  
  console.log("✅ Contenedor principal encontrado");
  return true;
}

// ===============================================
// INICIALIZACIÓN DE MÓDULOS
// ===============================================

/**
 * Inicializa todos los módulos en el orden correcto
 */
async function inicializarModulos() {
  console.log("🚀 Iniciando secuencia de inicialización de módulos...");
  
  try {
    // 1. Inicializar DataManager
    await inicializarModulo("DataManager");
    
    // 2. Inicializar AuthManager
    await inicializarModulo("AuthManager");
    
    // 3. Inicializar SupermercadosManager
    await inicializarModulo("SupermercadosManager");
    
    // 4. Inicializar ProductosManager
    await inicializarModulo("ProductosManager");
    
    // 5. FiltrosManager se inicializa automáticamente cuando se renderiza ProductosManager
    
    // 6. Inicializar EventManager
    await inicializarModulo("EventManager");
    
    console.log("✅ Todos los módulos inicializados correctamente");
    return true;
    
  } catch (error) {
    console.error("❌ Error durante la inicialización de módulos:", error);
    estadoApp.errores.push(`Error de inicialización: ${error.message}`);
    return false;
  }
}

/**
 * Inicializa un módulo específico
 */
async function inicializarModulo(nombreModulo) {
  console.log(`🔧 Inicializando ${nombreModulo}...`);
  
  const modulo = window[nombreModulo];
  
  if (!modulo) {
    throw new Error(`Módulo ${nombreModulo} no encontrado`);
  }
  
  if (typeof modulo.inicializar === 'function') {
    modulo.inicializar();
  }
  
  estadoApp.modulosListos.push(nombreModulo);
  
  // Esperar un poco entre módulos
  await esperar(CONFIG_APP.tiempos_espera.entre_modulos);
  
  console.log(`✅ ${nombreModulo} inicializado`);
}

// ===============================================
// RENDERIZADO DE LA APLICACIÓN
// ===============================================

/**
 * Renderiza toda la aplicación
 */
async function renderizarAplicacion() {
  console.log("🎨 Iniciando renderizado de la aplicación...");
  
  try {
    // Renderizar sección completa (supermercados + productos)
    const resultado = window.ProductosManager.renderizarSeccionCompleta(CONFIG_APP.contenedor_principal);
    
    if (!resultado) {
      throw new Error("Error al renderizar la sección principal");
    }
    
    // Esperar un poco para que el DOM se estabilice
    await esperar(CONFIG_APP.tiempos_espera.post_render);
    
    console.log("✅ Aplicación renderizada correctamente");
    return true;
    
  } catch (error) {
    console.error("❌ Error durante el renderizado:", error);
    estadoApp.errores.push(`Error de renderizado: ${error.message}`);
    return false;
  }
}

// ===============================================
// VALIDACIÓN FINAL
// ===============================================

/**
 * Realiza validaciones finales de la aplicación
 */
async function validarAplicacionFinal() {
  console.log("🔎 Realizando validaciones finales...");
  
  // Esperar un poco para que todo se estabilice
  await esperar(CONFIG_APP.tiempos_espera.validacion_final);
  
  const validaciones = [
    {
      nombre: "SupermercadosManager",
      test: () => document.getElementById("supermercados-section") !== null
    },
    {
      nombre: "ProductosManager", 
      test: () => document.getElementById("productos-section") !== null
    },
    {
      nombre: "FiltrosManager",
      test: () => window.FiltrosManager && window.ProductosManager.estaIntegrado()
    },
    {
      nombre: "EventManager",
      test: () => window.EventManager !== undefined
    },
    {
      nombre: "Elementos críticos",
      test: () => {
        const elementos = ["producto", "tipo-de-producto", "supermercado-buttons"];
        return elementos.every(id => document.getElementById(id) !== null);
      }
    }
  ];
  
  const validacionesFallidas = validaciones.filter(v => {
    try {
      return !v.test();
    } catch (error) {
      console.error(`Error en validación ${v.nombre}:`, error);
      return true;
    }
  });
  
  if (validacionesFallidas.length > 0) {
    console.warn("⚠️ Validaciones fallidas:", validacionesFallidas.map(v => v.nombre));
    estadoApp.errores.push(`Validaciones fallidas: ${validacionesFallidas.map(v => v.nombre).join(", ")}`);
    return false;
  }
  
  console.log("✅ Todas las validaciones finales pasaron");
  return true;
}

// ===============================================
// GESTIÓN DE ERRORES
// ===============================================

/**
 * Maneja los errores de la aplicación
 */
function manejarErrores() {
  if (estadoApp.errores.length === 0) return;
  
  console.error("❌ Errores encontrados durante la inicialización:");
  estadoApp.errores.forEach((error, index) => {
    console.error(`${index + 1}. ${error}`);
  });
  
  // En desarrollo, mostrar errores al usuario
  const esDesarrollo = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (esDesarrollo) {
    const mensaje = `Errores de inicialización:\n${estadoApp.errores.join('\n')}`;
    console.warn("Mostrando errores en desarrollo:", mensaje);
    // No usar alert() para no interrumpir el desarrollo
  }
}

/**
 * Recuperación de errores críticos
 */
function intentarRecuperacion() {
  console.log("🔄 Intentando recuperación de errores...");
  
  // Estrategias de recuperación
  const estrategias = [
    {
      nombre: "Reintento de inicialización",
      accion: () => {
        setTimeout(() => {
          console.log("🔄 Reintentando inicialización...");
          inicializarAplicacion();
        }, 2000);
      }
    }
  ];
  
  // Por ahora, solo log
  console.log("💡 Estrategias de recuperación disponibles:", estrategias.map(e => e.nombre));
}

// ===============================================
// UTILIDADES
// ===============================================

/**
 * Función de espera (Promise-based)
 */
function esperar(milisegundos) {
  return new Promise(resolve => setTimeout(resolve, milisegundos));
}

/**
 * Calcula estadísticas de rendimiento
 */
function calcularEstadisticas() {
  if (!estadoApp.tiempoInicio || !estadoApp.tiempoFinalizacion) return null;
  
  const tiempoTotal = estadoApp.tiempoFinalizacion - estadoApp.tiempoInicio;
  
  return {
    tiempoTotal: `${tiempoTotal}ms`,
    modulosInicializados: estadoApp.modulosListos.length,
    erroresEncontrados: estadoApp.errores.length,
    estado: estadoApp.inicializada ? "✅ Exitosa" : "❌ Fallida"
  };
}

// ===============================================
// FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
// ===============================================

/**
 * Inicializa completamente la aplicación
 */
async function inicializarAplicacion() {
  console.log("🚀 === INICIANDO CAMINANDO.ONLINE ===");
  
  estadoApp.tiempoInicio = Date.now();
  estadoApp.errores = [];
  estadoApp.modulosListos = [];
  
  try {
    // 1. Verificar dependencias
    if (!verificarDependencias()) {
      throw new Error("Dependencias faltantes");
    }
    
    // 2. Verificar contenedor principal
    if (!verificarContenedorPrincipal()) {
      throw new Error("Contenedor principal no encontrado");
    }
    
    // 3. Inicializar módulos
    const modulosOK = await inicializarModulos();
    if (!modulosOK) {
      throw new Error("Error en inicialización de módulos");
    }
    
    // 4. Renderizar aplicación
    const renderOK = await renderizarAplicacion();
    if (!renderOK) {
      throw new Error("Error en renderizado");
    }
    
    // 5. Validación final
    const validacionOK = await validarAplicacionFinal();
    if (!validacionOK) {
      console.warn("⚠️ Aplicación inicializada con advertencias");
    }
    
    // 6. Marcar como inicializada
    estadoApp.inicializada = true;
    estadoApp.tiempoFinalizacion = Date.now();
    
    // 7. Mostrar estadísticas
    const stats = calcularEstadisticas();
    console.log("📊 Estadísticas de inicialización:", stats);
    
    console.log("🎉 === CAMINANDO.ONLINE INICIALIZADA EXITOSAMENTE ===");
    
  } catch (error) {
    console.error("💥 Error crítico durante la inicialización:", error);
    estadoApp.errores.push(`Error crítico: ${error.message}`);
    estadoApp.tiempoFinalizacion = Date.now();
    
    // Manejar errores
    manejarErrores();
    
    // Intentar recuperación
    intentarRecuperacion();
  }
}

// ===============================================
// API PÚBLICA Y EVENTOS
// ===============================================

/**
 * API pública del AppManager
 */
window.AppManager = {
  // Inicialización
  inicializar: inicializarAplicacion,
  
  // Estado
  obtenerEstado: () => ({ ...estadoApp }),
  estaInicializada: () => estadoApp.inicializada,
  
  // Estadísticas
  obtenerEstadisticas: calcularEstadisticas,
  
  // Configuración
  configuracion: CONFIG_APP,
  
  // Utilidades
  esperar: esperar
};

// Event listener para inicialización automática
document.addEventListener("DOMContentLoaded", () => {
  console.log("📋 DOM cargado, iniciando AppManager...");
  
  // Esperar un poco para que todos los módulos se carguen
  setTimeout(() => {
    inicializarAplicacion();
  }, 100);
});

console.log("📦 AppManager cargado");
