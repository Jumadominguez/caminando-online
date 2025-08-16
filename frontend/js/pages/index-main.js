// /js/pages/index-main.js
// Lógica específica de la página principal (index.html)
import { API } from '../core/api.js';
import { SupermercadosSelector } from '../components/supermercados-selector.js';
import { ProductosTable } from '../components/productos-table.js';
import { FiltrosComponent } from '../components/filtros.js';

class IndexPage {
  constructor() {
    this.init();
  }
  
  async init() {
    console.log("🚀 Inicializando página principal...");
    
    // Verificar autenticación y actualizar UI
    await this.actualizarUIAutenticacion();
    
    // Inicializar componentes
    this.inicializarComponentes();
    
    // Configurar navegación
    this.configurarNavegacion();
    
    console.log("✅ Página principal inicializada");
  }
  
  async actualizarUIAutenticacion() {
    const { logueado } = await API.verificarAutenticacion();
    const authButton = document.getElementById('auth-button');
    
    if (authButton) {
      if (logueado) {
        const usuario = await API.obtenerUsuario();
        authButton.innerHTML = `
          <i class="fas fa-user-circle"></i> 
          ${usuario?.nombre || 'Mi Perfil'}
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
  
  inicializarComponentes() {
    // Inicializar selector de supermercados
    this.supermercadosSelector = new SupermercadosSelector('supermercado-buttons');
    
    // Inicializar tabla de productos
    this.productosTable = new ProductosTable('productos-container');
    
    // Inicializar filtros
    this.filtros = new FiltrosComponent('filtros-container', this.productosTable);
    
    // Crear tabla de productos a comparar
    this.crearTablaComparar();
  }
  
  crearTablaComparar() {
    const wrapper = document.createElement("div");
    wrapper.className = "productos-a-comparar-wrapper mb-4";
    wrapper.innerHTML = `
      <div class="card border-success">
        <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
          <h6 class="mb-0 d-flex align-items-center gap-2">
            <i class="fas fa-shopping-cart"></i>
            Productos a Comparar
            <span id="contador-productos" class="badge bg-light text-success ms-2">0</span>
          </h6>
          <button id="limpiar-comparacion" class="btn btn-outline-light btn-sm">
            <i class="fas fa-trash"></i> Limpiar
          </button>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive" style="max-height: 300px;">
            <table class="table table-striped mb-0">
              <thead class="table-dark sticky-top">
                <tr>
                  <th>Producto</th>
                  <th>Marca</th>
                  <th>Contenido</th>
                  <th>Variedad</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody id="productos-a-comparar"></tbody>
            </table>
          </div>
        </div>
        <div class="card-footer text-center">
          <button id="comparar-btn" class="btn btn-success btn-lg" disabled>
            <i class="fas fa-chart-bar"></i> 
            Comparar Precios
          </button>
        </div>
      </div>
    `;
    
    const compararBox = document.getElementById("comparar-box");
    compararBox.parentNode.insertBefore(wrapper, compararBox);
    
    this.configurarEventListenersComparar();
  }
  
  configurarEventListenersComparar() {
    // Botón comparar
    document.getElementById('comparar-btn').addEventListener('click', () => {
      this.compararProductos();
    });
    
    // Botón limpiar
    document.getElementById('limpiar-comparacion').addEventListener('click', () => {
      this.limpiarComparacion();
    });
  }
  
  compararProductos() {
    const productos = Array.from(document.querySelectorAll("#productos-a-comparar tr")).map(fila => {
      const celdas = fila.querySelectorAll("td");
      return {
        nombreCompleto: `${celdas[0]?.textContent.trim()} ${celdas[1]?.textContent.trim()} ${celdas[2]?.textContent.trim()} ${celdas[3]?.textContent.trim()}`
      };
    });

    if (productos.length === 0) {
      alert("Agregá al menos un producto para comparar.");
      return;
    }

    const supermercados = Array.from(document.querySelectorAll("#supermercado-buttons .supermercado-btn.selected"))
      .map(btn => {
        const img = btn.querySelector("img");
        const raw = img?.alt?.trim() || "Sin nombre";
        return raw.replace(/^Logo\s*/i, "");
      });

    if (supermercados.length === 0) {
      alert("Seleccioná al menos un supermercado.");
      return;
    }

    // Guardar en sessionStorage
    sessionStorage.setItem("productosComparados", JSON.stringify(productos));
    sessionStorage.setItem("supermercadosSeleccionados", JSON.stringify(supermercados));

    // Redirigir a página de comparación
    window.location.href = "/public/productos-comparados.html";
  }
  
  limpiarComparacion() {
    document.getElementById("productos-a-comparar").innerHTML = "";
    this.actualizarContadorProductos();
    sessionStorage.removeItem("productosComparados");
  }
  
  actualizarContadorProductos() {
    const contador = document.getElementById("contador-productos");
    const comparar = document.getElementById("comparar-btn");
    const cantidad = document.querySelectorAll("#productos-a-comparar tr").length;
    
    contador.textContent = cantidad;
    comparar.disabled = cantidad === 0;
    
    if (cantidad > 0) {
      contador.classList.add("badge-pulse");
      setTimeout(() => contador.classList.remove("badge-pulse"), 600);
    }
  }
  
  configurarNavegacion() {
    // Configurar navegación suave entre secciones
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// Funciones globales que necesita el HTML
window.agregarProductoAComparar = function(nombre, marca, contenido, variedad) {
  const tbody = document.getElementById("productos-a-comparar");
  
  // Verificar si ya existe
  const filaExistente = Array.from(tbody.querySelectorAll('tr')).find(fila => {
    const celdas = fila.querySelectorAll('td');
    return celdas[0]?.textContent.trim() === nombre &&
           celdas[1]?.textContent.trim() === marca &&
           celdas[2]?.textContent.trim() === contenido &&
           celdas[3]?.textContent.trim() === variedad;
  });
  
  if (filaExistente) {
    alert("Este producto ya está en la lista de comparación.");
    return;
  }
  
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${nombre}</td>
    <td>${marca}</td>
    <td>${contenido}</td>
    <td>${variedad}</td>
    <td>
      <button class="btn btn-outline-danger btn-sm" onclick="this.closest('tr').remove(); window.indexPage.actualizarContadorProductos();">
        <i class="fas fa-times"></i>
      </button>
    </td>
  `;
  
  tbody.appendChild(fila);
  window.indexPage.actualizarContadorProductos();
  
  // Animación
  fila.style.opacity = '0';
  fila.style.transform = 'translateX(-20px)';
  setTimeout(() => {
    fila.style.transition = 'all 0.3s ease';
    fila.style.opacity = '1';
    fila.style.transform = 'translateX(0)';
  }, 50);
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.indexPage = new IndexPage();
});