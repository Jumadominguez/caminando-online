/**
 * ============================================================================
 * TABLA DE PRODUCTOS - SINCRONIZADA CON FILTROS
 * ============================================================================
 * ✅ PRODUCTOS GENERADOS USANDO LAS MISMAS OPCIONES DE LOS FILTROS
 * - Los productos de la tabla usan exactamente las mismas marcas/contenidos/variedades que aparecen en los filtros
 * - Generación dinámica basada en tipo de producto seleccionado
 * - Integración completa con sistema de filtros
 */

class TablaProductos {
    constructor() {
        this.productos = [];
        this.productosFiltrados = [];
        this.contenedor = null;
        this.tipoProductoActual = null;
        this.filtrosActivos = {
            marca: '',
            contenido: '',
            variedad: ''
        };
        
        // Configurar listeners para integración
        this.configurarIntegracion();
    }

    /**
     * ✅ CONFIGURACIÓN DE INTEGRACIÓN CON SISTEMA PRINCIPAL
     */
    configurarIntegracion() {
        // Listener para evento de limpieza global
        document.addEventListener('filtrosLimpiados', () => {
            console.log("📋 Tabla recibió evento de limpieza global");
            this.manejarLimpiezaGlobal();
        });
        
        // Listener para evento de reseteo (compatibilidad)
        document.addEventListener('resetearFiltros', () => {
            console.log("📋 Tabla recibió evento de reseteo");
            this.manejarLimpiezaGlobal();
        });
    }

    /**
     * ✅ MANEJA LIMPIEZA DESDE EL BOTÓN PRINCIPAL
     */
    manejarLimpiezaGlobal() {
        console.log("🧹 Ejecutando limpieza en tabla de productos...");
        
        // Resetear filtros internos
        this.filtrosActivos = {
            marca: '',
            contenido: '',
            variedad: ''
        };
        
        this.tipoProductoActual = null;
        
        // Si existe la tabla, destruirla completamente
        if (this.contenedor && this.productos.length > 0) {
            this.destruir();
        }
        
        console.log("✅ Tabla limpiada por evento global");
    }

    /**
     * ✅ OBTENER DATOS DE FILTROS DEL SISTEMA PRINCIPAL
     */
    obtenerDatosFiltros() {
        // Intentar obtener datos desde el FiltrosManager global
        if (window.FiltrosManager && typeof window.FiltrosManager.obtenerDatos === 'function') {
            return window.FiltrosManager.obtenerDatos();
        }
        
        // Fallback: usar datos locales (mismos que filtros-manager-v2.js)
        return {
            marcas: {
                lacteos: ["La Serenísima", "Ilolay", "Sancor", "Milkaut", "Tregar"],
                bebidas: ["Coca-Cola", "Pepsi", "Sprite", "Fanta", "Quilmes"],
                carnes: ["Swift", "Quickfood", "Paty", "Campo Austral"],
                panaderia: ["Bimbo", "Lactal", "Fargo", "Bagley"],
                frutas_verduras: ["Sin marca", "Orgánico", "Campo Fresco"],
                congelados: ["McCain", "Granja del Sol", "La Paulina"],
                almacen: ["Molinos", "Natura", "Arcor", "Mastellone"],
                limpieza: ["Ala", "Skip", "Magistral", "Ayudín"],
                higiene: ["Head & Shoulders", "Pantene", "Rexona", "Dove"],
                mascotas: ["Pedigree", "Whiskas", "Pro Plan", "Royal Canin"]
            },
            contenidos: {
                lacteos: ["1L", "500ml", "200ml", "1kg", "500g"],
                bebidas: ["500ml", "1L", "1.5L", "2L", "355ml"],
                carnes: ["1kg", "500g", "250g"],
                panaderia: ["500g", "750g", "400g"],
                frutas_verduras: ["1kg", "500g", "1u", "3u"],
                congelados: ["500g", "1kg", "300g"],
                almacen: ["1kg", "500g", "1u"],
                limpieza: ["500ml", "750ml", "1L", "3kg"],
                higiene: ["400ml", "750ml", "200ml"],
                mascotas: ["1kg", "3kg", "7.5kg", "15kg"]
            },
            variedades: {
                lacteos: ["Entera", "Descremada", "Sin lactosa"],
                bebidas: ["Original", "Zero", "Light"],
                carnes: ["Fresco", "Congelado", "Premium"],
                panaderia: ["Integral", "Blanco", "Sin sal"],
                frutas_verduras: ["Fresco", "Orgánico", "Primera"],
                congelados: ["Clásico", "Premium", "Familiar"],
                almacen: ["Común", "Premium", "Orgánico"],
                limpieza: ["Clásico", "Concentrado", "Aromático"],
                higiene: ["Normal", "Graso", "Seco"],
                mascotas: ["Adulto", "Cachorro", "Senior"]
            }
        };
    }

    /**
     * ✅ OBTENER NOMBRES DE PRODUCTOS POR TIPO
     */
    obtenerNombresProductos(tipo) {
        const nombresBase = {
            lacteos: [
                "Leche Entera", "Leche Descremada", "Yogur Natural", "Yogur con Frutas", 
                "Queso Cremoso", "Queso Port Salut", "Manteca", "Dulce de Leche",
                "Crema de Leche", "Ricota", "Queso Rallado", "Leche en Polvo",
                "Yogur Griego", "Queso Provoleta", "Casancrem", "Leche Chocolatada",
                "Queso Fresco", "Manteca Light", "Dulce de Leche Light", "Crema Chantilly"
            ],
            bebidas: [
                "Gaseosa Cola", "Agua Mineral", "Jugo de Naranja", "Cerveza Rubia",
                "Vino Tinto", "Jugo de Manzana", "Agua Saborizada", "Gaseosa Lima-Limón",
                "Cerveza Negra", "Vino Blanco", "Jugo Multifrutas", "Energizante",
                "Agua Tónica", "Gaseosa Pomelo", "Jugo de Uva", "Cerveza Sin Alcohol",
                "Sidra", "Jugo de Tomate", "Agua con Gas", "Bebida Isotónica"
            ],
            carnes: [
                "Pollo Entero", "Carne Molida", "Milanesas de Pollo", "Jamón Cocido",
                "Salchichas", "Chorizo Colorado", "Asado de Tira", "Nalga",
                "Pollo Trozado", "Jamón Crudo", "Mortadela", "Bondiola",
                "Matambre", "Vacío", "Entraña", "Pollo Deshuesado",
                "Salame", "Panceta", "Costillas de Cerdo", "Pechuga de Pollo"
            ],
            panaderia: [
                "Pan Lactal", "Pan Francés", "Galletitas Dulces", "Tostadas",
                "Bizcochos de Grasa", "Medialunas", "Pan Integral", "Galletitas Saladas",
                "Pan de Molde", "Criollitos", "Pan Rallado", "Grisines",
                "Facturas Surtidas", "Pan Negro", "Galletitas Crackers", "Pan Árabe",
                "Budín Inglés", "Pan Lacteado", "Galletitas de Agua", "Pebetes"
            ],
            frutas_verduras: [
                "Tomate", "Lechuga", "Papa", "Cebolla", "Manzana",
                "Banana", "Zanahoria", "Acelga", "Naranja", "Limón",
                "Apio", "Zapallito", "Pimiento", "Brócoli", "Pera",
                "Durazno", "Espinaca", "Remolacha", "Choclo", "Mandarina"
            ],
            congelados: [
                "Pizza Muzzarella", "Helado de Vainilla", "Papas Fritas", "Empanadas de Carne",
                "Hamburguesas", "Milanesas Napolitanas", "Helado de Chocolate", "Vegetales Mixtos",
                "Pescado Rebozado", "Pizza Especial", "Helado de Frutilla", "Sorrentinos",
                "Ravioles", "Tarta de Verdura", "Suprema de Pollo", "Pizza Fugazzeta",
                "Helado de Dulce de Leche", "Empanadas de Pollo", "Croquetas", "Ñoquis"
            ],
            almacen: [
                "Arroz", "Fideos", "Harina", "Aceite", "Azúcar",
                "Sal", "Vinagre", "Mermelada", "Café", "Té",
                "Yerba Mate", "Lentejas", "Garbanzos", "Porotos", "Avena",
                "Polenta", "Sémola", "Cacao", "Miel", "Aceitunas"
            ],
            limpieza: [
                "Detergente", "Lavandina", "Jabón en Polvo", "Suavizante", "Desinfectante",
                "Limpiador Multiuso", "Papel Higiénico", "Servilletas", "Rollos de Cocina", "Esponjas",
                "Guantes", "Bolsas de Basura", "Limpia Vidrios", "Cera para Pisos", "Alcohol en Gel",
                "Jabón Líquido para Ropa", "Quitamanchas", "Limpiapisos", "Trapos de Piso", "Escoba"
            ],
            higiene: [
                "Shampoo", "Acondicionador", "Jabón Líquido", "Desodorante", "Crema Corporal",
                "Pasta Dental", "Cepillo de Dientes", "Protector Solar", "Maquillaje", "Perfume",
                "Afeitadora", "Gel de Afeitar", "Crema de Manos", "Loción Corporal", "Talco",
                "Hilo Dental", "Enjuague Bucal", "Crema Facial", "Desmaquillante", "Algodón"
            ],
            mascotas: [
                "Alimento para Perros", "Alimento para Gatos", "Arena para Gatos", "Snacks para Perros",
                "Juguetes para Perros", "Correa", "Collar", "Shampoo para Mascotas",
                "Huesos para Perros", "Pelota para Perros", "Comedero", "Bebedero",
                "Alimento para Cachorros", "Alimento para Gatos Senior", "Arena Sanitaria", "Pipeta Antipulgas",
                "Vitaminas para Mascotas", "Transportadora", "Cama para Mascotas", "Rascador para Gatos"
            ]
        };

        return nombresBase[tipo] || [];
    }

    /**
     * ✅ GENERAR PRODUCTOS DINÁMICOS BASADOS EN TIPO SELECCIONADO
     */
    generarProductosPorTipo(tipoProducto) {
        console.log(`📦 Generando productos para tipo: ${tipoProducto}`);
        
        this.tipoProductoActual = tipoProducto;
        const datos = this.obtenerDatosFiltros();
        
        // Obtener opciones disponibles para este tipo
        const marcasDisponibles = datos.marcas[tipoProducto] || [];
        const contenidosDisponibles = datos.contenidos[tipoProducto] || [];
        const variedadesDisponibles = datos.variedades[tipoProducto] || [];
        const nombresDisponibles = this.obtenerNombresProductos(tipoProducto);
        
        console.log(`📋 Opciones disponibles para ${tipoProducto}:`, {
            marcas: marcasDisponibles.length,
            contenidos: contenidosDisponibles.length,
            variedades: variedadesDisponibles.length,
            nombres: nombresDisponibles.length
        });

        // Generar 40 productos combinando aleatoriamente las opciones reales
        this.productos = [];
        for (let i = 0; i < 40; i++) {
            // Seleccionar aleatoriamente de las opciones reales de los filtros
            const nombre = this.seleccionarAleatorio(nombresDisponibles);
            const marca = this.seleccionarAleatorio(marcasDisponibles);
            const contenido = this.seleccionarAleatorio(contenidosDisponibles);
            const variedad = this.seleccionarAleatorio(variedadesDisponibles);

            this.productos.push({
                id: i + 1,
                nombre: nombre,
                marca: marca,
                contenido: contenido,
                variedad: variedad,
                sku: this.generarSKU(),
                tipo: tipoProducto
            });
        }

        console.log(`✅ Generados ${this.productos.length} productos usando opciones reales de filtros`);
        
        // Inicialmente mostrar todos los productos (sin filtros)
        this.productosFiltrados = [...this.productos];
    }

    /**
     * Selecciona un elemento aleatorio de un array
     */
    seleccionarAleatorio(array) {
        if (!array || array.length === 0) return 'N/A';
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Busca o crea el contenedor para la tabla
     */
    buscarContenedor() {
        this.contenedor = document.getElementById('contenedor-tabla-productos');
        
        if (this.contenedor) {
            console.log('📍 Contenedor encontrado');
            this.contenedor.innerHTML = '';
            this.contenedor.style.display = 'block';
        } else {
            this.contenedor = document.createElement('div');
            this.contenedor.id = 'contenedor-tabla-productos';
            this.contenedor.className = 'contenedor-tabla-productos';
            
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
        const productosAMostrar = this.productosFiltrados.length > 0 ? this.productosFiltrados : this.productos;
        const cantidadMostrada = productosAMostrar.length;

        const html = `
            <div class="tabla-nueva">
                <div class="tabla-nueva__header">
                    <div class="tabla-nueva__contador">${cantidadMostrada}</div>
                    <h3 class="tabla-nueva__titulo">Productos Disponibles - ${this.tipoProductoActual}</h3>
                    <button class="tabla-nueva__limpiar" onclick="limpiarFiltrosTabla()" title="Limpiar filtros de tabla">
                        <i class="fas fa-broom"></i>
                        <span>Limpiar</span>
                    </button>
                </div>
                <div class="tabla-nueva__contenido">
                    <table class="tabla-nueva__table">
                        <thead class="tabla-nueva__thead">
                            <tr>
                                <th class="tabla-nueva__th tabla-nueva__th--producto">Producto</th>
                                <th class="tabla-nueva__th tabla-nueva__th--marca">Marca</th>
                                <th class="tabla-nueva__th tabla-nueva__th--contenido">Contenido</th>
                                <th class="tabla-nueva__th tabla-nueva__th--variedad">Variedad</th>
                                <th class="tabla-nueva__th tabla-nueva__th--accion"></th>
                            </tr>
                        </thead>
                        <tbody class="tabla-nueva__tbody">
                            ${this.generarFilas(productosAMostrar)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        this.contenedor.innerHTML = html;
        console.log(`🎨 Tabla HTML renderizada con ${cantidadMostrada} productos`);
    }

    /**
     * Genera las filas de la tabla
     */
    generarFilas(productos) {
        return productos.map((producto, index) => `
            <tr class="tabla-nueva__fila" style="animation-delay: ${(index % 10) * 0.05}s">
                <td class="tabla-nueva__celda tabla-nueva__celda--producto">
                    <div class="producto-info">
                        <div class="producto-numero">#${producto.id}</div>
                        <div class="producto-content">
                            <span class="producto-nombre">${producto.nombre}</span>
                            <span class="producto-sku">SKU: ${producto.sku}</span>
                        </div>
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
                    <button class="boton-agregar" onclick="agregarProductoDesdeTabla(${producto.id}, '${producto.nombre.replace(/'/g, "\\'")}', '${producto.sku}')">
                        <span class="boton-agregar__icono">+</span>
                        <span class="boton-agregar__texto">Agregar</span>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    /**
     * ✅ APLICA FILTROS USANDO COINCIDENCIA EXACTA
     */
    aplicarFiltros() {
        // Leer valores actuales de los filtros
        this.filtrosActivos.marca = document.getElementById('marca')?.value || '';
        this.filtrosActivos.contenido = document.getElementById('contenido')?.value || '';
        this.filtrosActivos.variedad = document.getElementById('variedad')?.value || '';
        
        console.log('🔍 Aplicando filtros:', this.filtrosActivos);
        
        // Filtrar productos usando coincidencia exacta
        this.productosFiltrados = this.productos.filter(producto => {
            const cumpleMarca = !this.filtrosActivos.marca || 
                               this.filtrosActivos.marca === '' ||
                               producto.marca === this.filtrosActivos.marca;
            
            const cumpleContenido = !this.filtrosActivos.contenido || 
                                   this.filtrosActivos.contenido === '' ||
                                   producto.contenido === this.filtrosActivos.contenido;
            
            const cumpleVariedad = !this.filtrosActivos.variedad || 
                                  this.filtrosActivos.variedad === '' ||
                                  producto.variedad === this.filtrosActivos.variedad;
            
            return cumpleMarca && cumpleContenido && cumpleVariedad;
        });
        
        console.log(`📊 Productos filtrados: ${this.productosFiltrados.length} de ${this.productos.length}`);
        
        // Actualizar tabla
        this.crearTabla();
        
        // Emitir evento para mantener estados de botones
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('tablaRegenerada'));
        }, 100);
    }

    generarSKU() {
        const prefijos = ['CAM', 'PRD', 'ALM', 'MKT', 'SUP'];
        const prefijo = prefijos[Math.floor(Math.random() * prefijos.length)];
        const numero = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
        const sufijo = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
        return `${prefijo}${numero}${sufijo}`;
    }

    /**
     * ✅ MÉTODO PRINCIPAL MEJORADO - RECIBE TIPO DE PRODUCTO
     */
    generar(tipoProducto) {
        console.log(`🚀 Generando tabla de productos para tipo: ${tipoProducto}`);
        
        this.generarProductosPorTipo(tipoProducto);
        this.buscarContenedor();
        this.crearTabla();
        this.mostrarContenedor();
        
        console.log('✅ Tabla de productos generada exitosamente');
    }

    mostrarContenedor() {
        if (this.contenedor) {
            this.contenedor.style.display = 'block';
        }
    }

    ocultarContenedor() {
        if (this.contenedor) {
            this.contenedor.style.display = 'none';
        }
    }

    /**
     * ✅ DESTRUYE COMPLETAMENTE LA TABLA Y LIMPIA TODO
     */
    destruir() {
        console.log("🗑️ Destruyendo tabla de productos...");
        
        if (this.contenedor) {
            this.contenedor.innerHTML = '';
            this.ocultarContenedor();
        }
        
        // Limpiar datos
        this.productos = [];
        this.productosFiltrados = [];
        this.tipoProductoActual = null;
        this.filtrosActivos = {
            marca: '',
            contenido: '',
            variedad: ''
        };
        
        console.log('✅ Tabla completamente destruida y limpiada');
    }

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
 * ✅ FUNCIÓN PARA LIMPIAR SOLO FILTROS DE LA TABLA (botón independiente)
 */
function limpiarFiltrosTabla() {
    console.log('🧹 Limpiando filtros de tabla independientemente...');
    
    // Limpiar los selects personalizados secundarios
    const filtrosSecundarios = ['marca', 'contenido', 'variedad'];
    
    filtrosSecundarios.forEach(filtro => {
        // Limpiar el input oculto
        const input = document.getElementById(filtro);
        if (input) {
            input.value = '';
        }
        
        // Resetear el texto del trigger
        const trigger = document.getElementById(`${filtro}-trigger`);
        if (trigger) {
            const textSpan = trigger.querySelector('.custom-select-text');
            if (textSpan) {
                textSpan.textContent = `Elegí ${filtro === 'contenido' ? 'el contenido' : filtro === 'variedad' ? 'la variedad' : 'la marca'}`;
            }
        }
        
        // Ocultar el wrapper del filtro
        const wrapper = document.getElementById(`${filtro}-wrapper`);
        if (wrapper) {
            wrapper.classList.add('d-none');
        }
    });
    
    // Regenerar tabla sin filtros
    if (tablaProductosInstance) {
        tablaProductosInstance.filtrosActivos = {
            marca: '',
            contenido: '',
            variedad: ''
        };
        tablaProductosInstance.aplicarFiltros();
        console.log('✅ Filtros de tabla limpiados y tabla actualizada');
    }
    
    // Mostrar notificación
    const toast = document.getElementById('notification-toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
        toastMessage.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-table text-info me-2"></i>
                <span>Filtros de tabla limpiados</span>
            </div>
        `;
        
        // Mostrar toast usando Bootstrap
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
}

/**
 * ✅ FUNCIÓN MEJORADA PARA AGREGAR PRODUCTO CON TOGGLE PERMANENTE
 * El botón se mantiene en estado "agregado" hasta que el usuario lo deseleccione
 */
function agregarProductoDesdeTabla(id, nombre, sku) {
    console.log(`🛒 Toggle producto: ${nombre} (ID: ${id}, SKU: ${sku})`);
    
    const button = event.target.closest('.boton-agregar');
    if (!button) return;
    
    const textoSpan = button.querySelector('.boton-agregar__texto');
    const iconoSpan = button.querySelector('.boton-agregar__icono');
    
    // Verificar estado actual del botón
    const estaAgregado = button.classList.contains('boton-agregar--agregado');
    
    if (estaAgregado) {
        // QUITAR PRODUCTO (deseleccionar)
        console.log(`❌ Quitando producto: ${nombre}`);
        
        // Cambiar a estado normal
        button.classList.remove('boton-agregar--agregado');
        textoSpan.textContent = 'Agregar';
        iconoSpan.textContent = '+';
        
        // Quitar del sistema principal
        if (typeof window.quitarProductoAgregado === 'function') {
            window.quitarProductoAgregado(id, nombre, sku);
        } else {
            // Fallback: emitir evento directo
            document.dispatchEvent(new CustomEvent('productoQuitado', {
                detail: { id, nombre, sku }
            }));
        }
        
    } else {
        // AGREGAR PRODUCTO (seleccionar)
        console.log(`✅ Agregando producto: ${nombre}`);
        
        // Cambiar a estado agregado (PERMANENTE)
        button.classList.add('boton-agregar--agregado');
        textoSpan.textContent = 'Agregado';
        iconoSpan.textContent = '✓';
        
        // Agregar al sistema principal
        if (typeof window.notificarProductoAgregado === 'function') {
            window.notificarProductoAgregado(id, nombre, sku);
        } else {
            // Fallback: emitir evento directo
            document.dispatchEvent(new CustomEvent('productoAgregado', {
                detail: { id, nombre, sku }
            }));
        }
    }
}

/**
 * ✅ FUNCIÓN PRINCIPAL MEJORADA - RECIBE TIPO DE PRODUCTO
 */
function mostrarTablaProductos(tipoProducto) {
    console.log(`📋 Solicitud para mostrar tabla de productos tipo: ${tipoProducto}`);
    
    // Obtener tipo de producto desde el input si no se proporciona
    if (!tipoProducto) {
        const tipoInput = document.getElementById('tipo-de-producto');
        tipoProducto = tipoInput ? tipoInput.value : null;
    }
    
    if (!tipoProducto) {
        console.warn('⚠️ No se puede generar tabla sin tipo de producto');
        return;
    }
    
    // Crear nueva instancia si no existe
    if (!tablaProductosInstance) {
        tablaProductosInstance = new TablaProductos();
    }

    // Generar la tabla con el tipo específico
    tablaProductosInstance.generar(tipoProducto);
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
    console.log('📡 Sistema de tabla dinámica SINCRONIZADA configurado');
    
    // Listener para cambios en tipo de producto
    const tipoProductoInput = document.getElementById('tipo-de-producto');
    if (tipoProductoInput) {
        tipoProductoInput.addEventListener('change', (event) => {
            const valor = event.target.value;
            console.log(`🎯 Cambio en tipo de producto detectado: "${valor}"`);
            
            if (valor && valor !== '') {
                // Mostrar tabla con el tipo específico
                setTimeout(() => {
                    mostrarTablaProductos(valor);
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

/**
 * ✅ FUNCIÓN PARA RESETEAR TODOS LOS BOTONES CUANDO SE LIMPIAN FILTROS
 */
function resetearTodosLosBotones() {
    console.log("🔄 Reseteando todos los botones de agregar...");
    
    const todosLosBotones = document.querySelectorAll('.boton-agregar--agregado');
    
    todosLosBotones.forEach(button => {
        const textoSpan = button.querySelector('.boton-agregar__texto');
        const iconoSpan = button.querySelector('.boton-agregar__icono');
        
        // Resetear a estado normal
        button.classList.remove('boton-agregar--agregado');
        if (textoSpan) textoSpan.textContent = 'Agregar';
        if (iconoSpan) iconoSpan.textContent = '+';
    });
    
    console.log(`✅ ${todosLosBotones.length} botones reseteados`);
}

/**
 * ✅ FUNCIÓN PARA MANTENER ESTADOS DE BOTONES AL APLICAR FILTROS
 * Cuando se filtran productos, mantener el estado de los botones que siguen visibles
 */
function mantenerEstadosBotones() {
    // Obtener lista de productos agregados del sistema principal
    let productosAgregados = [];
    
    if (typeof window.obtenerProductosAgregados === 'function') {
        productosAgregados = window.obtenerProductosAgregados();
    }
    
    if (productosAgregados.length === 0) return;
    
    console.log(`🔍 Manteniendo estado de ${productosAgregados.length} productos agregados`);
    
    // Recorrer todos los botones visibles y actualizar su estado
    const botonesVisibles = document.querySelectorAll('.boton-agregar');
    
    botonesVisibles.forEach(button => {
        const onclick = button.getAttribute('onclick');
        if (!onclick) return;
        
        // Extraer el ID del producto del onclick
        const match = onclick.match(/agregarProductoDesdeTabla\((\d+),/);
        if (!match) return;
        
        const productoId = parseInt(match[1]);
        
        // Verificar si este producto está en la lista de agregados
        const estaAgregado = productosAgregados.some(p => p.id === productoId);
        
        const textoSpan = button.querySelector('.boton-agregar__texto');
        const iconoSpan = button.querySelector('.boton-agregar__icono');
        
        if (estaAgregado) {
            // Mantener estado agregado
            button.classList.add('boton-agregar--agregado');
            if (textoSpan) textoSpan.textContent = 'Agregado';
            if (iconoSpan) iconoSpan.textContent = '✓';
        } else {
            // Mantener estado normal
            button.classList.remove('boton-agregar--agregado');
            if (textoSpan) textoSpan.textContent = 'Agregar';
            if (iconoSpan) iconoSpan.textContent = '+';
        }
    });
}

// Event listener para resetear botones cuando se limpien filtros
document.addEventListener('filtrosLimpiados', () => {
    console.log("🧹 Evento de limpieza recibido - reseteando botones");
    setTimeout(() => {
        resetearTodosLosBotones();
    }, 100);
});

// Event listener para resetear botones cuando se reseteen filtros
document.addEventListener('resetearFiltros', () => {
    console.log("🧹 Evento de reseteo recibido - reseteando botones");
    setTimeout(() => {
        resetearTodosLosBotones();
    }, 100);
});

// ============================================================================
// EXPORTACIÓN GLOBAL
// ============================================================================

window.TablaProductos = TablaProductos;
window.mostrarTablaProductos = mostrarTablaProductos;
window.ocultarTablaProductos = ocultarTablaProductos;
window.inicializarTablaProductos = inicializarTablaProductos;
window.limpiarFiltrosTabla = limpiarFiltrosTabla;
window.agregarProductoDesdeTabla = agregarProductoDesdeTabla;
window.resetearTodosLosBotones = resetearTodosLosBotones;
window.mantenerEstadosBotones = mantenerEstadosBotones;

// Compatibilidad con función antigua
window.agregarProducto = agregarProductoDesdeTabla;
window.limpiarFiltrosSecundarios = limpiarFiltrosTabla;

console.log('📜 Sistema de tabla SINCRONIZADA con botones toggle permanente cargado');