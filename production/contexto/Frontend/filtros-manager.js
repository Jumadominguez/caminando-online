// ===============================================
// FILTROS MANAGER - SISTEMA UNIFICADO DE FILTROS
// ===============================================

/**
 * Módulo que maneja TODOS los filtros de la aplicación de forma centralizada
 * Incluye: Categorías, Tipo de Producto, Marca, Contenido, Variedad
 * Usa datos mock que simulan las respuestas del backend
 */

// ===============================================
// DATOS MOCK - CATEGORÍAS Y SUBCATEGORÍAS
// ===============================================

/**
 * Mock data para categorías principales y sus subcategorías
 * Simula la estructura que vendrá de /api/categorias y /api/subcategorias
 */
const CATEGORIAS_SUBCATEGORIAS_MOCK = [
  {
    id: "alimentos",
    categoria_original: "🍎 Alimentos",
    categoria_normalizada: "alimentos",
    subcategorias: [
      "Leche", "Yogurt", "Queso", "Manteca", "Crema", "Dulce de leche",
      "Agua", "Gaseosas", "Jugos", "Cervezas", "Vinos", "Energizantes",
      "Pollo", "Carne vacuna", "Cerdo", "Pescado", "Embutidos", "Milanesas",
      "Pan", "Facturas", "Galletitas", "Tostadas", "Bizcochos", "Tortas",
      "Tomate", "Lechuga", "Cebolla", "Papa", "Manzana", "Banana",
      "Hamburguesas", "Pizza", "Helados", "Vegetales", "Papas fritas", "Empanadas",
      "Arroz", "Fideos", "Harina", "Aceite", "Azúcar", "Sal"
    ]
  },
  {
    id: "limpieza",
    categoria_original: "🧽 Limpieza y Hogar", 
    categoria_normalizada: "limpieza hogar",
    subcategorias: [
      "Detergente", "Lavandina", "Jabón", "Suavizante", "Desinfectante", "Limpiadores",
      "Papel higiénico", "Servilletas", "Pañuelos", "Rollos de cocina",
      "Vasos", "Platos", "Cubiertos", "Sartenes", "Decoración", "Organizadores"
    ]
  },
  {
    id: "cuidado_personal",
    categoria_original: "🧴 Cuidado Personal",
    categoria_normalizada: "cuidado personal",
    subcategorias: [
      "Shampoo", "Jabón", "Pasta dental", "Desodorante", "Papel higiénico", "Pañales",
      "Crema", "Protector solar", "Maquillaje", "Perfumes", "Afeitadoras"
    ]
  },
  {
    id: "mascotas",
    categoria_original: "🐕 Mascotas",
    categoria_normalizada: "mascotas",
    subcategorias: [
      "Alimento perros", "Alimento gatos", "Arena", "Juguetes", "Correas", "Medicamentos",
      "Snacks", "Camas", "Transportadoras", "Comederos"
    ]
  },
  {
    id: "bebes",
    categoria_original: "👶 Bebés y Niños",
    categoria_normalizada: "bebes ninos",
    subcategorias: [
      "Pañales", "Toallitas", "Leche en polvo", "Papillas", "Chupetes", "Biberones",
      "Juguetes", "Ropa", "Cremas", "Medicamentos"
    ]
  },
  {
    id: "electrodomesticos",
    categoria_original: "⚡ Electrónicos",
    categoria_normalizada: "electronicos",
    subcategorias: [
      "Televisores", "Celulares", "Audífonos", "Cargadores", "Cables", "Parlantes",
      "Licuadoras", "Microondas", "Ventiladores", "Planchas"
    ]
  }
];

/**
 * Datos mock definidos localmente para evitar problemas de importación
 * En el futuro estos vendrán del backend
 */

// Tipos de producto
const TIPOS_PRODUCTO_MOCK = [
  { id: "lacteos", nombre: "Lácteos", categoria: "Alimentos", activo: true, orden: 1 },
  { id: "bebidas", nombre: "Bebidas", categoria: "Alimentos", activo: true, orden: 2 },
  { id: "limpieza", nombre: "Limpieza", categoria: "Hogar", activo: true, orden: 3 },
  { id: "carnes", nombre: "Carnes", categoria: "Alimentos", activo: true, orden: 4 },
  { id: "panaderia", nombre: "Panadería", categoria: "Alimentos", activo: true, orden: 5 },
  { id: "verduras", nombre: "Verduras y Frutas", categoria: "Alimentos", activo: true, orden: 6 },
  { id: "higiene", nombre: "Higiene Personal", categoria: "Cuidado Personal", activo: true, orden: 7 },
  { id: "congelados", nombre: "Congelados", categoria: "Alimentos", activo: true, orden: 8 },
  { id: "mascotas", nombre: "Mascotas", categoria: "Otros", activo: true, orden: 9 },
  { id: "bazar", nombre: "Bazar y Hogar", categoria: "Hogar", activo: true, orden: 10 }
];

// Marcas por tipo
const MARCAS_MOCK = {
  lacteos: ["La Serenísima", "Ilolay", "Sancor", "Milkaut", "Tregar", "Manfrey"],
  bebidas: ["Coca-Cola", "Pepsi", "Sprite", "Fanta", "Quilmes", "Stella Artois"],
  limpieza: ["Ala", "Skip", "Magistral", "Ayudín", "Mr. Músculo", "Cif"],
  carnes: ["Swift", "Quickfood", "Frigorífico", "Paty", "Granja del Sol", "Campo Austral"],
  panaderia: ["Bimbo", "Lactal", "Fargo", "Don Satur", "Bagley", "Terrabusi"],
  verduras: ["Sin marca", "Orgánico", "Campo Fresco", "Natural", "Estación Saludable"],
  higiene: ["Head & Shoulders", "Pantene", "Sedal", "Rexona", "Dove", "Colgate"],
  congelados: ["McCain", "Granja del Sol", "La Paulina", "Bonduelle", "Findus"],
  mascotas: ["Pedigree", "Whiskas", "Pro Plan", "Royal Canin", "Excellent", "Dog Chow"],
  bazar: ["Tramontina", "Tefal", "Pyrex", "Tupperware", "Luminarc", "Vasconia"]
};

// Contenidos por tipo
const CONTENIDOS_MOCK = {
  lacteos: ["1L", "500ml", "200ml", "1kg", "500g", "200g"],
  bebidas: ["500ml", "1L", "1.5L", "2L", "2.5L", "355ml", "473ml"],
  limpieza: ["500ml", "750ml", "1L", "2L", "500g", "1kg", "3kg"],
  carnes: ["1kg", "500g", "250g", "2kg", "1.5kg", "300g"],
  panaderia: ["500g", "750g", "1kg", "400g", "300g", "200g"],
  verduras: ["1kg", "500g", "2kg", "1u", "3u", "6u"],
  higiene: ["400ml", "750ml", "1L", "200ml", "100g", "150g"],
  congelados: ["500g", "1kg", "300g", "400g", "1.5kg", "2kg"],
  mascotas: ["1kg", "3kg", "7.5kg", "15kg", "21kg", "500g"],
  bazar: ["1u", "2u", "4u", "6u", "Set x3", "Set x6"]
};

// Variedades por tipo
const VARIEDADES_MOCK = {
  lacteos: ["Entera", "Descremada", "Semidescremada", "Sin lactosa", "Orgánica", "Clásica"],
  bebidas: ["Original", "Zero", "Light", "Sin azúcar", "Sabor lima", "Sabor naranja"],
  limpieza: ["Clásico", "Concentrado", "Aromático", "Antibacterial", "Para ropa blanca", "Para ropa de color"],
  carnes: ["Fresco", "Congelado", "Marinado", "Sin sal", "Orgánico", "Premium"],
  panaderia: ["Integral", "Blanco", "Salvado", "Sin sal", "Artesanal", "Light"],
  verduras: ["Fresco", "Orgánico", "Hidropónico", "Primera calidad", "Premium"],
  higiene: ["Normal", "Graso", "Seco", "Mixto", "Anticaspa", "Nutritivo"],
  congelados: ["Clásico", "Premium", "Familiar", "Individual", "Light", "Orgánico"],
  mascotas: ["Adulto", "Cachorro", "Senior", "Light", "Premium", "Natural"],
  bazar: ["Acero inoxidable", "Antiadherente", "Vidrio", "Plástico", "Cerámica", "Aluminio"]
};

// ===============================================
// VARIABLES DEL MÓDULO
// ===============================================

// Configuración de textos para la interfaz
const TEXTOS_FILTROS = {
  tipo_producto: "Elegí una opción...",
  marca: "Elegí la marca",
  contenido: "Elegí el contenido",
  variedad: "Elegí la variedad",
  categoria_placeholder: "Escribe un producto"
};

// Configuración de APIs (preparado para el futuro)
const API_CONFIG = {
  base_url: 'http://localhost:3000', // En producción será 'https://api.caminando.online'
  endpoints: {
    tipos_producto: '/api/tipos-producto',
    categorias: '/api/categorias',
    marcas: '/api/marcas',
    contenidos: '/api/contenidos', 
    variedades: '/api/variedades',
    supermercados: '/api/supermercados',
    productos: '/api/productos',
    precios: '/api/precios'
  },
  timeout: 10000,
  retry_attempts: 3
};

// Referencias a elementos del DOM
let productoInput, categoryMenu, tipoProductoSelect;
let marcaSelect, contenidoSelect, variedadSelect;
let marcaWrapper, contenidoWrapper, variedadWrapper;

// Estado del módulo
let filtroActual = {
  categoria: null,
  subcategoria: null,
  tipoProducto: null,
  marca: null,
  contenido: null,
  variedad: null
};

// Configuración
const CONFIG_FILTROS = {
  animacion_duracion: 300,
  delay_busqueda: 300,
  debug_mode: true
};

// ===============================================
// INICIALIZACIÓN DEL MÓDULO
// ===============================================

/**
 * Inicializa todo el sistema de filtros
 */
function inicializarFiltros() {
  console.log("🎯 Iniciando Filtros Manager Unificado...");
  
  // Obtener referencias DOM
  obtenerElementosDOM();
  
  // Inicializar filtros individuales
  inicializarFiltroCategorias();
  inicializarFiltroTipoProducto();
  inicializarFiltrosSecundarios();
  
  // Configurar event listeners
  configurarEventListeners();
  
  // Estado inicial
  establecerEstadoInicial();
  
  console.log("✅ Filtros Manager inicializado completamente");
}

/**
 * Obtiene todas las referencias a elementos del DOM
 */
function obtenerElementosDOM() {
  productoInput = document.getElementById("producto");
  categoryMenu = document.getElementById("categoryMenu");
  
  // Filtro tipo de producto
  tipoProductoSelect = document.getElementById("tipo-de-producto");
  
  // Filtros secundarios
  marcaSelect = document.getElementById("marca");
  contenidoSelect = document.getElementById("contenido");
  variedadSelect = document.getElementById("variedad");
  
  // Wrappers de filtros secundarios
  marcaWrapper = document.getElementById("marca-wrapper");
  contenidoWrapper = document.getElementById("contenido-wrapper");
  variedadWrapper = document.getElementById("variedad-wrapper");
  
  if (CONFIG_FILTROS.debug_mode) {
    console.log("🔍 Elementos DOM obtenidos:", {
      productoInput: !!productoInput,
      categoryMenu: !!categoryMenu,
      tipoProductoSelect: !!tipoProductoSelect,
      filtrosSecundarios: !!(marcaSelect && contenidoSelect && variedadSelect)
    });
  }
}

// ===============================================
// FILTRO DE CATEGORÍAS (Input + Menú Desplegable)
// ===============================================

/**
 * Inicializa el sistema de categorías de forma simple
 */
function inicializarFiltroCategorias() {
  // Obtener referencias frescas
  const inputElemento = document.getElementById("producto");
  const menuElemento = document.getElementById("categoryMenu");
  
  if (!inputElemento || !menuElemento) {
    console.warn("⚠️ Elementos de categorías no encontrados");
    return;
  }
  
  // Actualizar variables globales
  productoInput = inputElemento;
  categoryMenu = menuElemento;
  
  console.log("📋 Inicializando filtro de categorías...");
  
  // Event listeners simples
  productoInput.addEventListener("click", mostrarMenuCategorias);
  productoInput.addEventListener("input", filtrarMenuCategorias);
  
  // Click fuera para cerrar
  document.addEventListener("click", function(e) {
    if (!e.target.closest(".category-dropdown")) {
      ocultarMenuCategorias();
    }
  });
  
  console.log("✅ Filtro de categorías inicializado");
}

/**
 * Maneja clicks fuera del menú (función ya no necesaria)
 */
function manejarClickFuera(e) {
  // Esta función se mantiene por compatibilidad pero ya no se usa
}

/**
 * Muestra el menú de categorías de forma simple
 */
async function mostrarMenuCategorias() {
  if (!categoryMenu || !productoInput) return;
  
  console.log("🔄 Mostrando menú de categorías...");
  
  // Limpiar menú
  categoryMenu.innerHTML = "";
  
  // Generar contenido
  CATEGORIAS_SUBCATEGORIAS_MOCK.forEach(categoria => {
    const groupDiv = crearGrupoCategorias(categoria);
    categoryMenu.appendChild(groupDiv);
  });
  
  // Mostrar menú
  categoryMenu.style.display = "block";
  
  console.log("✅ Menú mostrado");
}

/**
 * Oculta el menú de categorías
 */
function ocultarMenuCategorias() {
  if (!categoryMenu) return;
  categoryMenu.style.display = "none";
}

/**
 * Crea un grupo de categorías con sus subcategorías
 */
function crearGrupoCategorias(categoria) {
  const groupDiv = document.createElement("div");
  groupDiv.classList.add("category-group");
  groupDiv.setAttribute("data-categoria-id", categoria.id);
  
  // Título de la categoría
  const title = document.createElement("strong");
  title.textContent = categoria.categoria_original;
  title.classList.add("category-title");
  groupDiv.appendChild(title);
  
  // Lista de subcategorías
  const subList = document.createElement("ul");
  subList.classList.add("subcategory-list");
  
  categoria.subcategorias.forEach(subcategoria => {
    const item = document.createElement("li");
    item.textContent = subcategoria;
    item.classList.add("subcategory-item");
    item.setAttribute("data-subcategoria", subcategoria);
    item.setAttribute("data-categoria-padre", categoria.id);
    
    // Event listener para selección simple
    item.addEventListener("click", function() {
      seleccionarSubcategoria(subcategoria, categoria);
    });
    
    subList.appendChild(item);
  });
  
  groupDiv.appendChild(subList);
  return groupDiv;
}

/**
 * Selecciona una subcategoría y actualiza el estado
 */
function seleccionarSubcategoria(subcategoria, categoria) {
  console.log(`🎯 Subcategoría seleccionada: ${subcategoria} (${categoria.categoria_original})`);
  
  // Actualizar input
  if (productoInput) {
    productoInput.value = subcategoria;
  }
  
  // Ocultar menú
  ocultarMenuCategorias();
  
  // Actualizar estado interno
  filtroActual.categoria = categoria.id;
  filtroActual.subcategoria = subcategoria;
  
  // Disparar evento de cambio de filtro
  notificarCambioFiltro("categoria", { 
    categoria: categoria.id, 
    subcategoria: subcategoria 
  });
  
  // Mostrar filtros adicionales si están ocultos
  mostrarFiltrosSecundarios();
}

/**
 * Filtra el menú de categorías basado en la entrada del usuario
 */
function filtrarMenuCategorias() {
  if (!productoInput || !categoryMenu) return;
  
  const input = normalizarTexto(productoInput.value);
  
  if (input.length === 0) {
    // Si no hay texto, mostrar todas las categorías
    mostrarMenuCategorias();
    return;
  }
  
  const groups = categoryMenu.querySelectorAll(".category-group");
  
  groups.forEach(group => {
    const categoryTitle = group.querySelector(".category-title")?.textContent || "";
    const normalizedCategory = normalizarTexto(categoryTitle);
    
    const subItems = group.querySelectorAll(".subcategory-item");
    let categoryMatch = normalizedCategory.includes(input);
    let hasVisibleSubs = false;
    
    subItems.forEach(item => {
      const normalizedText = normalizarTexto(item.textContent);
      const match = normalizedText.includes(input) || categoryMatch;
      
      item.style.display = match ? "" : "none";
      if (match) hasVisibleSubs = true;
    });
    
    // Mostrar grupo si tiene coincidencias
    group.style.display = (categoryMatch || hasVisibleSubs) ? "" : "none";
  });
  
  // Auto-mostrar menú si está oculto y hay texto
  if (categoryMenu.style.display === "none") {
    categoryMenu.style.display = "block";
  }
}

/**
 * Selecciona una subcategoría
 */
function seleccionarSubcategoria(subcategoria, categoria) {
  console.log(`🎯 Subcategoría seleccionada: ${subcategoria}`);
  
  // Actualizar input
  if (productoInput) {
    productoInput.value = subcategoria;
  }
  
  // Ocultar menú
  ocultarMenuCategorias();
  
  // Actualizar estado
  filtroActual.categoria = categoria.id;
  filtroActual.subcategoria = subcategoria;
  
  // Notificar cambio
  notificarCambioFiltro("categoria", { 
    categoria: categoria.id, 
    subcategoria: subcategoria 
  });
  
  // Mostrar filtros adicionales
  mostrarFiltrosSecundarios();
}

// ===============================================
// FILTRO TIPO DE PRODUCTO
// ===============================================

/**
 * Inicializa el filtro de tipo de producto
 */
function inicializarFiltroTipoProducto() {
  // Obtener referencia fresca justo antes de usar
  const selectElemento = document.getElementById("tipo-de-producto");
  
  if (!selectElemento) {
    console.warn("⚠️ Select tipo-de-producto no encontrado");
    return;
  }
  
  // Actualizar la variable global
  tipoProductoSelect = selectElemento;
  
  console.log("📦 Inicializando filtro tipo de producto...");
  
  // Cargar opciones
  cargarTiposProducto();
  
  // Event listener
  tipoProductoSelect.addEventListener("change", manejarCambioTipoProducto);
  
  console.log("✅ Filtro tipo de producto inicializado");
}

/**
 * Carga las opciones de tipos de producto
 */
function cargarTiposProducto() {
  if (!tipoProductoSelect) return;
  
  console.log("📦 Cargando tipos de producto desde mock data...");
  
  // Limpiar select completamente
  tipoProductoSelect.innerHTML = "";
  
  // Agregar opción por defecto
  const defaultOption = document.createElement('option');
  defaultOption.value = "";
  defaultOption.selected = true;
  defaultOption.disabled = true;
  defaultOption.textContent = TEXTOS_FILTROS.tipo_producto;
  tipoProductoSelect.appendChild(defaultOption);
  
  // Agregar opciones dinámicamente
  TIPOS_PRODUCTO_MOCK
    .filter(tipo => tipo.activo)
    .sort((a, b) => a.orden - b.orden)
    .forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo.id;
      option.setAttribute('data-id', tipo.id);
      option.setAttribute('data-categoria', tipo.categoria);
      option.textContent = tipo.nombre;
      tipoProductoSelect.appendChild(option);
    });
  
  console.log(`✅ ${TIPOS_PRODUCTO_MOCK.length} tipos de producto cargados`);
}

/**
 * Maneja el cambio en el select de tipo de producto
 */
function manejarCambioTipoProducto(event) {
  const tipoSeleccionado = event.target.value;
  
  console.log(`🎯 Tipo de producto seleccionado: ${tipoSeleccionado}`);
  
  // Actualizar estado
  filtroActual.tipoProducto = tipoSeleccionado;
  
  if (!tipoSeleccionado) {
    ocultarFiltrosSecundarios();
    return;
  }
  
  // Mostrar filtros secundarios
  mostrarFiltrosSecundarios();
  
  // Cargar opciones específicas para este tipo
  cargarOpcionesPorTipo(tipoSeleccionado);
  
  // Disparar evento de cambio
  notificarCambioFiltro("tipoProducto", tipoSeleccionado);
}

// ===============================================
// FILTROS SECUNDARIOS (Marca, Contenido, Variedad)
// ===============================================

/**
 * Inicializa los filtros secundarios
 */
function inicializarFiltrosSecundarios() {
  console.log("🔧 Inicializando filtros secundarios...");
  
  // Obtener referencias frescas justo antes de usar
  marcaSelect = document.getElementById("marca");
  contenidoSelect = document.getElementById("contenido");
  variedadSelect = document.getElementById("variedad");
  marcaWrapper = document.getElementById("marca-wrapper");
  contenidoWrapper = document.getElementById("contenido-wrapper");
  variedadWrapper = document.getElementById("variedad-wrapper");
  
  // Event listeners
  if (marcaSelect) {
    marcaSelect.addEventListener("change", (e) => manejarCambioFiltroSecundario("marca", e.target.value));
  }
  
  if (contenidoSelect) {
    contenidoSelect.addEventListener("change", (e) => manejarCambioFiltroSecundario("contenido", e.target.value));
  }
  
  if (variedadSelect) {
    variedadSelect.addEventListener("change", (e) => manejarCambioFiltroSecundario("variedad", e.target.value));
  }
  
  // Estado inicial: ocultos
  ocultarFiltrosSecundarios();
  
  console.log("✅ Filtros secundarios inicializados");
}

/**
 * Carga opciones específicas para un tipo de producto
 */
function cargarOpcionesPorTipo(tipoProducto) {
  console.log(`📋 Cargando opciones para tipo: ${tipoProducto}`);
  
  // Cargar marcas
  cargarOpcionesFiltro(marcaSelect, MARCAS_MOCK[tipoProducto] || []);
  
  // Cargar contenidos
  cargarOpcionesFiltro(contenidoSelect, CONTENIDOS_MOCK[tipoProducto] || []);
  
  // Cargar variedades
  cargarOpcionesFiltro(variedadSelect, VARIEDADES_MOCK[tipoProducto] || []);
  
  console.log(`✅ Opciones cargadas para ${tipoProducto}`);
}

/**
 * Carga opciones en un filtro específico
 */
function cargarOpcionesFiltro(selectElement, opciones) {
  if (!selectElement) return;
  
  // Limpiar select completamente
  selectElement.innerHTML = "";
  
  // Agregar opción por defecto según el tipo de filtro
  const defaultOption = document.createElement('option');
  defaultOption.value = "";
  defaultOption.selected = true;
  defaultOption.disabled = true;
  
  // Determinar texto por defecto según el ID del select
  if (selectElement.id === 'marca') {
    defaultOption.textContent = TEXTOS_FILTROS.marca;
  } else if (selectElement.id === 'contenido') {
    defaultOption.textContent = TEXTOS_FILTROS.contenido;
  } else if (selectElement.id === 'variedad') {
    defaultOption.textContent = TEXTOS_FILTROS.variedad;
  }
  
  selectElement.appendChild(defaultOption);
  
  // Agregar nuevas opciones
  opciones.forEach(opcion => {
    const option = document.createElement('option');
    option.value = opcion;
    option.textContent = opcion;
    selectElement.appendChild(option);
  });
  
  console.log(`✅ ${opciones.length} opciones cargadas en ${selectElement.id}`);
}

/**
 * Maneja cambios en filtros secundarios
 */
function manejarCambioFiltroSecundario(tipoFiltro, valor) {
  console.log(`🎯 Filtro ${tipoFiltro} cambiado a: ${valor}`);
  
  // Actualizar estado
  filtroActual[tipoFiltro] = valor;
  
  // Disparar evento de cambio
  notificarCambioFiltro(tipoFiltro, valor);
}

/**
 * Muestra los filtros secundarios con animación
 */
function mostrarFiltrosSecundarios() {
  const wrappers = [marcaWrapper, contenidoWrapper, variedadWrapper];
  
  wrappers.forEach((wrapper, index) => {
    if (!wrapper) return;
    
    wrapper.classList.remove('d-none');
    
    // Animación suave escalonada
    setTimeout(() => {
      wrapper.style.opacity = '0';
      wrapper.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        wrapper.style.transition = 'all 0.3s ease';
        wrapper.style.opacity = '1';
        wrapper.style.transform = 'translateY(0)';
      }, 50);
    }, index * 100);
  });
  
  console.log("✅ Filtros secundarios mostrados");
}

/**
 * Oculta los filtros secundarios
 */
function ocultarFiltrosSecundarios() {
  const wrappers = [marcaWrapper, contenidoWrapper, variedadWrapper];
  const selects = [marcaSelect, contenidoSelect, variedadSelect];
  
  wrappers.forEach((wrapper, index) => {
    if (!wrapper) return;
    
    // Animación de salida
    wrapper.style.transition = 'all 0.2s ease';
    wrapper.style.opacity = '0';
    wrapper.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      wrapper.classList.add('d-none');
      
      // Limpiar select correspondiente
      const select = selects[index];
      if (select) {
        const opciones = select.querySelectorAll('option:not(:first-child)');
        opciones.forEach(opcion => opcion.remove());
        select.selectedIndex = 0;
      }
    }, 200);
  });
  
  // Resetear estado
  filtroActual.marca = null;
  filtroActual.contenido = null;
  filtroActual.variedad = null;
  
  console.log("✅ Filtros secundarios ocultados");
}

// ===============================================
// CONFIGURACIÓN DE EVENT LISTENERS
// ===============================================

/**
 * Configura todos los event listeners del módulo
 */
function configurarEventListeners() {
  console.log("🔗 Configurando event listeners de filtros...");
  
  // Event listeners ya configurados en las funciones específicas
  // Esta función se mantiene para futuras expansiones
  
  console.log("✅ Event listeners de filtros configurados");
}

// ===============================================
// GESTIÓN DE ESTADO Y EVENTOS
// ===============================================

/**
 * Establece el estado inicial de todos los filtros
 */
function establecerEstadoInicial() {
  // Resetear estado interno
  filtroActual = {
    categoria: null,
    subcategoria: null,
    tipoProducto: null,
    marca: null,
    contenido: null,
    variedad: null
  };
  
  // Ocultar filtros secundarios
  ocultarFiltrosSecundarios();
  
  console.log("🔄 Estado inicial establecido");
}

/**
 * Notifica cambios en filtros a otros módulos
 */
function notificarCambioFiltro(tipoFiltro, valor) {
  // Crear evento personalizado
  const evento = new CustomEvent('filtrosCambiados', {
    detail: {
      tipo: tipoFiltro,
      valor: valor,
      estadoCompleto: { ...filtroActual }
    }
  });
  
  // Disparar evento
  document.dispatchEvent(evento);
  
  if (CONFIG_FILTROS.debug_mode) {
    console.log("📡 Evento filtrosCambiados disparado:", {
      tipo: tipoFiltro,
      valor: valor,
      estadoCompleto: filtroActual
    });
  }
}

/**
 * Obtiene el estado actual de todos los filtros
 */
function obtenerEstadoFiltros() {
  return { ...filtroActual };
}

/**
 * Resetea todos los filtros
 */
function resetearTodosFiltros() {
  console.log("🔄 Reseteando todos los filtros...");
  
  // Resetear input de categorías
  if (productoInput) {
    productoInput.value = "";
  }
  
  // Ocultar menú de categorías
  ocultarMenuCategorias();
  
  // Resetear tipo de producto
  if (tipoProductoSelect) {
    tipoProductoSelect.selectedIndex = 0;
  }
  
  // Ocultar y resetear filtros secundarios
  ocultarFiltrosSecundarios();
  
  // Resetear estado interno
  establecerEstadoInicial();
  
  // Notificar reset
  notificarCambioFiltro("reset", null);
  
  console.log("✅ Todos los filtros reseteados");
}

// ===============================================
// FUNCIONES UTILITARIAS
// ===============================================

/**
 * Normaliza texto para búsquedas (quita acentos y convierte a minúsculas)
 */
function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Simula llamada a API del backend (preparado para el futuro)
 */
async function simularLlamadaAPI(endpoint, params = {}) {
  console.log(`🌐 [SIMULADO] Llamada a ${endpoint}`, params);
  
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // En el futuro será:
  // const response = await fetch(`${API_CONFIG.base_url}${endpoint}`, {
  //   method: 'GET',
  //   headers: { 'Content-Type': 'application/json' },
  //   ...params
  // });
  // return await response.json();
  
  // Por ahora devolver datos mock según el endpoint
  switch(endpoint) {
    case '/api/categorias':
      return CATEGORIAS_SUBCATEGORIAS_MOCK;
    case '/api/tipos-producto':
      return TIPOS_PRODUCTO_MOCK;
    case '/api/marcas':
      return MARCAS_MOCK;
    case '/api/contenidos':
      return CONTENIDOS_MOCK;
    case '/api/variedades':
      return VARIEDADES_MOCK;
    default:
      return [];
  }
}

// ===============================================
// API PÚBLICA DEL MÓDULO
// ===============================================

/**
 * API pública del módulo FiltrosManager
 */
window.FiltrosManager = {
  // Inicialización
  inicializar: inicializarFiltros,
  
  // Gestión de categorías
  mostrarCategorias: mostrarMenuCategorias,
  ocultarCategorias: ocultarMenuCategorias,
  filtrarCategorias: filtrarMenuCategorias,
  
  // Gestión de tipo de producto
  cargarTiposProducto: cargarTiposProducto,
  cargarOpcionesPorTipo: cargarOpcionesPorTipo,
  
  // Gestión de filtros secundarios
  mostrarFiltrosSecundarios: mostrarFiltrosSecundarios,
  ocultarFiltrosSecundarios: ocultarFiltrosSecundarios,
  
  // Estado y control
  obtenerEstado: obtenerEstadoFiltros,
  resetear: resetearTodosFiltros,
  
  // Utilidades
  simularAPI: simularLlamadaAPI,
  
  // Compatibilidad con versiones anteriores
  inicializarFormularios: inicializarFiltros,
  resetearFiltros: resetearTodosFiltros
};

// Compatibilidad con FormManagerDinamico existente
window.FormManagerDinamico = window.FiltrosManager;

console.log("📦 FiltrosManager cargado - Sistema unificado de filtros listo");
