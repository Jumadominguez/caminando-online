/**
 * ============================================================================
 * INTEGRACIÓN TABLA PRODUCTOS CON FILTROS - VERSIÓN CORREGIDA
 * ============================================================================
 * Esto debería ejecutarse automáticamente cuando selecciones un tipo de producto
 */

// Función auxiliar para mostrar la tabla
function mostrarTablaProductosIntegracion() {
    console.log('🚀 Intentando mostrar tabla de productos...');
    
    // Ocultar el estado vacío
    const estadoVacio = document.getElementById('productos-area-vacia');
    if (estadoVacio) {
        estadoVacio.style.display = 'none';
        console.log('✅ Estado vacío ocultado');
    }
    
    // Mostrar contenedor de tabla
    const contenedorTabla = document.getElementById('contenedor-tabla-productos');
    if (contenedorTabla) {
        contenedorTabla.style.display = 'block';
        console.log('✅ Contenedor de tabla mostrado');
        
        // Intentar mostrar la tabla
        if (typeof window.tablaProductos !== 'undefined' && window.tablaProductos) {
            try {
                window.tablaProductos.mostrarTabla();
                console.log('✅ Tabla mostrada usando instancia existente');
            } catch (error) {
                console.error('❌ Error al mostrar tabla:', error);
            }
        } else if (typeof window.TablaProductos !== 'undefined') {
            try {
                console.log('🔧 Creando nueva instancia de tabla...');
                window.tablaProductos = new window.TablaProductos();
                window.tablaProductos.mostrarTabla();
                console.log('✅ Nueva tabla creada y mostrada');
            } catch (error) {
                console.error('❌ Error creando nueva tabla:', error);
            }
        } else {
            console.error('❌ TablaProductos no disponible');
        }
    }
}

// Función auxiliar para ocultar la tabla
function ocultarTablaProductosIntegracion() {
    console.log('🙈 Ocultando tabla de productos...');
    
    // Mostrar el estado vacío
    const estadoVacio = document.getElementById('productos-area-vacia');
    if (estadoVacio) {
        estadoVacio.style.display = 'flex';
    }
    
    // Ocultar contenedor de tabla
    const contenedorTabla = document.getElementById('contenedor-tabla-productos');
    if (contenedorTabla) {
        contenedorTabla.style.display = 'none';
        
        if (typeof window.tablaProductos !== 'undefined' && window.tablaProductos) {
            try {
                window.tablaProductos.ocultarTabla();
                console.log('✅ Tabla ocultada');
            } catch (error) {
                console.error('❌ Error al ocultar tabla:', error);
            }
        }
    }
}

// Listener para cuando se selecciona un tipo de producto
document.addEventListener('DOMContentLoaded', () => {
    console.log('📡 Integracion tabla-productos cargada');
    
    const tipoProductoInput = document.getElementById('tipo-de-producto');
    if (tipoProductoInput) {
        tipoProductoInput.addEventListener('change', (e) => {
            const valor = e.target.value;
            console.log(`🎯 Tipo de producto detectado: ${valor}`);
            
            if (valor && valor !== 'todos') {
                setTimeout(() => {
                    mostrarTablaProductosIntegracion();
                }, 500);
            } else {
                ocultarTablaProductosIntegracion();
            }
        });
        console.log('✅ Listener de tipo de producto configurado');
    }
});

// Test manual disponible en consola
window.testTablaIntegracion = () => {
    mostrarTablaProductosIntegracion();
};

console.log('🔗 Módulo de integración tabla-productos cargado');