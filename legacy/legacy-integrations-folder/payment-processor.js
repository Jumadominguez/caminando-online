// agregarProducto.js

const listaProductos = document.getElementById('lista-productos');
const productosCargados = [];

export function agregarProducto() {
  const nombre = document.getElementById('producto').value.trim();
  const marca = document.getElementById('marca').value;
  const presentacion = document.getElementById('presentacion').value.trim();

  if (!nombre || !marca || !presentacion) {
    alert('Por favor completá todos los campos.');
    return;
  }

  const producto = { nombre, marca, presentacion };
  productosCargados.push(producto);

  const item = document.createElement('li');
  item.className = 'list-group-item';
  item.textContent = `${nombre} - ${marca} - ${presentacion}`;
  listaProductos.appendChild(item);

  limpiarCampos();
}

function limpiarCampos() {
  document.getElementById('producto').value = '';
  document.getElementById('marca').selectedIndex = 0;
  document.getElementById('presentacion').value = '';
  const categoryMenu = document.getElementById('categoryMenu');
  categoryMenu?.classList.remove('show');
}

export function obtenerProductosCargados() {
  return productosCargados;
}

import { compararProductos } from './comparar.js';

document.querySelector('button.btn-primary').addEventListener('click', compararProductos);