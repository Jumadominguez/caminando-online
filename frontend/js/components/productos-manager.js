// ===============================================
// PRODUCTOS MANAGER - GENERACIÓN DINÁMICA
// ===============================================

/**
 * Módulo responsable de generar toda la sección de productos
 * Incluye: estructura HTML, filtros, tablas, integración con FiltrosManager
 */

// ===============================================
// CONFIGURACIÓN DEL MÓDULO
// ===============================================

const CONFIG_PRODUCTOS = {
  container_id: "productos-section",
  titulo: "📋 Cargá tus productos para comparar",
  placeholder_input: "Escribe un producto",
  clases_css: {
    section: "mb-0 position-relative",
    container: "container-custom-filtro",
    titulo_box: "box-titulo-carga",
    filtros_row: "row g-3 align-items-center mb-3",
    filtros_secundarios_row: "row g-3 mb-3",
    categoria_dropdown: "category-dropdown w-100",
    category_menu: "category-menu",
    comparar_box: "comparar-box"
  }
};

// Variables del módulo
let productosContainerElement = null;
let filtrosManagerIntegrado = false;

// ===============================================
// GENERACIÓN DE ESTRUCTURA HTML
// ===============================================

/**
 * Genera la estructura HTML completa de la sección productos
 */
function generarSeccionProductos() {
  console.log("🛍️ Generando sección de productos...");
  
  const section = document.createElement("section");
  section.id = CONFIG_PRODUCTOS.container_id;
  section.className = CONFIG_PRODUCTOS.clases_css.section;
  
  const container = document.createElement("div");
  container.className = CONFIG_PRODUCTOS.clases_css.container;
  
  // Título de la sección
  const tituloBox = crearTituloBox();
  container.appendChild(tituloBox);
  
  // Filtros principales (categoría + tipo producto)
  const filtrosPrincipales = crearFiltrosPrincipales();
  container.appendChild(filtrosPrincipales);
  
  // Filtros secundarios (marca, contenido, variedad)
  const filtrosSecundarios = crearFiltrosSecundarios();
  container.appendChild(filtrosSecundarios);
  
  // Área para tablas dinámicas
  const areaTablas = crearAreaTablas();
  container.appendChild(areaTablas);
  
  // Botón de comparación
  const compararBox = crearCompararBox();
  container.appendChild(compararBox);
  
  section.appendChild(container);
  
  console.log("✅ Sección de productos generada");
  return section;
}

/**
 * Crea el box del título
 */
function crearTituloBox() {
  const box = document.createElement("div");
  box.className = CONFIG_PRODUCTOS.clases_css.titulo_box;
  box.id = "box-titulo-carga";
  
  const titulo = document.createElement("h4");
  titulo.textContent = CONFIG_PRODUCTOS.titulo;
  
  box.appendChild(titulo);
  return box;
}

/**
 * Crea los filtros principales (categoría + tipo producto)
 */
function crearFiltrosPrincipales() {
  const row = document.createElement("div");
  row.className = CONFIG_PRODUCTOS.clases_css.filtros_row;
  
  // Columna de categorías (input con dropdown)
  const colCategorias = document.createElement("div");
  colCategorias.className = "col-md-6";
  
  const categoryDropdown = document.createElement("div");
  categoryDropdown.className = CONFIG_PRODUCTOS.clases_css.categoria_dropdown;
  
  const inputProducto = document.createElement("input");
  inputProducto.type = "text";
  inputProducto.className = "form-control";
  inputProducto.id = "producto";
  inputProducto.placeholder = CONFIG_PRODUCTOS.placeholder_input;
  inputProducto.autocomplete = "off";
  
  const categoryMenu = document.createElement("div");
  categoryMenu.className = CONFIG_PRODUCTOS.clases_css.category_menu;
  categoryMenu.id = "categoryMenu";
  
  categoryDropdown.appendChild(inputProducto);
  categoryDropdown.appendChild(categoryMenu);
  colCategorias.appendChild(categoryDropdown);
  
  // Columna de tipo de producto
  const colTipoProducto = document.createElement("div");
  colTipoProducto.className = "col-md-6";
  
  const selectTipoProducto = document.createElement("select");
  selectTipoProducto.className = "form-select w-100";
  selectTipoProducto.id = "tipo-de-producto";
  
  // Comentario para debug
  const comentario = document.createComment("Opciones generadas dinámicamente por FiltrosManager");
  selectTipoProducto.appendChild(comentario);
  
  colTipoProducto.appendChild(selectTipoProducto);
  
  row.appendChild(colCategorias);
  row.appendChild(colTipoProducto);
  
  return row;
}

/**
 * Crea los filtros secundarios (marca, contenido, variedad)
 */
function crearFiltrosSecundarios() {
  const row = document.createElement("div");
  row.className = CONFIG_PRODUCTOS.clases_css.filtros_secundarios_row;
  
  // Filtros secundarios: marca, contenido, variedad
  const filtros = [
    { id: "marca", label: "marca" },
    { id: "contenido", label: "contenido" },
    { id: "variedad", label: "variedad" }
  ];
  
  filtros.forEach(filtro => {
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.id = `${filtro.id}-wrapper`;
    
    const select = document.createElement("select");
    select.className = "form-select";
    select.id = filtro.id;
    
    // Comentario para debug
    const comentario = document.createComment("Opciones generadas dinámicamente por FiltrosManager");
    select.appendChild(comentario);
    
    col.appendChild(select);
    row.appendChild(col);
  });
  
  return row;
}

/**
 * Crea el área donde se insertarán las tablas dinámicamente
 */
function crearAreaTablas() {
  const area = document.createElement("div");
  area.id = "area-tablas-dinamicas";
  area.className = "tablas-container";
  
  // Comentario indicativo
  const comentario = document.createComment("Tablas generadas dinámicamente por FiltrosManager y EventManager");
  area.appendChild(comentario);
  
  return area;
}

/**
 * Crea el box del botón de comparación
 */
function crearCompararBox() {
  const box = document.createElement("div");
  box.id = "comparar-box";
  
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "btn btn-primary comparar-btn";
  boton.innerHTML = "🔍 Comparar productos";
  
  box.appendChild(boton);
  return box;
}

// ===============================================
// INTEGRACIÓN CON FILTROS MANAGER
// ===============================================

/**
 * Integra el FiltrosManager con la sección generada
 */
function integrarFiltrosManager() {
  if (!window.FiltrosManager) {
    console.warn("⚠️ FiltrosManager no está disponible");
    return false;
  }
  
  console.log("🔗 Integrando FiltrosManager...");
  
  try {
    // Inicializar FiltrosManager después de que el DOM esté listo
    window.FiltrosManager.inicializar();
    filtrosManagerIntegrado = true;
    
    console.log("✅ FiltrosManager integrado correctamente");
    return true;
  } catch (error) {
    console.error("❌ Error al integrar FiltrosManager:", error);
    return false;
  }
}

/**
 * Verifica que todos los elementos necesarios para filtros estén presentes
 */
function verificarElementosFiltros() {
  const elementosNecesarios = [
    "producto",
    "categoryMenu", 
    "tipo-de-producto",
    "marca",
    "contenido",
    "variedad",
    "marca-wrapper",
    "contenido-wrapper",
    "variedad-wrapper"
  ];
  
  const elementosFaltantes = elementosNecesarios.filter(id => !document.getElementById(id));
  
  if (elementosFaltantes.length > 0) {
    console.error("❌ Elementos faltantes para filtros:", elementosFaltantes);
    return false;
  }
  
  console.log("✅ Todos los elementos de filtros están presentes");
  return true;
}

// ===============================================
// GESTIÓN DE EVENTOS
// ===============================================

/**
 * Configura los event listeners específicos de productos
 */
function configurarEventListeners() {
  console.log("🔗 Configurando event listeners de productos...");
  
  // Event listener para cambios en filtros
  document.addEventListener('filtrosCambiados', manejarCambioFiltros);
  
  // Event listener para cambios en supermercados  
  document.addEventListener('supermercadosCambiados', manejarCambioSupermercados);
  
  console.log("✅ Event listeners de productos configurados");
}

/**
 * Maneja los cambios en los filtros
 */
function manejarCambioFiltros(event) {
  console.log("🔄 Filtros cambiados:", event.detail);
  
  // Aquí se puede agregar lógica para reaccionar a cambios de filtros
  // Por ejemplo: actualizar tablas, validar selecciones, etc.
}

/**
 * Maneja los cambios en los supermercados seleccionados
 */
function manejarCambioSupermercados(event) {
  console.log("🔄 Supermercados cambiados:", event.detail);
  
  // Aquí se puede agregar lógica para reaccionar a cambios de supermercados
  // Por ejemplo: habilitar/deshabilitar filtros, actualizar disponibilidad, etc.
}

// ===============================================
// VALIDACIONES
// ===============================================

/**
 * Valida que la sección de productos esté lista para usar
 */
function validarSeccionProductos() {
  const validaciones = [
    {
      nombre: "Elementos DOM",
      valido: verificarElementosFiltros()
    },
    {
      nombre: "FiltrosManager",
      valido: filtrosManagerIntegrado
    },
    {
      nombre: "EventManager", 
      valido: !!window.EventManager
    }
  ];
  
  const validacionesFallidas = validaciones.filter(v => !v.valido);
  
  if (validacionesFallidas.length > 0) {
    console.warn("⚠️ Validaciones fallidas:", validacionesFallidas.map(v => v.nombre));
    return false;
  }
  
  console.log("✅ Todas las validaciones pasaron");
  return true;
}

// ===============================================
// INICIALIZACIÓN Y RENDERIZADO
// ===============================================

/**
 * Inicializa el módulo de productos
 */
function inicializarProductos() {
  console.log("🚀 Inicializando ProductosManager...");
  
  // Configurar event listeners
  configurarEventListeners();
  
  console.log("✅ ProductosManager inicializado");
}

/**
 * Renderiza la sección de productos en un contenedor específico
 */
function renderizarEnContenedor(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`❌ Contenedor ${containerId} no encontrado`);
    return null;
  }
  
  const seccionProductos = generarSeccionProductos();
  container.appendChild(seccionProductos);
  
  productosContainerElement = container;
  
  // Integrar FiltrosManager después de renderizar
  setTimeout(() => {
    integrarFiltrosManager();
    
    // También integrar EventManager para que reconozca los nuevos elementos
    if (window.EventManager) {
      console.log("🔗 Re-inicializando EventManager para nuevos elementos...");
      window.EventManager.inicializar();
    }
    
    // Validar que todo esté correcto
    validarSeccionProductos();
  }, 100);
  
  console.log(`✅ Sección productos renderizada en ${containerId}`);
  return seccionProductos;
}

/**
 * Renderiza tanto supermercados como productos (método de conveniencia)
 */
function renderizarSeccionCompleta(containerId) {
  if (!window.SupermercadosManager) {
    console.error("❌ SupermercadosManager no está disponible");
    return null;
  }
  
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`❌ Contenedor ${containerId} no encontrado`);
    return null;
  }
  
  // Renderizar supermercados
  window.SupermercadosManager.renderizar(containerId);
  
  // Renderizar productos
  renderizarEnContenedor(containerId);
  
  console.log("✅ Sección completa renderizada");
  return container;
}

// ===============================================
// API PÚBLICA DEL MÓDULO
// ===============================================

window.ProductosManager = {
  // Inicialización
  inicializar: inicializarProductos,
  
  // Renderizado
  renderizar: renderizarEnContenedor,
  renderizarCompleto: renderizarSeccionCompleta,
  generarSeccion: generarSeccionProductos,
  
  // Integración
  integrarFiltros: integrarFiltrosManager,
  
  // Validaciones
  validar: validarSeccionProductos,
  verificarElementos: verificarElementosFiltros,
  
  // Estado
  estaIntegrado: () => filtrosManagerIntegrado,
  
  // Configuración
  configuracion: CONFIG_PRODUCTOS
};

console.log("📦 ProductosManager cargado");
