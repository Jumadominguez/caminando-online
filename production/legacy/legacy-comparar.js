// comparar.js

import { obtenerProductosCargados } from './agregarProducto.js';

const contenedorResultados = document.getElementById('resultados');

export async function compararProductos() {
  const productos = obtenerProductosCargados();

  if (productos.length === 0) {
    alert('Agregá al menos un producto para comparar.');
    return;
  }

  try {
    const res = await fetch('/api/comparar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productos })
    });

    if (!res.ok) throw new Error('Error al consultar precios');

    const resultados = await res.json();
    renderizarTabla(resultados);
  } catch (err) {
    console.error(err);
    contenedorResultados.innerHTML = `<div class="alert alert-danger">No se pudo obtener la comparación de precios.</div>`;
  }
}

function renderizarTabla(data) {
  if (!data || data.length === 0) {
    contenedorResultados.innerHTML = `<div class="alert alert-warning">No se encontraron resultados para los productos seleccionados.</div>`;
    return;
  }

  let html = `<table class="table table-bordered">
    <thead>
      <tr>
        <th>Producto</th>
        <th>Marca</th>
        <th>Presentación</th>
        <th>Supermercado</th>
        <th>Precio</th>
      </tr>
    </thead>
    <tbody>`;

  data.forEach(item => {
    html += `<tr>
      <td>${item.nombre}</td>
      <td>${item.marca}</td>
      <td>${item.presentacion}</td>
      <td>${item.supermercado}</td>
      <td>$${item.precio.toFixed(2)}</td>
    </tr>`;
  });

  html += `</tbody></table>`;
  contenedorResultados.innerHTML = html;
}