// ===============================================
// NUEVO FILTROS MANAGER CON TABLA COMPLETA
// ===============================================

// Actualizar estos métodos en filtros-manager-v2.js o usar este archivo completo

class FiltrosManagerV2Updated extends FiltrosManagerV2 {
  
  crearProductosMock(filtros) {
    console.log("🔄 Generando 40 productos aleatorios...", filtros);
    
    const productos = [];
    const NUM_PRODUCTOS = 40;
    
    // Obtener datos base
    const nombresBase = this.obtenerNombresBase(filtros);
    const marcas = this.obtenerMarcasDisponibles(filtros);
    const contenidos = this.obtenerContenidosDisponibles(filtros);
    const variedades = this.obtenerVariedadesDisponibles(filtros);
    
    const supermercados = ['Carrefour', 'Disco', 'Jumbo', 'Vea', 'Día'];
    
    // Generar 40 productos aleatorios
    for (let i = 0; i < NUM_PRODUCTOS; i++) {
      const nombre = nombresBase[Math.floor(Math.random() * nombresBase.length)];
      const marca = marcas[Math.floor(Math.random() * marcas.length)];
      const contenido = contenidos[Math.floor(Math.random() * contenidos.length)];
      const variedad = variedades[Math.floor(Math.random() * variedades.length)];
      
      const numSupermercados = Math.floor(Math.random() * 4) + 2; // 2-5
      const precioBase = Math.floor(Math.random() * 2000) + 200; // $200-$2200
      
      // Variaciones del nombre para diversidad
      const variacionesNombre = [
        nombre,
        `${nombre} Premium`,
        `${nombre} Clásico`,
        `${nombre} Especial`,
        `${nombre} Familiar`
      ];
      
      const nombreFinal = i < 8 ? nombre : variacionesNombre[Math.floor(Math.random() * variacionesNombre.length)];
      
      productos.push({
        id: `prod_${String(i).padStart(3, '0')}`,
        nombre: nombreFinal,
        marca: marca,
        contenido: contenido,
        variedad: variedad,
        supermercados: numSupermercados,
        precio: precioBase.toFixed(2),
        disponibilidad: this.generarDisponibilidad(numSupermercados),
        popularidad: Math.floor(Math.random() * 5) + 1,
        descuento: Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 5 : 0
      });
    }
    
    // Ordenar por popularidad y precio
    productos.sort((a, b) => {
      if (b.popularidad !== a.popularidad) {
        return b.popularidad - a.popularidad;
      }
      return parseFloat(a.precio) - parseFloat(b.precio);
    });
    
    console.log(`✅ Generados ${productos.length} productos aleatorios`);
    return productos;
  }

  renderizarProductos(productos) {
    if (productos.length === 0) {
      this.mostrarEstadoVacio();
      return;
    }
    
    const tbody = elementos.productosLista;
    const scrollIndicator = document.getElementById('scroll-indicator');
    const tablaContainer = document.getElementById('tabla-scroll-container');
    
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
    if (productos.length > 6) {
      scrollIndicator.classList.remove('d-none');
      
      // Auto-hide después de scroll
      tablaContainer.addEventListener('scroll', () => {
        if (tablaContainer.scrollTop > 50) {
          scrollIndicator.classList.add('d-none');
        }
      });
    } else {
      scrollIndicator.classList.add('d-none');
    }
    
    // Reset scroll position
    tablaContainer.scrollTop = 0;
    
    console.log(`✅ ${productos.length} productos renderizados con scroll habilitado`);
    console.log(`📊 Primeros 6 visibles sin scroll, ${productos.length - 6} requieren scroll`);
  }

  crearFilaProducto(producto, index) {
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
        <small class="text-muted d-block mt-1">$${producto.precio}</small>
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
    fila.setAttribute('data-precio', producto.precio);
    fila.setAttribute('data-popularidad', producto.popularidad);
    
    return fila;
  }

  generarDisponibilidad(numSupermercados) {
    if (numSupermercados >= 4) {
      return {
        estado: 'alta',
        texto: 'Alta disponibilidad',
        clase: 'bg-success',
        icono: 'fas fa-check-circle'
      };
    } else if (numSupermercados === 3) {
      return {
        estado: 'media',
        texto: 'Disponibilidad media',
        clase: 'bg-warning',
        icono: 'fas fa-exclamation-triangle'
      };
    } else {
      return {
        estado: 'baja',
        texto: 'Disponibilidad limitada',
        clase: 'bg-secondary',
        icono: 'fas fa-info-circle'
      };
    }
  }

  mostrarEstadoVacio() {
    const tbody = elementos.productosLista;
    const scrollIndicator = document.getElementById('scroll-indicator');
    
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
    
    // Ocultar indicador de scroll
    scrollIndicator.classList.add('d-none');
  }

  // Métodos auxiliares actualizados
  obtenerNombresBase(filtros) {
    if (filtros.subcategoria) {
      return [filtros.subcategoria];
    }
    
    if (filtros.categoria) {
      const categoria = DATOS_DEPURADOS.categorias.find(c => c.id === filtros.categoria);
      return categoria ? categoria.subcategorias.slice(0, 8) : ['Producto'];
    }
    
    return ['Producto genérico'];
  }

  obtenerMarcasDisponibles(filtros) {
    if (filtros.marca && filtros.marca !== 'todos') {
      return [filtros.marca];
    }
    
    if (filtros.tipoProducto && DATOS_DEPURADOS.marcas[filtros.tipoProducto]) {
      return DATOS_DEPURADOS.marcas[filtros.tipoProducto];
    }
    
    return ['Marca genérica', 'Marca premium', 'Marca económica'];
  }

  obtenerContenidosDisponibles(filtros) {
    if (filtros.contenido && filtros.contenido !== 'todos') {
      return [filtros.contenido];
    }
    
    if (filtros.tipoProducto && DATOS_DEPURADOS.contenidos[filtros.tipoProducto]) {
      return DATOS_DEPURADOS.contenidos[filtros.tipoProducto];
    }
    
    return ['1u', '500g', '1kg'];
  }

  obtenerVariedadesDisponibles(filtros) {
    if (filtros.variedad && filtros.variedad !== 'todos') {
      return [filtros.variedad];
    }
    
    if (filtros.tipoProducto && DATOS_DEPURADOS.variedades[filtros.tipoProducto]) {
      return DATOS_DEPURADOS.variedades[filtros.tipoProducto];
    }
    
    return ['Clásico', 'Premium'];
  }
}

// Función global mejorada para agregar productos
function agregarProducto(index, productoId) {
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
  fila.style.border = '2px solid var(--color-success)';
  
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
}

// Reemplazar instancia global si es necesario
if (typeof filtrosManager !== 'undefined') {
  const filtrosManagerUpdated = new FiltrosManagerV2Updated();
  
  // Copiar configuración existente
  if (filtrosManager.inicializado) {
    filtrosManagerUpdated.inicializar();
  }
  
  // Actualizar referencia global
  window.filtrosManager = filtrosManagerUpdated;
  window.FiltrosManager = {
    inicializar: () => filtrosManagerUpdated.inicializar(),
    obtenerEstado: () => filtrosManagerUpdated.obtenerEstado(),
    resetear: () => filtrosManagerUpdated.resetearTodo(),
    debug: () => filtrosManagerUpdated.debug()
  };
}

console.log("📦 Filtros Manager V2 Actualizado - Con tabla de 40 productos y scroll sticky cargado");
