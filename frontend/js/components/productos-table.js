import { Storage } from '../core/storage.js';
import { Utils } from '../core/utils.js';

export class ProductosTable {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.productos = [];
    this.filtros = { marca: '', contenido: '', variedad: '' };
    this.init();
  }
  
  init() {
    this.crearEstructuraTabla();
    this.cargarProductosEjemplo();
    this.configurarFiltros();
    this.configurarEventListeners();
  }
  
  crearEstructuraTabla() {
    // Crear la estructura de tabla que está en main.js
    const wrapper = document.createElement("div");
    wrapper.className = "tabla-wrapper-moderna";
    wrapper.innerHTML = `
      <div class="tabla-header-info mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0 d-flex align-items-center gap-2">
            <span class="badge bg-success">40</span>
            Productos disponibles
          </h5>
          <div class="tabla-filters">
            <small class="text-muted">
              <i class="fas fa-filter"></i>
              Usá los filtros de arriba para refinar tu búsqueda
            </small>
          </div>
        </div>
      </div>
      <div class="table-responsive tabla-scroll-moderna">
        <table class="table table-hover tabla-productos-mejorada mb-0">
          <thead class="table-dark">
            <tr>
              <th class="col-producto">
                <div class="th-content">
                  <span class="th-icon">🛒</span>
                  <span>Producto</span>
                </div>
              </th>
              <th class="col-marca">
                <div class="th-content">
                  <span class="th-icon">🏷️</span>
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
                  <span class="th-icon">⚡</span>
                  <span>Acción</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody id="tabla-productos-body" class="table-body-modern"></tbody>
        </table>
      </div>
    `;
    
    this.container.appendChild(wrapper);
    this.tbody = document.getElementById('tabla-productos-body');
  }
  
  cargarProductosEjemplo() {
    // Productos de ejemplo extraídos de main.js
    this.productos = [
      { nombre: "Aceite de Girasol", marca: "Natura", contenido: "900ml", variedad: "Clásico" },
      { nombre: "Arroz Largo Fino", marca: "Gallo Oro", contenido: "1kg", variedad: "Parboil" },
      { nombre: "Fideos Largos", marca: "Matarazzo", contenido: "500g", variedad: "Spaghetti" },
      { nombre: "Atún al Natural", marca: "La Campagnola", contenido: "170g", variedad: "Lomitos" },
      { nombre: "Leche Entera", marca: "La Serenísima", contenido: "1L", variedad: "Fortificada" },
      { nombre: "Yogur Natural", marca: "Sancor", contenido: "900g", variedad: "Cremoso" },
      { nombre: "Pan Lactal", marca: "Bimbo", contenido: "680g", variedad: "Integral" },
      { nombre: "Manteca", marca: "Sancor", contenido: "200g", variedad: "Con Sal" },
      { nombre: "Queso Cremoso", marca: "La Paulina", contenido: "300g", variedad: "Untable" },
      { nombre: "Jamón Cocido", marca: "Swift", contenido: "200g", variedad: "Tradicional" }
    ];
    
    this.renderizarProductos();
  }
  
  renderizarProductos() {
    this.tbody.innerHTML = '';
    
    this.productos.forEach((producto, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="celda-producto">
          <div class="producto-info">
            <span class="producto-nombre">${producto.nombre}</span>
          </div>
        </td>
        <td class="celda-marca">
          <span class="marca-badge">${producto.marca}</span>
        </td>
        <td class="celda-contenido">
          <span class="contenido-info">${producto.contenido}</span>
        </td>
        <td class="celda-variedad">
          <span class="variedad-tag">${producto.variedad}</span>
        </td>
        <td class="celda-accion">
          <button class="btn btn-outline-primary btn-sm agregar-producto-btn" 
                  onclick="window.agregarProductoAComparar('${producto.nombre}', '${producto.marca}', '${producto.contenido}', '${producto.variedad}')">
            <i class="fas fa-plus"></i>
          </button>
        </td>
      `;
      
      this.tbody.appendChild(row);
      
      // Animación de entrada
      setTimeout(() => {
        Utils.animarElemento(row);
      }, index * 50);
    });
  }
  
  aplicarFiltros() {
    const filas = this.tbody.querySelectorAll('tr');
    
    filas.forEach(fila => {
      const celdas = fila.querySelectorAll('td');
      const marca = celdas[1]?.textContent.trim() || '';
      const contenido = celdas[2]?.textContent.trim() || '';
      const variedad = celdas[3]?.textContent.trim() || '';
      
      const coincideMarca = !this.filtros.marca || marca === this.filtros.marca;
      const coincideContenido = !this.filtros.contenido || contenido === this.filtros.contenido;
      const coincideVariedad = !this.filtros.variedad || variedad === this.filtros.variedad;
      
      const mostrar = coincideMarca && coincideContenido && coincideVariedad;
      fila.style.display = mostrar ? '' : 'none';
    });
  }
  
  configurarFiltros() {
    // Configurar los filtros de marca, contenido y variedad
    // Extraído de main.js
  }
  
  configurarEventListeners() {
    // Event listeners para la tabla
  }
}
