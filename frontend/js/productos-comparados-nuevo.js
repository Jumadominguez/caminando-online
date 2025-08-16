// ==========================================
// PRODUCTOS COMPARADOS NUEVO - js/productos-comparados-nuevo.js
// ==========================================
// JavaScript unificado para la página de comparación de productos

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Iniciando tabla comparadora...");
  
  // ===============================================
  // VARIABLES Y DATOS
  // ===============================================
  const productos = JSON.parse(sessionStorage.getItem("productosComparados") || "[]");
  const supermercados = JSON.parse(sessionStorage.getItem("supermercadosSeleccionados") || "[]");
  const productosSection = document.querySelector("#productos .container-custom-comparados");
  
  console.log("📊 Datos encontrados:", { productos, supermercados });
  
  // ===============================================
  // INICIALIZACIÓN
  // ===============================================
  init();

  async function init() {
    // Actualizar UI de autenticación
    await actualizarUIAutenticacion();
    
    // Validar datos
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

    // Construir interfaz
    construirInterfazCompleta();
    
    console.log("✅ Tabla comparadora inicializada");
  }

  // ===============================================
  // AUTENTICACIÓN
  // ===============================================
  async function actualizarUIAutenticacion() {
    const authButton = document.getElementById('auth-button');
    
    if (authButton) {
      // Por ahora, simular que no está logueado
      const logueado = localStorage.getItem('token') ? true : false;
      
      if (logueado) {
        authButton.innerHTML = `
          <i class="fas fa-user-circle"></i> 
          Mi Perfil
        `;
        authButton.onclick = () => window.location.href = '/private/dashboard/dashboard.html';
      } else {
        authButton.innerHTML = `
          <i class="fas fa-sign-in-alt"></i> 
          Iniciar Sesión
        `;
        authButton.onclick = () => window.location.href = '/private/auth/login.html';
      }
    }
  }

  // ===============================================
  // CONSTRUCCIÓN DE INTERFAZ
  // ===============================================
  function construirInterfazCompleta() {
    console.log("🏗️ Construyendo interfaz completa...");
    
    limpiarContenedor();
    crearHeaderComparacion();
    const datosTabla = crearTablaComparacion();
    crearSeccionTotales(datosTabla);
    crearResumenAhorro(datosTabla);
    crearSeccionCompra(datosTabla);
    
    console.log("✅ Interfaz construida exitosamente");
  }

  function limpiarContenedor() {
    productosSection.innerHTML = '';
  }

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

  function crearTablaComparacion() {
    console.log("📋 Creando tabla de comparación...");
    
    // Generar precios simulados
    const datosTabla = generarDatosComparacion();
    
    const tablaWrapper = document.createElement("div");
    tablaWrapper.className = "tabla-comparadora-wrapper-premium";
    
    let columnasHTML = `
      <th class="th-producto-premium">
        <div class="th-content-premium">
          <span class="th-text">Producto</span>
        </div>
      </th>
    `;
    
    // Columnas de supermercados
    supermercados.forEach(supermercado => {
      columnasHTML += `
        <th class="th-supermercado-premium">
          <div class="th-content-premium">
            <div class="th-logo-container">
              <img src="/assets/img/supermercados/${supermercado.toLowerCase()}-logo.png" 
                   alt="Logo ${supermercado}" 
                   style="width: 40px; height: 40px; object-fit: contain;">
              <span class="th-text">${supermercado}</span>
            </div>
          </div>
        </th>
      `;
    });
    
    // Columna Caminando Online
    columnasHTML += `
      <th class="th-caminando-premium">
        <div class="th-content-premium">
          <div class="th-logo-container">
            <span class="th-icon">🛒</span>
            <span class="th-text">Caminando Online</span>
            <span class="th-help">¡Mejor opción!</span>
          </div>
        </div>
      </th>
    `;
    
    // Generar filas de productos
    let filasHTML = '';
    productos.forEach((producto, index) => {
      const datosProducto = datosTabla[index];
      
      filasHTML += `
        <tr class="fila-producto-premium">
          <td class="celda-producto-premium">
            <div class="producto-info-premium">
              <span class="producto-nombre-premium">${producto.nombreCompleto}</span>
              <span class="producto-codigo-premium">SKU: ${generarSKU()}</span>
            </div>
          </td>
      `;
      
      // Celdas de supermercados
      supermercados.forEach((supermercado, idx) => {
        const precio = datosProducto.precios[idx];
        const esMejor = precio === Math.min(...datosProducto.precios);
        
        filasHTML += `
          <td class="celda-${supermercado.toLowerCase()} ${esMejor ? 'mejor-precio' : ''}">
            <div class="precio-info">
              <span class="precio-valor ${esMejor ? 'precio-mejor' : 'precio-normal'}">
                $${precio.toLocaleString('es-AR')}
              </span>
              ${esMejor ? '<span class="precio-tag">¡Mejor precio!</span>' : ''}
            </div>
          </td>
        `;
      });
      
      // Celda Caminando Online
      const mejorPrecio = Math.min(...datosProducto.precios);
      filasHTML += `
        <td class="celda-caminando">
          <div class="precio-info-caminando">
            <span class="precio-valor precio-mejor">$${mejorPrecio.toLocaleString('es-AR')}</span>
            <span class="precio-tag">Seleccionado</span>
          </div>
        </td>
      `;
      
      filasHTML += '</tr>';
    });
    
    tablaWrapper.innerHTML = `
      <table class="tabla-productos-comparados-premium">
        <thead class="thead-premium">
          <tr>
            ${columnasHTML}
          </tr>
        </thead>
        <tbody class="tbody-premium">
          ${filasHTML}
        </tbody>
      </table>
    `;
    
    productosSection.appendChild(tablaWrapper);
    console.log("✅ Tabla creada");
    
    return datosTabla;
  }

  function generarDatosComparacion() {
    return productos.map(() => {
      const precioBase = Math.floor(Math.random() * 5000) + 1000; // Entre $1000 y $6000
      const precios = supermercados.map(() => {
        const variacion = (Math.random() - 0.5) * 0.4; // ±20% variación
        return Math.round(precioBase * (1 + variacion));
      });
      
      return { precios };
    });
  }

  function crearSeccionTotales(datosTabla) {
    const totales = calcularTotales(datosTabla);
    
    const seccionTotales = document.createElement("div");
    seccionTotales.className = "seccion-totales-premium";
    
    let totalesHTML = `
      <h4 class="text-center mb-4">💰 Totales por Supermercado</h4>
      <div class="row">
    `;
    
    supermercados.forEach((supermercado, idx) => {
      totalesHTML += `
        <div class="col-md-${Math.floor(12/supermercados.length)}">
          <div class="total-card total-${supermercado.toLowerCase()}">
            <h6>${supermercado}</h6>
            <div class="total-precio">$${totales.supermercados[idx].toLocaleString('es-AR')}</div>
          </div>
        </div>
      `;
    });
    
    totalesHTML += `
        <div class="col-md-${Math.floor(12/supermercados.length)}">
          <div class="total-card total-caminando">
            <h6>🛒 Caminando Online</h6>
            <div class="total-precio total-destacado">$${totales.caminando.toLocaleString('es-AR')}</div>
            <small class="text-success">¡Mejor combinación!</small>
          </div>
        </div>
      </div>
    `;
    
    seccionTotales.innerHTML = totalesHTML;
    productosSection.appendChild(seccionTotales);
  }

  function crearResumenAhorro(datosTabla) {
    const totales = calcularTotales(datosTabla);
    const promedio = totales.supermercados.reduce((a, b) => a + b, 0) / totales.supermercados.length;
    const ahorro = promedio - totales.caminando;
    
    const resumenAhorro = document.createElement("div");
    resumenAhorro.className = "resumen-ahorro-premium";
    resumenAhorro.innerHTML = `
      <div class="ahorro-content">
        <h3 class="ahorro-titulo">💚 ¡Vas a ahorrar!</h3>
        <div class="ahorro-cantidad">$${ahorro.toLocaleString('es-AR')}</div>
        <p class="ahorro-descripcion">
          Comparado con el promedio de ${supermercados.length} supermercados
        </p>
        <div class="ahorro-porcentaje">
          ${Math.round((ahorro / promedio) * 100)}% menos que el promedio
        </div>
      </div>
    `;
    
    productosSection.appendChild(resumenAhorro);
  }

  function crearSeccionCompra(datosTabla) {
    const totales = calcularTotales(datosTabla);
    const promedio = totales.supermercados.reduce((a, b) => a + b, 0) / totales.supermercados.length;
    const ahorro = promedio - totales.caminando;
    
    const seccionCompra = document.createElement("div");
    seccionCompra.className = "seccion-compra-premium";
    
    let botonesHTML = '';
    
    // Botones de supermercados individuales
    supermercados.forEach((supermercado, idx) => {
      botonesHTML += `
        <button class="boton-compra-supermercado boton-${supermercado.toLowerCase()}" 
                onclick="comprarEnSupermercado('${supermercado}')">
          <div class="boton-header">
            <img src="/assets/img/supermercados/${supermercado.toLowerCase()}-logo.png" 
                 alt="Logo ${supermercado}" style="width: 40px; height: 40px;">
            <span class="boton-nombre">${supermercado}</span>
          </div>
          <div class="boton-precio">$${totales.supermercados[idx].toLocaleString('es-AR')}</div>
          <div class="boton-accion">
            <span class="btn-text">Comprar en ${supermercado}</span>
            <span class="btn-proximamente">Próximamente 🙂</span>
          </div>
        </button>
      `;
    });
    
    // Botón Caminando Online
    botonesHTML += `
      <button class="boton-compra-caminando ${ahorro > 10000 ? '' : 'disabled'}" 
              onclick="comprarCaminando(${ahorro > 10000})">
        <div class="boton-header-caminando">
          <span class="boton-icon">🛒</span>
          <span class="boton-nombre-caminando">Caminando Online</span>
        </div>
        <div class="boton-contenido-caminando">
          <span class="btn-text-principal">¡Comprá Caminando!</span>
          <span class="btn-total-caminando">Total: $${totales.caminando.toLocaleString('es-AR')}</span>
          <span class="btn-ahorro">Ahorrás: $${ahorro.toLocaleString('es-AR')}</span>
          ${ahorro > 10000 
            ? '<span class="btn-proximamente">Solicitar acceso anticipado</span>' 
            : '<span class="btn-proximamente">Próximamente 🙂</span>'
          }
        </div>
      </button>
    `;
    
    seccionCompra.innerHTML = botonesHTML;
    productosSection.appendChild(seccionCompra);
  }

  // ===============================================
  // FUNCIONES AUXILIARES
  // ===============================================
  function calcularTotales(datosTabla) {
    const totalesSupermercados = new Array(supermercados.length).fill(0);
    let totalCaminando = 0;
    
    datosTabla.forEach(producto => {
      // Sumar a cada supermercado
      producto.precios.forEach((precio, idx) => {
        totalesSupermercados[idx] += precio;
      });
      
      // Agregar el mejor precio a Caminando
      totalCaminando += Math.min(...producto.precios);
    });
    
    return {
      supermercados: totalesSupermercados,
      caminando: totalCaminando
    };
  }

  function generarSKU() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  // ===============================================
  // FUNCIONES GLOBALES
  // ===============================================
  window.comprarEnSupermercado = function(supermercado) {
    alert(`Función de compra en ${supermercado} estará disponible próximamente 🙂`);
  };

  window.comprarCaminando = function(esElegible) {
    if (esElegible) {
      alert('¡Genial! La compra automática estará disponible próximamente. Te notificaremos cuando esté lista 🚀');
    } else {
      alert('La compra automática estará disponible próximamente 🙂');
    }
  };

  // ===============================================
  // ANIMACIONES
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

  console.log("🎉 Productos comparados completamente inicializados");
});