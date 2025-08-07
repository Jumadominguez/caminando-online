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

  async function showCategoryMenu() {
    categoryMenu.innerHTML = "";

    try {
      const res = await fetch("/api/categorias");
      const categories = await res.json();

      categories.forEach(cat => {
        const groupDiv = document.createElement("div");
        groupDiv.classList.add("category-group");

        const title = document.createElement("strong");
        title.textContent = cat.category;
        groupDiv.appendChild(title);

        const subList = document.createElement("ul");
        subList.classList.add("subcategory-list");

        const subItems = cat.filters?.["Tipo de producto"] || [];
        subItems.forEach(sub => {
          const item = document.createElement("li");
          item.textContent = sub;
          item.classList.add("subcategory-item");
          item.onclick = () => {
            productoInput.value = sub;
            categoryMenu.style.display = "none";
          };
          subList.appendChild(item);
        });

        groupDiv.appendChild(subList);
        categoryMenu.appendChild(groupDiv);
      });

      categoryMenu.style.display = "block";
    } catch (err) {
      console.error("❌ Error al cargar categorías:", err);
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