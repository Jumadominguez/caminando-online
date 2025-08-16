document.addEventListener("DOMContentLoaded", () => {
  // ===============================================
  // VARIABLES Y ELEMENTOS DEL DOM
  // ===============================================
  const productoInput = document.getElementById("producto");
  const categoryMenu = document.getElementById("categoryMenu");
  const btnComparar = document.querySelector("#comparar-box .comparar-btn");
  const filtroMarca = document.getElementById("marca");
  const filtroContenido = document.getElementById("contenido");
  const filtroVariedad = document.getElementById("variedad");
  const tipoProductoSelect = document.getElementById("tipo-de-producto");

  // ===============================================
  // INICIALIZACIÓN Y RESTAURAR ESTADO
  // ===============================================
  restaurarEstadoSiExiste();

  // ===============================================
  // EVENT LISTENERS PRINCIPALES
  // ===============================================
  productoInput?.addEventListener("click", showCategoryMenu);
  productoInput?.addEventListener("input", filterCategoryMenu);
  btnComparar?.addEventListener("click", compararProductos);
  tipoProductoSelect?.addEventListener("change", renderTablaProductos);

  // Cerrar menú si se hace clic fuera
  document.addEventListener("click", e => {
    if (!e.target.closest(".category-dropdown")) {
      categoryMenu.style.display = "none";
    }
  });

  // Event listeners para filtros
  [filtroMarca, filtroContenido, filtroVariedad].forEach(filtro => {
    filtro?.addEventListener("change", aplicarFiltros);
  });

  // Event delegation para botones dinámicos
  document.addEventListener("click", handleDynamicButtons);

  // ===============================================
  // FUNCIONES PRINCIPALES
  // ===============================================

  /**
   * Restaura el estado de productos y supermercados seleccionados
   */
  function restaurarEstadoSiExiste() {
    const esVistaFiltros = document.querySelector("#productos-a-comparar");
    if (!esVistaFiltros) return;

    const supermercados = JSON.parse(sessionStorage.getItem("supermercadosSeleccionados") || "[]");
    const productos = JSON.parse(sessionStorage.getItem("productosComparados") || "[]");

    // Restaurar supermercados seleccionados
    supermercados.forEach(nombre => {
      const btns = Array.from(document.querySelectorAll(".supermercado-btn"));
      btns.forEach(btn => {
        const img = btn.querySelector("img");
        const raw = img?.alt?.trim() || "";
        const nombreBtn = raw.replace(/^Logo\s*/i, "");
        if (nombreBtn === nombre) {
          btn.classList.add("selected");
        }
      });
    });

    // Restaurar productos en la tabla
    const tbody = document.querySelector("#productos-a-comparar tbody");
    if (tbody && productos.length > 0) {
      productos.forEach(prod => {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td colspan="4">${prod.nombreCompleto}</td>`;
        tbody.appendChild(fila);
      });
    }
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

  /**
   * Agrega un producto a la tabla de comparación
   */
  function agregarProductoAComparacion(btn) {
    const filaOriginal = btn.closest("tr");
    const id = btn.dataset.id;

    if (document.querySelector(`#productos-a-comparar tr[data-id="${id}"]`)) return;

    crearTablaComparacion();

    const filaClonada = filaOriginal.cloneNode(true);
    filaClonada.setAttribute("data-id", id);

    const btnEliminar = filaClonada.querySelector("button");
    btnEliminar.textContent = "🗑 Eliminar";
    btnEliminar.className = "btn btn-danger btn-sm eliminar-btn";
    btnEliminar.disabled = false;

    document.querySelector("#productos-a-comparar").appendChild(filaClonada);
    btn.disabled = true;
    
    // Animación de entrada
    animarEntrada(filaClonada);
    actualizarContadorProductos();
  }

  /**
   * Elimina un producto de la tabla de comparación
   */
  function eliminarProductoDeComparacion(btn) {
    const fila = btn.closest("tr");
    const id = fila.dataset.id;
    
    // Animación de salida
    fila.style.transition = 'all 0.3s ease';
    fila.style.opacity = '0';
    fila.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
      fila.remove();
      
      const btnOriginal = document.querySelector(`button.btn-success[data-id="${id}"]`);
      if (btnOriginal) btnOriginal.disabled = false;

      const compararBody = document.getElementById("productos-a-comparar");
      if (compararBody && compararBody.children.length === 0) {
        document.getElementById("tabla-comparacion-wrapper")?.remove();
      }
      
      actualizarContadorProductos();
    }, 300);
  }

  /**
   * Limpia todos los productos seleccionados
   */
  function limpiarTodosLosProductos() {
    const cantidad = document.querySelectorAll("#productos-a-comparar .eliminar-btn").length;
    if (cantidad === 0) return;
    
    if (confirm(`¿Estás seguro de eliminar los ${cantidad} productos seleccionados?`)) {
      const filas = document.querySelectorAll("#productos-a-comparar tr");
      filas.forEach((fila, index) => {
        setTimeout(() => {
          fila.style.transition = 'all 0.2s ease';
          fila.style.opacity = '0';
          fila.style.transform = 'translateX(-30px)';
        }, index * 50);
      });
      
      setTimeout(() => {
        document.querySelectorAll("#productos-a-comparar .eliminar-btn").forEach(btn => {
          btn.click();
        });
        sessionStorage.removeItem("supermercadosSeleccionados");
        sessionStorage.removeItem("productosComparados");
      }, filas.length * 50 + 200);
    }
  }

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
    compararBox.parentNode.insertBefore(wrapper, compararBox);
  }

  /**
   * Actualiza el contador de productos en la tabla
   */
  function actualizarContadorProductos() {
    const contador = document.getElementById("contador-productos");
    if (contador) {
      const cantidad = document.querySelectorAll("#productos-a-comparar tr").length;
      contador.textContent = cantidad;
      contador.classList.add("badge-count");
      setTimeout(() => contador.classList.remove("badge-count"), 600);
    }
  }

  /**
   * Maneja la comparación de productos
   */
  function compararProductos() {
    const productos = Array.from(document.querySelectorAll("#productos-a-comparar tr")).map(fila => {
      const celdas = fila.querySelectorAll("td");
      return {
        nombreCompleto: `${celdas[0]?.textContent.trim()} ${celdas[1]?.textContent.trim()} ${celdas[2]?.textContent.trim()} ${celdas[3]?.textContent.trim()}`
      };
    });

    if (productos.length === 0) {
      alert("Agregá al menos un producto para comparar.");
      return;
    }

    const supermercados = Array.from(document.querySelectorAll("#supermercado-buttons .supermercado-btn.selected"))
      .map(btn => {
        const img = btn.querySelector("img");
        const raw = img?.alt?.trim() || "Sin nombre";
        return raw.replace(/^Logo\s*/i, "");
      });

    if (supermercados.length === 0) {
      alert("Seleccioná al menos un supermercado.");
      return;
    }

    sessionStorage.setItem("productosComparados", JSON.stringify(productos));
    sessionStorage.setItem("supermercadosSeleccionados", JSON.stringify(supermercados));

    window.location.href = "/public/productos-comparados.html";
  }

  // ===============================================
  // FUNCIONES DE MENÚ DE CATEGORÍAS
  // ===============================================

  /**
   * Muestra el menú de categorías
   */
  async function showCategoryMenu() {
    categoryMenu.innerHTML = "";

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
        categoryMenu.appendChild(groupDiv);
      });

      categoryMenu.style.display = "block";
    } catch (err) {
      console.error("❌ Error al cargar categorías y subcategorías:", err);
    }
  }

  /**
   * Selecciona una subcategoría del menú
   */
  function seleccionarSubcategoria(subcategoria) {
    productoInput.value = subcategoria;
    categoryMenu.style.display = "none";

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
    const input = productoInput.value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const groups = categoryMenu.querySelectorAll(".category-group");

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
    const marca = filtroMarca?.value || "";
    const contenido = filtroContenido?.value || "";
    const variedad = filtroVariedad?.value || "";

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
    if (!tipoSeleccionado) return;

    eliminarTablaExistente();
    
    setTimeout(() => {
      crearNuevaTablaProductos(tipoSeleccionado);
    }, 300);
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

    const compararBox = document.getElementById("comparar-box");
    compararBox.parentNode.insertBefore(tablaWrapper, compararBox);

    // Animación de entrada
    animarEntrada(tablaWrapper);
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
        <span class="badge badge-marca">${marca}</span>
      </td>
      <td class="celda-contenido">
        <span class="badge badge-contenido">${contenido}</span>
      </td>
      <td class="celda-variedad">
        <span class="badge badge-variedad">${variedad}</span>
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
  // FUNCIONES DE ANIMACIÓN
  // ===============================================

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

});