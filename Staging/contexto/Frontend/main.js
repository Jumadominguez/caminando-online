document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Iniciando aplicación...");
  
  // Esperar un momento para que los módulos ES6 se carguen
  setTimeout(() => {
    // Inicializar el sistema de filtros unificado
    if (window.FiltrosManager) {
      window.FiltrosManager.inicializar();
    }
    
    // Inicializar el manejador de eventos
    if (window.EventManager) {
      window.EventManager.inicializar();
    }
    
    // Restaurar estado si existe
    restaurarEstadoSiExiste();
    
    console.log("✅ Aplicación inicializada completamente");
  }, 100);

  // ===============================================
  // FUNCIONES DE INICIALIZACIÓN
  // ===============================================

  /**
   * Restaura el estado de productos y supermercados seleccionados
   */
  function restaurarEstadoSiExiste() {
    const esVistaFiltros = document.querySelector("#productos-a-comparar");
    if (!esVistaFiltros) return;

    const supermercados = window.DataManager ? 
      window.DataManager.obtenerSupermercadosSeleccionados() : 
      JSON.parse(sessionStorage.getItem("supermercadosSeleccionados") || "[]");
      
    const productos = window.DataManager ? 
      window.DataManager.obtenerProductosComparados() : 
      JSON.parse(sessionStorage.getItem("productosComparados") || "[]");

    // Restaurar supermercados seleccionados
    supermercados.forEach(nombre => {
      const btns = Array.from(document.querySelectorAll(".supermercado-btn"));
      btns.forEach(btn => {
        const img = btn.querySelector("img");
        const raw = img?.alt?.trim() || "";
        const nombreBtn = raw.replace(/^Logo\s*/i, "");
        if (nombreBtn === nombre) {
          btn.classList.add("selected");
        }
      });
    });

    // Restaurar productos en la tabla
    const tbody = document.querySelector("#productos-a-comparar tbody");
    if (tbody && productos.length > 0) {
      productos.forEach(prod => {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td colspan="4">${prod.nombreCompleto}</td>`;
        tbody.appendChild(fila);
      });
    }
  }

});
