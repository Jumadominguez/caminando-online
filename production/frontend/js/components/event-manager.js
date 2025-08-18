/**
 * Ordena la tabla de productos según la columna seleccionada
 */
function ordenarTablaProductos(header) {
  console.log('🔄 Ordenando tabla por:', header.dataset.column);
  
  const column = header.dataset.column;
  const currentOrder = header.dataset.order;
  
  // Determinar nuevo orden
  let newOrder;
  if (currentOrder === 'none') {
    newOrder = 'asc';
  } else if (currentOrder === 'asc') {
    newOrder = 'desc';
  } else {
    newOrder = 'asc';
  }
  
  // Resetear todos los headers
  document.querySelectorAll('.sortable').forEach(th => {
    th.dataset.order = 'none';
    const icon = th.querySelector('.sort-icon');
    if (icon) {
      icon.className = 'fas fa-sort sort-icon';
    }
  });
  
  // Establecer el nuevo orden
  header.dataset.order = newOrder;
  const sortIcon = header.querySelector('.sort-icon');
  if (sortIcon) {
    if (newOrder === 'asc') {
      sortIcon.className = 'fas fa-sort-up sort-icon active';
    } else {
      sortIcon.className = 'fas fa-sort-down sort-icon active';
    }
  }
  
  // Obtener filas
  const tbody = document.querySelector('#tabla-productos-body');
  const filas = Array.from(tbody.querySelectorAll('tr'));
  
  // Ordenar filas
  filas.sort((a, b) => {
    let valorA, valorB;
    
    switch (column) {
      case 'producto':
        valorA = a.querySelector('.fw-bold')?.textContent?.trim() || '';
        valorB = b.querySelector('.fw-bold')?.textContent?.trim() || '';
        break;
      case 'marca':
        valorA = a.querySelector('.badge.bg-primary')?.textContent?.trim() || '';
        valorB = b.querySelector('.badge.bg-primary')?.textContent?.trim() || '';
        break;
      case 'contenido':
        valorA = a.querySelector('.badge.bg-info')?.textContent?.trim() || '';
        valorB = b.querySelector('.badge.bg-info')?.textContent?.trim() || '';
        // Para contenido, intentar convertir a número si es posible
        const numA = extraerNumeroDeContenido(valorA);
        const numB = extraerNumeroDeContenido(valorB);
        if (numA !== null && numB !== null) {
          if (newOrder === 'asc') {
            return numA - numB;
          } else {
            return numB - numA;
          }
        }
        break;
      case 'variedad':
        valorA = a.querySelector('.badge.bg-success')?.textContent?.trim() || '';
        valorB = b.querySelector('.badge.bg-success')?.textContent?.trim() || '';
        break;
    }
    
    // Ordenamiento alfabético
    if (newOrder === 'asc') {
      return valorA.localeCompare(valorB, 'es', { numeric: true, sensitivity: 'base' });
    } else {
      return valorB.localeCompare(valorA, 'es', { numeric: true, sensitivity: 'base' });
    }
  });
  
  // Limpiar tbody y agregar filas ordenadas
  tbody.innerHTML = '';
  filas.forEach((fila, index) => {
    // Aplicar animación escalonada
    fila.style.animationDelay = `${index * 0.05}s`;
    tbody.appendChild(fila);
  });
  
  console.log(`✅ Tabla ordenada por ${column} en orden ${newOrder}`);
}

/**
 * Extrae número del contenido para ordenamiento numérico
 */
function extraerNumeroDeContenido(texto) {
  const match = texto.match(/([\d.,]+)\s*(ml|l|gr?|kg|cc|oz|lb)/i);
  if (match) {
    let numero = parseFloat(match[1].replace(',', '.'));
    const unidad = match[2].toLowerCase();
    
    // Convertir a la misma unidad base
    if (unidad === 'l') numero *= 1000; // litros a ml
    if (unidad === 'kg') numero *= 1000; // kg a gr
    if (unidad === 'lb') numero *= 453.592; // lb a gr
    if (unidad === 'oz') numero *= 29.5735; // oz a ml
    
    return numero;
  }
  return null;
}

// ===============================================
// MANEJADOR DE EVENTOS - MÓDULO INDEPENDIENTE
// ===============================================

/**
 * Módulo responsable de manejar todos los eventos de la interfaz
 * Incluye: productos, filtros, navegación, comparación
 */

// Variables globales del módulo EventManager
let eventoProductoInput, eventoCategoryMenu, eventoBtnComparar, eventoFiltroMarca, eventoFiltroContenido, eventoFiltroVariedad, eventoTipoProductoSelect;

/**
 * Inicializa todos los event listeners de la aplicación
 */
function inicializarEventListeners() {
  console.log("🎯 Iniciando Event Manager...");
  
  // Obtener elementos del DOM
  obtenerElementosDOM();
  
  // Configurar event listeners principales
  configurarEventListenersPrincipales();
  
  // Configurar event delegation
  configurarEventDelegation();
  
  console.log("✅ Event Manager inicializado");
}

/**
 * Obtiene todas las referencias a elementos del DOM
 */
function obtenerElementosDOM() {
  eventoProductoInput = document.getElementById("producto");
  eventoCategoryMenu = document.getElementById("categoryMenu");
  eventoBtnComparar = document.querySelector("#comparar-box .comparar-btn");
  eventoFiltroMarca = document.getElementById("marca");
  eventoFiltroContenido = document.getElementById("contenido");
  eventoFiltroVariedad = document.getElementById("variedad");
  eventoTipoProductoSelect = document.getElementById("tipo-de-producto");
}

/**
 * Configura los event listeners principales
 */
function configurarEventListenersPrincipales() {
  // Event listeners de productos y categorías
  eventoProductoInput?.addEventListener("click", showCategoryMenu);
  eventoProductoInput?.addEventListener("input", filterCategoryMenu);
  
  // Event listener de comparación
  eventoBtnComparar?.addEventListener("click", compararProductos);
  
  // Event listener de tipo de producto
  eventoTipoProductoSelect?.addEventListener("change", renderTablaProductos);

  // Cerrar menú si se hace clic fuera
  document.addEventListener("click", e => {
    if (!e.target.closest(".category-dropdown")) {
      eventoCategoryMenu?.style && (eventoCategoryMenu.style.display = "none");
    }
  });

  // Event listeners para filtros
  [eventoFiltroMarca, eventoFiltroContenido, eventoFiltroVariedad].forEach(filtro => {
    filtro?.addEventListener("change", aplicarFiltros);
  });

  console.log("✅ Event listeners principales configurados");
}

/**
 * Configura event delegation para botones dinámicos
 */
function configurarEventDelegation() {
  document.addEventListener("click", handleDynamicButtons);
  console.log("✅ Event delegation configurado");
}

/**
 * Maneja todos los clics en botones dinámicos
 */
function handleDynamicButtons(e) {
  console.log('🔍 Click detectado en:', e.target);
  
  // Click en header para ordenar
  const headerSortable = e.target.closest(".sortable");
  if (headerSortable) {
    ordenarTablaProductos(headerSortable);
    return;
  }

  // Botón eliminar producto - Mejorar detección
  if (e.target.matches(".eliminar-btn") || e.target.matches(".eliminar-btn *") || e.target.closest(".eliminar-btn")) {
    e.preventDefault();
    e.stopPropagation();
    const btn = e.target.closest(".eliminar-btn") || e.target;
    console.log('🗑️ Botón eliminar clickeado:', btn);
    eliminarProductoDeComparacion(btn);
    return;
  }

  // Click en fila de producto (para agregar) - Solo si no es un botón
  const filaProducto = e.target.closest("#tabla-productos .fila-clickeable");
  if (filaProducto && !e.target.closest("button")) {
    agregarProductoDesdeFilaCompleta(filaProducto);
    return;
  }

  // Botón limpiar filtros - MEJORAR DETECCIÓN
  if (e.target.matches("#btn-limpiar-filtros") || e.target.closest("#btn-limpiar-filtros")) {
    console.log('🧹 Botón limpiar todos clickeado');
    limpiarTodosLosProductos();
    return;
  }
}

// ===============================================
// FUNCIONES DE PRODUCTOS
// ===============================================

/**
 * Crea la tabla de productos a comparar
 */
function crearTablaComparacion() {
  if (document.getElementById("productos-a-comparar")) return;

  const wrapper = document.createElement("div");
  wrapper.id = "tabla-comparacion-wrapper";
  wrapper.className = "mt-4";

  wrapper.innerHTML = `
    <div class="tabla-comparacion">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0 d-flex align-items-center gap-2">
          <span class="badge bg-primary" id="contador-productos">0</span>
            Productos seleccionados para comparar
        </h5>
        <button id="btn-limpiar-filtros" class="btn-limpiar-personalizado">
          <i class="fas fa-broom"></i>
          <span>Limpiar todos</span>
        </button>
      </div>
      
      <!-- Header independiente (sin contenido) -->
      <div class="tabla-header-independiente">
        <div class="header-producto">
          <div class="th-content">
            <!-- Sin contenido, solo el fondo verde -->
          </div>
        </div>
      </div>
      
      <div class="tabla-a-comparar-scroll mb-3">
        <table class="table tabla-a-comparar mb-0">
          <!-- THEAD ELIMINADO - Header ahora es independiente -->
          <tbody id="productos-a-comparar" class="table-body-modern"></tbody>
        </table>
      </div>
    </div>
  `;

  const compararBox = document.getElementById("comparar-box");
  if (compararBox) {
    compararBox.parentNode.insertBefore(wrapper, compararBox);
  }
}

/**
 * Agrega un producto a la tabla de comparación desde una fila completa
 */
function agregarProductoDesdeFilaCompleta(fila) {
  const id = fila.getAttribute("data-id");
  
  if (!id) {
    console.warn("⚠️ Fila sin ID encontrada");
    return;
  }

  if (document.querySelector(`#productos-a-comparar tr[data-id="${id}"]`)) {
    console.log(`📋 Producto ${id} ya está en la lista`);
    return;
  }

  // Crear tabla si no existe
  crearTablaComparacion();

  // Extraer datos de la fila usando selectores de Bootstrap
  const nombreProducto = fila.querySelector('.fw-bold')?.textContent || 'Producto';
  const sku = fila.querySelector('.text-muted')?.textContent || `SKU: ${id.toUpperCase()}`;
  const marca = fila.querySelector('.badge.bg-primary')?.textContent || '';
  const contenido = fila.querySelector('.badge.bg-info')?.textContent || '';
  const variedad = fila.querySelector('.badge.bg-success')?.textContent || '';
  
  // Crear string con los badges
  const badges = [marca, contenido, variedad].filter(item => item).join(', ');
  const nombreCompleto = badges ? `${nombreProducto} - ${badges}` : nombreProducto;

  // Crear nueva fila con solo 2 columnas
  const nuevaFila = document.createElement('tr');
  nuevaFila.className = 'fila-producto';
  nuevaFila.setAttribute('data-id', id);
  
  nuevaFila.innerHTML = `
    <td class="celda-producto">
      <div class="producto-info">
        <span class="producto-nombre">${nombreCompleto}</span>
        <small class="producto-codigo">${sku}</small>
      </div>
      <button class="eliminar-btn" data-id="${id}">
        <i class="fas fa-times"></i>
      </button>
    </td>
  `;

  const tbody = document.querySelector("#productos-a-comparar");
  if (tbody) {
    tbody.appendChild(nuevaFila);
  }
  
  // Marcar fila original como seleccionada
  fila.classList.add('fila-seleccionada');
  
  // Animación de entrada
  animarEntrada(nuevaFila);
  actualizarContadorProductos();
  
  console.log(`✅ Producto ${id} agregado desde fila completa`);
}



/**
 * Elimina un producto de la tabla de comparación
 */
function eliminarProductoDeComparacion(btn) {
  const fila = btn.closest("tr");
  const id = fila.dataset.id;
  
  console.log(`🗑️ Eliminando producto ID: ${id}`);
  
  // Aplicar la clase de animación fade-out hacia la izquierda
  fila.classList.add('fila-eliminando');
  
  // Esperar a que termine la animación CSS antes de eliminar (250ms)
  setTimeout(() => {
    fila.remove();
    
    // Quitar marca de selección de la fila original en la tabla de productos
    const filaOriginal = document.querySelector(`#tabla-productos tbody .fila-clickeable[data-id="${id}"]`);
    if (filaOriginal) {
      filaOriginal.classList.remove('fila-seleccionada');
      console.log(`✅ Clase 'fila-seleccionada' removida de producto ${id}`);
    } else {
      console.warn(`⚠️ No se encontró fila original para producto ${id}`);
    }
    
    // Re-habilitar botón original si existe (por compatibilidad)
    const btnOriginal = document.querySelector(`button.btn-success[data-id="${id}"]`);
    if (btnOriginal) {
      btnOriginal.disabled = false;
      console.log(`✅ Botón original rehabilitado para producto ${id}`);
    }

    const compararBody = document.getElementById("productos-a-comparar");
    if (compararBody && compararBody.children.length === 0) {
      document.getElementById("tabla-comparacion-wrapper")?.remove();
      console.log(`🗑️ Tabla de comparación eliminada - no quedan productos`);
    }
    
    actualizarContadorProductos();
  }, 250); // Coincide con la duración de la animación CSS (0.25s)
}

/**
 * Limpia todos los productos seleccionados con animación de fade out hacia la izquierda
 */
function limpiarTodosLosProductos() {
  const filas = document.querySelectorAll("#productos-a-comparar tr");
  const cantidad = filas.length;
  
  if (cantidad === 0) return;
  
  // Usar popup personalizado en lugar de confirm genérico
  mostrarPopupLimpiarProductos(cantidad, () => {
    console.log(`🧩 Limpiando ${cantidad} productos...`);
    
    // Aplicar animación de fade out a la izquierda a todas las filas
    filas.forEach((fila, index) => {
      setTimeout(() => {
        fila.classList.add('fila-eliminando');
      }, index * 75); // Animación escalonada cada 75ms
    });
    
    // Esperar a que todas las animaciones terminen y luego eliminar
    const tiempoTotal = cantidad * 75 + 250; // Tiempo de animación + última fila
    setTimeout(() => {
      // Eliminar todas las filas y quitar selección
      filas.forEach(fila => {
        const id = fila.dataset.id;
        
        // Quitar marca de selección de la fila original en la tabla de productos
        const filaOriginal = document.querySelector(`#tabla-productos tbody .fila-clickeable[data-id="${id}"]`);
        if (filaOriginal) {
          filaOriginal.classList.remove('fila-seleccionada');
          console.log(`✅ Clase 'fila-seleccionada' removida de producto ${id}`);
        } else {
          console.warn(`⚠️ No se encontró fila original para producto ${id}`);
        }
        
        // Re-habilitar botón original si existe (por compatibilidad)
        const btnOriginal = document.querySelector(`button.btn-success[data-id="${id}"]`);
        if (btnOriginal) {
          btnOriginal.disabled = false;
          console.log(`✅ Botón original rehabilitado para producto ${id}`);
        }
        
        fila.remove();
      });
      
      // Eliminar la tabla completa si no quedan productos
      const compararBody = document.getElementById("productos-a-comparar");
      if (compararBody && compararBody.children.length === 0) {
        document.getElementById("tabla-comparacion-wrapper")?.remove();
        console.log(`🗑️ Tabla de comparación eliminada - todos los productos limpiados`);
      }
      
      // Limpiar sessionStorage
      sessionStorage.removeItem("supermercadosSeleccionados");
      sessionStorage.removeItem("productosComparados");
      
      actualizarContadorProductos();
      console.log(`✅ Todos los productos limpiados exitosamente`);
    }, tiempoTotal);
  });
}

/**
 * Maneja la comparación de productos
 */
function compararProductos() {
  const productos = window.DataManager.extraerProductosDeTabla(
    document.querySelectorAll("#productos-a-comparar tr")
  );

  const supermercados = window.DataManager.extraerSupermercadosSeleccionados(
    "#supermercado-buttons"
  );

  // Validar datos usando DataManager
  const validacion = window.DataManager.validarDatosComparacion(productos, supermercados);
  
  if (!validacion.valido) {
    alert(validacion.errores.join('\n'));
    return;
  }

  // Guardar usando DataManager
  window.DataManager.guardarProductosComparados(productos);
  window.DataManager.guardarSupermercadosSeleccionados(supermercados);

  window.location.href = "productos-comparados.html";
}

// ===============================================
// FUNCIONES DE CATEGORÍAS Y MENÚS
// ===============================================

/**
 * Muestra el menú de categorías
 */
async function showCategoryMenu() {
  if (!eventoCategoryMenu) return;
  
  eventoCategoryMenu.innerHTML = "";

  try {
    const [resCategorias, resSubcategorias] = await Promise.all([
      fetch("/api/categorias"),
      fetch("/api/subcategorias")
    ]);

    const categories = await resCategorias.json();
    const subcategorias = await resSubcategorias.json();

    categories.forEach(cat => {
      const groupDiv = document.createElement("div");
      groupDiv.classList.add("category-group");

      const title = document.createElement("strong");
      title.textContent = cat.categoria_original;
      groupDiv.appendChild(title);

      const subList = document.createElement("ul");
      subList.classList.add("subcategory-list");

      const subcat = subcategorias.find(
        s => s.categoria_normalizada?.trim().toLowerCase() === cat.categoria_normalizada?.trim().toLowerCase()
      );

      const subItems = subcat?.subcategorias || [];

      subItems.forEach(sub => {
        const item = document.createElement("li");
        item.textContent = sub;
        item.classList.add("subcategory-item");

        item.onclick = () => seleccionarSubcategoria(sub);
        subList.appendChild(item);
      });

      groupDiv.appendChild(subList);
      eventoCategoryMenu.appendChild(groupDiv);
    });

    eventoCategoryMenu.style.display = "block";
  } catch (err) {
    console.error("❌ Error al cargar categorías y subcategorías:", err);
  }
}

/**
 * Selecciona una subcategoría del menú
 */
function seleccionarSubcategoria(subcategoria) {
  if (eventoProductoInput) {
    eventoProductoInput.value = subcategoria;
  }
  if (eventoCategoryMenu) {
    eventoCategoryMenu.style.display = "none";
  }

  // Mostrar filtros adicionales
  mostrarFiltrosAdicionales();
}

/**
 * Muestra los filtros adicionales (marca, contenido, variedad)
 */
function mostrarFiltrosAdicionales() {
  document.getElementById("marca-wrapper")?.classList.remove("d-none");
  document.getElementById("contenido-wrapper")?.classList.remove("d-none");
  document.getElementById("variedad-wrapper")?.classList.remove("d-none");

  // Poblar filtros con datos de ejemplo
  poblarFiltro("variedad", ["Clásico", "Integral", "Sin sal"]);
  poblarFiltro("contenido", ["500g", "1kg", "2L"]);
  poblarFiltro("marca", ["La Serenísima", "Ilolay", "Sancor"]);
}

/**
 * Puebla un filtro con opciones
 */
function poblarFiltro(filtroId, opciones) {
  const filtro = document.getElementById(filtroId);
  if (!filtro) return;

  filtro.innerHTML = `<option value="" selected>Todos</option>`;
  opciones.forEach(opcion => {
    const opt = document.createElement("option");
    opt.value = opcion;
    opt.textContent = opcion;
    filtro.appendChild(opt);
  });
}

/**
 * Filtra el menú de categorías basado en la entrada del usuario
 */
function filterCategoryMenu() {
  if (!eventoProductoInput || !eventoCategoryMenu) return;
  
  const input = eventoProductoInput.value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const groups = eventoCategoryMenu.querySelectorAll(".category-group");

  groups.forEach(group => {
    const categoryName = group.querySelector("strong")?.textContent || "";
    const normalizedCategory = categoryName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const subItems = group.querySelectorAll(".subcategory-item");
    let matchFound = normalizedCategory.includes(input);

    subItems.forEach(item => {
      const normalizedText = item.textContent
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      const match = normalizedText.includes(input);
      item.style.display = match ? "" : "none";
      if (match) matchFound = true;
    });

    group.style.display = matchFound ? "" : "none";
  });
}

// ===============================================
// FUNCIONES DE FILTROS
// ===============================================

/**
 * Aplica los filtros seleccionados a la tabla de productos
 */
function aplicarFiltros() {
  const marca = eventoFiltroMarca?.value || "";
  const contenido = eventoFiltroContenido?.value || "";
  const variedad = eventoFiltroVariedad?.value || "";

  const filas = document.querySelectorAll("#tabla-productos tbody tr");

  filas.forEach(fila => {
    const celdas = fila.querySelectorAll("td");
    const marcaTexto = celdas[1]?.textContent.trim() || "";
    const contenidoTexto = celdas[2]?.textContent.trim() || "";
    const variedadTexto = celdas[3]?.textContent.trim() || "";

    const coincideMarca = !marca || marcaTexto === marca;
    const coincideContenido = !contenido || contenidoTexto === contenido;
    const coincideVariedad = !variedad || variedadTexto === variedad;

    const mostrar = coincideMarca && coincideContenido && coincideVariedad;
    
    animarFiltroCambio(fila, mostrar);
  });
}

/**
 * Anima el cambio de visibilidad en los filtros
 */
function animarFiltroCambio(fila, mostrar) {
  if (mostrar) {
    fila.style.display = "";
    fila.style.opacity = "0";
    fila.style.transform = "translateY(-10px)";
    setTimeout(() => {
      fila.style.transition = "all 0.3s ease";
      fila.style.opacity = "1";
      fila.style.transform = "translateY(0)";
    }, 10);
  } else {
    fila.style.transition = "all 0.3s ease";
    fila.style.opacity = "0";
    fila.style.transform = "translateY(-10px)";
    setTimeout(() => {
      fila.style.display = "none";
    }, 300);
  }
}

// ===============================================
// FUNCIONES DE TABLA DE PRODUCTOS
// ===============================================

/**
 * Renderiza la tabla de productos al seleccionar un tipo
 */
function renderTablaProductos(e) {
  const tipoSeleccionado = e.target.value;
  console.log(`📦 Tipo de producto seleccionado: ${tipoSeleccionado}`);
  
  if (!tipoSeleccionado) return;

  eliminarTablaExistente();
  
  setTimeout(() => {
    crearTablaProductos(tipoSeleccionado);
  }, 300);
}

/**
 * Crea una tabla de productos completamente nueva - REDISEÑO PROFESIONAL
 */
function crearTablaProductos(tipoSeleccionado) {
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
  
  // Crear wrapper principal con diseño coherente con la tabla de comparación
  const tablaWrapper = document.createElement("div");
  tablaWrapper.id = "tabla-productos";
  tablaWrapper.className = "tabla-productos-container";
  
  // HTML rediseñado con coherencia visual total
  tablaWrapper.innerHTML = `
    <!-- Header rediseñado con gradiente naranja coherente -->
    <div class="tabla-productos-header">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0 d-flex align-items-center gap-2">
          <span class="badge tabla-productos-badge">${40}</span>
          <i class="fas fa-shopping-cart productos-icon"></i>
          Productos disponibles - ${tipoSeleccionado}
        </h5>
        <div class="tabla-productos-helper">
          <i class="fas fa-filter me-1"></i>
          Hacé clic en cualquier producto para agregarlo
        </div>
      </div>
    </div>
    
    <!-- Tabla principal con diseño profesional -->
    <div class="tabla-productos-scroll">
      <table class="table tabla-productos-moderna mb-0">
        <thead class="tabla-productos-thead">
          <tr class="tabla-productos-header-row">
            <th class="sortable th-producto" data-column="producto" data-order="none">
              <div class="th-content-productos">
                <i class="fas fa-tag th-icon"></i>
                <span>Producto</span>
                <i class="fas fa-sort sort-icon"></i>
              </div>
            </th>
            <th class="sortable th-centro" data-column="marca" data-order="none">
              <div class="th-content-productos">
                <i class="fas fa-building th-icon"></i>
                <span>Marca</span>
                <i class="fas fa-sort sort-icon"></i>
              </div>
            </th>
            <th class="sortable th-centro" data-column="contenido" data-order="none">
              <div class="th-content-productos">
                <i class="fas fa-box th-icon"></i>
                <span>Contenido</span>
                <i class="fas fa-sort sort-icon"></i>
              </div>
            </th>
            <th class="sortable th-centro" data-column="variedad" data-order="none">
              <div class="th-content-productos">
                <i class="fas fa-star th-icon"></i>
                <span>Variedad</span>
                <i class="fas fa-sort sort-icon"></i>
              </div>
            </th>
          </tr>
        </thead>
        <tbody id="tabla-productos-body" class="tabla-productos-tbody">
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
  
  // Animación de entrada profesional
  tablaWrapper.style.opacity = "0";
  tablaWrapper.style.transform = "translateY(30px) scale(0.98)";
  
  setTimeout(() => {
    tablaWrapper.style.transition = "all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)";
    tablaWrapper.style.opacity = "1";
    tablaWrapper.style.transform = "translateY(0) scale(1)";
  }, 100);
  
  console.log(`✅ Tabla de productos rediseñada creada para ${tipoSeleccionado}`);
}

/**
 * Genera las filas de productos con datos mock - MEJORADO
 */
function generarFilasProductos() {
  const marcas = ["La Serenísima", "Ilolay", "Sancor", "Tregar", "Manfrey"];
  const contenidos = ["500ml", "1L", "500g", "1kg", "2L"];
  const variedades = ["Clásico", "Integral", "Sin sal", "Light", "Orgánico"];
  
  let filasHTML = "";
  
  for (let i = 1; i <= 40; i++) {
    const id = `producto-${i}`;
    const producto = `Producto ${i}`;
    const marca = marcas[i % marcas.length];
    const contenido = contenidos[i % contenidos.length];
    const variedad = variedades[i % variedades.length];
    
    // Generar HTML limpio con clases correctas
    filasHTML += `<tr class="fila-clickeable tabla-productos-fila" data-id="${id}" title="Click para agregar a la comparación">`;
    filasHTML += `<td class="celda-producto-info">`;
    filasHTML += `<div class="producto-details">`;
    filasHTML += `<span class="fw-bold producto-nombre">${producto}</span>`;
    filasHTML += `<small class="text-muted producto-sku">SKU: ${id.toUpperCase()}</small>`;
    filasHTML += `</div>`;
    filasHTML += `</td>`;
    filasHTML += `<td class="text-center celda-badge">`;
    filasHTML += `<span class="badge bg-primary badge-marca">${marca}</span>`;
    filasHTML += `</td>`;
    filasHTML += `<td class="text-center celda-badge">`;
    filasHTML += `<span class="badge bg-info badge-contenido">${contenido}</span>`;
    filasHTML += `</td>`;
    filasHTML += `<td class="text-center celda-badge">`;
    filasHTML += `<span class="badge bg-success badge-variedad">${variedad}</span>`;
    filasHTML += `</td>`;
    filasHTML += `</tr>`;
  }
  
  console.log(`✅ ${40} filas de productos generadas correctamente`);
  
  return filasHTML;
}

/**
 * Elimina la tabla existente con animación
 */
function eliminarTablaExistente() {
  const tablaExistente = document.getElementById("tabla-productos");
  if (tablaExistente) {
    tablaExistente.style.transition = "all 0.3s ease";
    tablaExistente.style.opacity = "0";
    tablaExistente.style.transform = "translateY(-20px)";
    setTimeout(() => tablaExistente.remove(), 300);
  }
}



// ===============================================
// POPUP PERSONALIZADO - SISTEMA PREMIUM
// ===============================================

/**
 * Crea y muestra un popup de confirmación personalizado
 * @param {Object} options - Opciones del popup
 * @param {string} options.title - Título del popup
 * @param {string} options.message - Mensaje del popup
 * @param {string} options.icon - Icono del popup (FontAwesome)
 * @param {string} options.confirmText - Texto del botón confirmar
 * @param {string} options.cancelText - Texto del botón cancelar
 * @param {Function} options.onConfirm - Callback al confirmar
 * @param {Function} options.onCancel - Callback al cancelar (opcional)
 */
function mostrarPopupConfirmacion(options) {
  const {
    title = "Confirmar Acción",
    message = "¿Estás seguro de continuar?",
    icon = "fas fa-question-circle",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    tipo = "default", // Nuevo parámetro para el tipo de popup
    onConfirm = () => {},
    onCancel = () => {}
  } = options;

  // Crear overlay
  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';
  
  // Determinar botones a mostrar
  const botonesHTML = cancelText ? `
    <button class="popup-btn-cancel" data-action="cancel">
      <i class="fas fa-times me-2"></i>
      ${cancelText}
    </button>
    <button class="popup-btn-confirm" data-action="confirm">
      <i class="fas fa-check me-2"></i>
      ${confirmText}
    </button>
  ` : `
    <button class="popup-btn-confirm popup-btn-single" data-action="confirm">
      <i class="fas fa-check me-2"></i>
      ${confirmText}
    </button>
  `;

  // HTML del popup con tipo de clase
  overlay.innerHTML = `
    <div class="popup-container popup-${tipo}">
      <div class="popup-header">
        <div class="popup-header-content">
          <i class="${icon} popup-icon"></i>
          <h3 class="popup-title">${title}</h3>
        </div>
      </div>
      <div class="popup-body">
        <p class="popup-message">${message}</p>
        <div class="popup-buttons">
          ${botonesHTML}
        </div>
      </div>
    </div>
  `;

  // Agregar al DOM
  document.body.appendChild(overlay);
  
  // Forzar reflow para animación
  overlay.offsetHeight;
  
  // Mostrar con animación
  setTimeout(() => {
    overlay.classList.add('show');
    const container = overlay.querySelector('.popup-container');
    container.classList.add('entering');
  }, 10);

  // Función para cerrar el popup
  const cerrarPopup = (confirmar = false) => {
    const container = overlay.querySelector('.popup-container');
    
    // Animación de salida
    overlay.classList.remove('show');
    container.classList.add('leaving');
    
    setTimeout(() => {
      overlay.remove();
      
      // Ejecutar callback
      if (confirmar) {
        onConfirm();
      } else {
        onCancel();
      }
    }, 300);
  };

  // Event listeners
  overlay.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    
    if (action === 'confirm') {
      cerrarPopup(true);
    } else if (action === 'cancel') {
      cerrarPopup(false);
    } else if (e.target === overlay) {
      // Click fuera del popup
      cerrarPopup(false);
    }
  });

  // Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      cerrarPopup(false);
      document.removeEventListener('keydown', handleEscape);
    }
  };
  
  document.addEventListener('keydown', handleEscape);
  
  console.log('🎆 Popup personalizado mostrado');
}

/**
 * Popup específico para limpiar productos
 * @param {number} cantidad - Cantidad de productos a eliminar
 * @param {Function} onConfirm - Callback al confirmar
 */
function mostrarPopupLimpiarProductos(cantidad, onConfirm) {
  mostrarPopupConfirmacion({
    title: "Limpiar Productos",
    message: `¿Estás seguro de eliminar los <span class="popup-highlight">${cantidad}</span> productos seleccionados?`,
    icon: "fas fa-broom",
    confirmText: "Sí, Limpiar",
    cancelText: "Cancelar",
    onConfirm: onConfirm,
    onCancel: () => {
      console.log('🙅 Usuario canceló la limpieza de productos');
    }
  });
}

/**
 * Actualiza el contador de productos en la tabla y controla la visibilidad del botón comparar
 */
function actualizarContadorProductos() {
  const contador = document.getElementById("contador-productos");
  const botonComparar = document.querySelector("#comparar-box .comparar-btn");
  const cantidad = document.querySelectorAll("#productos-a-comparar tr").length;
  
  // Actualizar contador
  if (contador) {
    contador.textContent = cantidad;
    contador.classList.add("badge-count");
    setTimeout(() => contador.classList.remove("badge-count"), 600);
  }
  
  // Controlar visibilidad del botón comparar
  if (botonComparar) {
    if (cantidad > 0) {
      // Mostrar botón con animación
      botonComparar.style.display = "inline-block";
      
      // Forzar un reflow antes de aplicar la transición
      botonComparar.offsetHeight;
      
      botonComparar.style.transition = "all 0.3s ease";
      botonComparar.style.opacity = "1";
      botonComparar.style.transform = "translateY(0)";
    } else {
      // Ocultar botón con animación
      botonComparar.style.transition = "all 0.3s ease";
      botonComparar.style.opacity = "0";
      botonComparar.style.transform = "translateY(10px)";
      
      setTimeout(() => {
        botonComparar.style.display = "none";
      }, 300);
    }
  } else {
    console.warn("⚠️ Botón comparar no encontrado. Selector: #comparar-box .comparar-btn");
  }
  
  console.log(`📊 Contador actualizado: ${cantidad} productos seleccionados`);
}

/**
 * Anima la entrada de un elemento
 */
function animarEntrada(elemento) {
  elemento.style.opacity = "0";
  elemento.style.transform = "translateY(20px)";
  setTimeout(() => {
    elemento.style.transition = "all 0.4s ease";
    elemento.style.opacity = "1";
    elemento.style.transform = "translateY(0)";
  }, 100);
}











// ===============================================
// API PÚBLICA DEL MÓDULO
// ===============================================

// Hacer disponibles algunas funciones globalmente para compatibilidad con main.js
window.crearTablaComparacion = crearTablaComparacion;

// Exponer funciones públicas en el objeto window para compatibilidad
window.EventManager = {
  // Inicialización
  inicializar: inicializarEventListeners,
  
  // Gestión de tablas
  crearTablaComparacion: crearTablaComparacion,
  agregarProducto: agregarProductoDesdeFilaCompleta,
  eliminarProducto: eliminarProductoDeComparacion,
  limpiarTodos: limpiarTodosLosProductos,
  
  // Comparación
  compararProductos: compararProductos,
  
  // Menús y filtros
  mostrarMenuCategoria: showCategoryMenu,
  aplicarFiltros: aplicarFiltros,
  renderTablaProductos: renderTablaProductos,
  
  // Utilidades
  obtenerElementosDOM: obtenerElementosDOM,
  configurarEventListeners: configurarEventListenersPrincipales
};

// ===============================================
// FUNCIONES ADICIONALES DE POPUPS
// ===============================================

/**
 * Popup específico para eliminar cuenta
 * @param {Function} onConfirm - Callback al confirmar
 */
function mostrarPopupEliminarCuenta(onConfirm) {
  mostrarPopupConfirmacion({
    title: "Eliminar Cuenta",
    message: `¿Estás seguro de que deseas <span class="popup-highlight">eliminar permanentemente</span> tu cuenta?<br><br>Esta acción <strong>NO SE PUEDE DESHACER</strong> y se perderán todos tus datos.`,
    icon: "fas fa-exclamation-triangle",
    confirmText: "Sí, Eliminar",
    cancelText: "Cancelar",
    tipo: "delete",
    onConfirm: onConfirm,
    onCancel: () => {
      console.log('🙅 Usuario canceló la eliminación de cuenta');
    }
  });
}

/**
 * Popup específico para cambio de contraseña
 * @param {Function} onConfirm - Callback al confirmar
 */
function mostrarPopupCambiarContrasena(onConfirm) {
  mostrarPopupConfirmacion({
    title: "Cambiar Contraseña",
    message: `Se enviará un email a tu dirección registrada con las instrucciones para cambiar tu contraseña.`,
    icon: "fas fa-key",
    confirmText: "Enviar Email",
    cancelText: "Cancelar",
    tipo: "info",
    onConfirm: onConfirm,
    onCancel: () => {
      console.log('🙅 Usuario canceló el cambio de contraseña');
    }
  });
}

/**
 * Popup específico para guardar configuraciones
 * @param {Function} onConfirm - Callback al confirmar
 */
function mostrarPopupGuardarConfiguraciones(onConfirm) {
  mostrarPopupConfirmacion({
    title: "Guardar Configuraciones",
    message: `¿Confirmas que deseas guardar todos los cambios realizados en tus configuraciones?`,
    icon: "fas fa-save",
    confirmText: "Guardar",
    cancelText: "Cancelar",
    tipo: "success",
    onConfirm: onConfirm,
    onCancel: () => {
      console.log('🙅 Usuario canceló el guardado de configuraciones');
    }
  });
}

/**
 * Popup específico para cerrar sesión
 * @param {Function} onConfirm - Callback al confirmar
 */
function mostrarPopupCerrarSesion(onConfirm) {
  mostrarPopupConfirmacion({
    title: "Cerrar Sesión",
    message: `¿Estás seguro de que deseas cerrar tu sesión?`,
    icon: "fas fa-sign-out-alt",
    confirmText: "Cerrar Sesión",
    cancelText: "Cancelar",
    tipo: "warning",
    onConfirm: onConfirm,
    onCancel: () => {
      console.log('🙅 Usuario canceló el cierre de sesión');
    }
  });
}

/**
 * Popup específico para eliminar dirección
 * @param {string} alias - Alias de la dirección
 * @param {Function} onConfirm - Callback al confirmar
 */
function mostrarPopupEliminarDireccion(alias, onConfirm) {
  mostrarPopupConfirmacion({
    title: "Eliminar Dirección",
    message: `¿Estás seguro de eliminar la dirección <span class="popup-highlight">${alias}</span>?`,
    icon: "fas fa-home",
    confirmText: "Eliminar",
    cancelText: "Cancelar",
    tipo: "delete",
    onConfirm: onConfirm,
    onCancel: () => {
      console.log('🙅 Usuario canceló la eliminación de dirección');
    }
  });
}

/**
 * Popup de éxito genérico
 * @param {string} titulo - Título del popup
 * @param {string} mensaje - Mensaje del popup
 * @param {Function} onClose - Callback al cerrar (opcional)
 */
function mostrarPopupExito(titulo, mensaje, onClose = () => {}) {
  mostrarPopupConfirmacion({
    title: titulo,
    message: mensaje,
    icon: "fas fa-check-circle",
    confirmText: "Entendido",
    cancelText: null, // Solo botón de confirmación
    tipo: "success",
    onConfirm: onClose,
    onCancel: onClose
  });
}

/**
 * Popup de error genérico
 * @param {string} titulo - Título del popup
 * @param {string} mensaje - Mensaje del popup
 * @param {Function} onClose - Callback al cerrar (opcional)
 */
function mostrarPopupError(titulo, mensaje, onClose = () => {}) {
  mostrarPopupConfirmacion({
    title: titulo,
    message: mensaje,
    icon: "fas fa-exclamation-circle",
    confirmText: "Entendido",
    cancelText: null, // Solo botón de confirmación
    tipo: "delete", // Usar estilo rojo para errores
    onConfirm: onClose,
    onCancel: onClose
  });
}

// ===============================================
// EXPONER FUNCIONES GLOBALMENTE
// ===============================================

// Hacer las funciones de popup disponibles globalmente
window.mostrarPopupConfirmacion = mostrarPopupConfirmacion;
window.mostrarPopupLimpiarProductos = mostrarPopupLimpiarProductos;
window.mostrarPopupEliminarCuenta = mostrarPopupEliminarCuenta;
window.mostrarPopupCambiarContrasena = mostrarPopupCambiarContrasena;
window.mostrarPopupGuardarConfiguraciones = mostrarPopupGuardarConfiguraciones;
window.mostrarPopupCerrarSesion = mostrarPopupCerrarSesion;
window.mostrarPopupEliminarDireccion = mostrarPopupEliminarDireccion;
window.mostrarPopupExito = mostrarPopupExito;
window.mostrarPopupError = mostrarPopupError;

console.log("📦 Módulo EventManager cargado");
