/**
 * ============================================================================
 * TABLA DE PRODUCTOS - GENERACIÓN DINÁMICA
 * ============================================================================
 * Características:
 * - Se genera solo cuando el usuario elige un tipo de producto
 * - Solo 1 columna: Nombre del Producto
 * - 40 productos aleatorios
 * - Sin auto-inicialización
 */

class TablaProductos {
    constructor() {
        this.productos = [];
        this.contenedor = null;
        // NO inicializar automáticamente
    }

    /**
     * Genera exactamente 40 productos con nombres simplificados y filtros
     */
    generarProductos() {
        const productosBase = [
            { nombre: 'Leche Entera', marca: 'La Serenísima', contenido: '1L', variedad: 'Entera' },
            { nombre: 'Yogur Natural', marca: 'Ilolay', contenido: '180g', variedad: 'Natural' },
            { nombre: 'Queso Cremoso', marca: 'Sancor', contenido: '200g', variedad: 'Cremoso' },
            { nombre: 'Manteca', marca: 'Tregar', contenido: '200g', variedad: 'Con Sal' },
            { nombre: 'Dulce de Leche', marca: 'Colonial', contenido: '400g', variedad: 'Tradicional' },
            { nombre: 'Gaseosa', marca: 'Coca-Cola', contenido: '2L', variedad: 'Original' },
            { nombre: 'Agua Mineral', marca: 'Villavicencio', contenido: '1.5L', variedad: 'Sin Gas' },
            { nombre: 'Jugo de Naranja', marca: 'Cepita', contenido: '1L', variedad: 'Natural' },
            { nombre: 'Cerveza', marca: 'Quilmes', contenido: '473ml', variedad: 'Clásica' },
            { nombre: 'Vino Tinto', marca: 'Alamos', contenido: '750ml', variedad: 'Malbec' },
            { nombre: 'Pollo Entero', marca: 'Granja del Sol', contenido: '1kg', variedad: 'Fresco' },
            { nombre: 'Carne Molida', marca: 'Swift', contenido: '1kg', variedad: 'Común' },
            { nombre: 'Milanesas', marca: 'Suprema', contenido: '500g', variedad: 'Pollo' },
            { nombre: 'Jamón Cocido', marca: 'Feteado', contenido: '200g', variedad: 'Natural' },
            { nombre: 'Salchichas', marca: 'Frankfurt', contenido: '6u', variedad: 'Tradicional' },
            { nombre: 'Pan Lactal', marca: 'Bimbo', contenido: '500g', variedad: 'Blanco' },
            { nombre: 'Galletitas', marca: 'Oreo', contenido: '300g', variedad: 'Original' },
            { nombre: 'Bizcochos', marca: 'La Granja', contenido: '12u', variedad: 'Grasa' },
            { nombre: 'Facturas', marca: 'Panadería', contenido: '6u', variedad: 'Surtidas' },
            { nombre: 'Tostadas', marca: 'Criollitas', contenido: '200g', variedad: 'Clásicas' },
            { nombre: 'Tomate', marca: 'Huerta', contenido: '1kg', variedad: 'Redondo' },
            { nombre: 'Lechuga', marca: 'Verde', contenido: '1u', variedad: 'Criolla' },
            { nombre: 'Papa', marca: 'Campo', contenido: '1kg', variedad: 'Blanca' },
            { nombre: 'Cebolla', marca: 'Huerta', contenido: '1kg', variedad: 'Amarilla' },
            { nombre: 'Manzana', marca: 'Fruta Fresca', contenido: '1kg', variedad: 'Roja' },
            { nombre: 'Detergente', marca: 'Magistral', contenido: '750ml', variedad: 'Líquido' },
            { nombre: 'Lavandina', marca: 'Ayudín', contenido: '1L', variedad: 'Original' },
            { nombre: 'Jabón en Polvo', marca: 'Skip', contenido: '800g', variedad: 'Completo' },
            { nombre: 'Suavizante', marca: 'Comfort', contenido: '900ml', variedad: 'Concentrado' },
            { nombre: 'Limpiador', marca: 'CIF', contenido: '500ml', variedad: 'Cremoso' },
            { nombre: 'Shampoo', marca: 'Pantene', contenido: '400ml', variedad: 'Nutrición' },
            { nombre: 'Jabón Líquido', marca: 'Dove', contenido: '250ml', variedad: 'Humectante' },
            { nombre: 'Pasta Dental', marca: 'Colgate', contenido: '90g', variedad: 'Total' },
            { nombre: 'Desodorante', marca: 'Rexona', contenido: '150ml', variedad: 'Antibacterial' },
            { nombre: 'Crema', marca: 'Nivea', contenido: '200ml', variedad: 'Hidratante' },
            { nombre: 'Pizza', marca: 'McCain', contenido: '350g', variedad: 'Muzzarella' },
            { nombre: 'Helado', marca: 'Frigor', contenido: '1L', variedad: 'Vainilla' },
            { nombre: 'Papas Fritas', marca: 'McCain', contenido: '1kg', variedad: 'Congeladas' },
            { nombre: 'Empanadas', marca: 'Artesanales', contenido: '12u', variedad: 'Carne' },
            { nombre: 'Tarta', marca: 'Casera', contenido: '500g', variedad: 'Verdura' }
        ];

        this.productos = [];
        for (let i = 0; i < 40; i++) {
            const producto = productosBase[i];
            this.productos.push({
                id: i + 1,
                nombre: producto.nombre,
                marca: producto.marca,
                contenido: producto.contenido,
                variedad: producto.variedad,
                sku: this.generarSKU()
            });
        }

        console.log(`📦 Generados ${this.productos.length} productos con filtros para la tabla`);
    }

    /**
     * Busca o crea el contenedor para la tabla
     */
    buscarContenedor() {
        // Buscar contenedor existente
        this.contenedor = document.getElementById('contenedor-tabla-productos');
        
        if (this.contenedor) {
            console.log('📍 Contenedor encontrado');
            // Limpiar contenido previo
            this.contenedor.innerHTML = '';
            // Asegurar que esté visible
            this.contenedor.style.display = 'block';
        } else {
            // Crear contenedor si no existe
            this.contenedor = document.createElement('div');
            this.contenedor.id = 'contenedor-tabla-productos';
            this.contenedor.className = 'contenedor-tabla-productos';
            
            // Buscar donde insertarlo
            const seccion = document.querySelector('#seccion-productos .container');
            if (seccion) {
                seccion.appendChild(this.contenedor);
                console.log('📍 Contenedor creado en sección productos');
            } else {
                document.body.appendChild(this.contenedor);
                console.log('📍 Contenedor creado en body');
            }
        }
    }

    /**
     * Crea la estructura HTML de la tabla con 5 columnas
     */
    crearTabla() {
        const html = `
            <div class="tabla-nueva">
                <div class="tabla-nueva__header">
                    <div class="tabla-nueva__contador">40</div>
                    <h3 class="tabla-nueva__titulo">Productos Disponibles</h3>
                </div>
                <div class="tabla-nueva__contenido">
                    <table class="tabla-nueva__table">
                        <thead class="tabla-nueva__thead">
                            <tr>
                                <th class="tabla-nueva__th tabla-nueva__th--producto">Producto</th>
                                <th class="tabla-nueva__th tabla-nueva__th--marca">Marca</th>
                                <th class="tabla-nueva__th tabla-nueva__th--contenido">Contenido</th>
                                <th class="tabla-nueva__th tabla-nueva__th--variedad">Variedad</th>
                                <th class="tabla-nueva__th tabla-nueva__th--accion">Acción</th>
                            </tr>
                        </thead>
                        <tbody class="tabla-nueva__tbody">
                            ${this.generarFilas()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        this.contenedor.innerHTML = html;
        console.log('🎨 Tabla HTML renderizada con 5 columnas');
    }

    /**
     * Genera las filas de la tabla con 5 columnas
     */
    generarFilas() {
        return this.productos.map((producto, index) => `
            <tr class="tabla-nueva__fila" style="animation-delay: ${(index % 10) * 0.05}s">
                <td class="tabla-nueva__celda tabla-nueva__celda--producto">
                    <span class="producto-numero">#${producto.id}</span>
                    <div class="producto-info">
                        <span class="producto-nombre">${producto.nombre}</span>
                        <span class="producto-sku">SKU: ${producto.sku}</span>
                    </div>
                </td>
                <td class="tabla-nueva__celda tabla-nueva__celda--marca">
                    <span class="filtro-valor filtro-valor--marca">${producto.marca}</span>
                </td>
                <td class="tabla-nueva__celda tabla-nueva__celda--contenido">
                    <span class="filtro-valor filtro-valor--contenido">${producto.contenido}</span>
                </td>
                <td class="tabla-nueva__celda tabla-nueva__celda--variedad">
                    <span class="filtro-valor filtro-valor--variedad">${producto.variedad}</span>
                </td>
                <td class="tabla-nueva__celda tabla-nueva__celda--accion">
                    <button class="boton-agregar" onclick="agregarProducto(${producto.id}, '${producto.nombre}', '${producto.sku}')">
                        <span class="boton-agregar__icono">+</span>
                        <span class="boton-agregar__texto">Agregar</span>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    /**
     * Genera un SKU aleatorio realista
     */
    generarSKU() {
        const prefijos = ['CAM', 'PRD', 'ALM', 'MKT', 'SUP'];
        const prefijo = prefijos[Math.floor(Math.random() * prefijos.length)];
        const numero = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
        const sufijo = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
        return `${prefijo}${numero}${sufijo}`;
    }

    /**
     * Método principal para generar la tabla dinámicamente
     */
    generar() {
        console.log('🚀 Generando tabla de productos dinámicamente...');
        
        this.generarProductos();
        this.buscarContenedor();
        this.crearTabla();
        this.mostrarContenedor();
        
        console.log('✅ Tabla de productos generada exitosamente');
    }

    /**
     * Muestra el contenedor
     */
    mostrarContenedor() {
        // Mostrar contenedor de tabla
        if (this.contenedor) {
            this.contenedor.style.display = 'block';
        }
    }

    /**
     * Oculta el contenedor
     */
    ocultarContenedor() {
        // Ocultar contenedor de tabla
        if (this.contenedor) {
            this.contenedor.style.display = 'none';
        }
    }

    /**
     * Destruye la tabla y limpia el contenedor
     */
    destruir() {
        if (this.contenedor) {
            this.contenedor.innerHTML = '';
            this.ocultarContenedor();
        }
        this.productos = [];
        console.log('🗑️ Tabla destruida');
    }

    /**
     * Refresca la tabla (útil para futuras actualizaciones)
     */
    refrescar() {
        if (this.contenedor && this.productos.length > 0) {
            this.crearTabla();
            console.log('🔄 Tabla refrescada');
        }
    }
}

// ============================================================================
// FUNCIONES DE INTEGRACIÓN CON FILTROS
// ============================================================================

let tablaProductosInstance = null;

/**
 * Función para agregar producto (llamada por los botones)
 */
function agregarProducto(id, nombre, sku) {
    console.log(`🛒 Agregando producto: ${nombre} (ID: ${id}, SKU: ${sku})`);
    
    // Aquí se puede integrar con el sistema de carrito/comparación
    // Por ahora solo mostramos un feedback visual
    const button = event.target.closest('.boton-agregar');
    if (button) {
        // Feedback visual temporal
        const originalText = button.querySelector('.boton-agregar__texto').textContent;
        button.classList.add('boton-agregar--agregado');
        button.querySelector('.boton-agregar__texto').textContent = 'Agregado';
        button.querySelector('.boton-agregar__icono').textContent = '✓';
        
        // Restaurar después de 2 segundos
        setTimeout(() => {
            button.classList.remove('boton-agregar--agregado');
            button.querySelector('.boton-agregar__texto').textContent = originalText;
            button.querySelector('.boton-agregar__icono').textContent = '+';
        }, 2000);
    }
}

/**
 * Función principal para mostrar tabla cuando se selecciona tipo de producto
 */
function mostrarTablaProductos() {
    console.log('📋 Solicitud para mostrar tabla de productos');
    
    // Crear nueva instancia si no existe
    if (!tablaProductosInstance) {
        tablaProductosInstance = new TablaProductos();
    }

    // Generar la tabla
    tablaProductosInstance.generar();
}

/**
 * Función para ocultar tabla cuando no hay tipo seleccionado
 */
function ocultarTablaProductos() {
    console.log('🙈 Ocultando tabla de productos');
    
    if (tablaProductosInstance) {
        tablaProductosInstance.destruir();
        tablaProductosInstance = null;
    }
}

/**
 * Función para inicializar tabla (compatibilidad)
 */
function inicializarTablaProductos() {
    console.log('🔧 Inicializando sistema de tabla de productos...');
    return mostrarTablaProductos();
}

// ============================================================================
// LISTENER PARA TIPO DE PRODUCTO
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📡 Sistema de tabla dinámica configurado');
    
    // Listener para cambios en tipo de producto
    const tipoProductoInput = document.getElementById('tipo-de-producto');
    if (tipoProductoInput) {
        tipoProductoInput.addEventListener('change', (event) => {
            const valor = event.target.value;
            console.log(`🎯 Cambio en tipo de producto detectado: "${valor}"`);
            
            if (valor && valor !== '') {
                // Mostrar tabla con un pequeño delay para suavizar la transición
                setTimeout(() => {
                    mostrarTablaProductos();
                }, 300);
            } else {
                // Ocultar tabla
                ocultarTablaProductos();
            }
        });
        
        console.log('✅ Listener de tipo de producto configurado');
    } else {
        console.warn('⚠️ Input tipo-de-producto no encontrado');
    }
});

// ============================================================================
// EXPORTACIÓN GLOBAL
// ============================================================================

window.TablaProductos = TablaProductos;
window.mostrarTablaProductos = mostrarTablaProductos;
window.ocultarTablaProductos = ocultarTablaProductos;
window.inicializarTablaProductos = inicializarTablaProductos;
window.agregarProducto = agregarProducto;

console.log('📜 Sistema de tabla dinámica cargado - Esperando selección de tipo de producto');