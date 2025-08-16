// ===============================================
// GENERADOR DE TABLAS - MÓDULO INDEPENDIENTE
// ===============================================

/**
 * Módulo responsable de generar todas las tablas de comparación de precios
 * Incluye: headers, filas de productos, celdas de precios, tablas de totales
 */

/**
 * Crea el header completo de la tabla de comparación
 * @param {string[]} supermercados - Array con nombres de supermercados
 * @returns {HTMLElement} - Elemento thead completo
 */
function crearThead(supermercados) {
  const thead = document.createElement("thead");
  thead.className = "thead-premium";
  const filaHead = document.createElement("tr");

  // Columna de productos
  const thProducto = document.createElement("th");
  thProducto.className = "th-producto-premium";
  filaHead.appendChild(thProducto);

  // Columnas de supermercados CON LOGOS
  supermercados.forEach((s, index) => {
    const th = document.createElement("th");
    th.className = "th-supermercado-premium";
    
    // Crear el logo del supermercado
    const logoPath = `/assets/img/logos/${s.toLowerCase()}_logo.png`;
    
    th.innerHTML = `
      <div class="th-content-premium">
        <div class="th-logo-container" style="margin: 0.5rem 0;">
          <img src="${logoPath}" 
               alt="Logo ${s}" 
               style="width: 80px; height: auto; max-height: 80px; object-fit: contain;"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
          <span class="th-text-fallback" style="display: none; font-weight: 600; color: white;">${s}</span>
        </div>
      </div>
    `;
    filaHead.appendChild(th);
  });

  // Columna Caminando Online (destacada)
  const thOnline = document.createElement("th");
  thOnline.className = "th-caminando-premium";
  thOnline.innerHTML = `
    <div class="th-content-caminando-premium">
      <span class="th-star">⭐</span>
      <span class="th-text" text-align="center">Caminando .Online</span>
    </div>
  `;
  filaHead.appendChild(thOnline);

  thead.appendChild(filaHead);
  return thead;
}

/**
 * Crea el cuerpo de la tabla con todos los productos
 * @param {Object[]} productos - Array de productos a mostrar
 * @param {string[]} supermercados - Array con nombres de supermercados
 * @param {Object} frecuenciaSupermercado - Objeto para tracking de frecuencia
 * @returns {HTMLElement} - Elemento tbody completo
 */
function crearTbody(productos, supermercados, frecuenciaSupermercado) {
  const tbody = document.createElement("tbody");
  tbody.className = "tbody-premium";
  tbody.id = "tabla-productos-comparados-body";

  productos.forEach((prod, index) => {
    const fila = crearFilaProducto(prod, index, supermercados, frecuenciaSupermercado);
    tbody.appendChild(fila);
  });

  return tbody;
}

/**
 * Crea una fila individual de producto con precios
 * @param {Object} producto - Datos del producto
 * @param {number} index - Índice del producto
 * @param {string[]} supermercados - Array con nombres de supermercados
 * @param {Object} frecuenciaSupermercado - Objeto para tracking de frecuencia
 * @returns {HTMLElement} - Elemento tr de la fila
 */
function crearFilaProducto(producto, index, supermercados, frecuenciaSupermercado) {
  // Generar precios aleatorios para demo
  const precios = supermercados.map(() => Math.floor(Math.random() * 1000 + 900));
  const precioMin = Math.min(...precios);
  const indexMejorPrecio = precios.indexOf(precioMin);
  const supermercadoMejor = supermercados[indexMejorPrecio];
  
  // Actualizar frecuencia para algoritmo de distribución
  frecuenciaSupermercado[supermercadoMejor]++;

  const fila = document.createElement("tr");
  fila.className = "fila-producto-premium";
  fila.style.animationDelay = `${index * 0.05}s`;

  // Celda del producto
  fila.appendChild(crearCeldaProducto(producto, index));

  // Celdas de precios por supermercado
  precios.forEach((precio, i) => {
    fila.appendChild(crearCeldaPrecio(precio, i === indexMejorPrecio, precioMin));
  });

  // Celda Caminando Online
  fila.appendChild(crearCeldaCaminando(precioMin, supermercadoMejor));

  return fila;
}

/**
 * Crea la celda de información del producto
 * @param {Object} producto - Datos del producto
 * @param {number} index - Índice del producto
 * @returns {HTMLElement} - Elemento td de la celda
 */
function crearCeldaProducto(producto, index) {
  const celda = document.createElement("td");
  celda.className = "td-producto-premium";
  
  // Usar el nombreCompleto si existe, sino generar uno
  const nombreProducto = producto.nombreCompleto || `Producto ${index + 1}`;
  
  celda.innerHTML = `
    <div class="producto-info-premium">
      <span class="producto-numero">#${index + 1}</span>
      <div class="producto-detalles">
        <span class="producto-nombre-premium">${nombreProducto}</span>
        <span class="producto-codigo">SKU: ${window.DataManager ? window.DataManager.generarSKU() : generarSKU()}</span>
      </div>
    </div>
  `;
  return celda;
}

/**
 * Crea una celda de precio para un supermercado
 * @param {number} precio - Precio del producto
 * @param {boolean} esMejor - Si es el mejor precio
 * @param {number} precioMin - Precio mínimo para comparación
 * @returns {HTMLElement} - Elemento td de la celda
 */
function crearCeldaPrecio(precio, esMejor, precioMin) {
  const celda = document.createElement("td");
  celda.className = "td-precio-premium";
  
  if (esMejor) {
    celda.innerHTML = `
      <div class="precio-box mejor">
        <span class="precio-valor">$${precio.toLocaleString('es-AR')}</span>
      </div>
    `;
  } else {
    const diferencia = precio - precioMin;
    const porcentajeDif = ((diferencia / precioMin) * 100).toFixed(1);
    celda.innerHTML = `
      <div class="precio-box">
        <span class="precio-valor">$${precio.toLocaleString('es-AR')}</span>
        <span class="precio-diferencia">+$${diferencia} (${porcentajeDif}%)</span>
      </div>
    `;
  }
  
  return celda;
}

/**
 * Crea la celda especial de Caminando Online
 * @param {number} precioMin - Precio mínimo
 * @param {string} supermercadoMejor - Supermercado con mejor precio
 * @returns {HTMLElement} - Elemento td de la celda
 */
function crearCeldaCaminando(precioMin, supermercadoMejor) {
  const celda = document.createElement("td");
  celda.className = "td-caminando-premium";
  celda.innerHTML = `
    <div class="precio-caminando-box">
      <span class="precio-caminando-valor">$${precioMin.toLocaleString('es-AR')}</span>
      <span class="precio-caminando-ahorro">Mejor precio</span>
      <div class="precio-caminando-super">
        <small>vía ${supermercadoMejor}</small>
      </div>
    </div>
  `;
  return celda;
}

/**
 * Crea la tabla de totales con logos de supermercados
 * @param {Object} totales - Objeto con totales por supermercado
 * @param {number} totalOnline - Total de Caminando Online
 * @param {string[]} supermercados - Array con nombres de supermercados
 * @returns {HTMLElement} - Elemento table completo
 */
function crearTablaTotales(totales, totalOnline, supermercados) {
  const tabla = document.createElement("table");
  tabla.className = "table tabla-totales-premium";

  const thead = document.createElement("thead");
  const filaHead = document.createElement("tr");
  
  // Columnas de supermercados con logos
  supermercados.forEach(s => {
    const logoPath = `/assets/img/logos/${s.toLowerCase()}_logo.png`;
    filaHead.innerHTML += `
      <th style="text-align: center; padding: 1rem;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <img src="${logoPath}" 
               alt="Logo ${s}" 
               style="width: 100px; height: auto; max-height: 50px; object-fit: contain;"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
          <span style="display: none; font-weight: 600; color: white; font-size: 0.9rem;">${s}</span>
        </div>
      </th>
    `;
  });
  
  filaHead.innerHTML += '<th class="th-caminando-total"; style="text-align: center">Caminando Online</th>';
  
  thead.appendChild(filaHead);
  tabla.appendChild(thead);

  const tbody = document.createElement("tbody");
  const filaTotal = crearFilaTotales(totales, totalOnline, supermercados);
  tbody.appendChild(filaTotal);
  tabla.appendChild(tbody);

  return tabla;
}

/**
 * Crea la fila de totales
 * @param {Object} totales - Objeto con totales por supermercado
 * @param {number} totalOnline - Total de Caminando Online
 * @param {string[]} supermercados - Array con nombres de supermercados
 * @returns {HTMLElement} - Elemento tr de la fila
 */
function crearFilaTotales(totales, totalOnline, supermercados) {
  const fila = document.createElement("tr");
  
  supermercados.forEach(s => {
    fila.innerHTML += `
      <td>
        <div class="total-box">
          <span class="total-valor">$${totales[s].toLocaleString('es-AR')}</span>
        </div>
      </td>
    `;
  });
  
  fila.innerHTML += `
    <td class="td-total-caminando">
      <div class="total-caminando-box">
        <span class="total-caminando-valor">$${totalOnline.toLocaleString('es-AR')}</span>
        <span class="badge-mejor-precio">¡MEJOR PRECIO TOTAL!</span>
      </div>
    </td>
  `;
  
  return fila;
}

// ===============================================
// FUNCIONES UTILITARIAS
// ===============================================

/**
 * Genera un SKU aleatorio
 * @returns {string} - SKU generado
 */
function generarSKU() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

// ===============================================
// API PÚBLICA DEL MÓDULO
// ===============================================

// Exponer funciones públicas en el objeto window para compatibilidad
window.TablaGenerator = {
  crearThead: crearThead,
  crearTbody: crearTbody,
  crearFilaProducto: crearFilaProducto,
  crearCeldaProducto: crearCeldaProducto,
  crearCeldaPrecio: crearCeldaPrecio,
  crearCeldaCaminando: crearCeldaCaminando,
  crearTablaTotales: crearTablaTotales,
  crearFilaTotales: crearFilaTotales,
  generarSKU: generarSKU
};

console.log("📦 Módulo TablaGenerator cargado");
