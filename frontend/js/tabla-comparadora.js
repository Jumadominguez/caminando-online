document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Iniciando tabla comparadora...");
  
  // ===============================================
  // INICIALIZACIÓN Y VALIDACIÓN DE DATOS
  // ===============================================
  const productos = JSON.parse(sessionStorage.getItem("productosComparados") || "[]");
  const supermercados = JSON.parse(sessionStorage.getItem("supermercadosSeleccionados") || "[]");
  const productosSection = document.querySelector("#productos .container-custom-comparados");
  
  console.log("📊 Datos encontrados:", { productos, supermercados });
  
  // Validación inicial
  if (!productosSection) {
    console.error("❌ No se encontró el contenedor principal");
    return;
  }

  // Ocultar loading inicial
  const loadingElement = document.getElementById("loading-initial");
  if (loadingElement) {
    loadingElement.style.display = "none";
  }

  if (supermercados.length === 0 || productos.length === 0) {
    console.warn("⚠️ No hay datos suficientes para mostrar");
    mostrarMensajeError();
    return;
  }

  // Inicializar frecuencia de supermercados para algoritmo de selección
  const frecuenciaSupermercado = Object.fromEntries(supermercados.map(s => [s, 0]));
  
  console.log("✅ Datos válidos, construyendo interfaz...");
  
  // ===============================================
  // CONSTRUCCIÓN DE LA INTERFAZ
  // ===============================================
  limpiarContenedor();
  construirInterfazCompleta();

  // ===============================================
  // FUNCIONES PRINCIPALES
  // ===============================================

  /**
   * Muestra mensaje de error cuando no hay datos
   */
  function mostrarMensajeError() {
    productosSection.innerHTML = `
      <div class="alert alert-warning text-center p-5">
        <i class="fas fa-exclamation-triangle fa-3x mb-3 text-warning"></i>
        <h4>No hay productos para comparar</h4>
        <p class="mb-4">Por favor, volvé a la página principal y seleccioná productos y supermercados.</p>
        <button class="btn btn-primary btn-lg" onclick="window.location.href='/index.html'">
          <i class="fas fa-arrow-left me-2"></i> Volver al inicio
        </button>
      </div>
    `;
  }

  /**
   * Limpia el contenedor principal
   */
  function limpiarContenedor() {
    productosSection.innerHTML = '';
  }

  /**
   * Construye toda la interfaz de comparación
   */
  function construirInterfazCompleta() {
    console.log("🏗️ Construyendo interfaz completa...");
    
    crearHeaderComparacion();
    const datosTabla = crearTablaComparacion();
    crearSeccionTotales(datosTabla);
    crearResumenAhorro(datosTabla);
    crearSeccionCompra(datosTabla);
    configurarEventListeners(datosTabla);
    
    console.log("✅ Interfaz construida exitosamente");
  }

  /**
   * Crea el header principal con estadísticas
   */
  function crearHeaderComparacion() {
    const headerComparacion = document.createElement("div");
    headerComparacion.className = "comparacion-header-premium";
    headerComparacion.innerHTML = `
      <div class="header-comparacion-content">
        <div class="header-left">
          <h2 class="comparacion-titulo">
            <span class="titulo-icon">📊</span>
            Comparación de Precios
          </h2>
          <p class="comparacion-subtitulo">
            Analizando los mejores precios para tu compra
          </p>
        </div>
        <div class="header-right">
          <div class="stat-card">
            <span class="stat-number">${productos.length}</span>
            <span class="stat-label">Productos</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">${supermercados.length}</span>
            <span class="stat-label">Supermercados</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon">⏱️</span>
            <span class="stat-label">Actualizado</span>
          </div>
        </div>
      </div>
    `;
    productosSection.appendChild(headerComparacion);
    console.log("✅ Header creado");
  }

  /**
   * Crea la tabla principal de comparación
   */
  function crearTablaComparacion() {
    console.log("📋 Creando tabla de comparación...");
    
    const tablaWrapper = document.createElement("div");
    tablaWrapper.className = "tabla-comparadora-wrapper-premium";

    const tabla = document.createElement("table");
    tabla.className = "table tabla-productos-comparados-premium";

    // Crear estructura de la tabla
    const thead = crearThead();
    const tbody = crearTbody();
    
    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    tablaWrapper.appendChild(tabla);
    productosSection.appendChild(tablaWrapper);

    console.log("✅ Tabla creada");
    return calcularDatosTabla();
  }

  /**
   * Crea el header de la tabla
   */
  function crearThead() {
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
   */
  function crearTbody() {
    const tbody = document.createElement("tbody");
    tbody.className = "tbody-premium";
    tbody.id = "tabla-productos-comparados-body";

    productos.forEach((prod, index) => {
      const fila = crearFilaProducto(prod, index);
      tbody.appendChild(fila);
    });

    return tbody;
  }

  /**
   * Crea una fila individual de producto
   */
  function crearFilaProducto(producto, index) {
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
          <span class="producto-codigo">SKU: ${generarSKU()}</span>
        </div>
      </div>
    `;
    return celda;
  }

  /**
   * Crea una celda de precio para un supermercado
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
   * Calcula todos los datos necesarios de la tabla
   */
  function calcularDatosTabla() {
    console.log("🧮 Calculando datos de la tabla...");
    
    const totales = {};
    let totalOnline = 0;

    supermercados.forEach(s => totales[s] = 0);

    // Calcular totales recorriendo las filas
    document.querySelectorAll("#tabla-productos-comparados-body tr").forEach(fila => {
      const celdas = fila.querySelectorAll("td");
      
      supermercados.forEach((s, i) => {
        const textoValor = celdas[i + 1]?.querySelector('.precio-valor')?.textContent || '$0';
        const valor = parseInt(textoValor.replace(/[$,.]/g, '')) || 0;
        totales[s] += valor;
      });

      const textoOnline = celdas[celdas.length - 1]?.querySelector('.precio-caminando-valor')?.textContent || '$0';
      const valorOnline = parseInt(textoOnline.replace(/[$,.]/g, '')) || 0;
      totalOnline += valorOnline;
    });

    console.log("✅ Datos calculados:", { totales, totalOnline });
    return { totales, totalOnline };
  }

  /**
   * Crea la sección de totales
   */
  function crearSeccionTotales({ totales, totalOnline }) {
    console.log("📊 Creando sección de totales...");
    
    const seccionTotales = document.createElement("div");
    seccionTotales.className = "seccion-totales-premium";
    seccionTotales.innerHTML = `
      <h3 class="totales-titulo">
        <span class="titulo-icon">💰</span>
        Resumen
      </h3>
    `;

    const tablaTotales = crearTablaTotales(totales, totalOnline);
    seccionTotales.appendChild(tablaTotales);
    productosSection.appendChild(seccionTotales);
    
    console.log("✅ Sección de totales creada");
  }

/**
   * Crea la tabla de totales
   */
  function crearTablaTotales(totales, totalOnline) {
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
    const filaTotal = crearFilaTotales(totales, totalOnline);
    tbody.appendChild(filaTotal);
    tabla.appendChild(tbody);

    return tabla;
  }

  /**
   * Crea la fila de totales
   */
  function crearFilaTotales(totales, totalOnline) {
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

  /**
   * Crea el resumen de ahorro
   */
  function crearResumenAhorro({ totales, totalOnline }) {
    console.log("💡 Creando resumen de ahorro...");
    
    const promedio = Math.round(Object.values(totales).reduce((a, b) => a + b, 0) / supermercados.length);
    const ahorro = promedio - totalOnline;
    const porcentajeAhorro = ((ahorro / promedio) * 100).toFixed(1);

    const resumenAhorro = document.createElement("div");
    resumenAhorro.className = "resumen-ahorro-premium";
    resumenAhorro.innerHTML = `
      <div class="ahorro-content">
        <div class="ahorro-icon">
          <i class="fas fa-trophy fa-3x"></i>
        </div>

        <div class="ahorro-info">
          <!-- 1. Título -->
          <h3 class="ahorro-titulo">
            ¡Felicitaciones! Caminando Online estás ahorrando:
          </h3>

          <!-- 2. Cantidad -->
          <div class="ahorro-numeros">
            <div class="ahorro-cantidad">
              <span class="ahorro-numeros">
                $${ahorro.toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          <!-- 3. Descripción con porcentaje y comparación -->
          <p class="ahorro-descripcion">
            <span class="ahorro-label">Equivale a un </span>
            <span class="ahorro-valor">${porcentajeAhorro}% </span>
            <span class="ahorro-label">
              MENOS que el promedio de ${supermercados.length} supermercados.
            </span>
          </p>
        </div>
      </div>
    `;
    productosSection.appendChild(resumenAhorro);

    console.log("✅ Resumen de ahorro creado");
    return { ahorro, porcentajeAhorro };
  }

  /**
   * Crea la sección de botones de compra
   */
  function crearSeccionCompra({ totales, totalOnline }) {
    console.log("🛒 Creando sección de compra...");
    
    const promedio = Math.round(Object.values(totales).reduce((a, b) => a + b, 0) / supermercados.length);
    const ahorro = promedio - totalOnline;
    const mostrarDonacion = ahorro >= 10000;

    const seccionCompra = document.createElement("div");
    seccionCompra.className = "seccion-compra-premium";
    seccionCompra.innerHTML = `

      <div class="botones-compra-grid">
        ${crearBotonCaminando(totalOnline, ahorro, mostrarDonacion)}
      </div>
    `;
    productosSection.appendChild(seccionCompra);

    console.log("✅ Sección de compra creada");
    return { mostrarDonacion, ahorro };
  }

  /**
   * Crea los botones de compra por supermercado
   */
  function crearBotonesSupermercados(totales) {
    return supermercados.map(s => `
      <button class="btn-comprar-super" data-super="${s}">
        <span class="btn-text">Comprar en ${s}</span>
        <span class="btn-total">Total: $${totales[s].toLocaleString('es-AR')}</span>
      </button>
    `).join('');
  }

  /**
   * Crea el botón especial de Caminando Online
   */
  function crearBotonCaminando(totalOnline, ahorro, mostrarDonacion) {
    return `
      <button class="btn-comprar-caminando" ${mostrarDonacion ? '' : 'disabled'}>
        <span class="btn-text-principal">¡Comprá Caminando!</span>
        <span class="btn-total-caminando">Total: $${totalOnline.toLocaleString('es-AR')}</span>
        <span class="btn-ahorro">Ahorrás: $${ahorro.toLocaleString('es-AR')}</span>
        ${mostrarDonacion 
          ? '<span class="btn-proximamente">Solicitar acceso anticipado</span>' 
          : '<span class="btn-proximamente">Próximamente 🙂</span>'
        }
      </button>
    `;
  }

  // ===============================================
  // FUNCIONES UTILITARIAS
  // ===============================================

  /**
   * Genera un SKU aleatorio
   */
  function generarSKU() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  // ===============================================
  // ANIMACIONES SIMPLES
  // ===============================================
  setTimeout(() => {
    document.querySelectorAll('.comparacion-header-premium, .tabla-comparadora-wrapper-premium, .seccion-totales-premium, .resumen-ahorro-premium, .seccion-compra-premium').forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease';
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 2000);
    });
  }, 1000);

  console.log("🎉 Tabla comparadora completamente inicializada");

});

// ===============================================
// CARTEL FLOTANTE DE DONACIONES
// ===============================================

// Esperar a que todo esté cargado y luego crear el cartel
setTimeout(() => {
  console.log("🎁 Iniciando creación del cartel...");
  
  // 1. Agregar estilos CSS
  const estilos = document.createElement('style');
  estilos.innerHTML = `
  .cartel-donacion-flotante {
    position: absolute;
    left: -600px;
    top: calc(70% + 70px);
    transform: translateY(-50%);
    height: 380px;
    width: 350px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    border: 1px solid #ddd;
    z-index: 1000;
    font-family: 'Segoe UI', 'Roboto', sans-serif;
    overflow: hidden;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .cartel-donacion-flotante.mostrar {
    opacity: 1;
    left: calc(100% + 20px); /* Se mueve a 20px A LA DERECHA del container */
  }

  .cartel-header {
    position: relative;
    padding: 1.5rem 1rem 1rem;
    background: linear-gradient(135deg, #ff6f00, #ffab40);
    color: white;
  }

  .lita-indice {
    position: absolute;
    top: 134px; /* Más arriba que antes */
    left: 17%;
    transform: translateX(-50%); /* Para centrar perfectamente */
    width: 125px;
    height: auto;
    z-index: 1001;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1)); /* Sombra opcional */
  }

  .cartel-texto-titulo {
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 0.5;
    margin-top: 10px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .cartel-texto-h1 {
    font-size: 1rem;
    font-weight: 500;
    line-height: 20px;
    margin-top: 1px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .cartel-texto-h2 {
    font-size: 0.85rem;
    font-weight: 500;
    line-height: 1.5;
    margin-left: 7.5rem;
    margin-right: 1rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    text-align: justify;
  }

  .cartel-opciones {
    padding: 1rem;
    display: flex;
    justify-content: space-around;
    gap: 0.5rem;
  }

  .opcion-donacion {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    background: #f8f9fa;
    border: 2px solid transparent;
  }

  .opcion-donacion:hover {
    background: #fff8e1;
    border-color: #ff6f00;
    transform: translateY(-2px);
  }

  .qr-thumb {
    width: 50px;
    height: 50px;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 0.5rem;
  }

  .opcion-texto {
    font-size: 0.7rem;
    color: #666;
    font-weight: 500;
    text-align: center;
  }

  .btn-cerrar-cartel {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
  }

  .btn-cerrar-cartel:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .modal-qr {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }

  .modal-qr.show {
    display: flex;
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    max-width: 400px;
    margin: 0 1rem;
    position: relative;
  }

  .qr-expandido {
    width: 250px;
    height: 250px;
    margin: 1rem auto;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .close-modal {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
  }

  .modal-titulo {
    color: #ff6f00;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .modal-descripcion {
    color: #666;
    font-size: 0.9rem;
    margin-top: 1rem;
  }

  /* CRÍTICO: Hacer que el container tenga position relative */
  .container-custom-comparados {
    position: relative !important;
    overflow: visible !important;
  }

  @media (max-width: 768px) {
    .cartel-donacion-flotante {
      width: 250px;
      left: -270px;
    }
    
    .cartel-donacion-flotante.mostrar {
      left: calc(100% + 10px);
    }
    
    .cartel-texto {
      font-size: 0.8rem;
    }
    
    .qr-thumb {
      width: 40px;
      height: 40px;
    }
  }
`;

  document.head.appendChild(estilos);
  console.log("✅ Estilos agregados");

  // 2. Crear HTML del cartel
  const cartelHTML = `
    <div id="cartel-donacion-flotante" class="cartel-donacion-flotante">
      <div class="cartel-header">
        <img src="/assets/img/lita-indice.png" alt="Lita" class="lita-indice">
        <button class="btn-cerrar-cartel" type="button">×</button>
        <div class="cartel-texto-titulo">Caminando Online </div>
        <div class="cartel-texto-h1"></br> momentáneamente es gratuito y se sostiene gracias a las donaciones de sus usuarios. </div>  
        <div class="cartel-texto-h2"></br> Si quisieras compartir parte de lo ahorrado con nosotros, ¡te lo agradeceremos mejorando la plataforma!</div>
      </div>
      
      <div class="cartel-opciones">
        <div class="opcion-donacion" onclick="window.mostrarQRCartel('btc')">
          <img src="/assets/img/qr-btc.png" alt="Bitcoin QR" class="qr-thumb">
          <div class="opcion-texto">Bitcoin</div>
        </div>
        
        <div class="opcion-donacion" onclick="window.mostrarQRCartel('usdt')">
          <img src="/assets/img/qr-usdt.png" alt="USDT QR" class="qr-thumb">
          <div class="opcion-texto">USDT</div>
        </div>
        
        <div class="opcion-donacion" onclick="window.mostrarQRCartel('mp')">
          <img src="/assets/img/qr-mp.png" alt="MercadoPago QR" class="qr-thumb">
          <div class="opcion-texto">MercadoPago</div>
        </div>
      </div>
    </div>

    <div id="modal-qr-cartel" class="modal-qr">
      <div class="modal-content">
        <button class="close-modal" onclick="window.cerrarModalCartel()">×</button>
        <div id="modal-titulo-cartel" class="modal-titulo"></div>
        <img id="qr-expandido-cartel" class="qr-expandido" src="" alt="QR Code">
        <div id="modal-descripcion-cartel" class="modal-descripcion"></div>
      </div>
    </div>
  `;

  // 3. Insertar en el body
  const container = document.querySelector('.container-custom-comparados');
  if (container) {
    container.insertAdjacentHTML('beforeend', cartelHTML);
    console.log("✅ HTML del cartel insertado en el container");
  } else {
    document.body.insertAdjacentHTML('beforeend', cartelHTML);
    console.log("⚠️ Container no encontrado, insertando en body");
  }

  // 4. Configurar botón cerrar
  const btnCerrar = document.querySelector('.btn-cerrar-cartel');
  if (btnCerrar) {
    btnCerrar.onclick = function() {
      const cartel = document.getElementById('cartel-donacion-flotante');
      if (cartel) {
        cartel.classList.remove('mostrar');
        setTimeout(() => {
          cartel.style.display = 'none';
        }, 600);
      }
    };
  }

  // 5. Mostrar el cartel
  setTimeout(() => {
    const cartel = document.getElementById('cartel-donacion-flotante');
    if (cartel) {
      cartel.classList.add('mostrar');
      console.log("✅ Cartel mostrado");
    } else {
      console.error("❌ No se encontró el cartel para mostrar");
    }
  }, 1000);

}, 1000); // Esperar 1 segundos después de que cargue la página

// Funciones globales para los QR
window.mostrarQRCartel = function(tipo) {
  console.log(`🔍 Mostrando QR: ${tipo}`);
  const modal = document.getElementById('modal-qr-cartel');
  const titulo = document.getElementById('modal-titulo-cartel');
  const qrImg = document.getElementById('qr-expandido-cartel');
  const descripcion = document.getElementById('modal-descripcion-cartel');
  
  const configs = {
    btc: {
      titulo: 'Donación con Bitcoin',
      img: '/assets/img/qr-btc.png',
      descripcion: 'Escanea este código QR con tu wallet de Bitcoin para realizar una donación'
    },
    usdt: {
      titulo: 'Donación con USDT',
      img: '/assets/img/qr-usdt.png', 
      descripcion: 'Escanea este código QR con tu wallet de USDT para realizar una donación'
    },
    mp: {
      titulo: 'Donación con MercadoPago',
      img: '/assets/img/qr-mp.png',
      descripcion: 'Escanea este código QR con la app de MercadoPago para realizar una donación'
    }
  };
  
  const config = configs[tipo];
  if (config && modal && titulo && qrImg && descripcion) {
    titulo.textContent = config.titulo;
    qrImg.src = config.img;
    descripcion.textContent = config.descripcion;
    modal.classList.add('show');
  }
};

window.cerrarModalCartel = function() {
  const modal = document.getElementById('modal-qr-cartel');
  if (modal) {
    modal.classList.remove('show');
  }
};