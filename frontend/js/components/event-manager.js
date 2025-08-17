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
  // Botón agregar producto
  if (e.target.matches("button.btn-success")) {
    agregarProductoAComparacion(e.target);
  }

  // Botón eliminar producto
  if (e.target.matches("button.eliminar-btn")) {
    eliminarProductoDeComparacion(e.target);
  }

  // Botón limpiar filtros
  if (e.target.matches("#btn-limpiar-filtros")) {
    limpiarTodosLosProductos();
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
          📊 Productos seleccionados para comparar
        </h5>
        <button id="btn-limpiar-filtros" class="btn btn-outline-danger btn-sm">
          🧹 Limpiar todos
        </button>
      </div>
      <div class="tabla-a-comparar-scroll mb-3">
        <table class="table tabla-a-comparar mb-0">
          <thead class="table-header-modern">
            <tr>
              <th class="col-producto">
                <div class="th-content">
                  <span class="th-icon">🏷️</span>
                  <span>Producto</span>
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
          <tbody id="productos-a-comparar" class="table-body-modern"></tbody>
        </table>
      </div>
      <div class="tabla-stats">
        <small class="text-muted">
          <i class="fas fa-info-circle"></i>
          Agregá productos desde la tabla de abajo para compararlos
        </small>
      </div>
    </div>
  `;

  const compararBox = document.getElementById("comparar-box");
  if (compararBox) {
    compararBox.parentNode.insertBefore(wrapper, compararBox);
  }
}

/**
 * Agrega un producto a la tabla de comparación
 */
function agregarProductoAComparacion(btn) {
  const filaOriginal = btn.closest("tr");
  const id = btn.dataset.id;

  if (document.querySelector(`#productos-a-comparar tr[data-id="${id}"]`)) return;

  // Crear tabla si no existe
  crearTablaComparacion();

  // Extraer datos de la fila original
  const nombreProducto = filaOriginal.querySelector('.producto-nombre')?.textContent || 'Producto';
  const sku = filaOriginal.querySelector('.producto-codigo')?.textContent || `SKU: ${id.toUpperCase()}`;
  const marca = filaOriginal.querySelector('.marca-texto')?.textContent || '';
  const contenido = filaOriginal.querySelector('.contenido-texto')?.textContent || '';
  const variedad = filaOriginal.querySelector('.variedad-texto')?.textContent || '';
  
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
    </td>
    <td class="celda-accion">
      <button class="btn btn-danger btn-sm eliminar-btn" data-id="${id}">
        🗑 Eliminar
      </button>
    </td>
  `;

  const tbody = document.querySelector("#productos-a-comparar");
  if (tbody) {
    tbody.appendChild(nuevaFila);
  }
  
  btn.disabled = true;
  
  // Animación de entrada
  animarEntrada(nuevaFila);
  actualizarContadorProductos();
}

/**
 * Elimina un producto de la tabla de comparación
 */
function eliminarProductoDeComparacion(btn) {
  const fila = btn.closest("tr");
  const id = fila.dataset.id;
  
  // Aplicar la clase de animación fade-out hacia la izquierda
  fila.classList.add('fila-eliminando');
  
  // Esperar a que termine la animación CSS antes de eliminar (250ms)
  setTimeout(() => {
    fila.remove();
    
    const btnOriginal = document.querySelector(`button.btn-success[data-id="${id}"]`);
    if (btnOriginal) btnOriginal.disabled = false;

    const compararBody = document.getElementById("productos-a-comparar");
    if (compararBody && compararBody.children.length === 0) {
      document.getElementById("tabla-comparacion-wrapper")?.remove();
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
  
  if (confirm(`¿Estás seguro de eliminar los ${cantidad} productos seleccionados?`)) {
    // Aplicar animación de fade out a la izquierda a todas las filas
    filas.forEach((fila, index) => {
      setTimeout(() => {
        fila.classList.add('fila-eliminando');
      }, index * 75); // Animación escalonada cada 75ms
    });
    
    // Esperar a que todas las animaciones terminen y luego eliminar
    const tiempoTotal = cantidad * 75 + 250; // Tiempo de animación + última fila
    setTimeout(() => {
      // Eliminar todas las filas
      filas.forEach(fila => {
        const id = fila.dataset.id;
        const btnOriginal = document.querySelector(`button.btn-success[data-id="${id}"]`);
        if (btnOriginal) btnOriginal.disabled = false;
        fila.remove();
      });
      
      // Eliminar la tabla completa si no quedan productos
      const compararBody = document.getElementById("productos-a-comparar");
      if (compararBody && compararBody.children.length === 0) {
        document.getElementById("tabla-comparacion-wrapper")?.remove();
      }
      
      // Limpiar sessionStorage
      sessionStorage.removeItem("supermercadosSeleccionados");
      sessionStorage.removeItem("productosComparados");
      
      actualizarContadorProductos();
    }, tiempoTotal);
  }
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
    crearTablaProductosProfesional(tipoSeleccionado);
  }, 300);
}

/**
 * Crea una tabla de productos completamente nueva con estilo profesional
 */
function crearTablaProductosProfesional(tipoSeleccionado) {
  console.log(`🎯 Creando tabla profesional para: ${tipoSeleccionado}`);
  
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
  
  // Crear wrapper principal
  const tablaWrapper = document.createElement("div");
  tablaWrapper.id = "tabla-productos";
  tablaWrapper.className = "tabla-productos-profesional";
  
  // HTML completo de la tabla profesional
  tablaWrapper.innerHTML = `
    <!-- Header de la tabla -->
    <div class="tabla-header-info">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0 d-flex align-items-center gap-2">
          <span class="badge bg-success">40</span>
          <i class="fas fa-shopping-cart"></i>
          Productos disponibles - ${tipoSeleccionado}
        </h5>
        <div class="tabla-filters">
          <small class="text-muted">
            <i class="fas fa-filter"></i>
            Usá los filtros de arriba para refinar tu búsqueda
          </small>
        </div>
      </div>
    </div>
    
    <!-- Tabla principal -->
    <div class="tabla-scroll-container">
      <table class="table tabla-productos-mejorada mb-0">
        <thead class="table-header-modern">
          <tr>
            <th class="col-producto">
              <div class="th-content">
                <span class="th-icon">🏷️</span>
                <span>Producto</span>
              </div>
            </th>
            <th class="col-marca">
              <div class="th-content">
                <span class="th-icon">🏭</span>
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
        <tbody class="table-body-modern" id="tabla-productos-body">
          ${generarFilasProductosProfesional()}
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
  
  // Animación de entrada
  tablaWrapper.style.opacity = "0";
  tablaWrapper.style.transform = "translateY(20px)";
  
  // Debug: verificar que la tabla se insertó correctamente
  console.log("🔍 Debug post-inserción:");
  console.log("- Tabla insertada:", document.getElementById("tabla-productos"));
  console.log("- Filas encontradas:", document.querySelectorAll("#tabla-productos-body tr").length);
  
  setTimeout(() => {
    tablaWrapper.style.transition = "all 0.5s ease";
    tablaWrapper.style.opacity = "1";
    tablaWrapper.style.transform = "translateY(0)";
    
    // Debug: verificar que sigue ahí después de la animación
    setTimeout(() => {
      console.log("🔍 Debug post-animación:");
      console.log("- Tabla visible:", !!document.getElementById("tabla-productos"));
      console.log("- Opacity:", tablaWrapper.style.opacity);
      console.log("- Display:", getComputedStyle(tablaWrapper).display);
      
      // Debug específico de filas
      const filas = document.querySelectorAll("#tabla-productos-body tr");
      console.log("🔍 Debug de filas:");
      console.log("- Cantidad de filas:", filas.length);
      if (filas.length > 0) {
        const primeraFila = filas[0];
        console.log("- Primera fila:", primeraFila);
        console.log("- Display de fila:", getComputedStyle(primeraFila).display);
        console.log("- Visibility de fila:", getComputedStyle(primeraFila).visibility);
        console.log("- Height de fila:", getComputedStyle(primeraFila).height);
        console.log("- Contenido de primera celda:", primeraFila.firstElementChild?.textContent);
      }
      
      // Debug del tbody
      const tbody = document.getElementById("tabla-productos-body");
      if (tbody) {
        console.log("- Display de tbody:", getComputedStyle(tbody).display);
        console.log("- Height de tbody:", getComputedStyle(tbody).height);
        console.log("- Tbody innerHTML length:", tbody.innerHTML.length);
        console.log("- Tbody children count:", tbody.children.length);
        console.log("- Tbody first child:", tbody.children[0]);
        if (tbody.children[0]) {
          console.log("- First child HTML:", tbody.children[0].outerHTML.substring(0, 200));
        }
      }
      
      // Debug del contenedor padre y scroll
      console.log("🔍 Debug de contenedores:");
      const scrollContainer = document.querySelector(".tabla-scroll-container");
      if (scrollContainer) {
        const scrollStyles = getComputedStyle(scrollContainer);
        console.log("- Scroll container height:", scrollStyles.height);
        console.log("- Scroll container max-height:", scrollStyles.maxHeight);
        console.log("- Scroll container overflow:", scrollStyles.overflow);
        console.log("- Scroll container overflow-y:", scrollStyles.overflowY);
        console.log("- Scroll top:", scrollContainer.scrollTop);
        console.log("- Scroll height:", scrollContainer.scrollHeight);
        console.log("- Client height:", scrollContainer.clientHeight);
        console.log("- Scroll container background:", scrollStyles.backgroundColor);
        console.log("- Scroll container border:", scrollStyles.border);
      }
      
      // Debug de la tabla dentro del scroll
      const tabla = document.querySelector(".tabla-productos-mejorada");
      if (tabla) {
        const tablaStyles = getComputedStyle(tabla);
        console.log("🔍 Debug de tabla interna:");
        console.log("- Tabla display:", tablaStyles.display);
        console.log("- Tabla height:", tablaStyles.height);
        console.log("- Tabla width:", tablaStyles.width);
        console.log("- Tabla position:", tablaStyles.position);
        console.log("- Tabla top:", tablaStyles.top);
      }
      
      // Debug del wrapper principal
      const wrapper = document.getElementById("tabla-productos");
      if (wrapper) {
        const wrapperStyles = getComputedStyle(wrapper);
        console.log("- Wrapper height:", wrapperStyles.height);
        console.log("- Wrapper overflow:", wrapperStyles.overflow);
        console.log("- Wrapper position:", wrapperStyles.position);
      }
    }, 600);
  }, 100);
  
  console.log(`✅ Tabla profesional creada para ${tipoSeleccionado}`);
  
  // Debug: Observer para detectar si algo elimina la tabla
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.removedNodes.forEach((node) => {
          if (node.id === 'tabla-productos') {
            console.warn("⚠️ ¡TABLA ELIMINADA! Algo la está removiendo del DOM");
            console.log("Eliminada por:", mutation);
          }
        });
      }
    });
  });
  
  observer.observe(contenedor, { childList: true, subtree: true });
  
  // Desconectar observer después de 10 segundos
  setTimeout(() => observer.disconnect(), 10000);
}

/**
 * Genera las filas de productos con datos mock
 */
function generarFilasProductosProfesional() {
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
    
    // Generar HTML más simple y limpio
    filasHTML += `<tr class="fila-producto" data-id="${id}">`;
    filasHTML += `<td class="celda-producto">`;
    filasHTML += `<div class="producto-info">`;
    filasHTML += `<span class="producto-nombre">${producto}</span>`;
    filasHTML += `<small class="producto-codigo">SKU: ${id.toUpperCase()}</small>`;
    filasHTML += `</div>`;
    filasHTML += `</td>`;
    filasHTML += `<td class="celda-marca">`;
    filasHTML += `<span class="marca-texto">${marca}</span>`;
    filasHTML += `</td>`;
    filasHTML += `<td class="celda-contenido">`;
    filasHTML += `<span class="contenido-texto">${contenido}</span>`;
    filasHTML += `</td>`;
    filasHTML += `<td class="celda-variedad">`;
    filasHTML += `<span class="variedad-texto">${variedad}</span>`;
    filasHTML += `</td>`;
    filasHTML += `<td class="celda-accion">`;
    filasHTML += `<button class="btn btn-success btn-sm btn-agregar" data-id="${id}">`;
    filasHTML += `➕ Agregar`;  // Solo el emoji, sin + extra
    filasHTML += `</button>`;
    filasHTML += `</td>`;
    filasHTML += `</tr>`;
  }
  
  console.log(`🔧 HTML generado (primeros 500 caracteres):`, filasHTML.substring(0, 500));
  
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

/**
 * Crea una nueva tabla de productos
 */
function crearNuevaTablaProductos(tipoSeleccionado) {
  const tablaWrapper = document.createElement("div");
  tablaWrapper.id = "tabla-productos";
  tablaWrapper.className = "tabla-productos-moderna";

  const header = crearHeaderTabla(tipoSeleccionado);
  const tabla = crearTablaConProductos();

  tablaWrapper.appendChild(header);
  tablaWrapper.appendChild(tabla);

  // Buscar el área específica para tablas dinámicas
  let contenedor = document.getElementById("area-tablas-dinamicas");
  
  // Fallback al método anterior si no existe el área
  if (!contenedor) {
    const compararBox = document.getElementById("comparar-box");
    if (compararBox) {
      compararBox.parentNode.insertBefore(tablaWrapper, compararBox);
    } else {
      console.warn("⚠️ No se encontró contenedor para la tabla de productos");
      return;
    }
  } else {
    contenedor.appendChild(tablaWrapper);
  }

  // Animación de entrada
  animarEntrada(tablaWrapper);
  
  console.log(`✅ Tabla de productos creada para ${tipoSeleccionado}`);
}

// ===============================================
// FUNCIONES UTILITARIAS Y AUXILIARES
// ===============================================

/**
 * Actualiza el contador de productos en la tabla y controla la visibilidad del botón comparar
 */
function actualizarContadorProductos() {
  const contador = document.getElementById("contador-productos");
  const botonComparar = document.querySelector(".comparar-btn");
  const cantidad = document.querySelectorAll("#productos-a-comparar tr").length;
  
  if (contador) {
    contador.textContent = cantidad;
    contador.classList.add("badge-count");
    setTimeout(() => contador.classList.remove("badge-count"), 600);
  }
  
  // Controlar visibilidad del botón comparar
  if (botonComparar) {
    if (cantidad > 0) {
      // Mostrar botón con animación
      botonComparar.style.display = "block";
      botonComparar.style.opacity = "0";
      botonComparar.style.transform = "translateY(10px)";
      
      setTimeout(() => {
        botonComparar.style.transition = "all 0.3s ease";
        botonComparar.style.opacity = "1";
        botonComparar.style.transform = "translateY(0)";
      }, 10);
    } else {
      // Ocultar botón con animación
      botonComparar.style.transition = "all 0.3s ease";
      botonComparar.style.opacity = "0";
      botonComparar.style.transform = "translateY(10px)";
      
      setTimeout(() => {
        botonComparar.style.display = "none";
      }, 300);
    }
  }
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

/**
 * Crea el header de información de la tabla
 */
function crearHeaderTabla(tipoSeleccionado) {
  const header = document.createElement("div");
  header.className = "tabla-header-info mb-3";
  header.innerHTML = `
    <div class="d-flex justify-content-between align-items-center">
      <h5 class="mb-0 d-flex align-items-center gap-2">
        <span class="badge bg-success">40</span>
          Productos disponibles - ${tipoSeleccionado}
      </h5>
      <div class="tabla-filters">
        <small class="text-muted">
          <i class="fas fa-filter"></i>
          Usá los filtros de arriba para refinar tu búsqueda
        </small>
      </div>
    </div>
  `;
  return header;
}

/**
 * Crea la tabla con productos de ejemplo
 */
function crearTablaConProductos() {
  const tabla = document.createElement("table");
  tabla.className = "table table-hover tabla-productos-mejorada mb-0";

  const thead = crearThead();
  const tbody = crearTbodyConProductos();

  tabla.appendChild(thead);
  tabla.appendChild(tbody);

  return tabla;
}

/**
 * Crea el thead de la tabla
 */
function crearThead() {
  const thead = document.createElement("thead");
  thead.className = "table-header-modern";
  thead.innerHTML = `
    <tr>
      <th class="col-producto">
        <div class="th-content">
          <span class="th-icon">🏷️</span>
          <span>Producto</span>
        </div>
      </th>
      <th class="col-marca">
        <div class="th-content">
          <span class="th-icon">🏭</span>
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
      </th>
    </tr>
  `;
  return thead;
}

/**
 * Crea el tbody con productos de ejemplo
 */
function crearTbodyConProductos() {
  const tbody = document.createElement("tbody");
  tbody.className = "table-body-modern";

  for (let i = 1; i <= 40; i++) {
    const fila = crearFilaProducto(i);
    tbody.appendChild(fila);
  }

  return tbody;
}

/**
 * Crea una fila de producto
 */
function crearFilaProducto(numero) {
  const id = `mock-${numero}`;
  const producto = `Producto ${numero}`;
  const marca = ["La Serenísima", "Ilolay", "Sancor"][numero % 3];
  const contenido = numero % 2 === 0 ? "500g" : "1kg";
  const variedad = ["Clásico", "Integral", "Sin sal"][numero % 3];

  const fila = document.createElement("tr");
  fila.setAttribute("data-id", id);
  fila.className = "fila-producto";

  fila.innerHTML = `
    <td class="celda-producto">
      <div class="producto-info">
        <span class="producto-nombre">${producto}</span>
        <small class="producto-codigo">SKU: ${id.toUpperCase()}</small>
      </div>
    </td>
    <td class="celda-marca">
      <span class="marca-texto">${marca}</span>
    </td>
    <td class="celda-contenido">
      <span class="contenido-texto">${contenido}</span>
    </td>
    <td class="celda-variedad">
      <span class="variedad-texto">${variedad}</span>
    </td>
    <td class="celda-accion">
      <button class="btn btn-success btn-sm btn-agregar" data-id="${id}">
        ➕ Agregar
      </button>
    </td>
  `;

  return fila;
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
  agregarProducto: agregarProductoAComparacion,
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

console.log("📦 Módulo EventManager cargado");
