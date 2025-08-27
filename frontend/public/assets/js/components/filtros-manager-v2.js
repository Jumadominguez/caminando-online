// ===============================================
// FILTROS MANAGER V2 - SISTEMA DEPURADO COMPLETO
// ===============================================

/**
 * Sistema unificado de filtros para Caminando Online V2
 * - Elimina duplicados y conflictos del sistema anterior
 * - Implementa arquitectura limpia y modular  
 * - Datos mock optimizados y organizados
 * - Eventos personalizados para comunicación entre módulos
 */

// ===============================================
// DATOS MOCK DEPURADOS - SIN DUPLICADOS NI CONFLICTOS
// ===============================================

const DATOS_DEPURADOS = {
  // Categorías principales con subcategorías únicas
  categorias: [
    {
      id: "alimentos",
      nombre: "🍎 Alimentos",
      subcategorias: [
        // Lácteos (6)
        "Leche", "Yogurt", "Queso", "Manteca", "Crema", "Dulce de leche",
        
        // Bebidas (5)  
        "Agua", "Gaseosas", "Jugos", "Cervezas", "Vinos",
        
        // Carnes (5)
        "Pollo", "Carne vacuna", "Cerdo", "Pescado", "Embutidos",
        
        // Panadería (4)
        "Pan", "Galletitas", "Tostadas", "Bizcochos",
        
        // Frutas y Verduras (6)
        "Tomate", "Lechuga", "Cebolla", "Papa", "Manzana", "Banana",
        
        // Congelados (4)
        "Pizza congelada", "Helados", "Papas fritas", "Empanadas",
        
        // Almacén (6)
        "Arroz", "Fideos", "Harina", "Aceite", "Azúcar", "Sal"
      ]
    },
    {
      id: "limpieza",
      nombre: "🧽 Limpieza y Hogar",
      subcategorias: [
        // Limpieza (6)
        "Detergente", "Lavandina", "Jabón en polvo", "Suavizante", "Desinfectante", "Limpiador multiuso",
        
        // Papel (4)
        "Papel higiénico", "Servilletas", "Pañuelos", "Rollos de cocina",
        
        // Accesorios (3)
        "Esponjas", "Guantes", "Bolsas de basura"
      ]
    },
    {
      id: "cuidado_personal", 
      nombre: "🧴 Cuidado Personal",
      subcategorias: [
        // Cabello (2)
        "Shampoo", "Acondicionador",
        
        // Cuerpo (4)
        "Jabón líquido", "Desodorante", "Crema corporal", "Protector solar",
        
        // Oral (1)
        "Pasta dental",
        
        // Belleza (3)
        "Maquillaje", "Perfumes", "Afeitadoras"
      ]
    },
    {
      id: "mascotas",
      nombre: "🐕 Mascotas", 
      subcategorias: [
        "Alimento para perros", "Alimento para gatos", "Arena para gatos",
        "Juguetes para mascotas", "Correas", "Snacks para mascotas", "Medicamentos veterinarios"
      ]
    },
    {
      id: "bebes",
      nombre: "👶 Bebés y Niños",
      subcategorias: [
        "Pañales", "Toallitas húmedas", "Leche en polvo", "Papillas",
        "Chupetes", "Biberones", "Juguetes infantiles", "Cremas para bebé"
      ]
    }
  ],

  // Tipos de producto sin duplicados
  tiposProducto: [
    { id: "lacteos", nombre: "Lácteos", categoria: "alimentos", activo: true, orden: 1 },
    { id: "bebidas", nombre: "Bebidas", categoria: "alimentos", activo: true, orden: 2 },
    { id: "carnes", nombre: "Carnes y Fiambres", categoria: "alimentos", activo: true, orden: 3 },
    { id: "panaderia", nombre: "Panadería", categoria: "alimentos", activo: true, orden: 4 },
    { id: "frutas_verduras", nombre: "Frutas y Verduras", categoria: "alimentos", activo: true, orden: 5 },
    { id: "congelados", nombre: "Congelados", categoria: "alimentos", activo: true, orden: 6 },
    { id: "almacen", nombre: "Almacén", categoria: "alimentos", activo: true, orden: 7 },
    { id: "limpieza", nombre: "Limpieza", categoria: "limpieza", activo: true, orden: 8 },
    { id: "higiene", nombre: "Higiene Personal", categoria: "cuidado_personal", activo: true, orden: 9 },
    { id: "mascotas", nombre: "Mascotas", categoria: "mascotas", activo: true, orden: 10 }
  ],

  // Marcas organizadas por tipo - sin duplicados
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

  // Contenidos estándar por tipo
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

  // Variedades comunes por tipo  
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

// ===============================================
// CONFIGURACIÓN Y CONSTANTES
// ===============================================

const CONFIG = {
  // Textos de interfaz
  textos: {
    placeholder_producto: "Escribí el nombre del producto (ej: leche, pan, detergente...)",
    placeholder_tipo: "Elegí una opción...",
    placeholder_marca: "Elegí la marca",
    placeholder_contenido: "Elegí el contenido", 
    placeholder_variedad: "Elegí la variedad"
  },

  // Configuración de animaciones
  animaciones: {
    duracion: 300,
    delay_escalonado: 100,
    transition: 'all 0.3s ease'
  },

  // Configuración de búsqueda
  busqueda: {
    min_caracteres: 0,
    delay_busqueda: 300
  },

  // Debug mode
  debug: true
};

// ===============================================
// ESTADO Y VARIABLES GLOBALES
// ===============================================

class EstadoFiltros {
  constructor() {
    this.categoria = null;
    this.subcategoria = null;  
    this.tipoProducto = null;
    this.marca = null;
    this.contenido = null;
    this.variedad = null;
  }

  actualizar(campo, valor) {
    this[campo] = valor;
    this.notificarCambio(campo, valor);
  }

  obtener() {
    return {
      categoria: this.categoria,
      subcategoria: this.subcategoria,
      tipoProducto: this.tipoProducto, 
      marca: this.marca,
      contenido: this.contenido,
      variedad: this.variedad
    };
  }

  resetear() {
    this.categoria = null;
    this.subcategoria = null;
    this.tipoProducto = null;
    this.marca = null;
    this.contenido = null;
    this.variedad = null;
    this.notificarCambio('reset', null);
  }

  notificarCambio(campo, valor) {
    const evento = new CustomEvent('filtrosCambiados', {
      detail: {
        campo: campo,
        valor: valor,
        estadoCompleto: this.obtener()
      }
    });
    document.dispatchEvent(evento);

    if (CONFIG.debug) {
      console.log(`📡 Filtro cambiado: ${campo} = ${valor}`, this.obtener());
    }
  }
}

// Estado global
const estado = new EstadoFiltros();

// Referencias DOM
let elementos = {};

// ===============================================
// CLASE PRINCIPAL - FILTROS MANAGER V2
// ===============================================

class FiltrosManagerV2 {
  constructor() {
    this.inicializado = false;
  }

  // Inicialización principal
  inicializar() {
    if (this.inicializado) {
      console.warn("⚠️ FiltrosManagerV2 ya está inicializado");
      return;
    }

    console.log("🎯 Inicializando FiltrosManagerV2...");
    
    if (!this.obtenerElementosDOM()) {
      console.error("❌ No se pudieron obtener elementos DOM críticos");
      return;
    }
    
    this.inicializarComponentes();
    this.configurarEventListeners();
    
    this.inicializado = true;
    console.log("✅ FiltrosManagerV2 inicializado correctamente");
  }

  // Obtener referencias a elementos del DOM
  obtenerElementosDOM() {
    elementos = {
      // Elementos principales
      productoInput: document.getElementById("producto"),
      categoryMenu: document.getElementById("categoryMenu"),
      tipoProductoSelect: document.getElementById("tipo-de-producto"),
      
      // Filtros secundarios
      marcaSelect: document.getElementById("marca"),
      contenidoSelect: document.getElementById("contenido"),
      variedadSelect: document.getElementById("variedad"),
      
      // Wrappers de filtros secundarios
      marcaWrapper: document.getElementById("marca-wrapper"),
      contenidoWrapper: document.getElementById("contenido-wrapper"),
      variedadWrapper: document.getElementById("variedad-wrapper"),
      
      // Tabla de productos
      productosLista: document.getElementById("productos-lista")
    };

    // Validar elementos críticos
    const elementosCriticos = ['productoInput', 'categoryMenu', 'tipoProductoSelect'];
    const faltantes = elementosCriticos.filter(id => !elementos[id]);
    
    if (faltantes.length > 0) {
      console.error("❌ Elementos DOM faltantes:", faltantes);
      return false;
    }

    if (CONFIG.debug) {
      console.log("🔍 Elementos DOM obtenidos:", Object.keys(elementos).filter(key => elementos[key]));
    }
    
    return true;
  }

  // Inicializar componentes individuales
  inicializarComponentes() {
    this.inicializarFiltroCategorias();
    this.inicializarFiltroTipoProducto(); 
    this.inicializarFiltrosSecundarios();
    this.ocultarFiltrosSecundarios(); // Estado inicial
  }

  // ===============================================
  // FILTRO DE CATEGORÍAS - BÚSQUEDA CON MENÚ
  // ===============================================

  inicializarFiltroCategorias() {
    console.log("📋 Inicializando filtro de categorías...");
    
    if (!elementos.productoInput || !elementos.categoryMenu) {
      console.warn("⚠️ Elementos de categorías no encontrados");
      return;
    }
    
    // Event listeners del input
    elementos.productoInput.addEventListener('click', () => this.mostrarMenuCategorias());
    elementos.productoInput.addEventListener('input', () => this.filtrarMenuCategorias());
    elementos.productoInput.addEventListener('keydown', (e) => this.manejarTeclasMenu(e));
    
    // Click fuera para cerrar menú
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.category-dropdown')) {
        this.ocultarMenuCategorias();
      }
    });
  }

  mostrarMenuCategorias() {
    if (!elementos.categoryMenu) return;
    
    elementos.categoryMenu.innerHTML = "";
    
    DATOS_DEPURADOS.categorias.forEach(categoria => {
      const grupoElement = this.crearGrupoCategoria(categoria);
      elementos.categoryMenu.appendChild(grupoElement);
    });
    
    elementos.categoryMenu.style.display = "block";
    
    if (CONFIG.debug) {
      console.log("📋 Menú de categorías mostrado");
    }
  }

  ocultarMenuCategorias() {
    if (elementos.categoryMenu) {
      elementos.categoryMenu.style.display = "none";
    }
  }

  crearGrupoCategoria(categoria) {
    const grupo = document.createElement('div');
    grupo.classList.add('category-group');
    grupo.setAttribute('data-categoria-id', categoria.id);
    
    // Título de categoría
    const titulo = document.createElement('div');
    titulo.classList.add('category-title');
    titulo.textContent = categoria.nombre;
    grupo.appendChild(titulo);
    
    // Lista de subcategorías
    const lista = document.createElement('ul');
    lista.classList.add('subcategory-list');
    
    categoria.subcategorias.forEach(subcategoria => {
      const item = document.createElement('li');
      item.classList.add('subcategory-item');
      item.textContent = subcategoria;
      item.setAttribute('data-subcategoria', subcategoria);
      item.setAttribute('data-categoria-padre', categoria.id);
      
      // Event listener para selección
      item.addEventListener('click', () => {
        this.seleccionarSubcategoria(subcategoria, categoria);
      });
      
      lista.appendChild(item);
    });
    
    grupo.appendChild(lista);
    return grupo;
  }

  seleccionarSubcategoria(subcategoria, categoria) {
    console.log(`🎯 Subcategoría seleccionada: ${subcategoria} (${categoria.nombre})`);
    
    // Actualizar input
    if (elementos.productoInput) {
      elementos.productoInput.value = subcategoria;
    }
    
    // Ocultar menú
    this.ocultarMenuCategorias();
    
    // Actualizar estado
    estado.actualizar('categoria', categoria.id);
    estado.actualizar('subcategoria', subcategoria);
    
    // Mostrar filtros adicionales
    this.mostrarFiltrosSecundarios();
  }

  filtrarMenuCategorias() {
    if (!elementos.productoInput || !elementos.categoryMenu) return;
    
    const input = this.normalizarTexto(elementos.productoInput.value);
    
    if (input.length === 0) {
      this.mostrarMenuCategorias();
      return;
    }
    
    const grupos = elementos.categoryMenu.querySelectorAll('.category-group');
    
    grupos.forEach(grupo => {
      const items = grupo.querySelectorAll('.subcategory-item');
      let tieneCoincidencias = false;
      
      items.forEach(item => {
        const textoNormalizado = this.normalizarTexto(item.textContent);
        const coincide = textoNormalizado.includes(input);
        
        item.style.display = coincide ? '' : 'none';
        if (coincide) tieneCoincidencias = true;
      });
      
      grupo.style.display = tieneCoincidencias ? '' : 'none';
    });
    
    // Auto-mostrar menú si estaba oculto
    if (elementos.categoryMenu.style.display === 'none') {
      elementos.categoryMenu.style.display = 'block';
    }
  }

  manejarTeclasMenu(event) {
    // ESC para cerrar menú
    if (event.key === 'Escape') {
      this.ocultarMenuCategorias();
    }
  }

  // ===============================================
  // FILTRO TIPO DE PRODUCTO
  // ===============================================

  inicializarFiltroTipoProducto() {
    console.log("📦 Inicializando filtro tipo de producto...");
    
    if (!elementos.tipoProductoSelect) {
      console.warn("⚠️ Select tipo de producto no encontrado");
      return;
    }
    
    this.cargarTiposProducto();
    
    elementos.tipoProductoSelect.addEventListener('change', (e) => {
      this.manejarCambioTipoProducto(e.target.value);
    });
  }

  cargarTiposProducto() {
    if (!elementos.tipoProductoSelect) return;
    
    // Limpiar select
    elementos.tipoProductoSelect.innerHTML = '';
    
    // Opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = CONFIG.textos.placeholder_tipo;
    elementos.tipoProductoSelect.appendChild(defaultOption);
    
    // Cargar tipos ordenados
    DATOS_DEPURADOS.tiposProducto
      .filter(tipo => tipo.activo)
      .sort((a, b) => a.orden - b.orden)
      .forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo.id;
        option.textContent = tipo.nombre;
        option.setAttribute('data-categoria', tipo.categoria);
        elementos.tipoProductoSelect.appendChild(option);
      });
    
    if (CONFIG.debug) {
      console.log(`📦 ${DATOS_DEPURADOS.tiposProducto.length} tipos de producto cargados`);
    }
  }

  manejarCambioTipoProducto(tipoSeleccionado) {
    console.log(`🎯 Tipo de producto seleccionado: ${tipoSeleccionado}`);
    
    estado.actualizar('tipoProducto', tipoSeleccionado);
    
    if (!tipoSeleccionado) {
      this.ocultarFiltrosSecundarios();
      return;
    }
    
    // Cargar opciones específicas para este tipo
    this.cargarOpcionesPorTipo(tipoSeleccionado);
    
    // Mostrar filtros secundarios
    this.mostrarFiltrosSecundarios();
  }

  // ===============================================
  // FILTROS SECUNDARIOS
  // ===============================================

  inicializarFiltrosSecundarios() {
    console.log("🔧 Inicializando filtros secundarios...");
    
    // Event listeners para cada filtro secundario
    const filtrosSecundarios = [
      { elemento: elementos.marcaSelect, campo: 'marca' },
      { elemento: elementos.contenidoSelect, campo: 'contenido' },
      { elemento: elementos.variedadSelect, campo: 'variedad' }
    ];
    
    filtrosSecundarios.forEach(({elemento, campo}) => {
      if (elemento) {
        elemento.addEventListener('change', (e) => {
          estado.actualizar(campo, e.target.value);
        });
      }
    });
  }

  cargarOpcionesPorTipo(tipoProducto) {
    console.log(`📋 Cargando opciones para tipo: ${tipoProducto}`);
    
    // Cargar cada filtro secundario
    this.cargarOpcionesSelect(
      elementos.marcaSelect, 
      DATOS_DEPURADOS.marcas[tipoProducto] || [], 
      CONFIG.textos.placeholder_marca
    );
    
    this.cargarOpcionesSelect(
      elementos.contenidoSelect, 
      DATOS_DEPURADOS.contenidos[tipoProducto] || [], 
      CONFIG.textos.placeholder_contenido
    );
    
    this.cargarOpcionesSelect(
      elementos.variedadSelect, 
      DATOS_DEPURADOS.variedades[tipoProducto] || [], 
      CONFIG.textos.placeholder_variedad
    );
  }

  cargarOpcionesSelect(selectElement, opciones, placeholder) {
    if (!selectElement) return;
    
    // Limpiar select
    selectElement.innerHTML = '';
    
    // Opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = placeholder;
    selectElement.appendChild(defaultOption);
    
    // Agregar opciones
    opciones.forEach(opcion => {
      const option = document.createElement('option');
      option.value = opcion;
      option.textContent = opcion;
      selectElement.appendChild(option);
    });
    
    if (CONFIG.debug) {
      console.log(`✅ ${opciones.length} opciones cargadas en ${selectElement.id}`);
    }
  }

  mostrarFiltrosSecundarios() {
    const wrappers = [
      elementos.marcaWrapper,
      elementos.contenidoWrapper, 
      elementos.variedadWrapper
    ];
    
    wrappers.forEach((wrapper, index) => {
      if (!wrapper) return;
      
      // Remover clase d-none
      wrapper.classList.remove('d-none');
      
      // Animación escalonada
      setTimeout(() => {
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'translateY(-10px)';
        wrapper.style.transition = CONFIG.animaciones.transition;
        wrapper.classList.add('active');
        
        setTimeout(() => {
          wrapper.style.opacity = '1';
          wrapper.style.transform = 'translateY(0)';
        }, 50);
      }, index * CONFIG.animaciones.delay_escalonado);
    });
    
    if (CONFIG.debug) {
      console.log("✅ Filtros secundarios mostrados");
    }
  }

  ocultarFiltrosSecundarios() {
    const wrappers = [
      elementos.marcaWrapper,
      elementos.contenidoWrapper,
      elementos.variedadWrapper
    ];
    
    const selects = [
      elementos.marcaSelect,
      elementos.contenidoSelect, 
      elementos.variedadSelect
    ];
    
    wrappers.forEach((wrapper, index) => {
      if (!wrapper) return;
      
      // Animación de salida
      wrapper.style.transition = CONFIG.animaciones.transition;
      wrapper.style.opacity = '0';
      wrapper.style.transform = 'translateY(-10px)';
      wrapper.classList.remove('active');
      
      setTimeout(() => {
        wrapper.classList.add('d-none');
        
        // Limpiar select correspondiente
        const select = selects[index];
        if (select) {
          select.innerHTML = '';
          select.selectedIndex = 0;
        }
      }, CONFIG.animaciones.duracion);
    });
    
    // Resetear estado de filtros secundarios
    estado.actualizar('marca', null);
    estado.actualizar('contenido', null);
    estado.actualizar('variedad', null);
    
    if (CONFIG.debug) {
      console.log("✅ Filtros secundarios ocultados");
    }
  }

  // ===============================================
  // CONFIGURACIÓN DE EVENT LISTENERS GENERALES
  // ===============================================

  configurarEventListeners() {
    console.log("🔗 Configurando event listeners globales...");
    
    // Listener para cambios en filtros (para otros módulos)
    document.addEventListener('filtrosCambiados', (e) => {
      this.manejarCambioFiltro(e.detail);
    });
    
    // Listener para reset desde otros módulos
    document.addEventListener('resetearFiltros', () => {
      this.resetearTodo();
    });
    
    if (CONFIG.debug) {
      console.log("🔗 Event listeners globales configurados");
    }
  }

  manejarCambioFiltro(detalle) {
    const { campo, valor, estadoCompleto } = detalle;
    
    if (CONFIG.debug) {
      console.log(`🔄 Filtro cambiado externamente: ${campo} = ${valor}`);
    }
    
    // Generar productos cuando hay filtros suficientes
    if (estadoCompleto.categoria || estadoCompleto.tipoProducto) {
      this.generarProductosMock();
    }
  }

  // ===============================================
  // GESTIÓN DE PRODUCTOS MOCK
  // ===============================================

  generarProductosMock() {
    if (!elementos.productosLista) {
      console.warn("⚠️ Tabla de productos no encontrada");
      return;
    }

    const estadoActual = estado.obtener();
    
    // Si no hay suficientes filtros, no generar productos
    if (!estadoActual.categoria && !estadoActual.tipoProducto) {
      this.mostrarEstadoVacio();
      return;
    }

    console.log("🔄 Generando productos mock...", estadoActual);
    
    const productos = this.crearProductosMock(estadoActual);
    this.renderizarProductos(productos);
  }

  crearProductosMock(filtros) {
    const productos = [];
    
    // Obtener nombres base según filtros
    const nombresBase = this.obtenerNombresBase(filtros);
    const marcas = this.obtenerMarcasDisponibles(filtros);
    const contenidos = this.obtenerContenidosDisponibles(filtros);
    const variedades = this.obtenerVariedadesDisponibles(filtros);
    
    // Generar combinaciones (máximo 12 productos)
    let contador = 0;
    const maxProductos = 12;
    
    for (let nombre of nombresBase.slice(0, 4)) {
      for (let marca of marcas.slice(0, 3)) {
        for (let contenido of contenidos.slice(0, 2)) {
          for (let variedad of variedades.slice(0, 1)) {
            if (contador >= maxProductos) break;
            
            productos.push({
              id: `prod_${contador}`,
              nombre: nombre,
              marca: marca,
              contenido: contenido,
              variedad: variedad,
              supermercados: Math.floor(Math.random() * 4) + 2, // 2-5 supermercados
              precio_desde: (Math.random() * 1000 + 100).toFixed(2)
            });
            
            contador++;
          }
          if (contador >= maxProductos) break;
        }
        if (contador >= maxProductos) break;
      }
      if (contador >= maxProductos) break;
    }
    
    return productos;
  }

  obtenerNombresBase(filtros) {
    if (filtros.subcategoria) {
      return [filtros.subcategoria];
    }
    
    if (filtros.categoria) {
      const categoria = DATOS_DEPURADOS.categorias.find(c => c.id === filtros.categoria);
      return categoria ? categoria.subcategorias.slice(0, 6) : ['Producto'];
    }
    
    return ['Producto genérico'];
  }

  obtenerMarcasDisponibles(filtros) {
    if (filtros.marca) {
      return [filtros.marca];
    }
    
    if (filtros.tipoProducto && DATOS_DEPURADOS.marcas[filtros.tipoProducto]) {
      return DATOS_DEPURADOS.marcas[filtros.tipoProducto];
    }
    
    return ['Marca genérica', 'Marca premium'];
  }

  obtenerContenidosDisponibles(filtros) {
    if (filtros.contenido) {
      return [filtros.contenido];
    }
    
    if (filtros.tipoProducto && DATOS_DEPURADOS.contenidos[filtros.tipoProducto]) {
      return DATOS_DEPURADOS.contenidos[filtros.tipoProducto];
    }
    
    return ['1u', '500g'];
  }

  obtenerVariedadesDisponibles(filtros) {
    if (filtros.variedad) {
      return [filtros.variedad];
    }
    
    if (filtros.tipoProducto && DATOS_DEPURADOS.variedades[filtros.tipoProducto]) {
      return DATOS_DEPURADOS.variedades[filtros.tipoProducto];
    }
    
    return ['Clásico'];
  }

  renderizarProductos(productos) {
    if (productos.length === 0) {
      this.mostrarEstadoVacio();
      return;
    }
    
    elementos.productosLista.innerHTML = '';
    
    productos.forEach((producto, index) => {
      const fila = this.crearFilaProducto(producto, index);
      elementos.productosLista.appendChild(fila);
    });
    
    if (CONFIG.debug) {
      console.log(`✅ ${productos.length} productos renderizados`);
    }
  }

  crearFilaProducto(producto, index) {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td><strong>${producto.nombre}</strong></td>
      <td>${producto.marca}</td>
      <td><span class="badge bg-secondary">${producto.contenido}</span></td>
      <td>${producto.variedad}</td>
      <td>
        <span class="badge bg-primary">
          <i class="fas fa-store"></i> 
          ${producto.supermercados} disponibles
        </span>
      </td>
      <td>
        <button class="btn btn-success btn-sm btn-agregar" onclick="agregarProducto(${index}, '${producto.id}')">
          <i class="fas fa-plus"></i> Agregar
        </button>
      </td>
    `;
    return fila;
  }

  mostrarEstadoVacio() {
    elementos.productosLista.innerHTML = `
      <tr>
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

  // ===============================================
  // UTILIDADES
  // ===============================================

  normalizarTexto(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  // ===============================================
  // MÉTODOS PÚBLICOS
  // ===============================================

  obtenerEstado() {
    return estado.obtener();
  }

  resetearTodo() {
    console.log("🔄 Reseteando todos los filtros...");
    
    // Resetear input de categorías
    if (elementos.productoInput) {
      elementos.productoInput.value = '';
    }
    
    // Ocultar menú
    this.ocultarMenuCategorias();
    
    // Resetear tipo de producto
    if (elementos.tipoProductoSelect) {
      elementos.tipoProductoSelect.selectedIndex = 0;
    }
    
    // Ocultar filtros secundarios
    this.ocultarFiltrosSecundarios();
    
    // Resetear estado
    estado.resetear();
    
    // Mostrar estado vacío
    this.mostrarEstadoVacio();
    
    console.log("✅ Todos los filtros reseteados");
  }

  // Método para configurar desde otros módulos
  configurarCallbacks(callbacks) {
    this.callbacks = callbacks || {};
  }

  // Método para debugging
  debug() {
    return {
      estado: estado.obtener(),
      elementos: Object.keys(elementos),
      inicializado: this.inicializado,
      datos: {
        categorias: DATOS_DEPURADOS.categorias.length,
        tiposProducto: DATOS_DEPURADOS.tiposProducto.length,
        totalMarcas: Object.keys(DATOS_DEPURADOS.marcas).length
      }
    };
  }
}

// ===============================================
// FUNCIONES GLOBALES DE APOYO
// ===============================================

// Función global para agregar productos (llamada desde el HTML generado)
function agregarProducto(index, productoId) {
  console.log(`➕ Agregando producto ${productoId} (índice: ${index})`);
  
  // Efecto visual en el botón
  const boton = event.target.closest('button');
  const iconoOriginal = boton.innerHTML;
  
  boton.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
  boton.classList.remove('btn-success');
  boton.classList.add('btn-secondary');
  boton.disabled = true;
  
  // Restaurar botón después de 2 segundos
  setTimeout(() => {
    boton.innerHTML = iconoOriginal;
    boton.classList.remove('btn-secondary');
    boton.classList.add('btn-success');
    boton.disabled = false;
  }, 2000);
  
  // Disparar evento personalizado
  document.dispatchEvent(new CustomEvent('productoAgregado', {
    detail: { index, productoId }
  }));
}

// ===============================================
// INICIALIZACIÓN AUTOMÁTICA Y API PÚBLICA
// ===============================================

// Instancia global del manager
const filtrosManager = new FiltrosManagerV2();

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para que otros scripts se carguen
    setTimeout(() => {
      filtrosManager.inicializar();
    }, 100);
  });
} else {
  // DOM ya está listo
  setTimeout(() => filtrosManager.inicializar(), 100);
}

// API pública para compatibilidad con código existente
window.FiltrosManager = {
  // Métodos principales
  inicializar: () => filtrosManager.inicializar(),
  obtenerEstado: () => filtrosManager.obtenerEstado(),
  resetear: () => filtrosManager.resetearTodo(),
  
  // Gestión de categorías
  mostrarCategorias: () => filtrosManager.mostrarMenuCategorias(),
  ocultarCategorias: () => filtrosManager.ocultarMenuCategorias(),
  
  // Gestión de filtros secundarios
  mostrarFiltrosSecundarios: () => filtrosManager.mostrarFiltrosSecundarios(),
  ocultarFiltrosSecundarios: () => filtrosManager.ocultarFiltrosSecundarios(),
  
  // Utilidades
  debug: () => filtrosManager.debug(),
  configurarCallbacks: (callbacks) => filtrosManager.configurarCallbacks(callbacks),
  
  // Datos
  obtenerDatos: () => DATOS_DEPURADOS,
  
  // Compatibilidad con versiones anteriores
  inicializarFormularios: () => filtrosManager.inicializar(),
  resetearFiltros: () => filtrosManager.resetearTodo()
};

// Alias para compatibilidad
window.FormManagerDinamico = window.FiltrosManager;

console.log("📦 FiltrosManagerV2 cargado - Sistema depurado listo");

// Exportar para uso en módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FiltrosManagerV2, filtrosManager };
}
