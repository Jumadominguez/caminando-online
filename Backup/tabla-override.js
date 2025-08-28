// ===============================================
// OVERRIDE JAVASCRIPT PARA TABLA CON 40 PRODUCTOS
// ===============================================

console.log("🔧 Cargando override para tabla de 40 productos...");

// Esperar a que el DOM esté listo y el filtros manager se haya inicializado
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    if (window.filtrosManager && window.filtrosManager.renderizarProductos) {
      
      console.log("📝 Sobrescribiendo métodos del FiltrosManager...");
      
      // Sobrescribir renderizarProductos
      window.filtrosManager.renderizarProductos = function(productos) {
        if (productos.length === 0) {
          this.mostrarEstadoVacio();
          return;
        }
        
        const tbody = document.getElementById('productos-lista');
        const scrollIndicator = document.getElementById('scroll-indicator');
        const tablaContainer = document.getElementById('tabla-scroll-container');
        
        if (!tbody) {
          console.error("❌ No se encontró tbody productos-lista");
          return;
        }
        
        // Limpiar tabla
        tbody.innerHTML = '';
        
        // Renderizar productos
        productos.forEach((producto, index) => {
          const fila = this.crearFilaProducto(producto, index);
          tbody.appendChild(fila);
          
          // Animación escalonada para primeros 6 productos
          if (index < 6) {
            fila.style.opacity = '0';
            fila.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
              fila.style.transition = 'all 0.5s ease';
              fila.style.opacity = '1';
              fila.style.transform = 'translateY(0)';
            }, index * 100);
          }
        });
        
        // Mostrar indicador de scroll si hay más de 6 productos
        if (productos.length > 6 && scrollIndicator) {
          scrollIndicator.classList.remove('d-none');
          
          // Auto-hide después de scroll
          if (tablaContainer) {
            // Remover listener existente
            tablaContainer.removeEventListener('scroll', this.handleScroll);
            
            // Nuevo listener
            this.handleScroll = () => {
              if (tablaContainer.scrollTop > 50) {
                scrollIndicator.classList.add('d-none');
              }
            };
            tablaContainer.addEventListener('scroll', this.handleScroll);
          }
        } else if (scrollIndicator) {
          scrollIndicator.classList.add('d-none');
        }
        
        // Reset scroll position
        if (tablaContainer) {
          tablaContainer.scrollTop = 0;
        }
        
        console.log(`✅ ${productos.length} productos renderizados con scroll habilitado`);
        console.log(`📊 Primeros 6 visibles sin scroll, ${productos.length - 6} requieren scroll`);
      };
      
      // Sobrescribir crearFilaProducto
      window.filtrosManager.crearFilaProducto = function(producto, index) {
        const fila = document.createElement('tr');
        
        // Marcar primeros 6 productos
        if (index < 6) {
          fila.classList.add('producto-inicial');
          fila.setAttribute('data-initial-product', 'true');
        } else {
          fila.setAttribute('data-scroll-product', 'true');
        }
        
        // Badge de descuento
        const badgeDescuento = producto.descuento > 0 
          ? `<span class="badge bg-danger ms-1">${producto.descuento}% OFF</span>`
          : '';
        
        // Mostrar precio
        const precioTexto = producto.precio_hasta 
          ? `$${producto.precio_desde} - $${producto.precio_hasta}`
          : `$${producto.precio_desde || producto.precio || '0.00'}`;
        
        fila.innerHTML = `
          <td>
            <div>
              <strong>${producto.nombre}</strong>
              ${badgeDescuento}
            </div>
            <small class="text-muted d-block mt-1">
              <i class="fas fa-star text-warning"></i> ${producto.popularidad}/5
              <span class="ms-2">ID: ${producto.id}</span>
            </small>
          </td>
          <td>
            <span class="fw-medium">${producto.marca}</span>
          </td>
          <td>
            <span class="badge bg-secondary">${producto.contenido}</span>
          </td>
          <td>
            <span class="text-capitalize">${producto.variedad}</span>
          </td>
          <td>
            <div>
              <span class="badge ${producto.disponibilidad.clase}" title="${producto.disponibilidad.texto}">
                <i class="${producto.disponibilidad.icono}"></i> 
                ${producto.supermercados} disponibles
              </span>
            </div>
            <small class="text-muted d-block mt-1">${precioTexto}</small>
          </td>
          <td>
            <button 
              class="btn btn-success btn-sm btn-agregar" 
              onclick="agregarProducto(${index}, '${producto.id}')"
              title="Agregar ${producto.nombre}"
            >
              <i class="fas fa-plus"></i> Agregar
            </button>
          </td>
        `;
        
        // Data attributes
        fila.setAttribute('data-producto-id', producto.id);
        fila.setAttribute('data-precio', producto.precio_desde || producto.precio || '0');
        fila.setAttribute('data-popularidad', producto.popularidad || '1');
        
        return fila;
      };
      
      // Sobrescribir mostrarEstadoVacio
      window.filtrosManager.mostrarEstadoVacio = function() {
        const tbody = document.getElementById('productos-lista');
        const scrollIndicator = document.getElementById('scroll-indicator');
        
        if (tbody) {
          tbody.innerHTML = `
            <tr class="estado-inicial">
              <td colspan="6" class="text-center py-5">
                <div class="estado-vacio">
                  <i class="fas fa-search fa-3x text-muted mb-3"></i>
                  <h5 class="text-muted mb-2">Buscá productos para comenzar</h5>
                  <p class="text-muted mb-0">Utilizá los filtros de arriba para encontrar los productos que necesitás</p>
                </div>
              </td>
            </tr>
          `;
        }
        
        // Ocultar indicador de scroll
        if (scrollIndicator) {
          scrollIndicator.classList.add('d-none');
        }
      };
      
      console.log("✅ Métodos sobrescritos exitosamente");
      
    } else {
      console.warn("⚠️ filtrosManager no encontrado, reintentando...");
      
      // Reintentar después de un tiempo
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, 1000);
});

// Función global mejorada para agregar productos
window.agregarProducto = function(index, productoId) {
  console.log(`➕ Agregando producto ${productoId} (índice: ${index})`);
  
  const boton = event.target.closest('button');
  const iconoOriginal = boton.innerHTML;
  
  // Efecto de éxito
  boton.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
  boton.classList.remove('btn-success');
  boton.classList.add('btn-secondary');
  boton.disabled = true;
  
  // Animar la fila
  const fila = boton.closest('tr');
  fila.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
  fila.style.border = '2px solid #28a745';
  
  // Restaurar después de 3 segundos
  setTimeout(() => {
    boton.innerHTML = iconoOriginal;
    boton.classList.remove('btn-secondary');
    boton.classList.add('btn-success');
    boton.disabled = false;
    
    // Restaurar estilo de fila
    fila.style.backgroundColor = '';
    fila.style.border = '';
  }, 3000);
  
  // Disparar evento personalizado
  document.dispatchEvent(new CustomEvent('productoAgregado', {
    detail: { 
      index, 
      productoId, 
      elemento: fila,
      timestamp: new Date().toISOString()
    }
  }));
};

console.log("📦 Override de tabla con 40 productos cargado");
