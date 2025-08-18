// ===============================================
// SUPERMERCADOS MANAGER - GENERACIÓN DINÁMICA
// ===============================================

/**
 * Módulo responsable de generar toda la sección de supermercados
 * Incluye: estructura HTML, botones, eventos, estados
 */

// ===============================================
// DATOS MOCK DE SUPERMERCADOS
// ===============================================

const SUPERMERCADOS_DATA = [
  {
    id: "carrefour",
    nombre: "Carrefour",
    logo: "/assets/img/logos/carrefour_logo.png",
    activo: true,
    url_base: "https://www.carrefour.com.ar",
    orden: 1
  },
  {
    id: "disco",
    nombre: "Disco", 
    logo: "/assets/img/logos/disco_logo.png",
    activo: true,
    url_base: "https://www.disco.com.ar",
    orden: 2
  },
  {
    id: "jumbo",
    nombre: "Jumbo",
    logo: "/assets/img/logos/jumbo_logo.png", 
    activo: true,
    url_base: "https://www.jumbo.com.ar",
    orden: 3
  },
  {
    id: "dia",
    nombre: "Día",
    logo: "/assets/img/logos/día_logo.png",
    activo: true,
    url_base: "https://diaonline.supermercadosdia.com.ar",
    orden: 4
  },
  {
    id: "vea",
    nombre: "Vea",
    logo: "/assets/img/logos/vea_logo.png",
    activo: true,
    url_base: "https://www.vea.com.ar",
    orden: 5
  }
];

// ===============================================
// CONFIGURACIÓN DEL MÓDULO
// ===============================================

const CONFIG_SUPERMERCADOS = {
  container_id: "supermercados-section",
  titulo: "Elegí tus supermercados",
  min_selecciones: 1,
  max_selecciones: 5,
  clases_css: {
    section: "mb-0",
    container: "container-custom-super", 
    buttons_wrapper: "d-flex flex-wrap justify-content-center gap-3",
    button: "supermercado-btn",
    button_selected: "selected"
  }
};

// Variables del módulo
let supermercadosSeleccionados = [];
let supermercadosContainerElement = null;

// ===============================================
// GENERACIÓN DE HTML
// ===============================================

/**
 * Genera la estructura HTML completa de la sección supermercados
 */
function generarSeccionSupermercados() {
  console.log("🏪 Generando sección de supermercados...");
  
  const section = document.createElement("section");
  section.id = CONFIG_SUPERMERCADOS.container_id;
  section.className = CONFIG_SUPERMERCADOS.clases_css.section;
  
  const container = document.createElement("div");
  container.className = CONFIG_SUPERMERCADOS.clases_css.container;
  
  const titulo = document.createElement("h3");
  titulo.textContent = CONFIG_SUPERMERCADOS.titulo;
  
  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.className = CONFIG_SUPERMERCADOS.clases_css.buttons_wrapper;
  buttonsWrapper.id = "supermercado-buttons";
  
  // Ensamblar estructura
  container.appendChild(titulo);
  container.appendChild(buttonsWrapper);
  section.appendChild(container);
  
  // Generar botones de supermercados
  generarBotonesSupermercados(buttonsWrapper);
  
  console.log("✅ Sección de supermercados generada");
  return section;
}

/**
 * Genera los botones de supermercados dinámicamente
 */
function generarBotonesSupermercados(container) {
  console.log("🔘 Generando botones de supermercados...");
  
  SUPERMERCADOS_DATA
    .filter(supermercado => supermercado.activo)
    .sort((a, b) => a.orden - b.orden)
    .forEach(supermercado => {
      const boton = crearBotonSupermercado(supermercado);
      container.appendChild(boton);
    });
  
  // Notificar estado inicial
  actualizarEstadoVisual();
  notificarCambioSupermercados();
  
  console.log(`✅ ${SUPERMERCADOS_DATA.length} botones generados y seleccionados por defecto`);
}

/**
 * Crea un botón individual de supermercado
 */
function crearBotonSupermercado(supermercado) {
  const button = document.createElement("button");
  button.className = CONFIG_SUPERMERCADOS.clases_css.button;
  button.setAttribute("data-supermercado", supermercado.id);
  button.setAttribute("data-nombre", supermercado.nombre);
  button.setAttribute("data-url", supermercado.url_base);
  
  // Estructura del botón (solo logo, sin nombre)
  button.innerHTML = `
    <img src="${supermercado.logo}" alt="Logo ${supermercado.nombre}" class="supermercado-logo">
  `;
  
  // Seleccionar por defecto
  button.classList.add(CONFIG_SUPERMERCADOS.clases_css.button_selected);
  supermercadosSeleccionados.push(supermercado.id);
  
  // Event listener para selección
  button.addEventListener("click", () => toggleSupermercado(supermercado.id, button));
  
  return button;
}

// ===============================================
// LÓGICA DE SELECCIÓN
// ===============================================

/**
 * Maneja la selección/deselección de supermercados
 */
function toggleSupermercado(supermercadoId, buttonElement) {
  console.log(`🎯 Toggle supermercado: ${supermercadoId}`);
  
  const yaSeleccionado = supermercadosSeleccionados.includes(supermercadoId);
  
  if (yaSeleccionado) {
    // Deseleccionar
    supermercadosSeleccionados = supermercadosSeleccionados.filter(id => id !== supermercadoId);
    buttonElement.classList.remove(CONFIG_SUPERMERCADOS.clases_css.button_selected);
    
    console.log(`❌ ${supermercadoId} deseleccionado`);
  } else {
    // Verificar límite máximo
    if (supermercadosSeleccionados.length >= CONFIG_SUPERMERCADOS.max_selecciones) {
      alert(`Máximo ${CONFIG_SUPERMERCADOS.max_selecciones} supermercados permitidos`);
      return;
    }
    
    // Seleccionar
    supermercadosSeleccionados.push(supermercadoId);
    buttonElement.classList.add(CONFIG_SUPERMERCADOS.clases_css.button_selected);
    
    console.log(`✅ ${supermercadoId} seleccionado`);
  }
  
  // Notificar cambio de estado
  notificarCambioSupermercados();
  
  // Actualizar estado visual
  actualizarEstadoVisual();
}

/**
 * Actualiza el estado visual de la sección
 */
function actualizarEstadoVisual() {
  const cantidadSeleccionados = supermercadosSeleccionados.length;
  
  // Aquí se puede agregar lógica visual adicional
  // Por ejemplo: mostrar contador, cambiar colores, etc.
  
  console.log(`📊 Supermercados seleccionados: ${cantidadSeleccionados}`);
}

/**
 * Notifica cambios en la selección a otros módulos
 */
function notificarCambioSupermercados() {
  const evento = new CustomEvent('supermercadosCambiados', {
    detail: {
      seleccionados: [...supermercadosSeleccionados],
      cantidad: supermercadosSeleccionados.length,
      data: supermercadosSeleccionados.map(id => 
        SUPERMERCADOS_DATA.find(s => s.id === id)
      ).filter(Boolean)
    }
  });
  
  document.dispatchEvent(evento);
  
  console.log("📡 Evento supermercadosCambiados disparado");
}

// ===============================================
// GESTIÓN DE ESTADO
// ===============================================

/**
 * Obtiene los supermercados actualmente seleccionados
 */
function obtenerSupermercadosSeleccionados() {
  return {
    ids: [...supermercadosSeleccionados],
    cantidad: supermercadosSeleccionados.length,
    data: supermercadosSeleccionados.map(id => 
      SUPERMERCADOS_DATA.find(s => s.id === id)
    ).filter(Boolean)
  };
}

/**
 * Establece supermercados como seleccionados (para restaurar estado)
 */
function establecerSupermercadosSeleccionados(idsSupermercados) {
  console.log("🔄 Restaurando supermercados seleccionados...");
  
  // Limpiar selección actual
  limpiarSeleccion();
  
  // Aplicar nueva selección
  idsSupermercados.forEach(id => {
    if (SUPERMERCADOS_DATA.find(s => s.id === id)) {
      const button = document.querySelector(`[data-supermercado="${id}"]`);
      if (button) {
        supermercadosSeleccionados.push(id);
        button.classList.add(CONFIG_SUPERMERCADOS.clases_css.button_selected);
      }
    }
  });
  
  actualizarEstadoVisual();
  notificarCambioSupermercados();
  
  console.log(`✅ ${supermercadosSeleccionados.length} supermercados restaurados`);
}

/**
 * Limpia toda la selección de supermercados
 */
function limpiarSeleccion() {
  console.log("🧹 Limpiando selección de supermercados...");
  
  // Limpiar estado
  supermercadosSeleccionados = [];
  
  // Limpiar visual
  const botones = document.querySelectorAll(`.${CONFIG_SUPERMERCADOS.clases_css.button}`);
  botones.forEach(btn => btn.classList.remove(CONFIG_SUPERMERCADOS.clases_css.button_selected));
  
  actualizarEstadoVisual();
  notificarCambioSupermercados();
  
  console.log("✅ Selección limpiada");
}

/**
 * Valida que hay suficientes supermercados seleccionados
 */
function validarSeleccion() {
  const esValido = supermercadosSeleccionados.length >= CONFIG_SUPERMERCADOS.min_selecciones;
  
  return {
    valido: esValido,
    mensaje: esValido ? 
      "Selección válida" : 
      `Selecciona al menos ${CONFIG_SUPERMERCADOS.min_selecciones} supermercado(s)`
  };
}

// ===============================================
// INICIALIZACIÓN Y RENDERIZADO
// ===============================================

/**
 * Inicializa el módulo de supermercados
 */
function inicializarSupermercados() {
  console.log("🚀 Inicializando SupermercadosManager...");
  
  // Configurar event listeners globales si es necesario
  configurarEventListeners();
  
  console.log("✅ SupermercadosManager inicializado");
}

/**
 * Configura event listeners globales del módulo
 */
function configurarEventListeners() {
  // Event listeners adicionales si son necesarios
  console.log("🔗 Event listeners de supermercados configurados");
}

/**
 * Renderiza la sección de supermercados en un contenedor específico
 */
function renderizarEnContenedor(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`❌ Contenedor ${containerId} no encontrado`);
    return null;
  }
  
  const seccionSupermercados = generarSeccionSupermercados();
  container.appendChild(seccionSupermercados);
  
  supermercadosContainerElement = container;
  
  console.log(`✅ Sección supermercados renderizada en ${containerId}`);
  return seccionSupermercados;
}

// ===============================================
// API PÚBLICA DEL MÓDULO
// ===============================================

window.SupermercadosManager = {
  // Inicialización
  inicializar: inicializarSupermercados,
  
  // Renderizado
  renderizar: renderizarEnContenedor,
  generarSeccion: generarSeccionSupermercados,
  
  // Gestión de estado
  obtenerSeleccionados: obtenerSupermercadosSeleccionados,
  establecerSeleccionados: establecerSupermercadosSeleccionados,
  limpiar: limpiarSeleccion,
  validar: validarSeleccion,
  
  // Datos
  obtenerTodos: () => SUPERMERCADOS_DATA,
  
  // Configuración
  configuracion: CONFIG_SUPERMERCADOS
};

console.log("📦 SupermercadosManager cargado");
