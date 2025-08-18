// ===============================================
// DATA MANAGER - MÓDULO DE UTILIDADES Y DATOS
// ===============================================

/**
 * Módulo responsable de manejar todos los datos y utilidades
 * Incluye: cálculos, validaciones, sessionStorage, formateo
 */

// ===============================================
// FUNCIONES DE CÁLCULO DE PRECIOS
// ===============================================

/**
 * Calcula el precio promedio de un array de precios
 * @param {number[]} precios - Array de precios
 * @returns {number} - Precio promedio
 */
function calcularPromedio(precios) {
  if (!precios || precios.length === 0) return 0;
  const suma = precios.reduce((acc, precio) => acc + precio, 0);
  return Math.round(suma / precios.length);
}

/**
 * Encuentra el precio mínimo y su índice
 * @param {number[]} precios - Array de precios
 * @returns {Object} - {precio: number, indice: number}
 */
function encontrarPrecioMinimo(precios) {
  if (!precios || precios.length === 0) return { precio: 0, indice: -1 };
  
  const precio = Math.min(...precios);
  const indice = precios.indexOf(precio);
  
  return { precio, indice };
}

/**
 * Calcula el porcentaje de diferencia entre dos precios
 * @param {number} precioBase - Precio base para comparar
 * @param {number} precioComparar - Precio a comparar
 * @returns {number} - Porcentaje de diferencia
 */
function calcularPorcentajeDiferencia(precioBase, precioComparar) {
  if (precioBase === 0) return 0;
  return ((precioComparar - precioBase) / precioBase * 100);
}

/**
 * Calcula el total de ahorro comparando con el promedio
 * @param {number} totalOptimo - Total con mejores precios
 * @param {number[]} totalesSupermercados - Array de totales por supermercado
 * @returns {Object} - {ahorro: number, porcentaje: number}
 */
function calcularAhorro(totalOptimo, totalesSupermercados) {
  const promedio = calcularPromedio(totalesSupermercados);
  const ahorro = promedio - totalOptimo;
  const porcentaje = calcularPorcentajeDiferencia(promedio, totalOptimo);
  
  return {
    ahorro: Math.max(0, ahorro),
    porcentaje: Math.abs(porcentaje),
    promedio
  };
}

/**
 * Genera precios aleatorios para demo
 * @param {number} cantidad - Cantidad de precios a generar
 * @param {number} min - Precio mínimo
 * @param {number} max - Precio máximo
 * @returns {number[]} - Array de precios
 */
function generarPreciosDemo(cantidad = 5, min = 900, max = 1900) {
  return Array.from({ length: cantidad }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}

// ===============================================
// FUNCIONES DE SESSIONSTORAGE
// ===============================================

/**
 * Guarda datos en sessionStorage de forma segura
 * @param {string} key - Clave para guardar
 * @param {any} data - Datos a guardar
 * @returns {boolean} - true si se guardó exitosamente
 */
function guardarEnSession(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`❌ Error al guardar en sessionStorage (${key}):`, error);
    return false;
  }
}

/**
 * Obtiene datos de sessionStorage de forma segura
 * @param {string} key - Clave a buscar
 * @param {any} defaultValue - Valor por defecto si no existe
 * @returns {any} - Datos obtenidos o valor por defecto
 */
function obtenerDeSession(key, defaultValue = null) {
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`❌ Error al leer de sessionStorage (${key}):`, error);
    return defaultValue;
  }
}

/**
 * Elimina una clave de sessionStorage
 * @param {string} key - Clave a eliminar
 * @returns {boolean} - true si se eliminó exitosamente
 */
function eliminarDeSession(key) {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`❌ Error al eliminar de sessionStorage (${key}):`, error);
    return false;
  }
}

/**
 * Limpia completamente el sessionStorage
 * @returns {boolean} - true si se limpió exitosamente
 */
function limpiarSession() {
  try {
    sessionStorage.clear();
    return true;
  } catch (error) {
    console.error(`❌ Error al limpiar sessionStorage:`, error);
    return false;
  }
}

/**
 * Obtiene todos los productos comparados guardados
 * @returns {Array} - Array de productos
 */
function obtenerProductosComparados() {
  return obtenerDeSession('productosComparados', []);
}

/**
 * Obtiene todos los supermercados seleccionados
 * @returns {Array} - Array de supermercados
 */
function obtenerSupermercadosSeleccionados() {
  return obtenerDeSession('supermercadosSeleccionados', []);
}

/**
 * Guarda los productos seleccionados para comparar
 * @param {Array} productos - Array de productos
 * @returns {boolean} - true si se guardó exitosamente
 */
function guardarProductosComparados(productos) {
  return guardarEnSession('productosComparados', productos);
}

/**
 * Guarda los supermercados seleccionados
 * @param {Array} supermercados - Array de supermercados
 * @returns {boolean} - true si se guardó exitosamente
 */
function guardarSupermercadosSeleccionados(supermercados) {
  return guardarEnSession('supermercadosSeleccionados', supermercados);
}

// ===============================================
// FUNCIONES DE VALIDACIÓN
// ===============================================

/**
 * Valida si un precio es válido
 * @param {any} precio - Precio a validar
 * @returns {boolean} - true si es válido
 */
function esPrecioValido(precio) {
  return typeof precio === 'number' && precio > 0 && isFinite(precio);
}

/**
 * Valida si un array de productos es válido
 * @param {Array} productos - Array de productos
 * @returns {boolean} - true si es válido
 */
function esArrayProductosValido(productos) {
  return Array.isArray(productos) && productos.length > 0;
}

/**
 * Valida si un array de supermercados es válido
 * @param {Array} supermercados - Array de supermercados
 * @returns {boolean} - true si es válido
 */
function esArraySupermercadosValido(supermercados) {
  return Array.isArray(supermercados) && supermercados.length > 0;
}

/**
 * Valida si un nombre de producto es válido
 * @param {string} nombre - Nombre del producto
 * @returns {boolean} - true si es válido
 */
function esNombreProductoValido(nombre) {
  return typeof nombre === 'string' && nombre.trim().length > 0;
}

/**
 * Valida si los datos de comparación son válidos
 * @param {Array} productos - Array de productos
 * @param {Array} supermercados - Array de supermercados
 * @returns {Object} - {valido: boolean, errores: string[]}
 */
function validarDatosComparacion(productos, supermercados) {
  const errores = [];
  
  if (!esArrayProductosValido(productos)) {
    errores.push('Debe seleccionar al menos un producto');
  }
  
  if (!esArraySupermercadosValido(supermercados)) {
    errores.push('Debe seleccionar al menos un supermercado');
  }
  
  // Validar cada producto
  productos.forEach((producto, index) => {
    if (!esNombreProductoValido(producto.nombreCompleto)) {
      errores.push(`Producto ${index + 1} tiene un nombre inválido`);
    }
  });
  
  return {
    valido: errores.length === 0,
    errores
  };
}

// ===============================================
// FUNCIONES DE FORMATEO
// ===============================================

/**
 * Formatea un precio en pesos argentinos
 * @param {number} precio - Precio a formatear
 * @returns {string} - Precio formateado
 */
function formatearPrecio(precio) {
  if (!esPrecioValido(precio)) return '$0';
  return `$${precio.toLocaleString('es-AR')}`;
}

/**
 * Formatea un porcentaje
 * @param {number} porcentaje - Porcentaje a formatear
 * @param {number} decimales - Cantidad de decimales
 * @returns {string} - Porcentaje formateado
 */
function formatearPorcentaje(porcentaje, decimales = 1) {
  if (typeof porcentaje !== 'number' || !isFinite(porcentaje)) return '0%';
  return `${porcentaje.toFixed(decimales)}%`;
}

/**
 * Formatea un nombre de producto completo
 * @param {Object} producto - Objeto producto con detalles
 * @returns {string} - Nombre completo formateado
 */
function formatearNombreProducto(producto) {
  const partes = [
    producto.nombre,
    producto.marca,
    producto.contenido,
    producto.variedad
  ].filter(parte => parte && parte.trim());
  
  return partes.join(' ').trim();
}

/**
 * Extrae el texto limpio de un elemento HTML
 * @param {string} texto - Texto que puede contener HTML o caracteres especiales
 * @returns {string} - Texto limpio
 */
function limpiarTexto(texto) {
  if (typeof texto !== 'string') return '';
  return texto.replace(/[$,.]/g, '').trim();
}

/**
 * Convierte texto de precio a número
 * @param {string} textoPrecio - Texto del precio (ej: "$1,234")
 * @returns {number} - Precio como número
 */
function parsearPrecio(textoPrecio) {
  const limpio = limpiarTexto(textoPrecio);
  const numero = parseInt(limpio) || 0;
  return numero;
}

// ===============================================
// FUNCIONES DE TRANSFORMACIÓN DE DATOS
// ===============================================

/**
 * Convierte un array de filas DOM a array de productos
 * @param {NodeList} filas - Filas de la tabla DOM
 * @returns {Array} - Array de productos
 */
function extraerProductosDeTabla(filas) {
  return Array.from(filas).map(fila => {
    const celdas = fila.querySelectorAll('td');
    return {
      nombreCompleto: formatearNombreProducto({
        nombre: celdas[0]?.textContent?.trim() || '',
        marca: celdas[1]?.textContent?.trim() || '',
        contenido: celdas[2]?.textContent?.trim() || '',
        variedad: celdas[3]?.textContent?.trim() || ''
      })
    };
  });
}

/**
 * Extrae los supermercados seleccionados del DOM
 * @param {string} selector - Selector CSS para los botones de supermercados
 * @returns {Array} - Array de nombres de supermercados
 */
function extraerSupermercadosSeleccionados(selector) {
  const botones = document.querySelectorAll(`${selector} .supermercado-btn.selected`);
  
  return Array.from(botones).map(btn => {
    const img = btn.querySelector('img');
    const raw = img?.alt?.trim() || 'Sin nombre';
    return raw.replace(/^Logo\s*/i, '');
  });
}

/**
 * Calcula los totales por supermercado desde el DOM
 * @param {string} selectorTabla - Selector de la tabla de productos
 * @param {Array} supermercados - Array de supermercados
 * @returns {Object} - Objeto con totales por supermercado
 */
function calcularTotalesDesdeDOM(selectorTabla, supermercados) {
  const totales = {};
  let totalOnline = 0;

  // Inicializar totales
  supermercados.forEach(s => totales[s] = 0);

  // Calcular totales recorriendo las filas
  document.querySelectorAll(`${selectorTabla} tr`).forEach(fila => {
    const celdas = fila.querySelectorAll('td');
    
    supermercados.forEach((s, i) => {
      const textoValor = celdas[i + 1]?.querySelector('.precio-valor')?.textContent || '$0';
      const valor = parsearPrecio(textoValor);
      totales[s] += valor;
    });

    const textoOnline = celdas[celdas.length - 1]?.querySelector('.precio-caminando-valor')?.textContent || '$0';
    const valorOnline = parsearPrecio(textoOnline);
    totalOnline += valorOnline;
  });

  return { totales, totalOnline };
}

// ===============================================
// FUNCIONES DE FRECUENCIA Y DISTRIBUCIÓN
// ===============================================

/**
 * Inicializa el objeto de frecuencia de supermercados
 * @param {Array} supermercados - Array de supermercados
 * @returns {Object} - Objeto de frecuencia inicializado en 0
 */
function inicializarFrecuenciaSupermercados(supermercados) {
  const frecuencia = {};
  supermercados.forEach(s => frecuencia[s] = 0);
  return frecuencia;
}

/**
 * Encuentra el supermercado con menor frecuencia para balancear distribución
 * @param {Object} frecuencia - Objeto de frecuencia actual
 * @returns {string} - Nombre del supermercado con menor frecuencia
 */
function encontrarSupermercadoMenorFrecuencia(frecuencia) {
  const supermercados = Object.keys(frecuencia);
  if (supermercados.length === 0) return null;
  
  return supermercados.reduce((menor, actual) => 
    frecuencia[actual] < frecuencia[menor] ? actual : menor
  );
}

// ===============================================
// FUNCIONES DE SKU Y CÓDIGOS
// ===============================================

/**
 * Genera un SKU aleatorio
 * @param {number} longitud - Longitud del SKU
 * @returns {string} - SKU generado
 */
function generarSKU(longitud = 9) {
  return Math.random().toString(36).substr(2, longitud).toUpperCase();
}

/**
 * Genera un ID único para productos
 * @param {string} prefijo - Prefijo para el ID
 * @returns {string} - ID generado
 */
function generarIdProducto(prefijo = 'prod') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefijo}-${timestamp}-${random}`;
}

// ===============================================
// API PÚBLICA DEL MÓDULO
// ===============================================

// Exponer funciones públicas en el objeto window
window.DataManager = {
  // Cálculos
  calcularPromedio,
  encontrarPrecioMinimo,
  calcularPorcentajeDiferencia,
  calcularAhorro,
  generarPreciosDemo,
  
  // SessionStorage
  guardarEnSession,
  obtenerDeSession,
  eliminarDeSession,
  limpiarSession,
  obtenerProductosComparados,
  obtenerSupermercadosSeleccionados,
  guardarProductosComparados,
  guardarSupermercadosSeleccionados,
  
  // Validaciones
  esPrecioValido,
  esArrayProductosValido,
  esArraySupermercadosValido,
  esNombreProductoValido,
  validarDatosComparacion,
  
  // Formateo
  formatearPrecio,
  formatearPorcentaje,
  formatearNombreProducto,
  limpiarTexto,
  parsearPrecio,
  
  // Transformaciones
  extraerProductosDeTabla,
  extraerSupermercadosSeleccionados,
  calcularTotalesDesdeDOM,
  
  // Frecuencia
  inicializarFrecuenciaSupermercados,
  encontrarSupermercadoMenorFrecuencia,
  
  // Códigos
  generarSKU,
  generarIdProducto
};

console.log("📦 Módulo DataManager cargado");
