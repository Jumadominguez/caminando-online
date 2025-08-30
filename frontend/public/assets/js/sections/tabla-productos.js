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
     * Genera exactamente 40 productos con nombres realistas
     */
    generarProductos() {
        const nombres = [
            'Leche Entera La Serenísima 1L',
            'Yogur Natural Ilolay 180g',
            'Queso Cremoso Sancor 200g',
            'Manteca Tregar 200g',
            'Dulce de Leche Colonial 400g',
            'Gaseosa Coca-Cola 2L',
            'Agua Mineral Villavicencio 1.5L',
            'Jugo Naranja Cepita 1L',
            'Cerveza Quilmes 473ml',
            'Vino Tinto Alamos 750ml',
            'Pollo Entero Granja del Sol x Kg',
            'Carne Molida Swift x Kg',
            'Milanesas de Pollo x Kg',
            'Jamón Cocido Feteado 200g',
            'Salchichas Frankfurt x6',
            'Pan Lactal Bimbo 500g',
            'Galletitas Oreo 300g',
            'Bizcochos de Grasa x12',
            'Facturas Surtidas x6',
            'Tostadas Criollitas 200g',
            'Tomate Redondo x Kg',
            'Lechuga Criolla x Unidad',
            'Papa Blanca x Kg',
            'Cebolla Amarilla x Kg',
            'Manzana Roja x Kg',
            'Detergente Magistral 750ml',
            'Lavandina Ayudín 1L',
            'Jabón Polvo Skip 800g',
            'Suavizante Comfort 900ml',
            'Limpiador CIF 500ml',
            'Shampoo Pantene 400ml',
            'Jabón Líquido Dove 250ml',
            'Pasta Dental Colgate 90g',
            'Desodorante Rexona 150ml',
            'Crema Nivea 200ml',
            'Pizza Muzzarella McCain 350g',
            'Helado Frigor 1L',
            'Papas Fritas McCain 1Kg',
            'Empanadas de Carne x12',
            'Tarta de Verdura 500g'
        ];

        this.productos = [];
        for (let i = 0; i < 40; i++) {
            this.productos.push({
                id: i + 1,
                nombre: nombres[i]
            });
        }

        console.log(`📦 Generados ${this.productos.length} productos para la tabla`);
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
     * Crea la estructura HTML de la tabla
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
                                <th class="tabla-nueva__th">Nombre del Producto</th>
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
        console.log('🎨 Tabla HTML renderizada');
    }

    /**
     * Genera las filas de la tabla
     */
    generarFilas() {
        return this.productos.map((producto, index) => `
            <tr class="tabla-nueva__fila" style="animation-delay: ${(index % 10) * 0.05}s">
                <td class="tabla-nueva__celda">
                    <span class="producto-numero">#${producto.id}</span>
                    <span class="producto-nombre">${producto.nombre}</span>
                </td>
            </tr>
        `).join('');
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

console.log('📜 Sistema de tabla dinámica cargado - Esperando selección de tipo de producto');