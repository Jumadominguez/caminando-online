// helpers.js

/**
 * Valida que todos los campos requeridos estén completos
 * @param {string[]} campos - array de valores
 * @returns {boolean}
 */
export function camposCompletos(campos) {
  return campos.every(c => c && c.trim() !== '');
}

/**
 * Formatea un número como precio en ARS
 * @param {number} valor
 * @returns {string}
 */
export function formatearPrecio(valor) {
  return `$${valor.toFixed(2)}`;
}

/**
 * Crea un elemento <li> para la lista de productos
 * @param {object} producto - { nombre, marca, presentacion }
 * @returns {HTMLElement}
 */
export function crearItemProducto(producto) {
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.textContent = `${producto.nombre} - ${producto.marca} - ${producto.presentacion}`;
  return li;
}

/**
 * Muestra un mensaje de error en consola y opcionalmente en pantalla
 * @param {string} mensaje
 * @param {HTMLElement} contenedor
 */
export function mostrarError(mensaje, contenedor = null) {
  console.error(mensaje);
  if (contenedor) {
    contenedor.innerHTML = `<div class="alert alert-danger">${mensaje}</div>`;
  }
}