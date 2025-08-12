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

/**
 * Obtiene la lista de supermercados desde el backend
 * @returns {Promise<string[]>}
 */
export async function obtenerSupermercados() {
  try {
    const res = await fetch("/api/supermercados");
    const data = await res.json();
    return data.supermercados || [];
  } catch (err) {
    console.error("Error al obtener supermercados:", err);
    return [];
  }
}

/**
 * Renderiza los botones de supermercados con sus logos
 * @param {string} containerId - ID del contenedor HTML
 */
export async function renderSupermercadoButtons(containerId) {
  const LOGO_PATH = "./assets/img/logos/";
  const DEFAULT_LOGO = "default_logo.png";
  const container = document.getElementById(containerId);
  if (!container) return;

  const supermercados = await obtenerSupermercados();

  supermercados.forEach(nombre => {
    const btn = document.createElement("button");
    btn.classList.add("supermercado-btn");
    btn.setAttribute("data-supermercado", nombre);
    btn.onclick = () => btn.classList.toggle("selected");

    const img = document.createElement("img");
    img.src = `${LOGO_PATH}${nombre}_logo.png`;
    img.alt = `Logo ${nombre}`;
    img.onerror = () => {
      console.warn(`Logo no encontrado: ${nombre}_logo.png. Usando logo por defecto.`);
      img.src = `${LOGO_PATH}${DEFAULT_LOGO}`;
    };

    btn.appendChild(img);
    container.appendChild(btn);
  });
}