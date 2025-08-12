document.addEventListener("DOMContentLoaded", () => {
  const productoInput = document.getElementById("producto");
  const categoryMenu = document.getElementById("categoryMenu");
  const listaProductos = document.getElementById("lista-productos");
  const btnAgregar = document.querySelector("button.btn-success");
  const btnComparar = document.querySelector("button.btn-primary");

  // Mostrar menú de categorías
  productoInput.addEventListener("click", showCategoryMenu);
  productoInput.addEventListener("input", filterCategoryMenu);

  // Cerrar menú si se hace clic fuera
  document.addEventListener("click", e => {
    if (!e.target.closest(".category-dropdown")) {
      categoryMenu.style.display = "none";
    }
  });

  // Agregar producto
  btnAgregar.addEventListener("click", agregarProducto);

  // Comparar productos
  btnComparar.addEventListener("click", compararProductos);

  const marcaSelect = document.getElementById("marca");

marcaSelect.addEventListener("change", async () => {
  const producto = productoInput.value.trim();
  const marca = marcaSelect.value;

  if (!producto || !marca) return;

  let productos = [];

  try {
    const res = await fetch(`/api/productos?nombre=${encodeURIComponent(producto)}&marca=${encodeURIComponent(marca)}`);
    productos = await res.json();

    if (!Array.isArray(productos) || productos.length === 0) {
      console.warn("⚠️ Sin productos reales, usando mock");
      productos = generarMockProductos(producto, marca);
    }
  } catch (err) {
    console.error("❌ Error al cargar productos reales:", err);
    productos = generarMockProductos(producto, marca);
  }

  const tablaBody = document.getElementById("tabla-productos-body");
  tablaBody.innerHTML = "";

  productos.forEach(prod => {
    const fila = document.createElement("tr");

    const tdNombre = document.createElement("td");
    tdNombre.textContent = prod.nombre;

    const tdVariedad = document.createElement("td");
    tdVariedad.textContent = prod.variedad;

    const tdContenido = document.createElement("td");
    tdContenido.textContent = prod.contenido;

    const tdMarca = document.createElement("td");
    tdMarca.textContent = prod.marca;

    const tdAccion = document.createElement("td");
    const btn = document.createElement("button");
    btn.className = "btn btn-sm btn-success";
    btn.textContent = "Agregar";
    btn.onclick = () => {
      const item = document.createElement("li");
      item.className = "list-group-item";
      item.textContent = `${prod.nombre} - ${prod.marca} - ${prod.contenido}`;
      listaProductos.appendChild(item);
    };
    tdAccion.appendChild(btn);

    fila.appendChild(tdNombre);
    fila.appendChild(tdVariedad);
    fila.appendChild(tdContenido);
    fila.appendChild(tdMarca);
    fila.appendChild(tdAccion);

    tablaBody.appendChild(fila);
  });

  document.getElementById("tabla-productos-wrapper").style.display = "block";
});

  async function showCategoryMenu() {
    console.log("📥 showCategoryMenu disparado");
    categoryMenu.innerHTML = "";

    try {
      const [resCategorias, resSubcategorias] = await Promise.all([
        fetch("/api/categorias"),
        fetch("/api/subcategorias")
      ]);

      const categories = await resCategorias.json();
      const subcategorias = await resSubcategorias.json();

      console.log("📦 Categorías recibidas:", categories);
      console.log("🧩 Subcategorías recibidas:", subcategorias);

      categories.forEach(cat => {
        const groupDiv = document.createElement("div");
        groupDiv.classList.add("category-group");

        const title = document.createElement("strong");
        title.textContent = cat.categoria_normalizada;
        groupDiv.appendChild(title);

        const subList = document.createElement("ul");
        subList.classList.add("subcategory-list");

        const subcat = subcategorias.find(
          s => s.categoria_normalizada?.trim().toLowerCase() === cat.categoria_normalizada?.trim().toLowerCase()
        );

        const subItems = subcat?.subcategorias || [];

        console.log("🔍 Subcategorías para", cat.categoria_normalizada, "→", subItems);

        subItems.forEach(sub => {
          const item = document.createElement("li");
          item.textContent = sub;
          item.classList.add("subcategory-item");

          item.onclick = () => {
            productoInput.value = sub;
            categoryMenu.style.display = "none";

            // Activar menús dinámicos
            document.getElementById("variedad-wrapper").classList.remove("d-none");
            document.getElementById("contenido-wrapper").classList.remove("d-none");
            document.getElementById("marca-extra-wrapper").classList.remove("d-none");

            // Cargar opciones
            const variedad = document.getElementById("variedad");
            variedad.innerHTML = `<option selected disabled>Elegí una variedad...</option>`;
            ["Clásico", "Integral", "Sin sal"].forEach(op => {
              const opt = document.createElement("option");
              opt.value = op;
              opt.textContent = op;
              variedad.appendChild(opt);
            });

            const contenido = document.getElementById("contenido");
            contenido.innerHTML = `<option selected disabled>Elegí el contenido...</option>`;
            ["500g", "1kg", "2L"].forEach(op => {
              const opt = document.createElement("option");
              opt.value = op;
              opt.textContent = op;
              contenido.appendChild(opt);
            });

            const marcaExtra = document.getElementById("marca-extra");
            marcaExtra.innerHTML = `<option selected disabled>Elegí la marca...</option>`;
            ["La Serenísima", "Ilolay", "Sancor"].forEach(op => {
              const opt = document.createElement("option");
              opt.value = op;
              opt.textContent = op;
              marcaExtra.appendChild(opt);
            });
          };

          subList.appendChild(item);
        });

        groupDiv.appendChild(subList);
        categoryMenu.appendChild(groupDiv);
      });

      categoryMenu.style.display = "block";
      console.log("✅ Menú desplegable activado");
    } catch (err) {
      console.error("❌ Error al cargar categorías y subcategorías:", err);
    }
  }

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

  function agregarProducto() {
    const nombre = productoInput.value.trim();
    const marca = document.getElementById("marca").value;
    const presentacion = document.getElementById("presentacion").value.trim();

    if (!nombre || !marca || !presentacion) {
      alert("Por favor completá todos los campos.");
      return;
    }

    const item = document.createElement("li");
    item.className = "list-group-item";
    item.textContent = `${nombre} - ${marca} - ${presentacion}`;
    listaProductos.appendChild(item);

    // Limpiar campos
    productoInput.value = "";
    document.getElementById("marca").selectedIndex = 0;
    document.getElementById("presentacion").value = "";
    categoryMenu.style.display = "none";
  }

  function compararProductos() {
    const items = Array.from(listaProductos.children).map(li => li.textContent);
    if (items.length === 0) {
      alert("Agregá al menos un producto para comparar.");
      return;
    }

    console.log("📊 Comparando productos:", items);

    // Ejemplo de envío al backend
    // fetch('/api/comparar', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(items)
    // });
  }
});

function generarMockProductos(nombre, marca) {
  const variedades = ["Clásico", "Integral", "Premium"];
  const contenidos = ["500g", "1kg", "750g", "2kg"];

  return Array.from({ length: 5 }, () => ({
    nombre: `${nombre} ${Math.floor(Math.random() * 100)}`,
    variedad: variedades[Math.floor(Math.random() * variedades.length)],
    contenido: contenidos[Math.floor(Math.random() * contenidos.length)],
    marca
  }));
}