/**
 * TABLA PRODUCTOS V3 - COMPONENTE DESDE CERO
 * =============================================
 * Sistema moderno de tabla de productos con generación dinámica
 * - Generación automática al seleccionar tipo de producto
 * - Header sticky con ordenamiento
 * - 40 productos aleatorios
 * - Scroll vertical con 6 productos visibles
 * - Botones de agregar funcionales
 * - Sistema de ordenamiento completo
 * =============================================
 */

// ===============================================
// CONFIGURACIÓN Y DATOS BASE
// ===============================================

const TABLA_CONFIG = {
  productos_total: 40,
  productos_visibles: 6,
  animacion_duracion: 300,
  scroll_suave: true,
  ordenamiento_inicial: 'nombre',
  direccion_inicial: 'asc',
  debug: true
};

// Datos base para generación de productos
const DATOS_PRODUCTOS_BASE = {
  // Supermercados disponibles
  supermercados: ['carrefour', 'disco', 'jumbo', 'vea', 'dia'],
  
  // Estados de disponibilidad
  disponibilidades: [
    { estado: 'disponible', texto: 'Disponible', clase: 'bg-success', icono: 'check-circle' },
    { estado: 'pocas_unidades', texto: 'Pocas unidades', clase: 'bg-warning', icono: 'exclamation-triangle' },
    { estado: 'agotado', texto: 'Agotado', clase: 'bg-secondary', icono: 'times-circle' }
  ],

  // Productos por tipo con datos específicos
  productos_por_tipo: {
    lacteos: {
      nombres: ['Leche', 'Yogurt', 'Queso', 'Manteca', 'Crema', 'Dulce de leche'],
      marcas: ['La Serenísima', 'Ilolay', 'Sancor', 'Milkaut', 'Tregar'],
      contenidos: ['1L', '500ml', '200ml', '1kg', '500g', '200g'],
      variedades: ['Entera', 'Descremada', 'Sin lactosa', 'Natural', 'Con frutas']
    },
    bebidas: {
      nombres: ['Gaseosa', 'Agua', 'Jugo', 'Cerveza', 'Vino', 'Agua saborizada'],
      marcas: ['Coca-Cola', 'Pepsi', 'Sprite', 'Fanta', 'Quilmes', 'Villa del Sur'],
      contenidos: ['500ml', '1L', '1.5L', '2L', '355ml', '2.25L'],
      variedades: ['Original', 'Zero', 'Light', 'Sabor lima', 'Sabor naranja']
    },
    carnes: {
      nombres: ['Carne molida', 'Pollo', 'Cerdo', 'Pescado', 'Embutidos', 'Milanesas'],
      marcas: ['Swift', 'Quickfood', 'Paty', 'Campo Austral', 'Granja del Sol'],
      contenidos: ['1kg', '500g', '250g', '2kg', '750g'],
      variedades: ['Fresco', 'Congelado', 'Premium', 'Orgánico', 'Común']
    },
    panaderia: {
      nombres: ['Pan', 'Galletitas', 'Tostadas', 'Bizcochos', 'Facturas', 'Pan dulce'],
      marcas: ['Bimbo', 'Lactal', 'Fargo', 'Bagley', 'Havanna'],
      contenidos: ['500g', '750g', '400g', '1kg', '300g'],
      variedades: ['Integral', 'Blanco', 'Sin sal', 'Dulce', 'Salado']
    },
    frutas_verduras: {
      nombres: ['Tomate', 'Lechuga', 'Cebolla', 'Papa', 'Manzana', 'Banana'],
      marcas: ['Sin marca', 'Orgánico', 'Campo Fresco', 'Natural', 'Primera'],
      contenidos: ['1kg', '500g', '2kg', '1u', '3u'],
      variedades: ['Fresco', 'Orgánico', 'Primera', 'Segunda', 'Premium']
    },
    congelados: {
      nombres: ['Pizza', 'Helados', 'Papas fritas', 'Empanadas', 'Hamburguesas', 'Vegetales'],
      marcas: ['McCain', 'Granja del Sol', 'La Paulina', 'Haagen-Dazs', 'Sancor'],
      contenidos: ['500g', '1kg', '300g', '750g', '2L'],
      variedades: ['Clásico', 'Premium', 'Familiar', 'Individual', 'Light']
    },
    almacen: {
      nombres: ['Arroz', 'Fideos', 'Harina', 'Aceite', 'Azúcar', 'Sal'],
      marcas: ['Molinos', 'Natura', 'Arcor', 'Luchetti', 'Ledesma'],
      contenidos: ['1kg', '500g', '2kg', '1L', '750ml'],
      variedades: ['Común', 'Premium', 'Integral', 'Fino', 'Extra']
    },
    limpieza: {
      nombres: ['Detergente', 'Lavandina', 'Jabón', 'Suavizante', 'Desinfectante', 'Limpiador'],
      marcas: ['Ala', 'Skip', 'Magistral', 'Ayudín', 'Procenex'],
      contenidos: ['500ml', '750ml', '1L', '3kg', '2L'],
      variedades: ['Clásico', 'Concentrado', 'Aromático', 'Antibacterial', 'Multiuso']
    },
    higiene: {
      nombres: ['Shampoo', 'Acondicionador', 'Jabón', 'Desodorante', 'Crema', 'Protector solar'],
      marcas: ['Head & Shoulders', 'Pantene', 'Rexona', 'Dove', 'Nivea'],
      contenidos: ['400ml', '750ml', '200ml', '150ml', '100ml'],
      variedades: ['Normal', 'Graso', 'Seco', 'Sensible', 'Anti-caspa']
    },
    mascotas: {
      nombres: ['Alimento perros', 'Alimento gatos', 'Arena', 'Juguetes', 'Snacks', 'Medicamentos'],
      marcas: ['Pedigree', 'Whiskas', 'Pro Plan', 'Royal Canin', 'Sieger'],
      contenidos: ['1kg', '3kg', '7.5kg', '15kg', '500g'],
      variedades: ['Adulto', 'Cachorro', 'Senior', 'Light', 'Premium']
    }
  },

  // Rangos de precios por tipo (en pesos argentinos)
  rangos_precios: {
    lacteos: { min: 500, max: 3500 },
    bebidas: { min: 200, max: 2500 },
    carnes: { min: 1500, max: 8000 },
    panaderia: { min: 300, max: 2000 },
    frutas_verduras: { min: 250, max: 1800 },
    congelados: { min: 800, max: 4500 },
    almacen: { min: 400, max: 3000 },
    limpieza: { min: 600, max: 3500 },
    higiene: { min: 800, max: 4000 },
    mascotas: { min: 1200, max: 12000 }
  }
};

// ===============================================
// CLASE PRINCIPAL - TABLA PRODUCTOS V3
// ===============================================

class TablaProductosV3 {
  constructor() {
    this.productos = [];
    this.productosFiltrados = [];
    this.tipoActual = null;
    this.ordenActual = TABLA_CONFIG.ordenamiento_inicial;
    this.direccionActual = TABLA_CONFIG.direccion_inicial;
    this.contenedor = null;
    this.tabla = null;
    this.inicializado = false;
    
    this.inicializar();
  }

  /**
   * Inicializa el componente
   */
  inicializar() {
    if (this.inicializado) {
      console.warn('⚠️ TablaProductosV3 ya está inicializada');
      return;
    }

    console.log('🏗️ Inicializando TablaProductosV3...');
    
    this.crearContenedor();
    this.configurarEventListeners();
    this.inyectarEstilos();
    
    this.inicializado = true;
    console.log('✅ TablaProductosV3 inicializada correctamente');
  }

  /**
   * Crea el contenedor HTML para la tabla
   */
  crearContenedor() {
    // Buscar el contenedor donde insertar la tabla (después de los filtros)
    const seccionProductos = document.getElementById('seccion-productos');
    const filtrosContainer = seccionProductos?.querySelector('.filtros-container');
    
    if (!filtrosContainer) {
      console.error('❌ No se encontró el contenedor de filtros');
      return;
    }

    // Crear contenedor de la tabla
    this.contenedor = document.createElement('div');
    this.contenedor.id = 'tabla-productos-container';
    this.contenedor.className = 'tabla-productos-container';
    this.contenedor.style.display = 'none'; // Oculto inicialmente
    
    // Insertar después del contenedor de filtros
    filtrosContainer.insertAdjacentElement('afterend', this.contenedor);
    
    if (TABLA_CONFIG.debug) {
      console.log('📦 Contenedor de tabla creado');
    }
  }

  /**
   * Configura los event listeners
   */
  configurarEventListeners() {
    // Escuchar cambios en los filtros
    document.addEventListener('filtrosCambiados', (e) => {
      this.manejarCambioFiltros(e.detail);
    });

    // Escuchar reset de filtros
    document.addEventListener('resetearFiltros', () => {
      this.ocultarTabla();
    });

    if (TABLA_CONFIG.debug) {
      console.log('🔗 Event listeners configurados para TablaProductosV3');
    }
  }

  /**
   * Maneja cambios en los filtros
   */
  manejarCambioFiltros(detalle) {
    const { campo, valor, estadoCompleto } = detalle;
    
    if (campo === 'tipoProducto' && valor && valor !== 'todos') {
      this.tipoActual = valor;
      this.generarProductos(valor);
      this.mostrarTabla();
    } else if (campo === 'tipoProducto' && (!valor || valor === 'todos')) {
      this.ocultarTabla();
    } else if (campo === 'reset') {
      this.ocultarTabla();
    }
  }

  /**
   * Genera productos aleatorios para un tipo específico
   */
  generarProductos(tipo) {
    if (!DATOS_PRODUCTOS_BASE.productos_por_tipo[tipo]) {
      console.warn(`⚠️ No hay datos para el tipo de producto: ${tipo}`);
      return;
    }

    console.log(`🎲 Generando ${TABLA_CONFIG.productos_total} productos para tipo: ${tipo}`);
    
    const datosBase = DATOS_PRODUCTOS_BASE.productos_por_tipo[tipo];
    const rangoPrecios = DATOS_PRODUCTOS_BASE.rangos_precios[tipo];
    
    this.productos = [];
    
    for (let i = 0; i < TABLA_CONFIG.productos_total; i++) {
      const producto = {
        id: `${tipo}_${i + 1}`,
        nombre: this.obtenerAleatorio(datosBase.nombres),
        marca: this.obtenerAleatorio(datosBase.marcas),
        contenido: this.obtenerAleatorio(datosBase.contenidos),
        variedad: this.obtenerAleatorio(datosBase.variedades),
        disponibilidad: this.obtenerAleatorio(DATOS_PRODUCTOS_BASE.disponibilidades),
        precio: this.generarPrecio(rangoPrecios.min, rangoPrecios.max),
        supermercado: this.obtenerAleatorio(DATOS_PRODUCTOS_BASE.supermercados),
        orden_original: i
      };
      
      this.productos.push(producto);
    }
    
    this.productosFiltrados = [...this.productos];
    this.ordenarProductos(this.ordenActual, this.direccionActual);
    
    if (TABLA_CONFIG.debug) {
      console.log(`✅ ${this.productos.length} productos generados para ${tipo}`, this.productos.slice(0, 3));
    }
  }

  /**
   * Obtiene un elemento aleatorio de un array
   */
  obtenerAleatorio(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Genera un precio aleatorio en un rango
   */
  generarPrecio(min, max) {
    const precio = Math.floor(Math.random() * (max - min + 1)) + min;
    // Redondear a múltiplos de 10 para parecer más realista
    return Math.round(precio / 10) * 10;
  }

  /**
   * Muestra la tabla con animación
   */
  mostrarTabla() {
    if (!this.contenedor) {
      console.error('❌ Contenedor no disponible');
      return;
    }

    // Crear HTML de la tabla
    this.crearHTMLTabla();
    
    // Mostrar con animación
    this.contenedor.style.display = 'block';
    this.contenedor.style.opacity = '0';
    this.contenedor.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      this.contenedor.style.opacity = '1';
      this.contenedor.style.transform = 'translateY(0)';
    }, 50);
    
    if (TABLA_CONFIG.debug) {
      console.log('📊 Tabla mostrada con animación');
    }
  }

  /**
   * Oculta la tabla con animación
   */
  ocultarTabla() {
    if (!this.contenedor) return;
    
    this.contenedor.style.opacity = '0';
    this.contenedor.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      this.contenedor.style.display = 'none';
      this.productos = [];
      this.productosFiltrados = [];
      this.tipoActual = null;
    }, TABLA_CONFIG.animacion_duracion);
    
    if (TABLA_CONFIG.debug) {
      console.log('📊 Tabla ocultada');
    }
  }

  /**
   * Crea el HTML completo de la tabla
   */
  crearHTMLTabla() {
    if (!this.contenedor) return;

    const productosVisibles = this.productosFiltrados.slice(0, TABLA_CONFIG.productos_visibles);
    const productosEnScroll = this.productosFiltrados.slice(TABLA_CONFIG.productos_visibles);
    
    this.contenedor.innerHTML = `
      <div class="tabla-productos-header">
        <div class="tabla-info">
          <h3 class="tabla-titulo">
            <i class="fas fa-table"></i>
            Productos - ${this.tipoActual.charAt(0).toUpperCase() + this.tipoActual.slice(1)}
          </h3>
          <p class="tabla-subtitle">
            Mostrando ${TABLA_CONFIG.productos_visibles} de ${this.productosFiltrados.length} productos disponibles
          </p>
        </div>
        <div class="tabla-controles">
          <button class="btn btn-outline-primary btn-sm" onclick="tablaProductos.exportarDatos()">
            <i class="fas fa-download"></i>
            Exportar
          </button>
          <button class="btn btn-outline-secondary btn-sm" onclick="tablaProductos.alternarVista()">
            <i class="fas fa-th-list"></i>
            Vista compacta
          </button>
        </div>
      </div>

      <div class="tabla-productos-wrapper">
        <div class="tabla-scroll-container" id="tabla-scroll-container">
          <table class="table tabla-productos" id="tabla-productos">
            <thead class="tabla-header-sticky">
              <tr>
                ${this.crearHeaderColumnas()}
              </tr>
            </thead>
            <tbody>
              ${this.crearFilasProductos(productosVisibles, false)}
              ${productosEnScroll.length > 0 ? this.crearFilasProductos(productosEnScroll, true) : ''}
            </tbody>
          </table>
        </div>
        
        ${productosEnScroll.length > 0 ? this.crearIndicadorScroll() : ''}
      </div>
    `;

    // Configurar event listeners para ordenamiento
    this.configurarOrdenamiento();
  }

  /**
   * Crea el HTML del header con columnas ordenables
   */
  crearHeaderColumnas() {
    const columnas = [
      { key: 'nombre', texto: 'Nombre del Producto', icono: 'tag' },
      { key: 'marca', texto: 'Marca', icono: 'star' },
      { key: 'contenido', texto: 'Contenido', icono: 'balance-scale' },
      { key: 'variedad', texto: 'Variedad', icono: 'layer-group' },
      { key: 'disponibilidad', texto: 'Disponibilidad', icono: 'check-circle' },
      { key: 'accion', texto: 'Acción', icono: 'plus', no_ordenable: true }
    ];

    return columnas.map(col => {
      const esOrdenable = !col.no_ordenable;
      const estaOrdenado = this.ordenActual === col.key;
      const direccion = estaOrdenado ? this.direccionActual : 'asc';
      const iconoOrden = estaOrdenado ? (direccion === 'asc' ? 'sort-up' : 'sort-down') : 'sort';
      
      return `
        <th class="tabla-th ${esOrdenable ? 'ordenable' : ''} ${estaOrdenado ? 'ordenado-' + direccion : ''}" 
            ${esOrdenable ? `data-column="${col.key}" onclick="tablaProductos.ordenarPor('${col.key}')"` : ''}>
          <div class="th-content">
            <i class="fas fa-${col.icono} th-icon"></i>
            <span class="th-texto">${col.texto}</span>
            ${esOrdenable ? `<i class="fas fa-${iconoOrden} th-sort-icon"></i>` : ''}
          </div>
        </th>
      `;
    }).join('');
  }

  /**
   * Crea las filas de productos
   */
  crearFilasProductos(productos, enScroll = false) {
    return productos.map((producto, index) => {
      return `
        <tr class="tabla-fila ${enScroll ? 'fila-scroll' : 'fila-visible'}" 
            data-producto-id="${producto.id}">
          <td class="tabla-td td-nombre">
            <div class="producto-nombre">
              <strong>${producto.nombre}</strong>
              <small class="producto-id">#${producto.id}</small>
            </div>
          </td>
          <td class="tabla-td td-marca">
            <span class="marca-badge">${producto.marca}</span>
          </td>
          <td class="tabla-td td-contenido">
            <span class="contenido-valor">${producto.contenido}</span>
          </td>
          <td class="tabla-td td-variedad">
            <span class="variedad-tag">${producto.variedad}</span>
          </td>
          <td class="tabla-td td-disponibilidad">
            <span class="badge ${producto.disponibilidad.clase}">
              <i class="fas fa-${producto.disponibilidad.icono}"></i>
              ${producto.disponibilidad.texto}
            </span>
          </td>
          <td class="tabla-td td-accion">
            <button class="btn btn-agregar btn-success" 
                    onclick="tablaProductos.agregarProducto('${producto.id}')"
                    ${producto.disponibilidad.estado === 'agotado' ? 'disabled' : ''}>
              <i class="fas fa-plus"></i>
              <span class="btn-texto">Agregar</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Crea el indicador de scroll
   */
  crearIndicadorScroll() {
    const productosEnScroll = this.productosFiltrados.length - TABLA_CONFIG.productos_visibles;
    
    return `
      <div class="scroll-indicator">
        <i class="fas fa-chevron-down"></i>
        <span>Deslizá para ver ${productosEnScroll} productos más</span>
      </div>
    `;
  }

  /**
   * Configura el ordenamiento de columnas
   */
  configurarOrdenamiento() {
    // Los event listeners se configuran en el HTML generado
    if (TABLA_CONFIG.debug) {
      console.log('🔧 Sistema de ordenamiento configurado');
    }
  }

  /**
   * Ordena productos por columna
   */
  ordenarPor(columna) {
    if (this.ordenActual === columna) {
      // Cambiar dirección
      this.direccionActual = this.direccionActual === 'asc' ? 'desc' : 'asc';
    } else {
      // Nueva columna, comenzar ascendente
      this.ordenActual = columna;
      this.direccionActual = 'asc';
    }

    this.ordenarProductos(this.ordenActual, this.direccionActual);
    this.mostrarTabla(); // Regenerar tabla con nuevo orden
    
    if (TABLA_CONFIG.debug) {
      console.log(`📊 Ordenando por ${columna} (${this.direccionActual})`);
    }
  }

  /**
   * Ordena el array de productos
   */
  ordenarProductos(columna, direccion) {
    this.productosFiltrados.sort((a, b) => {
      let valorA, valorB;
      
      switch (columna) {
        case 'nombre':
        case 'marca':
        case 'contenido':
        case 'variedad':
          valorA = a[columna].toLowerCase();
          valorB = b[columna].toLowerCase();
          break;
        case 'disponibilidad':
          valorA = a.disponibilidad.texto.toLowerCase();
          valorB = b.disponibilidad.texto.toLowerCase();
          break;
        case 'precio':
          valorA = a.precio;
          valorB = b.precio;
          break;
        default:
          return 0;
      }
      
      if (valorA < valorB) return direccion === 'asc' ? -1 : 1;
      if (valorA > valorB) return direccion === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /**
   * Agrega un producto (acción del botón)
   */
  agregarProducto(productoId) {
    const producto = this.productos.find(p => p.id === productoId);
    
    if (!producto) {
      console.error(`❌ Producto no encontrado: ${productoId}`);
      return;
    }

    if (producto.disponibilidad.estado === 'agotado') {
      this.mostrarNotificacion('No se puede agregar producto agotado', 'warning');
      return;
    }

    // Disparar evento para notificar a otros componentes
    const evento = new CustomEvent('productoAgregado', {
      detail: {
        producto: producto,
        productoId: productoId,
        timestamp: Date.now()
      }
    });
    document.dispatchEvent(evento);

    // Efecto visual en el botón
    this.aplicarEfectoBoton(productoId);
    
    // Notificación
    this.mostrarNotificacion(`${producto.nombre} agregado a tu lista`, 'success');
    
    if (TABLA_CONFIG.debug) {
      console.log(`➕ Producto agregado: ${producto.nombre} (${productoId})`);
    }
  }

  /**
   * Aplica efecto visual al botón de agregar
   */
  aplicarEfectoBoton(productoId) {
    const fila = document.querySelector(`[data-producto-id="${productoId}"]`);
    const boton = fila?.querySelector('.btn-agregar');
    
    if (!boton) return;

    // Guardar estado original
    const textoOriginal = boton.innerHTML;
    const clasesOriginales = boton.className;
    
    // Aplicar efecto
    boton.innerHTML = '<i class="fas fa-check"></i> <span class="btn-texto">¡Agregado!</span>';
    boton.classList.add('btn-success-alt');
    boton.disabled = true;
    
    // Restaurar después de 2 segundos
    setTimeout(() => {
      boton.innerHTML = textoOriginal;
      boton.className = clasesOriginales;
      boton.disabled = false;
    }, 2000);
  }

  /**
   * Muestra notificaciones
   */
  mostrarNotificacion(mensaje, tipo = 'info') {
    // Buscar si existe sistema de notificaciones de la sección productos
    if (window.SeccionProductos && typeof window.SeccionProductos.mostrarToast === 'function') {
      window.SeccionProductos.mostrarToast(mensaje, tipo);
    } else {
      // Fallback simple
      console.log(`📢 [${tipo.toUpperCase()}] ${mensaje}`);
      
      // Toast simple
      const toast = document.createElement('div');
      toast.className = `toast-simple toast-${tipo}`;
      toast.textContent = mensaje;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'success' ? '#28a745' : tipo === 'warning' ? '#ffc107' : '#17a2b8'};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 10000;
        font-size: 14px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
      `;
      
      document.body.appendChild(toast);
      setTimeout(() => toast.style.transform = 'translateX(0)', 100);
      setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  }

  /**
   * Exportar datos (funcionalidad extra)
   */
  exportarDatos() {
    if (this.productos.length === 0) {
      this.mostrarNotificacion('No hay datos para exportar', 'warning');
      return;
    }

    const datosCSV = this.convertirACSV(this.productosFiltrados);
    this.descargarArchivo(datosCSV, `productos-${this.tipoActual}-${Date.now()}.csv`, 'text/csv');
    
    this.mostrarNotificacion('Datos exportados correctamente', 'success');
  }

  /**
   * Convierte productos a formato CSV
   */
  convertirACSV(productos) {
    const headers = ['ID', 'Nombre', 'Marca', 'Contenido', 'Variedad', 'Disponibilidad', 'Precio'];
    const rows = productos.map(p => [
      p.id,
      p.nombre,
      p.marca,
      p.contenido,
      p.variedad,
      p.disponibilidad.texto,
      p.precio
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Descarga archivo
   */
  descargarArchivo(contenido, nombre, tipo) {
    const blob = new Blob([contenido], { type: tipo });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Alternar vista compacta (funcionalidad extra)
   */
  alternarVista() {
    const tabla = document.getElementById('tabla-productos');
    if (!tabla) return;
    
    tabla.classList.toggle('vista-compacta');
    
    const esCompacta = tabla.classList.contains('vista-compacta');
    this.mostrarNotificacion(
      esCompacta ? 'Vista compacta activada' : 'Vista normal activada', 
      'info'
    );
  }

  /**
   * Inyecta estilos CSS específicos
   */
  inyectarEstilos() {
    if (document.getElementById('estilos-tabla-productos-v3')) return;
    
    const style = document.createElement('style');
    style.id = 'estilos-tabla-productos-v3';
    style.textContent = `
      /* Estilos específicos inyectados por TablaProductosV3 */
      .tabla-productos-container {
        transition: all ${TABLA_CONFIG.animacion_duracion}ms ease;
      }
      
      .btn-success-alt {
        background: linear-gradient(135deg, #20c997 0%, #28a745 100%) !important;
        animation: pulse-success 0.6s ease-out !important;
      }
      
      @keyframes pulse-success {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      .toast-simple {
        animation: slide-in 0.3s ease !important;
      }
      
      @keyframes slide-in {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * API pública para debugging
   */
  debug() {
    return {
      productos_generados: this.productos.length,
      productos_filtrados: this.productosFiltrados.length,
      tipo_actual: this.tipoActual,
      orden_actual: this.ordenActual,
      direccion_actual: this.direccionActual,
      inicializado: this.inicializado,
      contenedor_existe: !!this.contenedor
    };
  }
}

// ===============================================
// INICIALIZACIÓN AUTOMÁTICA
// ===============================================

let tablaProductos;

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      tablaProductos = new TablaProductosV3();
    }, 200);
  });
} else {
  setTimeout(() => {
    tablaProductos = new TablaProductosV3();
  }, 200);
}

// API pública global
window.TablaProductosV3 = TablaProductosV3;
window.tablaProductos = tablaProductos;

console.log('📦 TablaProductosV3 - Componente cargado y listo para usar');
