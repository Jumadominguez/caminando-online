// ===============================================
// FILTROS MANAGER V2 - LIMPIEZA POST ELIMINACIÓN TABLA
// ===============================================

/**
 * Sistema simplificado de filtros para Caminando Online V2
 * - Dropdowns completamente personalizados (no nativos)
 * - Sin generación de tablas de productos
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
    placeholder_tipo: "Primero elegí un producto arriba",
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
// CLASE PARA DROPDOWN PERSONALIZADO
// ===============================================

class CustomDropdown {
  constructor(wrapperId, hiddenInputId, placeholder = "Seleccionar...") {
    this.wrapperId = wrapperId;
    this.hiddenInputId = hiddenInputId;
    this.placeholder = placeholder;
    this.isOpen = false;
    this.selectedValue = null;
    this.selectedText = null;
    this.options = [];
    this.focusedIndex = -1;
    
    this.initializeElements();
    this.setupEventListeners();
  }

  initializeElements() {
    this.wrapper = document.getElementById(this.wrapperId);
    this.hiddenInput = document.getElementById(this.hiddenInputId);
    
    if (!this.wrapper || !this.hiddenInput) {
      console.error(`CustomDropdown: Elementos no encontrados - ${this.wrapperId}, ${this.hiddenInputId}`);
      return;
    }

    this.trigger = this.wrapper.querySelector('.custom-select-trigger');
    this.textElement = this.wrapper.querySelector('.custom-select-text');
    this.arrow = this.wrapper.querySelector('.custom-select-arrow');
    this.optionsContainer = this.wrapper.querySelector('.custom-select-options');

    if (!this.trigger || !this.textElement || !this.arrow || !this.optionsContainer) {
      console.error(`CustomDropdown: Elementos internos no encontrados en ${this.wrapperId}`);
      return;
    }

    // Establecer placeholder inicial
    this.setPlaceholder();
  }

  setupEventListeners() {
    if (!this.trigger) return;

    // Click en el trigger
    this.trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });

    // Navegación por teclado
    this.trigger.addEventListener('keydown', (e) => {
      this.handleKeyNavigation(e);
    });

    // Click fuera para cerrar
    document.addEventListener('click', (e) => {
      if (!this.wrapper.contains(e.target)) {
        this.close();
      }
    });

    // Focus/blur
    this.trigger.addEventListener('focus', () => {
      this.wrapper.classList.add('focused');
    });

    this.trigger.addEventListener('blur', () => {
      this.wrapper.classList.remove('focused');
    });
  }

  // Cargar opciones
  loadOptions(options, selectedValue = null) {
    this.options = options;
    this.renderOptions();
    
    if (selectedValue) {
      this.selectOption(selectedValue, options.find(opt => opt.value === selectedValue)?.text || selectedValue);
    }
  }

  renderOptions() {
    if (!this.optionsContainer) return;

    this.optionsContainer.innerHTML = '';

    if (this.options.length === 0) {
      const noOptionsElement = document.createElement('div');
      noOptionsElement.className = 'custom-select-no-options';
      noOptionsElement.textContent = 'No hay opciones disponibles';
      this.optionsContainer.appendChild(noOptionsElement);
      return;
    }

    this.options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'custom-select-option';
      optionElement.textContent = option.text || option;
      optionElement.setAttribute('data-value', option.value || option);
      optionElement.setAttribute('data-index', index);

      if (option.disabled) {
        optionElement.classList.add('disabled');
      }

      if (this.selectedValue === (option.value || option)) {
        optionElement.classList.add('selected');
      }

      // Event listener para selección
      optionElement.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!option.disabled) {
          this.selectOption(option.value || option, option.text || option);
          this.close();
        }
      });

      // Hover states
      optionElement.addEventListener('mouseenter', () => {
        if (!option.disabled) {
          this.focusedIndex = index;
          this.updateFocusedOption();
        }
      });

      this.optionsContainer.appendChild(optionElement);
    });
  }

  selectOption(value, text) {
    this.selectedValue = value;
    this.selectedText = text;

    // Actualizar input oculto
    if (this.hiddenInput) {
      this.hiddenInput.value = value;
      this.hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Actualizar texto visible
    this.updateDisplayText();

    // Actualizar clases selected en opciones
    this.updateSelectedOption();

    if (CONFIG.debug) {
      console.log(`🎯 Dropdown ${this.wrapperId}: seleccionado ${value}`);
    }
  }

  updateDisplayText() {
    if (!this.textElement) return;

    if (this.selectedValue) {
      this.textElement.textContent = this.selectedText || this.selectedValue;
      this.textElement.classList.remove('placeholder');
    } else {
      this.setPlaceholder();
    }
  }

  setPlaceholder() {
    if (this.textElement) {
      this.textElement.textContent = this.placeholder;
      this.textElement.classList.add('placeholder');
    }
  }

  updateSelectedOption() {
    if (!this.optionsContainer) return;

    const options = this.optionsContainer.querySelectorAll('.custom-select-option');
    options.forEach(opt => {
      opt.classList.remove('selected');
      if (opt.getAttribute('data-value') === this.selectedValue) {
        opt.classList.add('selected');
      }
    });
  }

  updateFocusedOption() {
    if (!this.optionsContainer) return;

    const options = this.optionsContainer.querySelectorAll('.custom-select-option');
    options.forEach((opt, index) => {
      opt.classList.remove('focused');
      if (index === this.focusedIndex) {
        opt.classList.add('focused');
      }
    });
  }

  toggle() {
    if (this.isDisabled()) return;
    
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.isDisabled() || this.options.length === 0) return;

    // Cerrar otros dropdowns
    CustomDropdown.closeAllExcept(this);

    this.isOpen = true;
    this.wrapper.classList.add('active');
    this.focusedIndex = Math.max(0, this.options.findIndex(opt => (opt.value || opt) === this.selectedValue));
    this.updateFocusedOption();

    // Focus en el trigger para navegación por teclado
    this.trigger.focus();

    if (CONFIG.debug) {
      console.log(`📖 Dropdown ${this.wrapperId} abierto`);
    }
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.wrapper.classList.remove('active');
    this.focusedIndex = -1;
    this.updateFocusedOption();

    if (CONFIG.debug) {
      console.log(`📘 Dropdown ${this.wrapperId} cerrado`);
    }
  }

  handleKeyNavigation(e) {
    if (!this.isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        this.open();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.focusNext();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.focusPrevious();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.selectFocusedOption();
        break;
      case 'Escape':
        e.preventDefault();
        this.close();
        break;
      case 'Home':
        e.preventDefault();
        this.focusFirst();
        break;
      case 'End':
        e.preventDefault();
        this.focusLast();
        break;
    }
  }

  focusNext() {
    if (this.options.length === 0) return;
    
    do {
      this.focusedIndex = (this.focusedIndex + 1) % this.options.length;
    } while (this.options[this.focusedIndex]?.disabled);
    
    this.updateFocusedOption();
  }

  focusPrevious() {
    if (this.options.length === 0) return;
    
    do {
      this.focusedIndex = this.focusedIndex <= 0 ? this.options.length - 1 : this.focusedIndex - 1;
    } while (this.options[this.focusedIndex]?.disabled);
    
    this.updateFocusedOption();
  }

  selectFocusedOption() {
    if (this.focusedIndex >= 0 && this.focusedIndex < this.options.length) {
      const option = this.options[this.focusedIndex];
      if (!option.disabled) {
        this.selectOption(option.value || option, option.text || option);
        this.close();
      }
    }
  }

  focusFirst() {
    this.focusedIndex = 0;
    while (this.options[this.focusedIndex]?.disabled && this.focusedIndex < this.options.length - 1) {
      this.focusedIndex++;
    }
    this.updateFocusedOption();
  }

  focusLast() {
    this.focusedIndex = this.options.length - 1;
    while (this.options[this.focusedIndex]?.disabled && this.focusedIndex > 0) {
      this.focusedIndex--;
    }
    this.updateFocusedOption();
  }

  // Estados
  enable() {
    this.wrapper.classList.remove('disabled');
    this.trigger.setAttribute('tabindex', '0');
  }

  disable() {
    this.wrapper.classList.add('disabled');
    this.trigger.setAttribute('tabindex', '-1');
    this.close();
  }

  isDisabled() {
    return this.wrapper.classList.contains('disabled');
  }

  setLoading(loading = true) {
    if (loading) {
      this.wrapper.classList.add('loading');
    } else {
      this.wrapper.classList.remove('loading');
    }
  }

  reset() {
    this.selectedValue = null;
    this.selectedText = null;
    if (this.hiddenInput) this.hiddenInput.value = '';
    this.updateDisplayText();
    this.updateSelectedOption();
    this.close();
  }

  getValue() {
    return this.selectedValue;
  }

  setText(text) {
    this.selectedText = text;
    this.updateDisplayText();
  }

  // Método estático para cerrar todos los dropdowns excepto uno específico
  static closeAllExcept(exception = null) {
    if (window.customDropdowns) {
      window.customDropdowns.forEach(dropdown => {
        if (dropdown !== exception && dropdown.isOpen) {
          dropdown.close();
        }
      });
    }
  }

  // Método estático para cerrar todos los dropdowns
  static closeAll() {
    CustomDropdown.closeAllExcept();
  }
}

// ===============================================
// CLASE PRINCIPAL - FILTROS MANAGER V2 ACTUALIZADA
// ===============================================

class FiltrosManagerV2 {
  constructor() {
    this.inicializado = false;
    this.dropdowns = {};
  }

  // Inicialización principal
  inicializar() {
    if (this.inicializado) {
      console.warn("⚠️ FiltrosManagerV2 ya está inicializado");
      return;
    }

    console.log("🎯 Inicializando FiltrosManagerV2 con dropdowns personalizados...");
    
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
      
      // Wrappers de dropdowns personalizados
      tipoProductoWrapper: document.getElementById("tipo-de-producto-wrapper"),
      marcaWrapper: document.getElementById("marca-wrapper"),
      contenidoWrapper: document.getElementById("contenido-wrapper"),
      variedadWrapper: document.getElementById("variedad-wrapper"),
      
      // Inputs ocultos
      tipoProductoInput: document.getElementById("tipo-de-producto"),
      marcaInput: document.getElementById("marca"),
      contenidoInput: document.getElementById("contenido"),
      variedadInput: document.getElementById("variedad")
    };

    // Validar elementos críticos
    const elementosCriticos = ['productoInput', 'categoryMenu', 'tipoProductoWrapper'];
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
    this.inicializarDropdownsPersonalizados();
    this.ocultarFiltrosSecundarios(); // Estado inicial
  }

  // ===============================================
  // INICIALIZACIÓN DE DROPDOWNS PERSONALIZADOS
  // ===============================================

  inicializarDropdownsPersonalizados() {
    console.log("🎛️ Inicializando dropdowns personalizados...");

    // Registrar array global de dropdowns
    if (!window.customDropdowns) {
      window.customDropdowns = [];
    }

    // Inicializar dropdown de tipo de producto
    if (elementos.tipoProductoWrapper && elementos.tipoProductoInput) {
      this.dropdowns.tipoProducto = new CustomDropdown(
        'tipo-de-producto-wrapper',
        'tipo-de-producto',
        'Elegí una opción...'
      );
      this.dropdowns.tipoProducto.disable(); // Inicialmente deshabilitado
      window.customDropdowns.push(this.dropdowns.tipoProducto);
    }

    // Inicializar dropdowns secundarios
    const dropdownsSecundarios = [
      { key: 'marca', wrapper: 'marca-select-wrapper', input: 'marca', placeholder: 'Elegí la marca' },
      { key: 'contenido', wrapper: 'contenido-select-wrapper', input: 'contenido', placeholder: 'Elegí el contenido' },
      { key: 'variedad', wrapper: 'variedad-select-wrapper', input: 'variedad', placeholder: 'Elegí la variedad' }
    ];

    dropdownsSecundarios.forEach(({ key, wrapper, input, placeholder }) => {
      const wrapperElement = document.getElementById(wrapper);
      const inputElement = document.getElementById(input);
      
      if (wrapperElement && inputElement) {
        this.dropdowns[key] = new CustomDropdown(wrapper, input, placeholder);
        window.customDropdowns.push(this.dropdowns[key]);
      } else {
        console.warn(`⚠️ No se pudo inicializar dropdown ${key}: elementos no encontrados`);
      }
    });

    // Cargar opciones iniciales
    this.cargarTiposProducto();

    if (CONFIG.debug) {
      console.log("✅ Dropdowns personalizados inicializados:", Object.keys(this.dropdowns));
    }
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
    
    // NO aplicar búsqueda automáticamente, dejar que el usuario filtre manualmente
    
    // Actualizar el dropdown de tipo de producto para mostrar solo opciones relevantes
    this.filtrarTiposPorCategoria(categoria.id);
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
    
    // La búsqueda en tiempo real está desactivada para evitar filtrado excesivo
    // El filtrado se aplicará cuando el usuario seleccione una subcategoría del menú
  }

  manejarTeclasMenu(event) {
    // ESC para cerrar menú
    if (event.key === 'Escape') {
      this.ocultarMenuCategorias();
    }
  }

  // ===============================================
  // GESTIÓN DE DROPDOWNS DE TIPO DE PRODUCTO
  // ===============================================

  cargarTiposProducto() {
    if (!this.dropdowns.tipoProducto) return;
    
    console.log("📦 Cargando tipos de producto...");
    
    // Cargar todos los tipos ordenados, comenzando con "Todos"
    const opciones = [
      { value: 'todos', text: 'Todos' },
      ...DATOS_DEPURADOS.tiposProducto
        .filter(tipo => tipo.activo)
        .sort((a, b) => a.orden - b.orden)
        .map(tipo => ({
          value: tipo.id,
          text: tipo.nombre,
          categoria: tipo.categoria
        }))
    ];
    
    this.dropdowns.tipoProducto.loadOptions(opciones);
    
    if (CONFIG.debug) {
      console.log(`📦 ${opciones.length} tipos de producto cargados (incluyendo "Todos")`);
    }
  }

  filtrarTiposPorCategoria(categoriaId) {
    if (!this.dropdowns.tipoProducto) return;
    
    console.log(`🔍 Filtrando tipos de producto por categoría: ${categoriaId}`);
    
    // Filtrar y cargar solo tipos de la categoría seleccionada, comenzando con "Todos"
    const opcionesFiltradas = [
      { value: 'todos', text: 'Todos' },
      ...DATOS_DEPURADOS.tiposProducto
        .filter(tipo => tipo.activo && tipo.categoria === categoriaId)
        .sort((a, b) => a.orden - b.orden)
        .map(tipo => ({
          value: tipo.id,
          text: tipo.nombre,
          categoria: tipo.categoria
        }))
    ];
    
    this.dropdowns.tipoProducto.loadOptions(opcionesFiltradas);
    
    // Habilitar el dropdown
    this.dropdowns.tipoProducto.enable();
    this.dropdowns.tipoProducto.setPlaceholder();
    
    if (CONFIG.debug) {
      console.log(`✅ ${opcionesFiltradas.length} tipos de producto filtrados para categoría ${categoriaId} (incluyendo "Todos")`);
    }
  }

  // ===============================================
  // GESTIÓN DE DROPDOWNS SECUNDARIOS
  // ===============================================

  cargarOpcionesPorTipo(tipoProducto) {
    console.log(`📋 Cargando opciones para tipo: ${tipoProducto}`);
    
    // Cargar cada dropdown secundario
    this.cargarOpcionesDropdown('marca', DATOS_DEPURADOS.marcas[tipoProducto] || []);
    this.cargarOpcionesDropdown('contenido', DATOS_DEPURADOS.contenidos[tipoProducto] || []);
    this.cargarOpcionesDropdown('variedad', DATOS_DEPURADOS.variedades[tipoProducto] || []);
  }

  cargarOpcionesDropdown(dropdownKey, opciones) {
    const dropdown = this.dropdowns[dropdownKey];
    if (!dropdown) return;
    
    // Siempre agregar "Todos" al principio
    const opcionesFormateadas = [
      { value: 'todos', text: 'Todos' },
      ...opciones.map(opcion => ({
        value: opcion,
        text: opcion
      }))
    ];
    
    dropdown.loadOptions(opcionesFormateadas);
    
    if (CONFIG.debug) {
      console.log(`✅ ${opciones.length + 1} opciones cargadas en dropdown ${dropdownKey} (incluyendo "Todos")`);
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
    
    const dropdownKeys = ['marca', 'contenido', 'variedad'];
    
    wrappers.forEach((wrapper, index) => {
      if (!wrapper) return;
      
      // Animación de salida
      wrapper.style.transition = CONFIG.animaciones.transition;
      wrapper.style.opacity = '0';
      wrapper.style.transform = 'translateY(-10px)';
      wrapper.classList.remove('active');
      
      setTimeout(() => {
        wrapper.classList.add('d-none');
        
        // Resetear dropdown correspondiente
        const dropdownKey = dropdownKeys[index];
        if (this.dropdowns[dropdownKey]) {
          this.dropdowns[dropdownKey].reset();
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

    // Event listeners específicos para dropdowns personalizados
    this.configurarEventListenersDropdowns();
    
    if (CONFIG.debug) {
      console.log("🔗 Event listeners globales configurados");
    }
  }

  configurarEventListenersDropdowns() {
    // Listener para tipo de producto
    if (elementos.tipoProductoInput) {
      elementos.tipoProductoInput.addEventListener('change', (e) => {
        const valor = e.target.value;
        console.log(`🎯 Tipo de producto seleccionado: ${valor}`);
        
        // Si selecciona "Todos", resetear filtros secundarios
        if (valor === 'todos') {
          estado.actualizar('tipoProducto', null);
          this.ocultarFiltrosSecundarios();
          this.ocultarTablaProductos();
          return;
        }
        
        estado.actualizar('tipoProducto', valor);
        
        if (valor) {
          // Cargar opciones específicas para este tipo
          this.cargarOpcionesPorTipo(valor);
          
          // Mostrar filtros secundarios
          this.mostrarFiltrosSecundarios();
          
          // Mostrar tabla de productos
          this.mostrarTablaProductos();
          
          // NO aplicar filtros inicialmente, mostrar todos los productos
          // Los filtros se aplicarán cuando el usuario seleccione marca/contenido/variedad
        } else {
          this.ocultarFiltrosSecundarios();
          this.ocultarTablaProductos();
        }
      });
    }

    // Listeners para filtros secundarios
    const filtrosSecundarios = [
      { input: elementos.marcaInput, campo: 'marca' },
      { input: elementos.contenidoInput, campo: 'contenido' },
      { input: elementos.variedadInput, campo: 'variedad' }
    ];
    
    filtrosSecundarios.forEach(({input, campo}) => {
      if (input) {
        input.addEventListener('change', (e) => {
          const valor = e.target.value;
          
          // Si selecciona "Todos", pasar null al estado para resetear el filtro
          if (valor === 'todos') {
            estado.actualizar(campo, null);
          } else {
            estado.actualizar(campo, valor);
          }
          
          // Aplicar filtros a la tabla si está visible
          this.aplicarFiltrosATabla();
        });
      }
    });
  }

  // ===============================================
  // APLICACIÓN DE FILTROS A LA TABLA
  // ===============================================

  aplicarFiltrosATabla() {
    // Solo aplicar filtros si la tabla está visible e inicializada
    if (typeof tablaProductosInstance === 'undefined' || !tablaProductosInstance) {
      console.log('⚠️ Tabla no disponible para filtros');
      return;
    }

    const estadoActual = estado.obtener();
    
    if (CONFIG.debug) {
      console.log('🔍 Aplicando filtros a tabla:', estadoActual);
    }

    // Solo aplicar filtros si hay filtros activos (no null y no 'todos')
    const filtrosActivos = {
      marca: (estadoActual.marca && estadoActual.marca !== 'todos') ? estadoActual.marca : null,
      contenido: (estadoActual.contenido && estadoActual.contenido !== 'todos') ? estadoActual.contenido : null,
      variedad: (estadoActual.variedad && estadoActual.variedad !== 'todos') ? estadoActual.variedad : null,
      subcategoria: estadoActual.subcategoria || null
    };

    // Si no hay filtros activos, mostrar todos los productos
    const tieneAlgunFiltro = Object.values(filtrosActivos).some(filtro => filtro !== null);
    
    if (!tieneAlgunFiltro) {
      if (CONFIG.debug) {
        console.log('🔄 No hay filtros activos, mostrando todos los productos');
      }
      tablaProductosInstance.productosFiltrados = [...tablaProductosInstance.productos];
      tablaProductosInstance.productosVisibles = 6;
      tablaProductosInstance.mostrarProductos();
    } else {
      // Aplicar filtros a la tabla
      tablaProductosInstance.aplicarFiltros(filtrosActivos);
    }
  }

  aplicarBusquedaATabla(textoBusqueda) {
    // Solo aplicar búsqueda si la tabla está visible e inicializada
    if (typeof tablaProductosInstance === 'undefined' || !tablaProductosInstance) {
      return;
    }

    if (CONFIG.debug) {
      console.log('🔍 Aplicando búsqueda a tabla:', textoBusqueda);
    }

    tablaProductosInstance.buscarProductos(textoBusqueda);
  }

  // ===============================================
  // GESTIÓN DE TABLA DE PRODUCTOS
  // ===============================================

  mostrarTablaProductos() {
    // Ocultar el estado vacío
    const estadoVacio = document.getElementById('productos-area-vacia');
    if (estadoVacio) {
      estadoVacio.style.display = 'none';
    }
    
    // Mostrar contenedor de tabla
    const contenedorTabla = document.getElementById('contenedor-tabla-productos');
    if (contenedorTabla) {
      contenedorTabla.style.display = 'block';
      
      // Inicializar tabla si existe la función global
      if (typeof inicializarTablaProductos === 'function') {
        try {
          inicializarTablaProductos();
          
          // Mostrar todos los productos inicialmente (sin filtros)
          setTimeout(() => {
            if (tablaProductosInstance) {
              tablaProductosInstance.productosFiltrados = [...tablaProductosInstance.productos];
              tablaProductosInstance.productosVisibles = 6;
              tablaProductosInstance.mostrarProductos();
            }
          }, 100);
          
          if (CONFIG.debug) {
            console.log('✅ Tabla de productos inicializada - Mostrando todos los productos');
          }
        } catch (error) {
          console.error('❌ Error al inicializar tabla de productos:', error);
        }
      } else {
        console.warn('⚠️ Función inicializarTablaProductos no disponible');
      }
    }
  }
  
  ocultarTablaProductos() {
    // Mostrar el estado vacío
    const estadoVacio = document.getElementById('productos-area-vacia');
    if (estadoVacio) {
      estadoVacio.style.display = 'flex';
    }
    
    // Ocultar contenedor de tabla
    const contenedorTabla = document.getElementById('contenedor-tabla-productos');
    if (contenedorTabla) {
      contenedorTabla.style.display = 'none';
      
      // Destruir tabla si existe la instancia global
      if (typeof tablaProductosInstance !== 'undefined' && tablaProductosInstance) {
        try {
          tablaProductosInstance.destruir();
          if (CONFIG.debug) {
            console.log('✅ Tabla de productos destruida');
          }
        } catch (error) {
          console.error('❌ Error al destruir tabla de productos:', error);
        }
      }
    }
  }

  manejarCambioFiltro(detalle) {
    const { campo, valor, estadoCompleto } = detalle;
    
    if (CONFIG.debug) {
      console.log(`🔄 Filtro cambiado externamente: ${campo} = ${valor}`);
      console.log('📊 Estado completo de filtros:', estadoCompleto);
    }
    
    // Los filtros están funcionando, pero ya no generamos productos
    // Esta funcionalidad se implementará en el futuro
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
    
    // Resetear y deshabilitar dropdown de tipo de producto
    if (this.dropdowns.tipoProducto) {
      this.dropdowns.tipoProducto.reset();
      this.dropdowns.tipoProducto.disable();
    }
    
    // Ocultar filtros secundarios
    this.ocultarFiltrosSecundarios();
    
    // Ocultar tabla de productos
    this.ocultarTablaProductos();
    
    // Cerrar todos los dropdowns
    CustomDropdown.closeAll();
    
    // Resetear estado
    estado.resetear();
    
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
      dropdowns: Object.keys(this.dropdowns),
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
// FUNCIONES GLOBALES SIMPLIFICADAS
// ===============================================

// NOTA: La función agregarProducto fue eliminada junto con la tabla
// de productos. Esta funcionalidad se implementará en el futuro.

console.log("📦 FiltrosManagerV2 simplificado cargado - Sistema listo");

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
  
  // Gestión de tabla de productos
  mostrarTablaProductos: () => filtrosManager.mostrarTablaProductos(),
  ocultarTablaProductos: () => filtrosManager.ocultarTablaProductos(),
  aplicarFiltrosATabla: () => filtrosManager.aplicarFiltrosATabla(),
  aplicarBusquedaATabla: (texto) => filtrosManager.aplicarBusquedaATabla(texto),
  
  // Utilidades
  debug: () => filtrosManager.debug(),
  configurarCallbacks: (callbacks) => filtrosManager.configurarCallbacks(callbacks),
  
  // Datos
  obtenerDatos: () => DATOS_DEPURADOS
};

// Alias para compatibilidad
window.FormManagerDinamico = window.FiltrosManager;