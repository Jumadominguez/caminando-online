document.addEventListener("DOMContentLoaded", () => {
  const productos = JSON.parse(sessionStorage.getItem("productosComparados") || "[]");
  const supermercados = JSON.parse(sessionStorage.getItem("supermercadosSeleccionados") || "[]");
  const frecuenciaSupermercado = Object.fromEntries(supermercados.map(s => [s, 0]));

  const volverSection = document.getElementById("volver-a-filtros");
  if (volverSection) {
    const wrapper = document.createElement("div");
    wrapper.className = "text-center mb-4";

    const boton = document.createElement("button");
    boton.className = "btn btn-secondary";
    boton.textContent = "← Volver a los filtros";
    boton.onclick = () => window.location.href = "/index.html";

    wrapper.appendChild(boton);
    volverSection.appendChild(wrapper);
  }

  const productosSection = document.querySelector("#productos .container-custom-comparados");
  if (productosSection && supermercados.length > 0 && productos.length > 0) {
    // 🧱 Título
    const titulo = document.createElement("h5");
    titulo.className = "mb-3";
    titulo.textContent = "🧮 Comparación de precios por supermercado";
    productosSection.appendChild(titulo);

    // 🧱 Tabla comparadora
    const tablaWrapper = document.createElement("div");
    tablaWrapper.className = "tabla-comparadora-wrapper";

    const tabla = document.createElement("table");
    tabla.className = "table table-bordered table-sm tabla-productos-comparados";

    const thead = document.createElement("thead");
    const filaHead = document.createElement("tr");

    const thProducto = document.createElement("th");
    thProducto.textContent = "Producto";
    filaHead.appendChild(thProducto);

    supermercados.forEach(s => {
      const th = document.createElement("th");
      th.textContent = s;
      filaHead.appendChild(th);
    });

    const thOnline = document.createElement("th");
    thOnline.textContent = "Caminando Online";
    filaHead.appendChild(thOnline);

    thead.appendChild(filaHead);
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");
    tbody.id = "tabla-productos-comparados-body";
    tabla.appendChild(tbody);
    tablaWrapper.appendChild(tabla);
    productosSection.appendChild(tablaWrapper);

    // 🧮 Renderizar filas
    productos.forEach(prod => {
      const precios = supermercados.map(() => Math.floor(Math.random() * 1000 + 900));
      const precioMin = Math.min(...precios);

      const indicesMinimos = precios
        .map((p, i) => p === precioMin ? i : -1)
        .filter(i => i !== -1);

      let supermercadoElegidoIndex = indicesMinimos[0];
      let maxFrecuencia = -1;
      indicesMinimos.forEach(i => {
        const nombreSuper = supermercados[i];
        const frecuencia = frecuenciaSupermercado[nombreSuper];
        if (frecuencia > maxFrecuencia) {
          maxFrecuencia = frecuencia;
          supermercadoElegidoIndex = i;
        }
      });

      const supermercadoElegido = supermercados[supermercadoElegidoIndex];
      frecuenciaSupermercado[supermercadoElegido]++;

      const fila = document.createElement("tr");

      const celdaNombre = document.createElement("td");
      celdaNombre.textContent = prod.nombreCompleto;
      fila.appendChild(celdaNombre);

      precios.forEach((p, i) => {
        const celda = document.createElement("td");
        celda.textContent = `$${p}`;
        if (i === supermercadoElegidoIndex) {
          celda.classList.add("precio-minimo-super");
        }
        fila.appendChild(celda);
      });

      const celdaOnline = document.createElement("td");
      celdaOnline.textContent = `$${precioMin}`;
      fila.appendChild(celdaOnline);

      tbody.appendChild(fila);
    });

    // 🧮 Calcular y renderizar totales
    const calcularTotales = () => {
      const totales = Object.fromEntries(supermercados.map(s => [s, 0]));
      let totalOnline = 0;

      document.querySelectorAll("#tabla-productos-comparados-body tr").forEach(fila => {
        const celdas = fila.querySelectorAll("td");
        supermercados.forEach((s, i) => {
          const valor = parseInt(celdas[i + 1].textContent.replace("$", "")) || 0;
          totales[s] += valor;
        });
        const valorOnline = parseInt(celdas[celdas.length - 1].textContent.replace("$", "")) || 0;
        totalOnline += valorOnline;
      });

      return { totales, totalOnline };
    };

    const renderResumenTotales = ({ totales, totalOnline }) => {
      // 🧱 Título de totales
      const tituloTotales = document.createElement("h5");
      tituloTotales.className = "mt-4 mb-3";
      tituloTotales.textContent = "📊 Totales por supermercado";
      productosSection.appendChild(tituloTotales);

      // 🧱 Tabla horizontal
      const tablaTotales = document.createElement("table");
      tablaTotales.className = "table table-bordered table-sm tabla-totales-comparados";

      const theadTotales = document.createElement("thead");
      const filaSupermercados = document.createElement("tr");

      const thLabel = document.createElement("th");
      thLabel.textContent = "Supermercado";
      filaSupermercados.appendChild(thLabel);

      supermercados.forEach(s => {
        const th = document.createElement("th");
        th.textContent = s;
        filaSupermercados.appendChild(th);
      });

      const thOnline = document.createElement("th");
      thOnline.textContent = "Caminando Online";
      filaSupermercados.appendChild(thOnline);

      theadTotales.appendChild(filaSupermercados);
      tablaTotales.appendChild(theadTotales);

      const tbodyTotales = document.createElement("tbody");
      const filaTotales = document.createElement("tr");

      const tdLabel = document.createElement("td");
      tdLabel.textContent = "Total";
      filaTotales.appendChild(tdLabel);

      supermercados.forEach(s => {
        const td = document.createElement("td");
        td.textContent = `$${totales[s]}`;
        filaTotales.appendChild(td);
      });

      const tdOnline = document.createElement("td");
      tdOnline.textContent = `$${totalOnline}`;
      filaTotales.appendChild(tdOnline);

      tbodyTotales.appendChild(filaTotales);
      tablaTotales.appendChild(tbodyTotales);

      // 🧱 Wrapper visual
      const tablaTotalesWrapper = document.createElement("div");
      tablaTotalesWrapper.className = "tabla-totales-wrapper";
      tablaTotalesWrapper.appendChild(tablaTotales);
      productosSection.appendChild(tablaTotalesWrapper);

      // 🧾 Resumen de ahorro
      const sumaSupermercados = supermercados.reduce((acc, s) => acc + totales[s], 0);
      const promedio = Math.round(sumaSupermercados / supermercados.length);
      const ahorro = promedio - totalOnline;
      const porcentaje = ((ahorro / promedio) * 100).toFixed(2);

      const resumen = document.createElement("div");
      resumen.className = "alert alert-success mt-3 fw-bold";

      const ahorroSpan = document.createElement("span");
      ahorroSpan.style.color = "#d84315";
      ahorroSpan.textContent = `$${ahorro}`;

      const porcentajeSpan = document.createElement("span");
      porcentajeSpan.style.color = "#d84315";
      porcentajeSpan.textContent = `${porcentaje}%`;

      resumen.innerHTML = `¡Caminando Online te estás ahorrando `;
      resumen.appendChild(ahorroSpan);
      resumen.innerHTML += `, eso es `;
      resumen.appendChild(porcentajeSpan);
      resumen.innerHTML += ` menos que el promedio de supermercados!`;

      productosSection.appendChild(resumen);

      // 🛒 Botón "Compra con CaminandoOnline"
      const botonCompra = document.createElement("button");
      botonCompra.className = "btn btn-warning btn-lg w-100 mt-3 fw-bold boton-caminando-online";
      botonCompra.innerHTML = `🛒 <strong>¡Comprá Caminando!</strong><br>
        <small style="font-size: 0.85rem; color: #6d4c41;">(Próximamente 🙂)</small>`;
      botonCompra.disabled = true; // Desactivado por ahora

      productosSection.appendChild(botonCompra);
    };

    // 🧮 Ejecutar resumen
    const { totales, totalOnline } = calcularTotales();
    renderResumenTotales({ totales, totalOnline });
  }
});
