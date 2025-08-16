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
        <button class="btn btn-primary btn-lg" onclick="window.location.href='index.html'">
          <i class="fas fa-arrow-left me-2"></i> Volver al inicio
        </button>
      </div>
    `;
  }

  /**
   * Limpia el contenedor principal preservando el cartel de donaciones
   */
  function limpiarContenedor() {
    // Buscar y preservar el cartel si existe
    const cartelExistente = document.getElementById('cartel-donacion-flotante');
    
    // Limpiar el contenedor
    productosSection.innerHTML = '';
    
    // Restaurar el cartel si existía
    if (cartelExistente) {
      productosSection.appendChild(cartelExistente);
      console.log("✅ Cartel de donaciones preservado durante limpieza");
    }
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

    // Crear estructura de la tabla usando el módulo TablaGenerator
    const thead = window.TablaGenerator.crearThead(supermercados);
    const tbody = window.TablaGenerator.crearTbody(productos, supermercados, frecuenciaSupermercado);
    
    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    tablaWrapper.appendChild(tabla);
    productosSection.appendChild(tablaWrapper);

    console.log("✅ Tabla creada");
    return calcularDatosTabla();
  }

  /**
   * Calcula todos los datos necesarios de la tabla
   */
  function calcularDatosTabla() {
    console.log("🧮 Calculando datos de la tabla...");
    
    if (window.DataManager) {
      const resultado = window.DataManager.calcularTotalesDesdeDOM(
        "#tabla-productos-comparados-body", 
        supermercados
      );
      console.log("✅ Datos calculados con DataManager:", resultado);
      return resultado;
    } else {
      // Fallback al método original
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

      console.log("✅ Datos calculados (fallback):", { totales, totalOnline });
      return { totales, totalOnline };
    }
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
    return window.TablaGenerator.crearTablaTotales(totales, totalOnline, supermercados);
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
                ${ahorro.toLocaleString('es-AR')}
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
   * Crea el botón especial de Caminando Online
   */
  function crearBotonCaminando(totalOnline, ahorro, mostrarDonacion) {
    return `
      <button class="btn-comprar-caminando" ${mostrarDonacion ? '' : 'disabled'}>
        <span class="btn-text-principal">¡Comprá Caminando!</span>
        <span class="btn-total-caminando">Total: ${totalOnline.toLocaleString('es-AR')}</span>
        <span class="btn-ahorro">Ahorrás: ${ahorro.toLocaleString('es-AR')}</span>
        ${mostrarDonacion 
          ? '<span class="btn-proximamente">Solicitar acceso anticipado</span>' 
          : '<span class="btn-proximamente">Próximamente 🙂</span>'
        }
      </button>
    `;
  }

  /**
   * Configura event listeners
   */
  function configurarEventListeners(datosTabla) {
    // Aquí se pueden agregar más event listeners si es necesario
    console.log("✅ Event listeners configurados");
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
      }, index * 200);
    });
  }, 100);

  console.log("🎉 Tabla comparadora completamente inicializada");

});
