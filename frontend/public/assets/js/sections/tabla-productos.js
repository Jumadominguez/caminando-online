/**
 * TABLA-PRODUCTOS.JS - Sistema independiente de tabla de productos
 * Funcionalidades: Generación dinámica, ordenamiento, scroll limitado, botones agregar
 */

class TablaProductos {
    constructor() {
        this.productos = [];
        this.productosFiltrados = [];
        this.ordenamiento = {
            columna: null,
            direccion: 'asc'
        };
        this.productosVisibles = 6;
        this.init();
    }

    /**
     * Inicializa la tabla de productos
     */
    init() {
        this.generarProductosMock();
        this.crearEstructuraHTML();
        this.configurarEventListeners();
        this.mostrarProductos();
    }

    /**
     * Genera 40 productos mock con datos realistas
     */
    generarProductosMock() {
        const nombresProductos = [
            'Aceite de Girasol', 'Arroz Largo Fino', 'Azúcar Común', 'Fideos Mostacholes',
            'Leche Entera', 'Pan Lactal', 'Manteca', 'Queso Cremoso', 'Jamón Cocido',
            'Pollo Entero', 'Carne Picada Común', 'Tomate Perita', 'Papa Blanca',
            'Cebolla Amarilla', 'Zanahoria', 'Lechuga Capuchina', 'Banana', 'Manzana Roja',
            'Naranja', 'Yogur Natural', 'Huevos Blancos', 'Atún en Aceite', 'Mermelada Durazno',
            'Café Molido', 'Té en Saquitos', 'Galletitas Dulces', 'Cereales Corn Flakes',
            'Shampoo Anticaspa', 'Jabón en Pan', 'Papel Higiénico', 'Detergente Líquido',
            'Lavandina', 'Desodorante Spray', 'Pasta Dental', 'Agua Mineral', 'Gaseosa Cola',
            'Vino Tinto', 'Cerveza Rubia', 'Helado Vainilla', 'Pizza Muzzarella'
        ];

        const marcas = [
            'La Campagnola', 'Molinos', 'Ledesma', 'Marolio', 'Sancor', 'Bimbo',
            'La Serenísima', 'Swift', 'Granja del Sol', 'Coto', 'Carrefour', 'Día',
            'Arcor', 'Nescafé', 'La Virginia', 'Bagley', 'Kelloggs', 'Head & Shoulders',
            'Dove', 'Scott', 'Ariel', 'Ayudín', 'Rexona', 'Colgate', 'Villavicencio',
            'Coca Cola', 'López', 'Quilmes', 'Fredddo', 'Siempre Listo'
        ];

        const contenidos = [
            '500ml', '1L', '1.5L', '2L', '500g', '1kg', '400g', '350g', '250g',
            '200g', '150g', '100g', '12 unidades', '6 unidades', '4 unidades',
            '1 unidad', '500cc', '750cc', '1000cc', '300g'
        ];

        const variedades = [
            'Clásico', 'Light', 'Sin TACC', 'Descremado', 'Integral', 'Diet',
            'Extra Virgen', 'Común', 'Premium', 'Orgánico', 'Natural', 'Con Sal',
            'Sin Sal', 'Dulce', 'Salado', 'Suave', 'Fuerte', 'Tradicional',
            'Familiar', 'Individual'
        ];

        const disponibilidades = ['Disponible', 'Agotado', 'Stock Limitado'];

        this.productos = [];
        
        for (let i = 0; i < 40; i++) {
            this.productos.push({
                id: i + 1,
                nombre: nombresProductos[i],
                marca: marcas[Math.floor(Math.random() * marcas.length)],
                contenido: contenidos[Math.floor(Math.random() * contenidos.length)],
                variedad: variedades[Math.floor(Math.random() * variedades.length)],
                disponibilidad: disponibilidades[Math.floor(Math.random() * disponibilidades.length)],
                precio: (Math.random() * 5000 + 100).toFixed(2)
            });
        }
        
        this.productosFiltrados = [...this.productos];
    }

    /**
     * Crea la estructura HTML de la tabla
     */
    crearEstructuraHTML() {
        const container = document.createElement('section');
        container.className = 'tabla-productos';
        container.id = 'tablaProductos';
        
        container.innerHTML = `
            <div class="tabla-productos__container">
                <div class="tabla-productos__header">
                    <h3 class="tabla-productos__titulo">Productos Disponibles</h3>
                    <div class="tabla-productos__contador" id="contadorProductos">
                        Mostrando ${Math.min(this.productosVisibles, this.productos.length)} de ${this.productos.length} productos
                    </div>
                </div>
                <div class="tabla-productos__scroll" id="tablaScroll">
                    <table class="tabla-productos__table">
                        <thead class="tabla-productos__thead">
                            <tr>
                                <th class="tabla-productos__th" data-sort="nombre">
                                    Nombre del Producto
                                </th>
                                <th class="tabla-productos__th" data-sort="marca">
                                    Marca
                                </th>
                                <th class="tabla-productos__th" data-sort="contenido">
                                    Contenido
                                </th>
                                <th class="tabla-productos__th" data-sort="variedad">
                                    Variedad
                                </th>
                                <th class="tabla-productos__th" data-sort="disponibilidad">
                                    Disponibilidad
                                </th>
                                <th class="tabla-productos__th">
                                    Acción
                                </th>
                            </tr>
                        </thead>
                        <tbody class="tabla-productos__tbody" id="tablaProductosBody">
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Agregar al DOM (buscar un contenedor existente o agregarlo al body)
        const targetContainer = document.getElementById('contenedor-tabla-productos') || document.body;
        targetContainer.appendChild(container);
    }

    /**
     * Configura todos los event listeners
     */
    configurarEventListeners() {
        // Event listeners para ordenamiento
        const headers = document.querySelectorAll('.tabla-productos__th[data-sort]');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const columna = header.dataset.sort;
                this.ordenarPor(columna);
            });
        });

        // Event listener para scroll infinito (mostrar más productos)
        const scrollContainer = document.getElementById('tablaScroll');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', () => {
                if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 10) {
                    this.cargarMasProductos();
                }
            });
        }
    }

    /**
     * Ordena los productos por la columna especificada
     */
    ordenarPor(columna) {
        // Cambiar dirección si es la misma columna
        if (this.ordenamiento.columna === columna) {
            this.ordenamiento.direccion = this.ordenamiento.direccion === 'asc' ? 'desc' : 'asc';
        } else {
            this.ordenamiento.columna = columna;
            this.ordenamiento.direccion = 'asc';
        }

        // Ordenar productos
        this.productosFiltrados.sort((a, b) => {
            let valorA = a[columna];
            let valorB = b[columna];

            // Manejo especial para números en contenido
            if (columna === 'contenido') {
                valorA = this.extraerNumero(valorA);
                valorB = this.extraerNumero(valorB);
            }

            // Comparación
            if (valorA < valorB) return this.ordenamiento.direccion === 'asc' ? -1 : 1;
            if (valorA > valorB) return this.ordenamiento.direccion === 'asc' ? 1 : -1;
            return 0;
        });

        // Actualizar indicadores visuales
        this.actualizarIndicadoresOrden();
        
        // Resetear productos visibles y volver a mostrar
        this.productosVisibles = 6;
        this.mostrarProductos();
    }

    /**
     * Extrae el número de una cadena para ordenamiento numérico
     */
    extraerNumero(str) {
        const numero = parseFloat(str.match(/[\d.]+/));
        return isNaN(numero) ? 0 : numero;
    }

    /**
     * Actualiza los indicadores visuales de ordenamiento
     */
    actualizarIndicadoresOrden() {
        // Limpiar todas las clases de ordenamiento
        document.querySelectorAll('.tabla-productos__th').forEach(th => {
            th.classList.remove('tabla-productos__th--asc', 'tabla-productos__th--desc');
        });

        // Agregar clase a la columna activa
        if (this.ordenamiento.columna) {
            const headerActivo = document.querySelector(`[data-sort="${this.ordenamiento.columna}"]`);
            if (headerActivo) {
                headerActivo.classList.add(`tabla-productos__th--${this.ordenamiento.direccion}`);
            }
        }
    }

    /**
     * Muestra los productos en la tabla
     */
    mostrarProductos() {
        const tbody = document.getElementById('tablaProductosBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        // Mostrar solo los primeros productos según el límite
        const productosAMostrar = this.productosFiltrados.slice(0, this.productosVisibles);

        productosAMostrar.forEach((producto, index) => {
            const fila = this.crearFilaProducto(producto, index);
            tbody.appendChild(fila);
        });

        this.actualizarContador();
    }

    /**
     * Crea una fila de producto
     */
    crearFilaProducto(producto, index) {
        const tr = document.createElement('tr');
        tr.className = 'tabla-productos__tr';
        tr.style.animationDelay = `${(index % 6) * 0.05}s`;

        const disponibilidadClass = this.getDisponibilidadClass(producto.disponibilidad);
        const btnDisabled = producto.disponibilidad === 'Agotado' ? 'disabled' : '';

        tr.innerHTML = `
            <td class="tabla-productos__td tabla-productos__nombre">
                ${producto.nombre}
            </td>
            <td class="tabla-productos__td tabla-productos__marca">
                ${producto.marca}
            </td>
            <td class="tabla-productos__td tabla-productos__contenido">
                ${producto.contenido}
            </td>
            <td class="tabla-productos__td tabla-productos__variedad">
                ${producto.variedad}
            </td>
            <td class="tabla-productos__td tabla-productos__disponibilidad">
                <span class="disponibilidad-badge ${disponibilidadClass}">
                    ${producto.disponibilidad}
                </span>
            </td>
            <td class="tabla-productos__td">
                <button class="tabla-productos__btn-agregar" 
                        data-producto-id="${producto.id}" 
                        ${btnDisabled}>
                    + Agregar
                </button>
            </td>
        `;

        // Agregar event listener al botón
        const btnAgregar = tr.querySelector('.tabla-productos__btn-agregar');
        if (btnAgregar) {
            btnAgregar.addEventListener('click', (e) => {
                this.agregarProducto(producto, e.target);
            });
        }

        return tr;
    }

    /**
     * Obtiene la clase CSS según la disponibilidad
     */
    getDisponibilidadClass(disponibilidad) {
        switch (disponibilidad) {
            case 'Disponible':
                return 'disponibilidad-badge--disponible';
            case 'Agotado':
                return 'disponibilidad-badge--agotado';
            case 'Stock Limitado':
                return 'disponibilidad-badge--limitado';
            default:
                return 'disponibilidad-badge--disponible';
        }
    }

    /**
     * Maneja la acción de agregar producto
     */
    agregarProducto(producto, boton) {
        if (producto.disponibilidad === 'Agotado') return;

        // Feedback visual
        boton.style.transform = 'scale(0.95)';
        boton.textContent = 'Agregado ✓';
        boton.style.background = 'linear-gradient(135deg, #28a745, #20c997)';

        // Restaurar después de 1.5 segundos
        setTimeout(() => {
            boton.textContent = '+ Agregar';
            boton.style.background = '';
            boton.style.transform = '';
        }, 1500);

        // Aquí se podría integrar con el sistema de carrito
        console.log('Producto agregado:', producto);

        // Emitir evento personalizado para integración
        const evento = new CustomEvent('productoAgregado', {
            detail: { producto }
        });
        document.dispatchEvent(evento);
    }

    /**
     * Carga más productos cuando se hace scroll
     */
    cargarMasProductos() {
        const productosRestantes = this.productosFiltrados.length - this.productosVisibles;
        if (productosRestantes > 0) {
            this.productosVisibles += 6;
            this.mostrarProductos();
        }
    }

    /**
     * Actualiza el contador de productos
     */
    actualizarContador() {
        const contador = document.getElementById('contadorProductos');
        if (contador) {
            const productosShown = Math.min(this.productosVisibles, this.productosFiltrados.length);
            contador.textContent = `Mostrando ${productosShown} de ${this.productosFiltrados.length} productos`;
        }
    }

    /**
     * Filtra productos por disponibilidad (método público para integración)
     */
    filtrarPorDisponibilidad(filtro) {
        switch (filtro) {
            case 'disponible':
                this.productosFiltrados = this.productos.filter(p => p.disponibilidad === 'Disponible');
                break;
            case 'agotado':
                this.productosFiltrados = this.productos.filter(p => p.disponibilidad === 'Agotado');
                break;
            case 'limitado':
                this.productosFiltrados = this.productos.filter(p => p.disponibilidad === 'Stock Limitado');
                break;
            default:
                this.productosFiltrados = [...this.productos];
        }
        
        this.productosVisibles = 6;
        this.mostrarProductos();
    }

    /**
     * Aplica filtros múltiples a la tabla
     */
    aplicarFiltros(filtros) {
        console.log('🔍 Aplicando filtros a tabla:', filtros);

        if (!filtros) {
            this.productosFiltrados = [...this.productos];
            this.productosVisibles = 6;
            this.mostrarProductos();
            return;
        }

        this.productosFiltrados = this.productos.filter(producto => {
            // Filtro por marca (solo si está definido y no es 'todos')
            if (filtros.marca && filtros.marca !== 'todos' && filtros.marca !== null) {
                if (producto.marca.toLowerCase() !== filtros.marca.toLowerCase()) {
                    return false;
                }
            }

            // Filtro por contenido (solo si está definido y no es 'todos')
            if (filtros.contenido && filtros.contenido !== 'todos' && filtros.contenido !== null) {
                if (producto.contenido.toLowerCase() !== filtros.contenido.toLowerCase()) {
                    return false;
                }
            }

            // Filtro por variedad (solo si está definido y no es 'todos')
            if (filtros.variedad && filtros.variedad !== 'todos' && filtros.variedad !== null) {
                if (producto.variedad.toLowerCase() !== filtros.variedad.toLowerCase()) {
                    return false;
                }
            }

            // Filtro por subcategoría (búsqueda parcial en nombre del producto)
            if (filtros.subcategoria && filtros.subcategoria !== null) {
                const subcategoriaNormalizada = this.normalizarTexto(filtros.subcategoria);
                const nombreNormalizado = this.normalizarTexto(producto.nombre);
                const marcaNormalizada = this.normalizarTexto(producto.marca);
                const variedadNormalizada = this.normalizarTexto(producto.variedad);
                
                // Buscar en nombre, marca o variedad
                if (!nombreNormalizado.includes(subcategoriaNormalizada) && 
                    !marcaNormalizada.includes(subcategoriaNormalizada) && 
                    !variedadNormalizada.includes(subcategoriaNormalizada)) {
                    return false;
                }
            }

            return true;
        });

        this.productosVisibles = 6;
        this.mostrarProductos();

        console.log(`✅ Filtros aplicados: ${this.productosFiltrados.length} de ${this.productos.length} productos`);
        console.log('Productos filtrados:', this.productosFiltrados.map(p => p.nombre));
    }

    /**
     * Normaliza texto para comparaciones
     */
    normalizarTexto(texto) {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    /**
     * Busca productos por texto (método público para integración)
     */
    buscarProductos(texto) {
        if (!texto || texto.trim() === '') {
            this.productosFiltrados = [...this.productos];
        } else {
            const textoBusqueda = texto.toLowerCase().trim();
            this.productosFiltrados = this.productos.filter(producto => 
                producto.nombre.toLowerCase().includes(textoBusqueda) ||
                producto.marca.toLowerCase().includes(textoBusqueda) ||
                producto.variedad.toLowerCase().includes(textoBusqueda)
            );
        }
        
        this.productosVisibles = 6;
        this.mostrarProductos();
    }

    /**
     * Destruye la instancia y limpia eventos
     */
    destruir() {
        const tabla = document.getElementById('tablaProductos');
        if (tabla) {
            tabla.remove();
        }
    }
}

// Variable global para acceso externo
let tablaProductosInstance = null;

/**
 * Función para inicializar la tabla (llamar desde filtros)
 */
function inicializarTablaProductos() {
    if (tablaProductosInstance) {
        tablaProductosInstance.destruir();
    }
    
    tablaProductosInstance = new TablaProductos();
    return tablaProductosInstance;
}

/**
 * Función para mostrar la tabla cuando se selecciona un tipo de producto
 */
function mostrarTablaProductos() {
    // Mostrar el contenedor si estaba oculto
    const tabla = document.getElementById('tablaProductos');
    if (tabla) {
        tabla.style.display = 'block';
        // Animar entrada
        tabla.style.opacity = '0';
        tabla.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            tabla.style.transition = 'all 0.5s ease';
            tabla.style.opacity = '1';
            tabla.style.transform = 'translateY(0)';
        });
    }
}

/**
 * Función para ocultar la tabla
 */
function ocultarTablaProductos() {
    const tabla = document.getElementById('tablaProductos');
    if (tabla) {
        tabla.style.transition = 'all 0.3s ease';
        tabla.style.opacity = '0';
        tabla.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            tabla.style.display = 'none';
        }, 300);
    }
}

// Inicialización automática cuando se carga el script
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si existe un contenedor específico
    if (document.getElementById('contenedor-tabla-productos')) {
        // No auto-inicializar, dejar que los filtros la manejen
        console.log('✅ tabla-productos.js cargado - Esperando inicialización desde filtros');
    }
});

// Exportar para uso externo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TablaProductos, inicializarTablaProductos, mostrarTablaProductos, ocultarTablaProductos };
}
