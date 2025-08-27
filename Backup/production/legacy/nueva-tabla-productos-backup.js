/**
 * Crea una tabla de productos completamente nueva - REDISEÑADA CON ESTILO MODERNO
 */
function crearTablaProductosRediseñada(tipoSeleccionado) {
  console.log(`🎯 Creando tabla rediseñada para: ${tipoSeleccionado}`);
  
  // Buscar contenedor
  let contenedor = document.getElementById("area-tablas-dinamicas");
  if (!contenedor) {
    const compararBox = document.getElementById("comparar-box");
    contenedor = compararBox?.parentNode;
  }
  
  if (!contenedor) {
    console.error("❌ No se encontró contenedor para la tabla");
    return;
  }
  
  // Crear wrapper principal con el nuevo diseño
  const tablaWrapper = document.createElement("div");
  tablaWrapper.id = "tabla-productos";
  
  // HTML rediseñado con estructura moderna
  tablaWrapper.innerHTML = `
    <!-- Header rediseñado con gradiente naranja y badge naranja -->
    <div class="card-header">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0 d-flex align-items-center">
          <span class="badge bg-success me-2">${40}</span>
          <i class="fas fa-shopping-cart me-2"></i>
          Productos disponibles - ${tipoSeleccionado}
        </h5>
        <div class="text-muted small">
          <i class="fas fa-filter me-1"></i>
          Usá los filtros de arriba para refinar tu búsqueda
        </div>
      </div>
    </div>
    
    <!-- Tabla principal rediseñada con mejor estructura -->
    <div class="table-responsive">
      <table class="table mb-0">
        <thead class="table-light sticky-top">
          <tr>
            <th class="sortable" data-column="producto" data-order="none">
              <div class="d-flex align-items-center gap-2 sort-header">
                <i class="fas fa-tag"></i>
                <span>Producto</span>
                <i class="fas fa-sort sort-icon"></i>
              </div>
            </th>
            <th class="text-center sortable" data-column="marca" data-order="none">
              <div class="d-flex align-items-center justify-content-center gap-2 sort-header">
                <i class="fas fa-building"></i>
                <span>Marca</span>
                <i class="fas fa-sort sort-icon"></i>
              </div>
            </th>
            <th class="text-center sortable" data-column="contenido" data-order="none">
              <div class="d-flex align-items-center justify-content-center gap-2 sort-header">
                <i class="fas fa-box"></i>
                <span>Contenido</span>
                <i class="fas fa-sort sort-icon"></i>
              </div>
            </th>
            <th class="text-center sortable" data-column="variedad" data-order="none">
              <div class="d-flex align-items-center justify-content-center gap-2 sort-header">
                <i class="fas fa-star"></i>
                <span>Variedad</span>
                <i class="fas fa-sort sort-icon"></i>
              </div>
            </th>
          </tr>
        </thead>
        <tbody id="tabla-productos-body">
          ${generarFilasProductos()}
        </tbody>
      </table>
    </div>
  `;
  
  // Insertar en el contenedor
  if (contenedor.id === "area-tablas-dinamicas") {
    contenedor.appendChild(tablaWrapper);
  } else {
    const compararBox = document.getElementById("comparar-box");
    if (compararBox) {
      contenedor.insertBefore(tablaWrapper, compararBox);
    }
  }
  
  // Crear y agregar el texto instructivo DEBAJO de la tabla
  const notaInstructiva = document.createElement("div");
  notaInstructiva.className = "tabla-note";
  notaInstructiva.innerHTML = `
    <small class="text-muted">
      <i class="fas fa-info-circle"></i>
      Hacé clic en cualquier producto para agregarlo a la comparación
    </small>
  `;
  
  // Insertar la nota después de la tabla
  if (contenedor.id === "area-tablas-dinamicas") {
    contenedor.appendChild(notaInstructiva);
  } else {
    const compararBox = document.getElementById("comparar-box");
    if (compararBox) {
      contenedor.insertBefore(notaInstructiva, compararBox);
    }
  }
  
  // Animación de entrada
  tablaWrapper.style.opacity = "0";
  tablaWrapper.style.transform = "translateY(20px)";
  
  // Animación inicial para la nota instructiva
  notaInstructiva.style.opacity = "0";
  notaInstructiva.style.transform = "translateY(10px)";
  
  setTimeout(() => {
    tablaWrapper.style.transition = "all 0.5s ease";
    tablaWrapper.style.opacity = "1";
    tablaWrapper.style.transform = "translateY(0)";
    
    // Animar la nota instructiva con un pequeño delay
    setTimeout(() => {
      notaInstructiva.style.transition = "all 0.3s ease";
      notaInstructiva.style.opacity = "1";
      notaInstructiva.style.transform = "translateY(0)";
    }, 200);
  }, 100);
  
  console.log(`✅ Tabla rediseñada creada para ${tipoSeleccionado}`);
}
