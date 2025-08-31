/**
 * ============================================================================
 * TABLA PRODUCTOS A COMPARAR - FUNCIONALIDAD COMPLETA  
 * ============================================================================
 * 🔧 FIX: Estructura de tabla reparada - todas las columnas visibles
 * ============================================================================ */

class TablaComparar {
    constructor() {
        this.productosComparar = [];
        this.contenedor = null;
        this.tablaYaCreada = false; // ✅ Control de estado de tabla
        this.configurarEventListeners();
        
        console.log('🛒 TablaComparar inicializada');
    }

    /**
     * Configurar event listeners para integración con sistema
     */
    configurarEventListeners() {
        // Listener para productos agregados desde tabla principal
        document.addEventListener('productoAgregado', (event) => {
            const { id, nombre, sku } = event.detail;
            this.agregarProducto(id, nombre, sku);
        });

        // Listener para productos quitados desde tabla principal
        document.addEventListener('productoQuitado', (event) => {
            const { id, nombre, sku } = event.detail;
            this.quitarProductoPorId(id);
        });

        // Listener para limpieza global
        document.addEventListener('filtrosLimpiados', () => {
            this.limpiarTodosLosProductos();
        });

        // Listener para reseteo global
        document.addEventListener('resetearFiltros', () => {
            this.limpiarTodosLosProductos();
        });
    }

    /**
     * Busca o crea el contenedor para la tabla
     */
    buscarOCrearContenedor() {
        // Buscar contenedor existente
        this.contenedor = document.getElementById('contenedor-tabla-comparar');
        
        if (!this.contenedor) {
            // Crear nuevo contenedor
            this.contenedor = document.createElement('div');
            this.contenedor.id = 'contenedor-tabla-comparar';
            this.contenedor.className = 'contenedor-tabla-comparar';
            
            // Insertar después del contenedor de tabla productos
            const tablaProductos = document.getElementById('contenedor-tabla-productos');
            if (tablaProductos) {
                tablaProductos.parentNode.insertBefore(this.contenedor, tablaProductos.nextSibling);
                console.log('📍 Contenedor tabla comparar creado después de tabla productos');
            } else {
                // Fallback: agregar al final de la sección productos
                const seccionProductos = document.querySelector('#seccion-productos .container');
                if (seccionProductos) {
                    seccionProductos.appendChild(this.contenedor);
                    console.log('📍 Contenedor tabla comparar creado en sección productos');
                } else {
                    document.body.appendChild(this.contenedor);
                    console.log('📍 Contenedor tabla comparar creado en body');
                }
            }
        }

        return this.contenedor;
    }

    /**
     * ✅ Agrega un producto con animaciones correctas
     */
    agregarProducto(id, nombre, sku) {
        console.log(`➕ Agregando producto a comparar: ${nombre} (ID: ${id}, SKU: ${sku})`);
        
        // Verificar si ya existe
        const existeProducto = this.productosComparar.find(p => p.id === id);
        if (existeProducto) {
            console.log(`⚠️ Producto ya existe en tabla comparar: ${nombre}`);
            return;
        }

        // Obtener información adicional del producto desde la tabla principal
        const infoProducto = this.obtenerInfoProductoCompleta(id, nombre, sku);
        
        // Agregar producto con cantidad inicial 1
        const nuevoProducto = {
            id: id,
            nombre: nombre,
            sku: sku,
            cantidad: 1,
            filtrosString: infoProducto.filtrosString,
            fechaAgregado: new Date()
        };

        this.productosComparar.push(nuevoProducto);
        
        // ✅ LÓGICA DE ANIMACIONES CORREGIDA
        if (!this.tablaYaCreada || this.productosComparar.length === 1) {
            // PRIMERA VEZ: Crear tabla completa con animación completa
            console.log('🎬 Primera vez: Generando tabla completa con animación');
            this.generarTablaCompleta();
            this.mostrarTabla();
            this.tablaYaCreada = true;
        } else {
            // SIGUIENTES VECES: Solo agregar la nueva fila con animación de fila
            console.log('➕ Agregando solo la nueva fila con animación individual');
            this.agregarSoloNuevaFila(nuevoProducto);
        }
        
        console.log(`✅ Producto agregado a comparar. Total: ${this.productosComparar.length}`);
    }

    /**
     * ✅ Agregar solo una nueva fila sin regenerar toda la tabla
     */
    agregarSoloNuevaFila(nuevoProducto) {
        const tbody = this.contenedor.querySelector('.tabla-comparar__tbody');
        if (!tbody) {
            console.warn('⚠️ Tbody no encontrado, regenerando tabla completa');
            this.generarTablaCompleta();
            return;
        }

        // Crear nueva fila HTML con estructura completa
        const nuevaFilaHTML = this.generarFilaProducto(nuevoProducto, this.productosComparar.length - 1);
        
        // Insertar nueva fila usando insertAdjacentHTML (más seguro)
        tbody.insertAdjacentHTML('beforeend', nuevaFilaHTML);
        
        // Obtener la fila recién insertada
        const nuevaFila = tbody.lastElementChild;
        
        // ✅ ANIMACIÓN ESPECIAL PARA NUEVA FILA
        nuevaFila.style.opacity = '0';
        nuevaFila.style.transform = 'translateX(-20px) scale(0.95)';
        nuevaFila.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        // Actualizar contador
        this.actualizarContador();
        
        // Trigger animación de entrada para la nueva fila
        setTimeout(() => {
            nuevaFila.style.opacity = '1';
            nuevaFila.style.transform = 'translateX(0) scale(1)';
            
            // Efecto de brillo/highlight temporal
            nuevaFila.style.background = 'rgba(40, 167, 69, 0.1)';
            nuevaFila.style.borderLeft = '4px solid #28a745';
            
            // Remover el highlight después de 2 segundos
            setTimeout(() => {
                nuevaFila.style.background = '';
                nuevaFila.style.borderLeft = '';
                nuevaFila.style.transition = '';
            }, 2000);
        }, 50);
        
        console.log('✨ Nueva fila agregada con animación individual');
    }

    /**
     * ✅ Actualizar solo el contador sin regenerar tabla
     */
    actualizarContador() {
        const contador = this.contenedor.querySelector('.tabla-comparar__contador');
        if (contador) {
            // Animación del contador
            contador.style.transform = 'scale(1.3)';
            contador.textContent = this.productosComparar.length;
            
            setTimeout(() => {
                contador.style.transform = '';
            }, 200);
        }
    }

    /**
     * Obtiene información completa del producto desde la tabla principal
     */
    obtenerInfoProductoCompleta(id, nombre, sku) {
        let filtrosString = '';
        
        try {
            // Intentar obtener información desde la tabla principal
            const filaProducto = document.querySelector(`[onclick*="agregarProductoDesdeTabla(${id},"]`);
            if (filaProducto) {
                const fila = filaProducto.closest('.tabla-nueva__fila');
                if (fila) {
                    // Extraer valores de filtros desde las celdas
                    const marcaCelda = fila.querySelector('.tabla-nueva__celda--marca .filtro-valor--marca');
                    const contenidoCelda = fila.querySelector('.tabla-nueva__celda--contenido .filtro-valor--contenido');
                    const variedadCelda = fila.querySelector('.tabla-nueva__celda--variedad .filtro-valor--variedad');
                    
                    const marca = marcaCelda ? marcaCelda.textContent.trim() : '';
                    const contenido = contenidoCelda ? contenidoCelda.textContent.trim() : '';
                    const variedad = variedadCelda ? variedadCelda.textContent.trim() : '';
                    
                    // Crear string de filtros
                    const filtros = [marca, contenido, variedad].filter(f => f && f !== '').join(' • ');
                    filtrosString = filtros || 'Sin especificar';
                    
                    console.log(`📝 Filtros extraídos para ${nombre}: ${filtrosString}`);
                }
            }
        } catch (error) {
            console.warn('⚠️ Error extrayendo filtros:', error);
            filtrosString = 'Información no disponible';
        }
        
        return {
            filtrosString: filtrosString || 'Sin especificar'
        };
    }

    /**
     * ✅ Quita un producto con control de animaciones
     */
    quitarProductoPorId(id) {
        const indice = this.productosComparar.findIndex(p => p.id === id);
        if (indice !== -1) {
            const producto = this.productosComparar[indice];
            console.log(`🗑️ Quitando producto de comparar: ${producto.nombre}`);
            
            // ✅ ANIMACIÓN DE SALIDA PARA FILA ESPECÍFICA
            const filaProducto = this.contenedor.querySelector(`[onclick*="eliminarDeComparar(${id},"]`);
            if (filaProducto) {
                const fila = filaProducto.closest('.tabla-comparar__fila');
                if (fila) {
                    // Animación de salida
                    fila.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    fila.style.opacity = '0';
                    fila.style.transform = 'translateX(100px) scale(0.9)';
                    fila.style.background = 'rgba(220, 53, 69, 0.05)';
                    
                    setTimeout(() => {
                        // Quitar del array
                        this.productosComparar.splice(indice, 1);
                        
                        if (this.productosComparar.length === 0) {
                            // Si no quedan productos, resetear estado y ocultar tabla
                            this.tablaYaCreada = false;
                            this.ocultarTabla();
                        } else {
                            // Remover la fila del DOM y actualizar contador
                            fila.remove();
                            this.actualizarContador();
                        }
                    }, 400);
                    
                    console.log(`✅ Producto quitado con animación. Restantes: ${this.productosComparar.length}`);
                    return;
                }
            }
            
            // Fallback: método anterior si no se encuentra la fila
            this.productosComparar.splice(indice, 1);
            if (this.productosComparar.length === 0) {
                this.tablaYaCreada = false;
                this.ocultarTabla();
            } else {
                this.generarTablaCompleta();
            }
        }
    }

    /**
     * Quita un producto específico y notifica al sistema principal
     */
    eliminarProducto(id, nombre) {
        console.log(`❌ Eliminando producto desde tabla comparar: ${nombre} (ID: ${id})`);
        
        // Quitar de la lista local
        this.quitarProductoPorId(id);
        
        // Notificar al sistema principal para actualizar botones
        if (typeof window.quitarProductoAgregado === 'function') {
            window.quitarProductoAgregado(id, nombre, '');
        } else {
            // Fallback: emitir evento
            document.dispatchEvent(new CustomEvent('productoQuitado', {
                detail: { id, nombre, sku: '' }
            }));
        }
        
        // Actualizar estado de botón en tabla principal
        this.actualizarBotonTablaOriginal(id, false);
        
        console.log(`🔄 Sistema notificado de eliminación de producto: ${nombre}`);
    }

    /**
     * Actualiza el estado del botón correspondiente en la tabla original
     */
    actualizarBotonTablaOriginal(productoId, estaAgregado) {
        try {
            const boton = document.querySelector(`[onclick*="agregarProductoDesdeTabla(${productoId},"]`);
            if (boton) {
                const textoSpan = boton.querySelector('.boton-agregar__texto');
                const iconoSpan = boton.querySelector('.boton-agregar__icono');
                
                if (estaAgregado) {
                    boton.classList.add('boton-agregar--agregado');
                    if (textoSpan) textoSpan.textContent = 'Agregado';
                    if (iconoSpan) iconoSpan.textContent = '✓';
                } else {
                    boton.classList.remove('boton-agregar--agregado');
                    if (textoSpan) textoSpan.textContent = 'Agregar';
                    if (iconoSpan) iconoSpan.textContent = '+';
                }
                
                console.log(`🔄 Botón original actualizado para producto ${productoId}: ${estaAgregado ? 'agregado' : 'normal'}`);
            }
        } catch (error) {
            console.warn('⚠️ Error actualizando botón original:', error);
        }
    }

    /**
     * Actualiza la cantidad de un producto
     */
    actualizarCantidad(id, nuevaCantidad) {
        const producto = this.productosComparar.find(p => p.id === id);
        if (producto && nuevaCantidad > 0) {
            producto.cantidad = Math.max(1, Math.min(99, nuevaCantidad));
            console.log(`🔢 Cantidad actualizada para ${producto.nombre}: ${producto.cantidad}`);
            
            // Solo actualizar el input, no regenerar toda la tabla
            const input = document.querySelector(`#cantidad-${id}`);
            if (input) {
                input.value = producto.cantidad;
            }
        }
    }

    /**
     * ✅ Genera la estructura HTML completa (primera vez o regeneración completa)
     */
    generarTablaCompleta() {
        if (!this.contenedor) {
            this.buscarOCrearContenedor();
        }

        if (this.productosComparar.length === 0) {
            this.contenedor.innerHTML = this.generarTablaVacia();
            return;
        }

        // ✅ ANIMACIÓN CONTROLADA: Solo aplicar si es primera vez
        const claseAnimacion = !this.tablaYaCreada ? 'tabla-comparar tabla-comparar--primera-vez' : 'tabla-comparar';

        const html = `
            <div class="${claseAnimacion}">
                <div class="tabla-comparar__header">
                    <div class="tabla-comparar__contador">${this.productosComparar.length}</div>
                    <h3 class="tabla-comparar__titulo">Productos a Comparar</h3>
                    <button class="tabla-comparar__limpiar" onclick="limpiarTablaComparar()" title="Limpiar todos los productos">
                        <i class="fas fa-trash"></i>
                        <span>Limpiar</span>
                    </button>
                </div>
                <div class="tabla-comparar__contenido">
                    <table class="tabla-comparar__table">
                        <thead class="tabla-comparar__thead">
                            <tr>
                                <th class="tabla-comparar__th tabla-comparar__th--producto">Producto</th>
                                <th class="tabla-comparar__th tabla-comparar__th--cantidad">Cantidad</th>
                                <th class="tabla-comparar__th tabla-comparar__th--accion">Acción</th>
                            </tr>
                        </thead>
                        <tbody class="tabla-comparar__tbody">
                            ${this.generarFilasComparar()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        this.contenedor.innerHTML = html;
        
        // Configurar event listeners para los controles
        this.configurarEventListenersTabla();
        
        console.log(`🎨 Tabla comparar generada completa con ${this.productosComparar.length} productos`);
    }

    /**
     * ✅ REPARADO: Genera HTML para una sola fila de producto - ESTRUCTURA COMPLETA
     */
    generarFilaProducto(producto, index) {
        // 🔧 Parsear filtros correctamente
        const partesFiltros = producto.filtrosString.split(' • ');
        const marca = partesFiltros[0] || '';
        const contenido = partesFiltros[1] || '';
        const variedad = partesFiltros[2] || '';
        
        return `
            <tr class="tabla-comparar__fila tabla-comparar__fila--nueva" style="animation-delay: ${index * 0.1}s">
                <td class="tabla-comparar__celda tabla-comparar__celda--producto">
                    <div class="producto-comparar-info">
                        <div class="producto-comparar-id">#${producto.id}</div>
                        <div class="producto-comparar-content">
                            <span class="producto-comparar-nombre">${producto.nombre}</span>
                            <div class="producto-comparar-filtros" title="${producto.filtrosString}">
                                ${marca ? `<span>${marca}</span>` : ''}
                                ${marca && (contenido || variedad) ? '<span>•</span>' : ''}
                                ${contenido ? `<span>${contenido}</span>` : ''}
                                ${contenido && variedad ? '<span>•</span>' : ''}
                                ${variedad ? `<span>${variedad}</span>` : ''}
                            </div>
                        </div>
                    </div>
                </td>
                <td class="tabla-comparar__celda tabla-comparar__celda--cantidad">
                    <div class="cantidad-selector">
                        <button class="cantidad-btn cantidad-btn-menos" onclick="cambiarCantidad(${producto.id}, -1)" 
                                ${producto.cantidad <= 1 ? 'disabled' : ''}>
                            −
                        </button>
                        <input type="number" 
                               class="cantidad-input" 
                               id="cantidad-${producto.id}"
                               value="${producto.cantidad}" 
                               min="1" 
                               max="99"
                               onchange="setCantidad(${producto.id}, this.value)">
                        <button class="cantidad-btn cantidad-btn-mas" onclick="cambiarCantidad(${producto.id}, 1)" 
                                ${producto.cantidad >= 99 ? 'disabled' : ''}>
                            +
                        </button>
                    </div>
                </td>
                <td class="tabla-comparar__celda tabla-comparar__celda--accion">
                    <button class="boton-eliminar-comparar" 
                            onclick="eliminarDeComparar(${producto.id}, '${producto.nombre.replace(/'/g, "\\'")}')">
                        <i class="boton-eliminar-comparar__icono fas fa-trash"></i>
                        <span class="boton-eliminar-comparar__texto">Eliminar</span>
                    </button>
                </td>
            </tr>
        `;
    }

    /**
     * Genera las filas de productos en la tabla
     */
    generarFilasComparar() {
        return this.productosComparar.map((producto, index) => 
            this.generarFilaProducto(producto, index)
        ).join('');
    }

    /**
     * Genera HTML para tabla vacía
     */
    generarTablaVacia() {
        return `
            <div class="tabla-comparar">
                <div class="tabla-comparar__vacia">
                    <div class="tabla-comparar__vacia-icono">🛒</div>
                    <h4>Tu lista está vacía</h4>
                    <p>Agregá productos desde la tabla superior para comenzar a comparar precios</p>
                </div>
            </div>
        `;
    }

    /**
     * Configura event listeners específicos de la tabla
     */
    configurarEventListenersTabla() {
        // Los event listeners se configuran via onclick en el HTML
        // para mayor simplicidad y compatibilidad
        console.log('🔗 Event listeners de tabla comparar configurados');
    }

    /**
     * Muestra la tabla con animación
     */
    mostrarTabla() {
        if (!this.contenedor) {
            this.buscarOCrearContenedor();
        }
        
        this.contenedor.style.display = 'block';
        // Trigger reflow para activar transición CSS
        this.contenedor.offsetHeight;
        this.contenedor.classList.add('mostrar');
        
        console.log('👁️ Tabla comparar mostrada');
    }

    /**
     * Oculta la tabla
     */
    ocultarTabla() {
        if (this.contenedor) {
            this.contenedor.classList.remove('mostrar');
            
            // Esperar a que termine la transición antes de ocultar
            setTimeout(() => {
                if (this.productosComparar.length === 0) {
                    this.contenedor.style.display = 'none';
                    console.log('🙈 Tabla comparar ocultada');
                }
            }, 600);
        }
    }

    /**
     * ✅ Limpia todos los productos con reseteo de estado
     */
    limpiarTodosLosProductos() {
        console.log('🧹 Limpiando todos los productos de tabla comparar...');
        
        // Notificar al sistema principal para cada producto
        this.productosComparar.forEach(producto => {
            if (typeof window.quitarProductoAgregado === 'function') {
                window.quitarProductoAgregado(producto.id, producto.nombre, producto.sku);
            }
            
            // Actualizar botón en tabla original
            this.actualizarBotonTablaOriginal(producto.id, false);
        });
        
        // Limpiar array local
        this.productosComparar = [];
        
        // ✅ RESETEAR ESTADO DE TABLA
        this.tablaYaCreada = false;
        
        // Ocultar tabla
        this.ocultarTabla();
        
        console.log('✅ Todos los productos limpiados y estado reseteado');
    }

    /**
     * Obtiene la lista de productos para comparar
     */
    obtenerProductos() {
        return [...this.productosComparar]; // Retorna copia
    }

    /**
     * Obtiene el total de productos
     */
    obtenerTotalProductos() {
        return this.productosComparar.length;
    }

    /**
     * Obtiene la cantidad total de items (suma de cantidades)
     */
    obtenerTotalItems() {
        return this.productosComparar.reduce((total, producto) => total + producto.cantidad, 0);
    }
}

// ============================================================================
// INSTANCIA GLOBAL Y FUNCIONES DE INTERFAZ
// ============================================================================

let tablaCompararInstance = null;

/**
 * Inicializa la tabla de comparar
 */
function inicializarTablaComparar() {
    if (!tablaCompararInstance) {
        tablaCompararInstance = new TablaComparar();
        console.log('🚀 TablaComparar inicializada globalmente');
    }
    return tablaCompararInstance;
}

/**
 * Función para cambiar cantidad (botones + y -)
 */
function cambiarCantidad(id, delta) {
    if (!tablaCompararInstance) return;
    
    const producto = tablaCompararInstance.productosComparar.find(p => p.id === id);
    if (producto) {
        const nuevaCantidad = producto.cantidad + delta;
        if (nuevaCantidad >= 1 && nuevaCantidad <= 99) {
            tablaCompararInstance.actualizarCantidad(id, nuevaCantidad);
            
            // Actualizar botones de cantidad después del cambio
            setTimeout(() => {
                const btnMenos = document.querySelector(`[onclick*="cambiarCantidad(${id}, -1)"]`);
                const btnMas = document.querySelector(`[onclick*="cambiarCantidad(${id}, 1)"]`);
                
                if (btnMenos) btnMenos.disabled = nuevaCantidad <= 1;
                if (btnMas) btnMas.disabled = nuevaCantidad >= 99;
            }, 10);
        }
    }
}

/**
 * Función para establecer cantidad directamente (input)
 */
function setCantidad(id, valor) {
    if (!tablaCompararInstance) return;
    
    const nuevaCantidad = parseInt(valor) || 1;
    tablaCompararInstance.actualizarCantidad(id, nuevaCantidad);
    
    // Actualizar botones
    setTimeout(() => {
        const btnMenos = document.querySelector(`[onclick*="cambiarCantidad(${id}, -1)"]`);
        const btnMas = document.querySelector(`[onclick*="cambiarCantidad(${id}, 1)"]`);
        
        if (btnMenos) btnMenos.disabled = nuevaCantidad <= 1;
        if (btnMas) btnMas.disabled = nuevaCantidad >= 99;
    }, 10);
}

/**
 * Función para eliminar producto individual
 */
function eliminarDeComparar(id, nombre) {
    if (!tablaCompararInstance) return;
    
    console.log(`🗑️ Eliminando producto individual: ${nombre}`);
    tablaCompararInstance.eliminarProducto(id, nombre);
    
    // Mostrar notificación
    mostrarNotificacionProductoEliminado(nombre);
}

/**
 * Función para limpiar toda la tabla
 */
function limpiarTablaComparar() {
    if (!tablaCompararInstance) return;
    
    console.log('🧹 Limpiando tabla comparar desde botón');
    tablaCompararInstance.limpiarTodosLosProductos();
    
    // Mostrar notificación
    const toast = document.getElementById('notification-toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
        toastMessage.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-check-circle text-success me-2"></i>
                <span>Lista de comparación limpiada</span>
            </div>
        `;
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
}

/**
 * Muestra notificación cuando se elimina un producto
 */
function mostrarNotificacionProductoEliminado(nombreProducto) {
    const toast = document.getElementById('notification-toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
        toastMessage.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-trash text-danger me-2"></i>
                <span>Producto eliminado: <strong>${nombreProducto}</strong></span>
            </div>
        `;
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
}

/**
 * Funciones globales para integración
 */
window.inicializarTablaComparar = inicializarTablaComparar;
window.cambiarCantidad = cambiarCantidad;
window.setCantidad = setCantidad;
window.eliminarDeComparar = eliminarDeComparar;
window.limpiarTablaComparar = limpiarTablaComparar;

// ============================================================================
// INICIALIZACIÓN AUTOMÁTICA
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Inicializando sistema de tabla comparar...');
    inicializarTablaComparar();
});

console.log('📜 Sistema TablaComparar con estructura reparada cargado completamente');