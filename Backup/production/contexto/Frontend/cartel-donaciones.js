// ===============================================
// CARTEL FLOTANTE DE DONACIONES - MÓDULO INDEPENDIENTE
// ===============================================

/**
 * Inicializa y muestra el cartel flotante de donaciones
 * Se ejecuta automáticamente cuando se carga el módulo
 */
function inicializarCartelDonaciones() {
  console.log("🎁 Iniciando cartel de donaciones...");
  
  // Esperar a que el DOM esté completamente cargado
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', crearCartelDonaciones);
  } else {
    // Si ya está cargado, ejecutar inmediatamente con un pequeño delay
    setTimeout(crearCartelDonaciones, 1000);
  }
}

/**
 * Crea e inserta el cartel de donaciones en la página
 */
function crearCartelDonaciones() {
  console.log("🎨 Creando cartel de donaciones...");
  
  // 1. Agregar estilos CSS
  agregarEstilosCartel();
  
  // 2. Crear HTML del cartel
  const cartelHTML = crearHTMLCartel();
  
  // 3. Insertar en el container
  insertarCartelEnPagina(cartelHTML);
  
  // 4. Configurar event listeners
  configurarEventListeners();
  
  // 5. Mostrar el cartel con delay mayor
  setTimeout(mostrarCartel, 2000);
}

/**
 * Agrega los estilos CSS necesarios para el cartel
 */
function agregarEstilosCartel() {
  const estilos = document.createElement('style');
  estilos.id = 'estilos-cartel-donaciones';
  estilos.innerHTML = `
  .cartel-donacion-flotante {
    position: absolute;
    left: -600px;
    top: calc(70% + 50px);
    transform: translateY(-50%);
    height: 410px;
    width: 350px;
    background: transparent;
    border-radius: 12px;
    z-index: 1000;
    font-family: 'Segoe UI', 'Roboto', sans-serif;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    perspective: 1000px;
  }

  .cartel-donacion-flotante.mostrar {
    opacity: 1;
    left: calc(100% + 20px);
  }

  /* Contenedor interno para la animación de volteo */
  .cartel-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  .cartel-donacion-flotante.volteado .cartel-inner {
    transform: rotateY(180deg);
  }

  /* Cara frontal y trasera */
  .cartel-cara-frontal,
  .cartel-cara-trasera {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    border: 1px solid #ddd;
    background: white;
    overflow: hidden;
  }

  .cartel-cara-trasera {
    transform: rotateY(180deg);
  }

  .cartel-header {
    position: relative;
    padding: 1.5rem 1rem 1rem;
    background: linear-gradient(135deg, #ff6f00, #ffab40);
    color: white;
  }

  .lita-indice {
    position: absolute;
    top: 134px;
    left: 17%;
    transform: translateX(-50%);
    width: 125px;
    height: auto;
    z-index: 1001;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
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
    flex-direction: column;
    align-items: center;
  }

  .texto-elegir {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  .opciones-container {
    display: flex;
    justify-content: space-around;
    gap: 0.5rem;
    width: 100%;
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

  .btn-volver {
    position: absolute;
    top: 8px;
    left: 8px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
  }

  .btn-volver:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .cartel-qr-header {
    background: linear-gradient(135deg, #ff6f00, #ffab40);
    color: white;
    padding: 1rem;
    text-align: center;
    position: relative;
  }

  .cartel-qr-titulo {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
  }

  .cartel-qr-content {
    padding: 2rem;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100% - 80px);
    gap: 1rem;
  }

  .qr-grande {
    width: 200px;
    height: 240px;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
  }

  .qr-descripcion {
    text-align: center;
    color: #666;
    font-size: .9rem;
    line-height: 1.4;
  }

  /* CRÍTICO: Hacer que el container tenga position relative */
  .container-custom-comparados {
    position: relative !important;
    overflow: visible !important;
  }

  @media (max-width: 768px) {
    .cartel-donacion-flotante {
      width: 300px;
      height: 350px;
      left: -350px;
    }
    
    .cartel-donacion-flotante.mostrar {
      left: calc(100% + 10px);
    }
    
    .lita-indice {
      width: 100px;
      top: 120px;
    }
    
    .qr-grande {
      width: 160px;
      height: 160px;
    }
  }
  `;

  document.head.appendChild(estilos);
  console.log("✅ Estilos del cartel agregados");
}

/**
 * Crea el HTML del cartel con las dos caras
 */
function crearHTMLCartel() {
  return `
    <div id="cartel-donacion-flotante" class="cartel-donacion-flotante">
      <div class="cartel-inner">
        
        <!-- CARA FRONTAL -->
        <div class="cartel-cara-frontal">
          <div class="cartel-header">
            <img src="/assets/img/lita-indice.png" alt="Lita" class="lita-indice">
            <div class="cartel-texto-titulo">Caminando Online </div>
            <div class="cartel-texto-h1"></br> momentáneamente es gratuito y se sostiene gracias a las donaciones de sus usuarios. </div>  
            <div class="cartel-texto-h2"></br> Si quisieras compartir parte de lo ahorrado con nosotros, ¡te lo agradeceremos mejorando la plataforma!</div>
          </div>
          
          <div class="cartel-opciones">
            <div class="texto-elegir">Elige una opción:</div>
            <div class="opciones-container">
              <div class="opcion-donacion" onclick="window.CartelDonaciones.mostrarQR('btc')">
                <img src="/assets/img/qr-btc.png" alt="Bitcoin QR" class="qr-thumb">
                <div class="opcion-texto">Bitcoin</div>
              </div>
              
              <div class="opcion-donacion" onclick="window.CartelDonaciones.mostrarQR('usdt')">
                <img src="/assets/img/qr-usdt.png" alt="USDT QR" class="qr-thumb">
                <div class="opcion-texto">USDT</div>
              </div>
              
              <div class="opcion-donacion" onclick="window.CartelDonaciones.mostrarQR('mp')">
                <img src="/assets/img/qr-mp.png" alt="MercadoPago QR" class="qr-thumb">
                <div class="opcion-texto">MercadoPago</div>
              </div>
            </div>
          </div>
        </div>

        <!-- CARA TRASERA (QR AMPLIADO) -->
        <div class="cartel-cara-trasera">
          <div class="cartel-qr-header">
            <button class="btn-volver" onclick="window.CartelDonaciones.volver()">←</button>
            <h3 id="qr-titulo-grande" class="cartel-qr-titulo">Donación</h3>
          </div>
          <div class="cartel-qr-content">
            <img id="qr-imagen-grande" class="qr-grande" src="" alt="QR Code">
            <p id="qr-descripcion-grande" class="qr-descripcion">Escanea este código QR para realizar tu donación</p>
          </div>
        </div>

      </div>
    </div>
  `;
}

/**
 * Inserta el cartel en la página
 */
function insertarCartelEnPagina(cartelHTML) {
  const container = document.querySelector('.container-custom-comparados');
  if (container) {
    container.insertAdjacentHTML('beforeend', cartelHTML);
    console.log("✅ HTML del cartel insertado en el container");
  } else {
    document.body.insertAdjacentHTML('beforeend', cartelHTML);
    console.log("⚠️ Container no encontrado, insertando en body");
  }
}

/**
 * Configura los event listeners del cartel
 */
function configurarEventListeners() {
  // Event listener para clicks fuera del cartel
  document.addEventListener('click', function(event) {
    const cartel = document.getElementById('cartel-donacion-flotante');
    if (cartel && !cartel.contains(event.target)) {
      // Click fuera del cartel - volver a la cara frontal
      cartel.classList.remove('volteado');
    }
  });
}

/**
 * Muestra el cartel con animación
 */
function mostrarCartel() {
  console.log("🔍 Intentando mostrar cartel...");
  const cartel = document.getElementById('cartel-donacion-flotante');
  
  if (cartel) {
    console.log("🎯 Cartel encontrado, aplicando clase 'mostrar'");
    cartel.classList.add('mostrar');
    console.log("✅ Cartel mostrado");
    
    // Debug: verificar que se aplicó la clase
    setTimeout(() => {
      const tieneClase = cartel.classList.contains('mostrar');
      const estilos = window.getComputedStyle(cartel);
      console.log("🔍 Estado del cartel:", {
        tieneClaseMostrar: tieneClase,
        opacity: estilos.opacity,
        left: estilos.left,
        display: estilos.display
      });
    }, 500);
  } else {
    console.error("❌ No se encontró el cartel para mostrar");
    
    // Debug: verificar qué elementos existen
    const elementos = document.querySelectorAll('[id*="cartel"], [class*="cartel"]');
    console.log("🔍 Elementos relacionados con cartel:", elementos);
  }
}

/**
 * Muestra un QR específico volteando la tarjeta
 */
function mostrarQR(tipo) {
  console.log(`🔄 Volteando tarjeta para mostrar QR: ${tipo}`);
  
  const cartel = document.getElementById('cartel-donacion-flotante');
  const titulo = document.getElementById('qr-titulo-grande');
  const qrImg = document.getElementById('qr-imagen-grande');
  const descripcion = document.getElementById('qr-descripcion-grande');
  
  const configs = {
    btc: {
      titulo: 'Doná con Bitcoin',
      img: '/assets/img/qr-btc.png',
      descripcion: 'bc1q3vg6q9ls962u9wp2xjxyfrfl283s05sfsges5m'
    },
    usdt: {
      titulo: 'Doná con USDT',
      img: '/assets/img/qr-usdt.png', 
      descripcion: 'THXw6V4LhvXmVGcHwtYn7qzsuGBLdvZ7gj'
    },
    mp: {
      titulo: 'Doná con MercadoPago',
      img: '/assets/img/qr-mp.png',
      descripcion: 'Alias: caminando.online'
    }
  };
  
  const config = configs[tipo];
  if (config && cartel && titulo && qrImg && descripcion) {
    // Actualizar contenido de la cara trasera
    titulo.textContent = config.titulo;
    qrImg.src = config.img;
    descripcion.textContent = config.descripcion;
    
    // Voltear la tarjeta
    cartel.classList.add('volteado');
  }
}

/**
 * Vuelve a la cara frontal del cartel
 */
function volverCartelFrontal() {
  console.log("🔄 Volviendo a la cara frontal");
  const cartel = document.getElementById('cartel-donacion-flotante');
  if (cartel) {
    cartel.classList.remove('volteado');
  }
}

// ===============================================
// API PÚBLICA DEL MÓDULO
// ===============================================

// Exponer funciones públicas en el objeto window para compatibilidad
window.CartelDonaciones = {
  mostrarQR: mostrarQR,
  volver: volverCartelFrontal,
  inicializar: inicializarCartelDonaciones
};

// Auto-inicializar cuando se carga el módulo
inicializarCartelDonaciones();

console.log("📦 Módulo CartelDonaciones cargado");
