// /js/pages/productos-main.js  
// Lógica específica de la página de productos comparados
import { TablaComparadora } from '../components/tabla-comparadora.js';
import { API } from '../core/api.js';

class ProductosPage {
  constructor() {
    this.init();
  }
  
  async init() {
    console.log("🚀 Inicializando página de productos...");
    
    // Verificar autenticación
    await this.actualizarUIAutenticacion();
    
    // Inicializar tabla comparadora
    this.tablaComparadora = new TablaComparadora('productos');
    
    console.log("✅ Página de productos inicializada");
  }
  
  async actualizarUIAutenticacion() {
    // Similar a IndexPage pero adaptado para esta página
    const { logueado } = await API.verificarAutenticacion();
    // Actualizar UI según estado de autenticación
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.productosPage = new ProductosPage();
});