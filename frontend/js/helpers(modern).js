// ===============================================
// HELPERS.JS - FUNCIONES AUXILIARES
// Ubicación: E:/caminando-online/frontend/public/js/helpers.js
// ===============================================

/**
 * 🔧 FUNCIONES DE VALIDACIÓN
 */

/**
 * Valida que todos los campos requeridos estén completos
 * @param {string[]} campos - array de valores
 * @returns {boolean}
 */
export function camposCompletos(campos) {
  return campos.every(c => c && c.trim() !== '');
}

/**
 * Valida formato de email
 * @param {string} email 
 * @returns {boolean}
 */
export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * 💰 FUNCIONES DE FORMATO
 */

/**
 * Formatea un número como precio en ARS
 * @param {number} valor
 * @returns {string}
 */
export function formatearPrecio(valor) {
  if (typeof valor !== 'number' || isNaN(valor)) {
    return '$0.00';
  }
  return `$${valor.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Formatea un texto para mostrar como título
 * @param {string} texto 
 * @returns {string}
 */
export function formatearTitulo(texto) {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

/**
 * 🏗️ FUNCIONES DE DOM
 */

/**
 * Crea un elemento <li> para la lista de productos
 * @param {object} producto - { nombre, marca, presentacion }
 * @returns {HTMLElement}
 */
export function crearItemProducto(producto) {
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-center';
  
  const contenido = document.createElement('div');
  contenido.innerHTML = `
    <strong>${producto.nombre}</strong><br>
    <small class="text-muted">${producto.marca} - ${producto.presentacion}</small>
  `;
  
  const botonEliminar = document.createElement('button');
  botonEliminar.className = 'btn btn-sm btn-outline-danger';
  botonEliminar.innerHTML = '<i class="fas fa-trash"></i>';
  botonEliminar.onclick = () => eliminarProducto(producto.id);
  
  li.appendChild(contenido);
  li.appendChild(botonEliminar);
  
  return li;
}

/**
 * Crea un spinner de carga
 * @returns {HTMLElement}
 */
export function crearSpinner() {
  const spinner = document.createElement('div');
  spinner.className = 'd-flex justify-content-center p-4';
  spinner.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  `;
  return spinner;
}

/**
 * 🚨 FUNCIONES DE NOTIFICACIONES
 */

/**
 * Muestra un mensaje de error en consola y opcionalmente en pantalla
 * @param {string} mensaje
 * @param {HTMLElement} contenedor
 */
export function mostrarError(mensaje, contenedor = null) {
  console.error('❌ Error:', mensaje);
  if (contenedor) {
    contenedor.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <i class="fas fa-exclamation-triangle me-2"></i>
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
  }
}

/**
 * Muestra un mensaje de éxito
 * @param {string} mensaje
 * @param {HTMLElement} contenedor
 */
export function mostrarExito(mensaje, contenedor = null) {
  console.log('✅ Éxito:', mensaje);
  if (contenedor) {
    contenedor.innerHTML = `
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <i class="fas fa-check-circle me-2"></i>
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
  }
}

/**
 * Muestra un mensaje de advertencia
 * @param {string} mensaje
 * @param {HTMLElement} contenedor
 */
export function mostrarAdvertencia(mensaje, contenedor = null) {
  console.warn('⚠️ Advertencia:', mensaje);
  if (contenedor) {
    contenedor.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show" role="alert">
        <i class="fas fa-exclamation-circle me-2"></i>
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
  }
}

/**
 * 🌐 FUNCIONES DE API
 */

/**
 * Obtiene la lista de supermercados desde el backend
 * @returns {Promise<string[]>}
 */
export async function obtenerSupermercados() {
  try {
    console.log('🔄 Obteniendo lista de supermercados...');
    
    // Por ahora devolvemos datos mock hasta que el backend esté listo
    const supermercadosMock = [
      'Carrefour',
      'Disco', 
      'Jumbo',
      'Vea',
      'Dia'
    ];
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('✅ Supermercados obtenidos:', supermercadosMock);
    return supermercadosMock;

    /* 
    // Código para cuando el backend esté listo:
    const res = await fetch("/api/supermercados");
    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }
    const data = await res.json();
    return data.supermercados || [];
    */
    
  } catch (err) {
    console.error("❌ Error al obtener supermercados:", err);
    mostrarError("No se pudieron cargar los supermercados. Usando valores por defecto.");
    
    // Fallback a datos locales
    return ['Carrefour', 'Disco', 'Jumbo', 'Vea', 'Dia'];
  }
}

/**
 * Obtiene categorías de productos
 * @returns {Promise<object[]>}
 */
export async function obtenerCategorias() {
  try {
    console.log('🔄 Obteniendo categorías...');
    
    // Datos mock por ahora
    const categoriasMock = [
      {
        id: 1,
        nombre: 'Lácteos',
        subcategorias: ['Leche', 'Yogur', 'Quesos', 'Manteca']
      },
      {
        id: 2,
        nombre: 'Panadería',
        subcategorias: ['Pan', 'Facturas', 'Galletitas', 'Tostadas']
      },
      {
        id: 3,
        nombre: 'Bebidas',
        subcategorias: ['Gaseosas', 'Jugos', 'Agua', 'Cervezas']
      },
      {
        id: 4,
        nombre: 'Limpieza',
        subcategorias: ['Detergente', 'Lavandina', 'Desinfectante', 'Papel']
      }
    ];
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('✅ Categorías obtenidas:', categoriasMock);
    return categoriasMock;
    
  } catch (err) {
    console.error("❌ Error al obtener categorías:", err);
    return [];
  }
}

/**
 * 🛒 FUNCIONES DE SUPERMERCADOS
 */

/**
 * Renderiza los botones de supermercados con sus logos
 * @param {string} containerId - ID del contenedor HTML
 */
export async function renderSupermercadoButtons(containerId) {
  const LOGO_PATH = "./assets/img/logos/";
  const DEFAULT_LOGO = "default_logo.png";
  
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`❌ No se encontró el contenedor: ${containerId}`);
    return;
  }

  console.log('🔄 Renderizando botones de supermercados...');
  
  // Mostrar spinner mientras carga
  container.innerHTML = '<div class="d-flex justify-content-center"><div class="spinner-border text-primary"></div></div>';

  try {
    const supermercados = await obtenerSupermercados();
    
    // Limpiar contenedor
    container.innerHTML = '';

    supermercados.forEach(nombre => {
      const btn = document.createElement("button");
      btn.classList.add("supermercado-btn");
      btn.setAttribute("data-supermercado", nombre);
      btn.title = `Seleccionar ${nombre}`;
      
      // Toggle selección al hacer click
      btn.onclick = () => {
        btn.classList.toggle("selected");
        console.log(`🏪 ${nombre} ${btn.classList.contains('selected') ? 'seleccionado' : 'deseleccionado'}`);
      };
      
      // Inicialmente todos seleccionados
      btn.classList.add("selected");

      // Crear imagen del logo
      const img = document.createElement("img");
      img.src = `${LOGO_PATH}${nombre.toLowerCase()}_logo.png`;
      img.alt = `Logo ${nombre}`;
      img.loading = "lazy";
      
      // Manejo de error de imagen
      img.onerror = () => {
        console.warn(`⚠️ Logo no encontrado: ${nombre}_logo.png. Usando logo por defecto.`);
        img.src = `${LOGO_PATH}${DEFAULT_LOGO}`;
        
        // Si tampoco existe el default, mostrar texto
        img.onerror = () => {
          const span = document.createElement('span');
          span.textContent = nombre;
          span.className = 'fw-bold text-primary';
          btn.replaceChild(span, img);
        };
      };

      btn.appendChild(img);
      container.appendChild(btn);
    });
    
    console.log('✅ Botones de supermercados renderizados correctamente');
    
  } catch (err) {
    console.error('❌ Error al renderizar botones:', err);
    container.innerHTML = `
      <div class="alert alert-warning">
        <i class="fas fa-exclamation-triangle me-2"></i>
        Error al cargar supermercados
      </div>
    `;
  }
}

/**
 * Obtiene los supermercados seleccionados
 * @returns {string[]}
 */
export function obtenerSupermercadosSeleccionados() {
  const botonesSeleccionados = document.querySelectorAll('.supermercado-btn.selected');
  const seleccionados = Array.from(botonesSeleccionados).map(btn => 
    btn.getAttribute('data-supermercado')
  );
  
  console.log('🏪 Supermercados seleccionados:', seleccionados);
  return seleccionados;
}

/**
 * 🔍 FUNCIONES DE BÚSQUEDA Y FILTROS
 */

/**
 * Debounce para optimizar búsquedas
 * @param {Function} func 
 * @param {number} delay 
 * @returns {Function}
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Filtra productos por texto de búsqueda
 * @param {object[]} productos 
 * @param {string} busqueda 
 * @returns {object[]}
 */
export function filtrarProductos(productos, busqueda) {
  if (!busqueda || busqueda.trim() === '') {
    return productos;
  }
  
  const termino = busqueda.toLowerCase().trim();
  
  return productos.filter(producto => 
    producto.nombre.toLowerCase().includes(termino) ||
    producto.marca.toLowerCase().includes(termino) ||
    producto.categoria.toLowerCase().includes(termino)
  );
}

/**
 * 📊 FUNCIONES DE ALMACENAMIENTO LOCAL
 */

/**
 * Guarda datos en localStorage de forma segura
 * @param {string} key 
 * @param {any} data 
 */
export function guardarEnStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`💾 Datos guardados en storage: ${key}`);
  } catch (err) {
    console.error('❌ Error al guardar en storage:', err);
  }
}

/**
 * Obtiene datos del localStorage de forma segura
 * @param {string} key 
 * @param {any} defaultValue 
 * @returns {any}
 */
export function obtenerDeStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error('❌ Error al leer storage:', err);
    return defaultValue;
  }
}

/**
 * 🎛️ FUNCIONES DE UTILIDAD
 */

/**
 * Genera un ID único
 * @returns {string}
 */
export function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Copia texto al portapapeles
 * @param {string} texto 
 */
export async function copiarAlPortapapeles(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    console.log('📋 Texto copiado al portapapeles');
  } catch (err) {
    console.error('❌ Error al copiar:', err);
  }
}

/**
 * Verifica si es un dispositivo móvil
 * @returns {boolean}
 */
export function esMobile() {
  return window.innerWidth <= 768;
}

/**
 * 🔄 FUNCIONES DE INICIALIZACIÓN
 */

/**
 * Inicializa tooltips de Bootstrap
 */
export function inicializarTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

/**
 * Inicializa todos los componentes helpers
 */
export function inicializarHelpers() {
  console.log('🚀 Inicializando helpers...');
  
  // Inicializar tooltips
  if (typeof bootstrap !== 'undefined') {
    inicializarTooltips();
  }
  
  // Log de información del dispositivo
  console.log('📱 Dispositivo móvil:', esMobile());
  console.log('🌐 User Agent:', navigator.userAgent);
  
  console.log('✅ Helpers inicializados correctamente');
}

// Auto-inicializar cuando se carga el módulo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarHelpers);
} else {
  inicializarHelpers();
}