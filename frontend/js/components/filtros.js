
// /js/components/filtros.js
import { Utils } from '../core/utils.js';

export class FiltrosComponent {
  constructor(containerId, productosTable) {
    this.container = document.getElementById(containerId);
    this.productosTable = productosTable;
    this.filtros = {
      marca: '',
      contenido: '',
      variedad: ''
    };
    this.init();
  }

  init() {
    console.log("🔍 Inicializando componente de filtros...");
    this.configurarEventListeners();
  }

  configurarEventListeners() {
    // Event listeners para los filtros
    const filtroMarca = document.getElementById("marca");
    const filtroContenido = document.getElementById("contenido");
    const filtroVariedad = document.getElementById("variedad");

    [filtroMarca, filtroContenido, filtroVariedad].forEach(filtro => {
      if (filtro) {
        filtro.addEventListener("change", () => this.aplicarFiltros());
      }
    });

    // Botón limpiar filtros si existe
    const btnLimpiar = document.getElementById("btn-limpiar-filtros");
    if (btnLimpiar) {
      btnLimpiar.addEventListener("click", () => this.limpiarFiltros());
    }
  }

  /**
   * Aplica los filtros seleccionados a la tabla de productos
   */
  aplicarFiltros() {
    const filtroMarca = document.getElementById("marca");
    const filtroContenido = document.getElementById("contenido");
    const filtroVariedad = document.getElementById("variedad");

    // Actualizar valores de filtros
    this.filtros.marca = filtroMarca?.value || "";
    this.filtros.contenido = filtroContenido?.value || "";
    this.filtros.variedad = filtroVariedad?.value || "";

    console.log("🔍 Aplicando filtros:", this.filtros);

    // Obtener filas de la tabla
    const filas = document.querySelectorAll("#tabla-productos tbody tr");

    filas.forEach(fila => {
      const celdas = fila.querySelectorAll("td");
      const marcaTexto = celdas[1]?.textContent.trim() || "";
      const contenidoTexto = celdas[2]?.textContent.trim() || "";
      const variedadTexto = celdas[3]?.textContent.trim() || "";

      // Verificar coincidencias
      const coincideMarca = !this.filtros.marca || marcaTexto === this.filtros.marca;
      const coincideContenido = !this.filtros.contenido || contenidoTexto === this.filtros.contenido;
      const coincideVariedad = !this.filtros.variedad || variedadTexto === this.filtros.variedad;

      const mostrar = coincideMarca && coincideContenido && coincideVariedad;
      
      // Aplicar filtro con animación
      this.animarFiltroCambio(fila, mostrar);
    });

    // Actualizar contador de productos visibles
    this.actualizarContadorFiltrados();
  }

  /**
   * Anima el cambio de visibilidad en los filtros
   */
  animarFiltroCambio(fila, mostrar) {
    if (mostrar) {
      fila.style.display = "";
      fila.style.opacity = "0";
      fila.style.transform = "translateY(-10px)";
      
      setTimeout(() => {
        fila.style.transition = "all 0.3s ease";
        fila.style.opacity = "1";
        fila.style.transform = "translateY(0)";
      }, 50);
    } else {
      fila.style.transition = "all 0.3s ease";
      fila.style.opacity = "0";
      fila.style.transform = "translateY(-10px)";
      
      setTimeout(() => {
        fila.style.display = "none";
      }, 300);
    }
  }

  /**
   * Limpia todos los filtros
   */
  limpiarFiltros() {
    console.log("🧹 Limpiando filtros...");
    
    // Resetear valores
    const filtroMarca = document.getElementById("marca");
    const filtroContenido = document.getElementById("contenido");
    const filtroVariedad = document.getElementById("variedad");

    if (filtroMarca) filtroMarca.value = "";
    if (filtroContenido) filtroContenido.value = "";
    if (filtroVariedad) filtroVariedad.value = "";

    // Limpiar objeto filtros
    this.filtros = { marca: '', contenido: '', variedad: '' };

    // Aplicar filtros vacíos (mostrar todo)
    this.aplicarFiltros();

    // Feedback visual
    Utils.showMessage('Filtros limpiados', 'success');
  }

  /**
   * Actualiza el contador de productos filtrados
   */
  actualizarContadorFiltrados() {
    const filasVisibles = document.querySelectorAll("#tabla-productos tbody tr[style=''], #tabla-productos tbody tr:not([style])");
    const total = document.querySelectorAll("#tabla-productos tbody tr").length;
    
    // Actualizar badge del header si existe
    const badge = document.querySelector(".tabla-header-info .badge");
    if (badge) {
      badge.textContent = filasVisibles.length;
      
      // Animación del badge
      badge.classList.add("badge-pulse");
      setTimeout(() => badge.classList.remove("badge-pulse"), 600);
    }

    console.log(`📊 Filtros aplicados: ${filasVisibles.length}/${total} productos visibles`);
  }

  /**
   * Puebla un filtro con opciones únicas basadas en la tabla actual
   */
  poblarFiltroConDatos(filtroId) {
    const filtro = document.getElementById(filtroId);
    if (!filtro) return;

    const opciones = new Set();
    const filas = document.querySelectorAll("#tabla-productos tbody tr");
    
    // Determinar qué columna usar según el filtro
    let columnaIndex;
    switch(filtroId) {
      case 'marca': columnaIndex = 1; break;
      case 'contenido': columnaIndex = 2; break;
      case 'variedad': columnaIndex = 3; break;
      default: return;
    }

    // Extraer opciones únicas
    filas.forEach(fila => {
      const valor = fila.querySelectorAll('td')[columnaIndex]?.textContent.trim();
      if (valor) opciones.add(valor);
    });

    // Limpiar y poblar filtro
    filtro.innerHTML = '<option value="" selected>Todos</option>';
    Array.from(opciones).sort().forEach(opcion => {
      const opt = document.createElement('option');
      opt.value = opcion;
      opt.textContent = opcion;
      filtro.appendChild(opt);
    });

    console.log(`📝 Filtro ${filtroId} poblado con ${opciones.size} opciones`);
  }

  /**
   * Inicializa todos los filtros con datos de la tabla
   */
  inicializarFiltrosConDatos() {
    this.poblarFiltroConDatos('marca');
    this.poblarFiltroConDatos('contenido');
    this.poblarFiltroConDatos('variedad');
  }

  /**
   * Obtiene estadísticas de filtros aplicados
   */
  obtenerEstadisticasFiltros() {
    const total = document.querySelectorAll("#tabla-productos tbody tr").length;
    const visibles = document.querySelectorAll("#tabla-productos tbody tr[style=''], #tabla-productos tbody tr:not([style])").length;
    
    return {
      total,
      visibles,
      filtrados: total - visibles,
      porcentajeVisible: total > 0 ? Math.round((visibles / total) * 100) : 0
    };
  }
}