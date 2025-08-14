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
      ahorroSpan.textContent = `${ahorro}`;

      const porcentajeSpan = document.createElement("span");
      porcentajeSpan.style.color = "#d84315";
      porcentajeSpan.textContent = `${porcentaje}%`;

      resumen.innerHTML = `¡Caminando Online te estás ahorrando `;
      resumen.appendChild(ahorroSpan);
      resumen.innerHTML += `, eso es `;
      resumen.appendChild(porcentajeSpan);
      resumen.innerHTML += ` menos que el promedio de supermercados!`;

      productosSection.appendChild(resumen);

      // 🎁 Cartel de donaciones FUERA del container
      const cartelDonaciones = document.createElement("div");
      cartelDonaciones.className = "cartel-donaciones-flotante";
      cartelDonaciones.innerHTML = `
        <div class="text-center">
          <div class="mb-2"></div>
          <div style="font-size: 1.3rem;">
            <strong>Caminando Online</strong>
          </div>
            <div style="font-size: 1rem;"> 
            momentaneamente es gratuito y se sostiene gracias a las donaciones.
            </div>
          <div style="font-size: 0.85rem; margin-top: 8px; margin-bottom: 1rem;">
            Si querés compartir parte de tu ahorro con nosotros te lo vamos a agradecer
          </div>
          <div class="qr-donaciones">
            <div class="qr-item" data-crypto="btc">
              <img src="/assets/img/qr-btc.png" alt="Donar con Bitcoin" class="qr-small" />
              <span class="qr-label">BTC</span>
            </div>
            <div class="qr-item" data-crypto="usdt">
              <img src="/assets/img/qr-usdt.png" alt="Donar con USDT" class="qr-small" />
              <span class="qr-label">USDT</span>
            </div>
            <div class="qr-item" data-crypto="mp">
              <img src="/assets/img/qr-mp.png" alt="Donar con MercadoPago" class="qr-small" />
              <span class="qr-label">MP</span>
            </div>
          </div>
        </div>
        
        <!-- Modal para QR ampliado -->
        <div class="qr-modal" id="qr-modal">
          <div class="qr-modal-content">
            <img src="" alt="" class="qr-large" id="qr-large-img" />
            <div class="qr-modal-title" id="qr-modal-title"></div>
          </div>
        </div>
      `;

      // Crear la imagen de Lita por separado
      const litaImagen = document.createElement("img");
      litaImagen.src = "/assets/img/lita-indice.png";
      litaImagen.alt = "Lita señalando";
      litaImagen.className = "lita-imagen-externa";

      // En móvil, agregar después del resumen. En desktop, posicionar relativo al container
      if (window.innerWidth <= 768) {
        productosSection.appendChild(cartelDonaciones);
      } else {
        // Posicionar el cartel relativo al container
        document.body.appendChild(cartelDonaciones);
        document.body.appendChild(litaImagen);
        
        // Función para posicionar el cartel y la imagen
        const posicionarCartel = () => {
          const containerRect = productosSection.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
          // Buscar el mensaje verde de resumen de ahorro
          const resumenElement = productosSection.querySelector('.alert-success');
          if (resumenElement) {
            const resumenRect = resumenElement.getBoundingClientRect();
            
            // Posición a 50px a la derecha del container
            cartelDonaciones.style.left = `${containerRect.right + 20}px`;
            // Alineado con el borde superior del resumen de ahorro
            cartelDonaciones.style.top = `${containerRect.top + scrollTop + (containerRect.height * 0.66)}px`;
            
            // Posicionar imagen de Lita
            litaImagen.style.left = `${containerRect.right + 22}px`; // Alineada a la izquierda del cartel
            litaImagen.style.top = `${resumenRect.top + scrollTop - 190}px`; // 60px arriba del cartel
          } else {
            // Fallback si no encuentra el resumen
            cartelDonaciones.style.left = `${containerRect.right + 20}px`;
            cartelDonaciones.style.top = `${containerRect.top + scrollTop + 240}px`;
            
            litaImagen.style.left = `${containerRect.right + 22}px`;
            litaImagen.style.top = `${containerRect.top + scrollTop + 240}px`;
          }
          
          // Hacer visible el cartel y la imagen
          cartelDonaciones.style.opacity = '1';
          litaImagen.style.opacity = '1';
        };
        
        // Posicionar inicialmente
        posicionarCartel();
        
        // Activar animación de entrada después de un pequeño delay
        setTimeout(() => {
          cartelDonaciones.classList.add('entrada-desde-atras');
          litaImagen.classList.add('entrada-desde-atras');
          
          // Después de la animación, deshabilitar transiciones de posición
          setTimeout(() => {
            cartelDonaciones.classList.add('posicionado');
            litaImagen.classList.add('posicionado');
          }, 600); // Esperar a que termine la animación de entrada
        }, 200);
        
        // Reposicionar cuando se hace scroll o se redimensiona (sin animación)
        window.addEventListener('scroll', posicionarCartel);
        window.addEventListener('resize', posicionarCartel);
        
        // Agregar funcionalidad a los QR después de un pequeño delay
        setTimeout(() => {
          setupQRFunctionality();
        }, 800);
      }

      // Función para configurar la funcionalidad de los QR
      function setupQRFunctionality() {
        const qrItems = document.querySelectorAll('.qr-item');
        const modal = document.getElementById('qr-modal');
        const modalImg = document.getElementById('qr-large-img');
        const modalTitle = document.getElementById('qr-modal-title');
        const cartelFlotan = document.querySelector('.cartel-donaciones-flotante');

        const cryptoNames = {
          'btc': 'Bitcoin (BTC)',
          'usdt': 'Tether (USDT)', 
          'mp': 'MercadoPago'
        };

        qrItems.forEach(item => {
          // Tanto Desktop como Mobile: click para mostrar
          item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Evitar que se propague al documento
            showQRModal(item, modal, modalImg, modalTitle, cryptoNames);
          });
        });

        // Cerrar al tocar/click fuera del modal
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            hideQRModal(modal);
          }
        });

        // Prevenir cierre cuando se hace click dentro del modal
        modal.querySelector('.qr-modal-content').addEventListener('click', (e) => {
          e.stopPropagation();
        });

        // Cerrar cuando se hace click fuera del cartel flotante
        document.addEventListener('click', (e) => {
          // Verificar si el modal está abierto
          if (modal.style.display === 'flex') {
            // Verificar si el click fue fuera del cartel flotante Y fuera del modal
            const clickedInsideCartel = cartelFlotan && cartelFlotan.contains(e.target);
            const clickedInsideModal = modal.contains(e.target);
            
            if (!clickedInsideCartel && !clickedInsideModal) {
              hideQRModal(modal);
            }
          }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            hideQRModal(modal);
          }
        });
      }

      function showQRModal(item, modal, modalImg, modalTitle, cryptoNames) {
        const crypto = item.dataset.crypto;
        const imgSrc = `/assets/img/qr-${crypto}.png`;
        
        modalImg.src = imgSrc;
        modalImg.alt = `QR ${cryptoNames[crypto]}`;
        modalTitle.textContent = `Escanear ${cryptoNames[crypto]}`;
        
        modal.style.display = 'flex';
      }

      function hideQRModal(modal) {
        modal.style.display = 'none';
      }

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