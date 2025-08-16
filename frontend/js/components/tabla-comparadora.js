// /js/components/tabla-comparadora.js
import { Storage } from '../core/storage.js';
import { Utils } from '../core/utils.js';

export class TablaComparadora {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.productos = Storage.obtenerProductos();
    this.supermercados = Storage.obtenerSupermercados();
    this.frecuenciaSupermercado = {};
    this.init();
  }
  
  init() {
    console.log("🚀 Iniciando tabla comparadora...");
    
    if (!this.validarDatos()) {
      this.mostrarMensajeError();
      return;
    }
    
    this.inicializarFrecuencia();
    this.construirInterfazCompleta();
  }
  
  validarDatos() {
    return this.productos.length > 0 && this.supermercados.length > 0;
  }
  
  inicializarFrecuencia() {
    this.frecuenciaSupermercado = Object.fromEntries(
      this.supermercados.map(s => [s, 0])
    );
  }
  
  construirInterfazCompleta() {
    console.log("🏗️ Construyendo interfaz completa...");
    
    this.limpiarContenedor();
    this.crearHeaderComparacion();
    const datosTabla = this.crearTablaComparacion();
    this.crearSeccionTotales(datosTabla);
    this.crearResumenAhorro(datosTabla);
    this.crearSeccionCompra(datosTabla);
    this.configurarEventListeners(datosTabla);
    
    console.log("✅ Interfaz construida exitosamente");
  }
  
  limpiarContenedor() {
    this.container.innerHTML = '';
  }
  
  mostrarMensajeError() {
    this.container.innerHTML = `
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
  
  // Resto de métodos extraídos de tabla-comparadora.js...
  // crearHeaderComparacion(), crearTablaComparacion(), etc.
}