// ===============================================
// FORM MANAGER DINÁMICO - USA DATOS MOCK
// ===============================================

/**
 * Módulo que maneja todos los formularios de manera dinámica
 * Usa datos mock que simulan las respuestas del backend
 */

// Importar datos mock (simulan respuestas del backend)
import { 
  TIPOS_PRODUCTO_MOCK, 
  CATEGORIAS_MOCK, 
  MARCAS_MOCK, 
  CONTENIDOS_MOCK, 
  VARIEDADES_MOCK,
  API_CONFIG 
} from '../data/mock-data.js';

// Variable para almacenar el tipo de producto seleccionado
let tipoProductoActual = null;

/**
 * Inicializa todos los formularios dinámicos
 */
function inicializarFormularios() {
  console.log("📝 Iniciando Form Manager Dinámico...");
  
  // Cargar tipos de producto dinámicamente
  cargarTiposProducto();
  
  // Configurar event listeners para filtros dinámicos
  configurarEventListenersFiltros();
  
  // Inicialmente ocultar filtros secundarios
  ocultarFiltrosSecundarios();
  
  console.log("✅ Form Manager Dinámico inicializado");
}

/**
 * Carga las opciones de tipos de producto dinámicamente
 */
function cargarTiposProducto() {
  const select = document.getElementById("tipo-de-producto");
  if (!select) {
    console.warn("⚠️ Select tipo-de-producto no encontrado");
    return;
  }
  
  console.log("📦 Cargando tipos de producto desde mock data...");
  
  // Limpiar opciones existentes (excepto la primera)
  const opciones = select.querySelectorAll('option:not(:first-child)');
  opciones.forEach(opcion => opcion.remove());
  
  // Agregar opciones dinámicamente desde mock data
  TIPOS_PRODUCTO_MOCK
    .filter(tipo => tipo.activo)
    .sort((a, b) => a.orden - b.orden)
    .forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo.id;
      option.setAttribute('data-id', tipo.id);
      option.setAttribute('data-categoria', tipo.categoria);
      option.textContent = tipo.nombre;
      select.appendChild(option);
    });
  
  console.log(`✅ ${TIPOS_PRODUCTO_MOCK.length} tipos de producto cargados dinámicamente`);
}

/**
 * Configura event listeners para filtros dinámicos
 */
function configurarEventListenersFiltros() {
  const tipoProductoSelect = document.getElementById("tipo-de-producto");
  
  if (tipoProductoSelect) {
    tipoProductoSelect.addEventListener('change', manejarCambioTipoProducto);
  }
  
  console.log("✅ Event listeners de filtros configurados");
}

/**
 * Maneja el cambio en el select de tipo de producto
 */
function manejarCambioTipoProducto(event) {
  const tipoSeleccionado = event.target.value;
  
  if (!tipoSeleccionado) {
    ocultarFiltrosSecundarios();
    return;
  }
  
  console.log(`🎯 Tipo de producto seleccionado: ${tipoSeleccionado}`);
  
  // Guardar tipo actual
  tipoProductoActual = tipoSeleccionado;
  
  // Mostrar filtros secundarios
  mostrarFiltrosSecundarios();
  
  // Cargar opciones específicas para este tipo
  cargarOpcionesPorTipo(tipoSeleccionado);
}

/**
 * Carga opciones específicas para un tipo de producto
 */
function cargarOpcionesPorTipo(tipoProducto) {
  console.log(`📋 Cargando opciones para tipo: ${tipoProducto}`);
  
  // Cargar marcas
  cargarOpcionesFiltro('marca', MARCAS_MOCK[tipoProducto] || []);
  
  // Cargar contenidos
  cargarOpcionesFiltro('contenido', CONTENIDOS_MOCK[tipoProducto] || []);
  
  // Cargar variedades
  cargarOpcionesFiltro('variedad', VARIEDADES_MOCK[tipoProducto] || []);
  
  console.log(`✅ Opciones cargadas para ${tipoProducto}`);
}

/**
 * Carga opciones en un filtro específico
 */
function cargarOpcionesFiltro(filtroId, opciones) {
  const select = document.getElementById(filtroId);
  if (!select) {
    console.warn(`⚠️ Filtro ${filtroId} no encontrado`);
    return;
  }
  
  // Limpiar opciones existentes (excepto la primera)
  const opcionesExistentes = select.querySelectorAll('option:not(:first-child)');
  opcionesExistentes.forEach(opcion => opcion.remove());
  
  // Agregar nuevas opciones
  opciones.forEach(opcion => {
    const option = document.createElement('option');
    option.value = opcion;
    option.textContent = opcion;
    select.appendChild(option);
  });
  
  console.log(`✅ ${opciones.length} opciones cargadas en ${filtroId}`);
}

/**
 * Muestra los filtros secundarios (marca, contenido, variedad)
 */
function mostrarFiltrosSecundarios() {
  const wrappers = ['marca-wrapper', 'contenido-wrapper', 'variedad-wrapper'];
  
  wrappers.forEach(wrapperId => {
    const wrapper = document.getElementById(wrapperId);
    if (wrapper) {
      wrapper.classList.remove('d-none');
      // Animación suave
      wrapper.style.opacity = '0';
      wrapper.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        wrapper.style.transition = 'all 0.3s ease';
        wrapper.style.opacity = '1';
        wrapper.style.transform = 'translateY(0)';
      }, 50);
    }
  });
  
  console.log("✅ Filtros secundarios mostrados");
}

/**
 * Oculta los filtros secundarios
 */
function ocultarFiltrosSecundarios() {
  const wrappers = ['marca-wrapper', 'contenido-wrapper', 'variedad-wrapper'];
  
  wrappers.forEach(wrapperId => {
    const wrapper = document.getElementById(wrapperId);
    if (wrapper) {
      wrapper.classList.add('d-none');
      
      // Limpiar selects
      const select = wrapper.querySelector('select');
      if (select) {
        const opciones = select.querySelectorAll('option:not(:first-child)');
        opciones.forEach(opcion => opcion.remove());
      }
    }
  });
  
  console.log("✅ Filtros secundarios ocultados");
}

/**
 * Simula llamada a API del backend
 * En el futuro esto hará fetch() real al backend
 */
async function simularLlamadaAPI(endpoint, params = {}) {
  console.log(`🌐 Simulando llamada a ${endpoint}`, params);
  
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // En el futuro será:
  // const response = await fetch(`${API_CONFIG.base_url}${endpoint}`, {
  //   method: 'GET',
  //   headers: { 'Content-Type': 'application/json' },
  //   ...params
  // });
  // return await response.json();
  
  // Por ahora devolvemos datos mock
  switch(endpoint) {
    case '/api/tipos-producto':
      return TIPOS_PRODUCTO_MOCK;
    case '/api/categorias':
      return CATEGORIAS_MOCK;
    default:
      return [];
  }
}

/**
 * Obtiene el tipo de producto actualmente seleccionado
 */
function obtenerTipoProductoActual() {
  return tipoProductoActual;
}

/**
 * Resetea todos los filtros
 */
function resetearFiltros() {
  // Resetear select principal
  const tipoSelect = document.getElementById('tipo-de-producto');
  if (tipoSelect) {
    tipoSelect.selectedIndex = 0;
  }
  
  // Ocultar y limpiar filtros secundarios
  ocultarFiltrosSecundarios();
  
  // Resetear variable
  tipoProductoActual = null;
  
  console.log("🔄 Filtros reseteados");
}

// ===============================================
// API PÚBLICA DEL MÓDULO
// ===============================================

// Exponer funciones públicas
window.FormManagerDinamico = {
  inicializar: inicializarFormularios,
  cargarTiposProducto: cargarTiposProducto,
  cargarOpcionesPorTipo: cargarOpcionesPorTipo,
  mostrarFiltros: mostrarFiltrosSecundarios,
  ocultarFiltros: ocultarFiltrosSecundarios,
  resetear: resetearFiltros,
  obtenerTipoActual: obtenerTipoProductoActual,
  simularAPI: simularLlamadaAPI
};

console.log("📦 FormManager Dinámico cargado");
