// ===============================================
// MAIN.JS - LÓGICA PRINCIPAL DE LA APLICACIÓN
// Ubicación: E:/caminando-online/frontend/public/js/main.js
// ===============================================

import { 
  obtenerCategorias, 
  mostrarError, 
  mostrarExito,
  mostrarAdvertencia,
  crearSpinner,
  debounce,
  filtrarProductos,
  obtenerSupermercadosSeleccionados,
  guardarEnStorage,
  obtenerDeStorage
} from './helpers.js';

/**
 * 🎯 VARIABLES GLOBALES
 */
let categorias = [];
let productosDisponibles = [];
let productosSeleccionados = [];
let filtrosActivos = {
  categoria: '',
  marca: '',
  contenido: '',
  variedad: ''
};

/**
 * 🚀 INICIALIZACIÓN DE LA APLICACIÓN
 */
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 Caminando Online - Iniciando aplicación...');
  
  try {
    await inicializarAplicacion();
  } catch (error) {
    console.error('❌ Error al inicializar aplicación:', error);
    mostrarError('Error al inicializar la aplicación. Por favor, recarga la página.');
  }
});

/**
 * Inicializa todos los componentes de la aplicación
 */
async function inicializarAplicacion() {
  // 1. Cargar datos iniciales
  await cargarDatosIniciales();
  
  // 2. Configurar eventos
  configurarEventos();
  
  // 3. Configurar filtros
  configurarFiltros();
  
  // 4. Cargar estado guardado
  cargarEstadoGuardado();
  
  console.log('✅ Aplicación inicializada correctamente');
}

/**
 * 📊 CARGA DE DATOS INICIALES
 */
async function cargarDatosIniciales() {
  console.log('🔄 Cargando datos iniciales...');
  
  try {
    // Cargar categorías
    categorias = await obtenerCategorias();
    configurarAutocompletado();
    
    // Cargar productos mock
    await cargarProductosMock();
    
    console.log('✅ Datos iniciales cargados');
  } catch (error) {
    console.error('❌ Error cargando datos:', error);
    throw error;
  }
}

/**
 * Carga productos de ejemplo (mock data)
 */
async function cargarProductosMock() {
  productosDisponibles = [
    // Lácteos
    { 
      id: 1, 
      nombre: 'Leche Descremada', 
      marca: 'La Serenísima', 
      contenido: '1L', 
      variedad: 'Descremada',
      categoria: 'Lácteos',
      precio: 850.00
    },
    { 
      id: 2, 
      nombre: 'Leche Entera', 
      marca: 'La Serenísima', 
      contenido: '1L', 
      variedad: 'Entera',
      categoria: 'Lácteos',
      precio: 820.00
    },
    { 
      id: 3, 
      nombre: 'Yogur Natural', 
      marca: 'Danone', 
      contenido: '200ml', 
      variedad: 'Natural',
      categoria: 'Lácteos',
      precio: 320.00
    },
    { 
      id: 4, 
      nombre: 'Queso Cremoso', 
      marca: 'La Paulina', 
      contenido: '300g', 
      variedad: 'Cremoso',
      categoria: 'Lácteos',
      precio: 1250.00
    },
    
    // Bebidas
    { 
      id: 5, 
      nombre: 'Coca Cola', 
      marca: 'Coca-Cola', 
      contenido: '2.25L', 
      variedad: 'Original',
      categoria: 'Bebidas',
      precio: 1150.00
    },
    { 
      id: 6, 
      nombre: 'Agua Mineral', 
      marca: 'Villavicencio', 
      contenido: '2L', 
      variedad: 'Sin Gas',
      categoria: 'Bebidas',
      precio: 480.00
    },
    { 
      id: 7, 
      nombre: 'Jugo de Naranja', 
      marca: 'Baggio', 
      contenido: '1L', 
      variedad: 'Pulpa',
      categoria: 'Bebidas',
      precio: 650.00
    },
    
    // Panadería
    { 
      id: 8, 
      nombre: 'Pan Lactal', 
      marca: 'Bimbo', 
      contenido: '500g', 
      variedad: 'Blanco',
      categoria: 'Panadería',
      precio: 420.00
    },
    { 
      id: 9, 
      nombre: 'Galletitas Oreo', 
      marca: 'Nabisco', 
      contenido: '118g', 
      variedad: 'Original',
      categoria: 'Panadería',
      precio: 380.00
    },
    
    // Limpieza
    { 
      id: 10, 
      nombre: 'Detergente', 
      marca: 'Ala', 
      contenido: '800ml', 
      variedad: 'Multiuso',
      categoria: 'Limpieza',
      precio: 950.00
    },
    { 
      id: 11, 
      nombre: 'Papel Higiénico', 
      marca: 'Higienol', 
      contenido: '4 rollos', 
      variedad: 'Doble hoja',
      categoria: 'Limpieza',
      precio: 720.00
    },
    { 
      id: 12, 
      nombre: 'Lavandina', 
      marca: 'Ayudín', 
      contenido: '1L', 
      variedad: 'Original',
      categoria: 'Limpieza',
      precio: 480.00
    }
  ];
  
  console.log('✅ Productos mock cargados:', productosDisponibles.length);
}

/**
 * ⚙️ CONFIGURACIÓN DE EVENTOS
 */
function configurarEventos() {
  console.log('🔄 Configurando eventos...');
  
  // Evento del buscador principal
  const inputProducto = document.getElementById('producto');
  if (inputProducto) {
    inputProducto.addEventListener('input', debounce(manejarBusquedaProducto, 300));
    inputProducto.addEventListener('focus', mostrarMenuCategorias);
    inputProducto.addEventListener('blur', () => {
      // Delay para permitir clicks en el menu
      setTimeout(ocultarMenuCategorias, 200);
    });
  }
  
  // Eventos de filtros adicionales
  const selectores = ['marca', 'contenido', 'variedad'];
  selectores.forEach(id => {
    const select = document.getElementById(id);
    if (select) {
      select.addEventListener('change', manejarCambioFiltro);
    }
  });
  
  // Evento del botón comparar
  const btnComparar = document.getElementById('btn-comparar');
  if (btnComparar) {
    btnComparar.addEventListener('click', manejarComparacion);
  }
  
  console.log('✅ Eventos configurados');
}

/**
 * 🔍 CONFIGURACIÓN DE FILTROS Y AUTOCOMPLETADO
 */
function configurarFiltros() {
  configurarAutocompletado();
}

function configurarAutocompletado() {
  const categoryMenu = document.getElementById('categoryMenu');
  if (!categoryMenu) return;
  
  categoryMenu.innerHTML = '';
  
  categorias.forEach(categoria => {
    // Categoría principal
    const categoriaDiv = document.createElement('div');
    categoriaDiv.className = 'category-item';
    categoriaDiv.textContent = categoria.nombre;
    categoriaDiv.onclick = () => seleccionarCategoria(categoria.nombre);
    
    categoryMenu.appendChild(categoriaDiv);
    
    // Subcategorías
    categoria.subcategorias.forEach(sub => {
      const subDiv = document.createElement('div');
      subDiv.className = 'subcategory-item';
      subDiv.textContent = sub;
      subDiv.onclick = () => seleccionarSubcategoria(sub, categoria.nombre);
      
      categoryMenu.appendChild(subDiv);
    });
  });
}

/**
 * 📝 MANEJO DE EVENTOS
 */
function manejarBusquedaProducto(event) {
  const termino = event.target.value;
  console.log('🔍 Buscando:', termino);
  
  if (termino.length >= 2) {
    buscarYMostrarProductos(termino);
  } else {
    ocultarTablaProductos();
  }
}

function manejarCambioFiltro(event) {
  const filtro = event.target.id;
  const valor = event.target.value;
  
  filtrosActivos[filtro] = valor;
  
  console.log('🎯 Filtro aplicado:', filtro, '=', valor);
  
  // Re-filtrar productos si hay búsqueda activa
  const inputProducto = document.getElementById('producto');
  if (inputProducto && inputProducto.value.length >= 2) {
    buscarYMostrarProductos(inputProducto.value);
  }
  
  // Actualizar filtros dependientes
  actualizarFiltrosDependientes(filtro, valor);
}

function manejarComparacion() {
  console.log('📊 Iniciando comparación...');
  
  if (productosSeleccionados.length === 0) {
    mostrarAdvertencia('Agregá al menos un producto para comparar.');
    return;
  }
  
  const supermercadosSeleccionados = obtenerSupermercadosSeleccionados();
  if (supermercadosSeleccionados.length === 0) {
    mostrarAdvertencia('Seleccioná al menos un supermercado para comparar.');
    return;
  }
  
  // Guardar datos para la página de comparación
  guardarEnStorage('productosParaComparar', productosSeleccionados);
  guardarEnStorage('supermercadosParaComparar', supermercadosSeleccionados);
  
  // Redirigir a página de comparación
  window.location.href = 'productos-comparados.html';
}

/**
 * 🔍 FUNCIONES DE BÚSQUEDA
 */
async function buscarYMostrarProductos(termino) {
  console.log('🔍 Buscando productos para:', termino);
  
  // Filtrar productos
  let productosFiltrados = filtrarProductos(productosDisponibles, termino);
  
  // Aplicar filtros adicionales
  productosFiltrados = aplicarFiltrosAdicionales(productosFiltrados);
  
  // Mostrar resultados
  mostrarTablaProductos(productosFiltrados);
  
  // Actualizar opciones de filtros
  actualizarOpcionesFiltros(productosFiltrados);
}

function aplicarFiltrosAdicionales(productos) {
  let filtrados = [...productos];
  
  if (filtrosActivos.marca) {
    filtrados = filtrados.filter(p => p.marca === filtrosActivos.marca);
  }
  
  if (filtrosActivos.contenido) {
    filtrados = filtrados.filter(p => p.contenido === filtrosActivos.contenido);
  }
  
  if (filtrosActivos.variedad) {
    filtrados = filtrados.filter(p => p.variedad === filtrosActivos.variedad);
  }
  
  return filtrados;
}

/**
 * 📊 RENDERIZADO DE TABLAS
 */
function mostrarTablaProductos(productos) {
  const container = document.getElementById('productos-container');
  if (!container) return;
  
  if (productos.length === 0) {
    container.innerHTML = `
      <div class="alert alert-info">
        <i class="fas fa-info-circle me-2"></i>
        No se encontraron productos que coincidan con tu búsqueda.
      </div>
    `;
    return;
  }
  
  const tabla = crearTablaProductos(productos);
  container.innerHTML = '';
  container.appendChild(tabla);
  
  console.log(`📊 Mostrando ${productos.length} productos`);
}

function crearTablaProductos(productos) {
  const wrapper = document.createElement('div');
  wrapper.className = 'tabla-wrapper-moderna';
  
  const header = document.createElement('div');
  header.className = 'tabla-header-info';
  header.innerHTML = `
    <h5 class="mb-0">
      <i class="fas fa-list me-2"></i>
      Productos encontrados 
      <span class="badge bg-success ms-2">${productos.length}</span>
    </h5>
  `;
  
  const scrollContainer = document.createElement('div');
  scrollContainer.className = 'tabla-scroll-moderna';
  scrollContainer.id = 'tabla-productos';
  
  const tabla = document.createElement('table');
  tabla.className = 'tabla-productos-mejorada';
  
  // Header de la tabla
  const thead = document.createElement('thead');
  thead.className = 'table-header-modern';
  thead.innerHTML = `
    <tr>
      <th class="col-producto">
        <div class="th-content">
          <span class="th-icon">🏷️</span>
          <span>Producto</span>
        </div>
      </th>
      <th class="col-marca">
        <div class="th-content">
          <span class="th-icon">🏭</span>
          <span>Marca</span>
        </div>
      </th>
      <th class="col-contenido">
        <div class="th-content">
          <span class="th-icon">📦</span>
          <span>Contenido</span>
        </div>
      </th>
      <th class="col-variedad">
        <div class="th-content">
          <span class="th-icon">🎯</span>
          <span>Variedad</span>
        </div>
      </th>
      <th class="col-accion">
        <div class="th-content">
          <span class="th-icon">➕</span>
        </div>
      </th>
    </tr>
  `;
  
  // Body de la tabla
  const tbody = document.createElement('tbody');
  tbody.className = 'table-body-modern';
  
  productos.forEach(producto => {
    const fila = crearFilaProducto(producto);
    tbody.appendChild(fila);
  });
  
  tabla.appendChild(thead);
  tabla.appendChild(tbody);
  scrollContainer.appendChild(tabla);
  wrapper.appendChild(header);
  wrapper.appendChild(scrollContainer);
  
  return wrapper;
}

function crearFilaProducto(producto) {
  const fila = document.createElement('tr');
  
  fila.innerHTML = `
    <td class="celda-producto">
      <div class="producto-info">
        <div class="producto-nombre">${producto.nombre}</div>
        <div class="producto-codigo">ID: ${producto.id}</div>
      </div>
    </td>
    <td class="celda-marca">
      <span class="badge-marca">${producto.marca}</span>
    </td>
    <td class="celda-contenido">
      <span class="badge-contenido">${producto.contenido}</span>
    </td>
    <td class="celda-variedad">
      <span class="badge-variedad">${producto.variedad}</span>
    </td>
    <td class="celda-accion">
      <button class="btn btn-success btn-sm btn-agregar" onclick="agregarProducto(${producto.id})">
        <i class="fas fa-plus me-1"></i>
        Agregar
      </button>
    </td>
  `;
  
  return fila;
}

function ocultarTablaProductos() {
  const container = document.getElementById('productos-container');
  if (container) {
    container.innerHTML = '';
  }
}

/**
 * 🛒 GESTIÓN DE PRODUCTOS SELECCIONADOS
 */
window.agregarProducto = function(productoId) {
  const producto = productosDisponibles.find(p => p.id === productoId);
  
  if (!producto) {
    mostrarError('Producto no encontrado');
    return;
  }
  
  // Verificar si ya está agregado
  if (productosSeleccionados.find(p => p.id === productoId)) {
    mostrarAdvertencia(`${producto.nombre} ya está en tu lista`);
    return;
  }
  
  productosSeleccionados.push(producto);
  mostrarExito(`${producto.nombre} agregado a la comparación`);
  
  actualizarListaProductosSeleccionados();
  guardarEstado();
  
  console.log('✅ Producto agregado:', producto.nombre);
};

window.eliminarProducto = function(productoId) {
  const index = productosSeleccionados.findIndex(p => p.id === productoId);
  
  if (index !== -1) {
    const producto = productosSeleccionados[index];
    productosSeleccionados.splice(index, 1);
    
    mostrarExito(`${producto.nombre} eliminado de la comparación`);
    actualizarListaProductosSeleccionados();
    guardarEstado();
    
    console.log('🗑️ Producto eliminado:', producto.nombre);
  }
};

function actualizarListaProductosSeleccionados() {
  const container = document.getElementById('productos-a-comparar-container');
  if (!container) return;
  
  if (productosSeleccionados.length === 0) {
    container.style.display = 'none';
    document.getElementById('comparar-box').style.display = 'none';
    return;
  }
  
  container.style.display = 'block';
  document.getElementById('comparar-box').style.display = 'block';
  
  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">
          <i class="fas fa-shopping-cart me-2"></i>
          Productos para comparar
          <span class="badge bg-light text-dark ms-2">${productosSeleccionados.length}</span>
        </h5>
      </div>
      <div class="card-body">
        <div class="row">
          ${productosSeleccionados.map(producto => `
            <div class="col-md-6 mb-2">
              <div class="d-flex justify-content-between align-items-center p-2 border rounded">
                <div>
                  <strong>${producto.nombre}</strong><br>
                  <small class="text-muted">${producto.marca} - ${producto.contenido}</small>
                </div>
                <button class="btn btn-outline-danger btn-sm" onclick="eliminarProducto(${producto.id})">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

/**
 * 🎨 FUNCIONES DE INTERFAZ
 */
function mostrarMenuCategorias() {
  const menu = document.getElementById('categoryMenu');
  if (menu) {
    menu.style.display = 'block';
  }
}

function ocultarMenuCategorias() {
  const menu = document.getElementById('categoryMenu');
  if (menu) {
    menu.style.display = 'none';
  }
}

function seleccionarCategoria(categoria) {
  const input = document.getElementById('producto');
  if (input) {
    input.value = categoria;
    buscarYMostrarProductos(categoria);
  }
  ocultarMenuCategorias();
}

function seleccionarSubcategoria(subcategoria, categoria) {
  const input = document.getElementById('producto');
  if (input) {
    input.value = subcategoria;
    buscarYMostrarProductos(subcategoria);
  }
  ocultarMenuCategorias();
}

/**
 * 🔧 ACTUALIZACIÓN DE FILTROS
 */
function actualizarOpcionesFiltros(productos) {
  // Obtener valores únicos
  const marcas = [...new Set(productos.map(p => p.marca))].sort();
  const contenidos = [...new Set(productos.map(p => p.contenido))].sort();
  const variedades = [...new Set(productos.map(p => p.variedad))].sort();
  
  // Actualizar select de marcas
  actualizarSelect('marca', marcas);
  actualizarSelect('contenido', contenidos);
  actualizarSelect('variedad', variedades);
}

function actualizarSelect(selectId, opciones) {
  const select = document.getElementById(selectId);
  if (!select) return;
  
  const valorActual = select.value;
  
  // Limpiar opciones existentes (excepto la primera)
  while (select.children.length > 1) {
    select.removeChild(select.lastChild);
  }
  
  // Agregar nuevas opciones
  opciones.forEach(opcion => {
    const option = document.createElement('option');
    option.value = opcion;
    option.textContent = opcion;
    
    if (opcion === valorActual) {
      option.selected = true;
    }
    
    select.appendChild(option);
  });
}

function actualizarFiltrosDependientes(filtroModificado, valor) {
  // Lógica para actualizar filtros dependientes
  // Por ejemplo, si se selecciona una marca, filtrar contenidos y variedades
  
  let productosFiltrados = [...productosDisponibles];
  
  // Aplicar filtro del input de búsqueda si existe
  const inputProducto = document.getElementById('producto');
  if (inputProducto && inputProducto.value.length >= 2) {
    productosFiltrados = filtrarProductos(productosFiltrados, inputProducto.value);
  }
  
  // Aplicar filtros ya seleccionados
  if (filtrosActivos.marca && filtroModificado !== 'marca') {
    productosFiltrados = productosFiltrados.filter(p => p.marca === filtrosActivos.marca);
  }
  
  if (filtrosActivos.contenido && filtroModificado !== 'contenido') {
    productosFiltrados = productosFiltrados.filter(p => p.contenido === filtrosActivos.contenido);
  }
  
  if (filtrosActivos.variedad && filtroModificado !== 'variedad') {
    productosFiltrados = productosFiltrados.filter(p => p.variedad === filtrosActivos.variedad);
  }
  
  // Actualizar opciones de los otros filtros
  if (filtroModificado !== 'marca') {
    const marcas = [...new Set(productosFiltrados.map(p => p.marca))].sort();
    actualizarSelect('marca', marcas);
  }
  
  if (filtroModificado !== 'contenido') {
    const contenidos = [...new Set(productosFiltrados.map(p => p.contenido))].sort();
    actualizarSelect('contenido', contenidos);
  }
  
  if (filtroModificado !== 'variedad') {
    const variedades = [...new Set(productosFiltrados.map(p => p.variedad))].sort();
    actualizarSelect('variedad', variedades);
  }
}

/**
 * 💾 PERSISTENCIA DE ESTADO
 */
function guardarEstado() {
  const estado = {
    productosSeleccionados,
    filtrosActivos,
    timestamp: Date.now()
  };
  
  guardarEnStorage('estadoAplicacion', estado);
}

function cargarEstadoGuardado() {
  const estado = obtenerDeStorage('estadoAplicacion');
  
  if (estado) {
    // Cargar productos seleccionados
    if (estado.productosSeleccionados) {
      productosSeleccionados = estado.productosSeleccionados;
      actualizarListaProductosSeleccionados();
    }
    
    // Cargar filtros activos
    if (estado.filtrosActivos) {
      filtrosActivos = { ...filtrosActivos, ...estado.filtrosActivos };
      aplicarFiltrosGuardados();
    }
    
    console.log('📚 Estado cargado desde storage');
  }
}

function aplicarFiltrosGuardados() {
  // Aplicar valores guardados a los selects
  Object.keys(filtrosActivos).forEach(filtro => {
    const select = document.getElementById(filtro);
    if (select && filtrosActivos[filtro]) {
      select.value = filtrosActivos[filtro];
    }
  });
}

/**
 * 🧹 FUNCIONES DE UTILIDAD
 */
function limpiarFiltros() {
  // Resetear filtros
  filtrosActivos = {
    categoria: '',
    marca: '',
    contenido: '',
    variedad: ''
  };
  
  // Limpiar selects
  const selects = ['marca', 'contenido', 'variedad'];
  selects.forEach(id => {
    const select = document.getElementById(id);
    if (select) {
      select.selectedIndex = 0;
    }
  });
  
  // Limpiar búsqueda
  const inputProducto = document.getElementById('producto');
  if (inputProducto) {
    inputProducto.value = '';
  }
  
  // Ocultar tabla
  ocultarTablaProductos();
  
  console.log('🧹 Filtros limpiados');
}

function limpiarProductosSeleccionados() {
  productosSeleccionados = [];
  actualizarListaProductosSeleccionados();
  guardarEstado();
  
  mostrarExito('Lista de productos limpiada');
  console.log('🧹 Productos seleccionados limpiados');
}

/**
 * 🌐 FUNCIONES GLOBALES (disponibles en window)
 */

// Hacer funciones disponibles globalmente para onclick
window.limpiarFiltros = limpiarFiltros;
window.limpiarProductosSeleccionados = limpiarProductosSeleccionados;

/**
 * 🔄 EVENT LISTENERS ADICIONALES
 */

// Manejar tecla Enter en el buscador
document.addEventListener('keypress', function(event) {
  if (event.key === 'Enter' && event.target.id === 'producto') {
    const valor = event.target.value;
    if (valor.length >= 2) {
      buscarYMostrarProductos(valor);
    }
  }
});

// Manejar escape para cerrar menús
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    ocultarMenuCategorias();
  }
});

// Guardar estado antes de salir de la página
window.addEventListener('beforeunload', function() {
  guardarEstado();
});

/**
 * 📱 RESPONSIVE HANDLERS
 */
function manejarCambioTamano() {
  // Ajustar interfaz según el tamaño de pantalla
  const esMobile = window.innerWidth <= 768;
  
  // Ajustar tabla en móviles
  const tablas = document.querySelectorAll('.tabla-productos-mejorada');
  tablas.forEach(tabla => {
    if (esMobile) {
      tabla.style.fontSize = '0.875rem';
    } else {
      tabla.style.fontSize = '';
    }
  });
}

// Escuchar cambios de tamaño
window.addEventListener('resize', debounce(manejarCambioTamano, 250));

/**
 * 🔍 FUNCIONES DE DEBUG (solo en desarrollo)
 */
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  
  // Funciones de debug disponibles en consola
  window.debug = {
    mostrarEstado: () => {
      console.log('🔍 Estado actual:');
      console.log('Productos disponibles:', productosDisponibles.length);
      console.log('Productos seleccionados:', productosSeleccionados.length);
      console.log('Filtros activos:', filtrosActivos);
      console.log('Categorías:', categorias.length);
    },
    
    simularProductos: (cantidad = 5) => {
      console.log(`🎭 Simulando ${cantidad} productos...`);
      for (let i = 0; i < cantidad; i++) {
        const producto = productosDisponibles[Math.floor(Math.random() * productosDisponibles.length)];
        if (!productosSeleccionados.find(p => p.id === producto.id)) {
          window.agregarProducto(producto.id);
        }
      }
    },
    
    limpiarTodo: () => {
      console.log('🧹 Limpiando todo...');
      limpiarFiltros();
      limpiarProductosSeleccionados();
      localStorage.clear();
    }
  };
  
  console.log('🛠️ Funciones de debug disponibles: window.debug');
}

/**
 * 📊 ANALYTICS Y MÉTRICAS (para futuro)
 */
function trackearEvento(evento, datos = {}) {
  // Placeholder para analytics
  console.log('📊 Evento:', evento, datos);
  
  // Aquí se integraría con Google Analytics, Mixpanel, etc.
  // if (typeof gtag !== 'undefined') {
  //   gtag('event', evento, datos);
  // }
}

// Trackear eventos importantes
function configurarAnalytics() {
  // Trackear búsquedas
  const inputProducto = document.getElementById('producto');
  if (inputProducto) {
    inputProducto.addEventListener('input', debounce((e) => {
      if (e.target.value.length >= 3) {
        trackearEvento('busqueda_producto', { termino: e.target.value });
      }
    }, 1000));
  }
  
  // Trackear productos agregados
  const originalAgregarProducto = window.agregarProducto;
  window.agregarProducto = function(productoId) {
    const producto = productosDisponibles.find(p => p.id === productoId);
    if (producto) {
      trackearEvento('producto_agregado', { 
        nombre: producto.nombre, 
        marca: producto.marca,
        categoria: producto.categoria 
      });
    }
    return originalAgregarProducto(productoId);
  };
}

// Inicializar analytics si estamos en producción
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  configurarAnalytics();
}

console.log('✅ main.js cargado completamente');