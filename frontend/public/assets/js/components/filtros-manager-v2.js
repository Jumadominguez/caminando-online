// ===============================================
// FILTROS MANAGER V2 - INTEGRACIÓN COMPLETA CON BOTÓN LIMPIAR FILTROS
// ===============================================

/**
 * Sistema de filtros integrado para Caminando Online V2
 * - Dropdowns completamente personalizados
 * - ✅ INTEGRACIÓN COMPLETA CON BOTÓN LIMPIAR FILTROS
 * - Eventos sincronizados con productos.js
 * - Manejo correcto de estados
 */

// ===============================================
// DATOS MOCK DEPURADOS
// ===============================================

const DATOS_DEPURADOS = {
  categorias: [
    {
      id: "alimentos",
      nombre: "🍎 Alimentos",
      subcategorias: ["Leche", "Yogurt", "Queso", "Manteca", "Crema", "Dulce de leche", "Agua", "Gaseosas", "Jugos", "Cervezas", "Vinos", "Pollo", "Carne vacuna", "Cerdo", "Pescado", "Embutidos", "Pan", "Galletitas", "Tostadas", "Bizcochos", "Tomate", "Lechuga", "Cebolla", "Papa", "Manzana", "Banana", "Pizza congelada", "Helados", "Papas fritas", "Empanadas", "Arroz", "Fideos", "Harina", "Aceite", "Azúcar", "Sal"]
    },
    {
      id: "limpieza",
      nombre: "🧽 Limpieza y Hogar",
      subcategorias: ["Detergente", "Lavandina", "Jabón en polvo", "Suavizante", "Desinfectante", "Limpiador multiuso", "Papel higiénico", "Servilletas", "Pañuelos", "Rollos de cocina", "Esponjas", "Guantes", "Bolsas de basura"]
    },
    {
      id: "cuidado_personal", 
      nombre: "🧴 Cuidado Personal",
      subcategorias: ["Shampoo", "Acondicionador", "Jabón líquido", "Desodorante", "Crema corporal", "Protector solar", "Pasta dental", "Maquillaje", "Perfumes", "Afeitadoras"]
    },
    {
      id: "mascotas",
      nombre: "🐕 Mascotas", 
      subcategorias: ["Alimento para perros", "Alimento para gatos", "Arena para gatos", "Juguetes para mascotas", "Correas", "Snacks para mascotas", "Medicamentos veterinarios"]
    },
    {
      id: "bebes",
      nombre: "👶 Bebés y Niños",
      subcategorias: ["Pañales", "Toallitas húmedas", "Leche en polvo", "Papillas", "Chupetes", "Biberones", "Juguetes infantiles", "Cremas para bebé"]
    }
  ],

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

// ===============================================
// CONFIGURACIÓN
// ===============================================

const CONFIG = {
  textos: {
    placeholder_producto: "Escribí el nombre del producto (ej: leche, pan, detergente...)",
    placeholder_marca: "Elegí la marca",
    placeholder_contenido: "Elegí el contenido", 
    placeholder_variedad: "Elegí la variedad"
  },
  animaciones: {
    duracion: 300,
    delay_escalonado: 100,
    transition: 'all 0.3s ease'
  },
  debug: true
};

// ===============================================
// ESTADO GLOBAL
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
    document.dispatchEvent(new CustomEvent('filtrosCambiados', {
      detail: { campo, valor, estadoCompleto: this.obtener() }
    }));

    if (CONFIG.debug) {
      console.log(`📡 Filtro cambiado: ${campo} = ${valor}`, this.obtener());
    }
  }
}

const estado = new EstadoFiltros();
let elementos = {};

// ===============================================
// DROPDOWN PERSONALIZADO
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
    
    this.initializeElements();
    this.setupEventListeners();
  }

  initializeElements() {
    this.wrapper = document.getElementById(this.wrapperId);
    this.hiddenInput = document.getElementById(this.hiddenInputId);
    
    if (!this.wrapper || !this.hiddenInput) {
      console.error(`CustomDropdown: Elementos no encontrados - ${this.wrapperId}`);
      return;
    }

    this.trigger = this.wrapper.querySelector('.custom-select-trigger');
    this.textElement = this.wrapper.querySelector('.custom-select-text');
    this.optionsContainer = this.wrapper.querySelector('.custom-select-options');

    if (!this.trigger || !this.textElement || !this.optionsContainer) {
      console.error(`CustomDropdown: Elementos internos no encontrados en ${this.wrapperId}`);
      return;
    }

    this.setPlaceholder();
  }

  setupEventListeners() {
    if (!this.trigger) return;

    this.trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });

    document.addEventListener('click', (e) => {
      if (!this.wrapper.contains(e.target)) {
        this.close();
      }
    });
  }

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

    this.options.forEach((option) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'custom-select-option';
      optionElement.textContent = option.text || option;
      optionElement.setAttribute('data-value', option.value || option);

      if (this.selectedValue === (option.value || option)) {
        optionElement.classList.add('selected');
      }

      optionElement.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectOption(option.value || option, option.text || option);
        this.close();
      });

      this.optionsContainer.appendChild(optionElement);
    });
  }

  selectOption(value, text) {
    this.selectedValue = value;
    this.selectedText = text;

    if (this.hiddenInput) {
      this.hiddenInput.value = value;
      this.hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    this.updateDisplayText();
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

    CustomDropdown.closeAllExcept(this);

    this.isOpen = true;
    this.wrapper.classList.add('active');

    if (CONFIG.debug) {
      console.log(`📖 Dropdown ${this.wrapperId} abierto`);
    }
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.wrapper.classList.remove('active');

    if (CONFIG.debug) {
      console.log(`📘 Dropdown ${this.wrapperId} cerrado`);
    }
  }

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

  /**
   * ✅ MÉTODO RESET MEJORADO PARA INTEGRACIÓN
   */
  reset() {
    this.selectedValue = null;
    this.selectedText = null;
    
    if (this.hiddenInput) {
      this.hiddenInput.value = '';
    }
    
    this.updateDisplayText();
    this.updateSelectedOption();
    this.close();
    
    if (CONFIG.debug) {
      console.log(`🔄 Dropdown ${this.wrapperId} reseteado`);
    }
  }

  getValue() {
    return this.selectedValue;
  }

  static closeAllExcept(exception = null) {
    if (window.customDropdowns) {
      window.customDropdowns.forEach(dropdown => {
        if (dropdown !== exception && dropdown.isOpen) {
          dropdown.close();
        }
      });
    }
  }

  static closeAll() {
    CustomDropdown.closeAllExcept();
  }
}

// ===============================================
// FILTROS MANAGER PRINCIPAL
// ===============================================

class FiltrosManagerV2 {
  constructor() {
    this.inicializado = false;
    this.dropdowns = {};
    
    // ✅ CONFIGURAR LISTENERS DE INTEGRACIÓN
    this.configurarIntegracion();
  }

  // ✅ CONFIGURACIÓN DE INTEGRACIÓN CON BOTÓN LIMPIAR FILTROS
  configurarIntegracion() {
    // Listener para evento de limpieza global
    document.addEventListener('filtrosLimpiados', (event) => {
      console.log("🧹 FiltrosManager recibió evento de limpieza global");
      this.manejarLimpiezaGlobal(event.detail);
    });
    
    // Listener para evento de reseteo (compatibilidad)
    document.addEventListener('resetearFiltros', () => {
      console.log("🧹 FiltrosManager recibió evento de reseteo");
      this.manejarLimpiezaGlobal();
    });
    
    if (CONFIG.debug) {
      console.log("✅ Integración de eventos configurada en FiltrosManager");
    }
  }

  // ✅ MANEJA LIMPIEZA DESDE EL BOTÓN PRINCIPAL
  manejarLimpiezaGlobal(detalle = null) {
    console.log("🧽 Ejecutando limpieza completa en FiltrosManager...");
    
    // Hacer reset completo usando método público
    this.resetearTodo();
    
    console.log("✅ Limpieza completa finalizada en FiltrosManager");
  }

  inicializar() {
    if (this.inicializado) {
      console.warn("⚠️ FiltrosManagerV2 ya está inicializado");
      return;
    }

    console.log("🎯 Inicializando FiltrosManagerV2 con integración completa...");
    
    if (!this.obtenerElementosDOM()) {
      console.error("❌ No se pudieron obtener elementos DOM críticos");
      return;
    }
    
    this.inicializarComponentes();
    this.configurarEventListeners();
    
    this.inicializado = true;
    console.log("✅ FiltrosManagerV2 inicializado correctamente");
  }

  obtenerElementosDOM() {
    elementos = {
      productoInput: document.getElementById("producto"),
      categoryMenu: document.getElementById("categoryMenu"),
      tipoProductoWrapper: document.getElementById("tipo-de-producto-wrapper"),
      marcaWrapper: document.getElementById("marca-wrapper"),
      contenidoWrapper: document.getElementById("contenido-wrapper"),
      variedadWrapper: document.getElementById("variedad-wrapper"),
      tipoProductoInput: document.getElementById("tipo-de-producto"),
      marcaInput: document.getElementById("marca"),
      contenidoInput: document.getElementById("contenido"),
      variedadInput: document.getElementById("variedad")
    };

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

  inicializarComponentes() {
    this.inicializarFiltroCategorias();
    this.inicializarDropdownsPersonalizados();
    this.ocultarFiltrosSecundarios();
  }

  inicializarDropdownsPersonalizados() {
    console.log("🎛️ Inicializando dropdowns personalizados...");

    if (!window.customDropdowns) {
      window.customDropdowns = [];
    }

    // Dropdown tipo de producto
    if (elementos.tipoProductoWrapper && elementos.tipoProductoInput) {
      this.dropdowns.tipoProducto = new CustomDropdown(
        'tipo-de-producto-wrapper',
        'tipo-de-producto',
        'Elegí una opción...'
      );
      this.dropdowns.tipoProducto.disable();
      window.customDropdowns.push(this.dropdowns.tipoProducto);
    }

    // Dropdowns secundarios
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
      }
    });

    this.cargarTiposProducto();

    if (CONFIG.debug) {
      console.log("✅ Dropdowns personalizados inicializados:", Object.keys(this.dropdowns));
    }
  }

  inicializarFiltroCategorias() {
    console.log("📋 Inicializando filtro de categorías...");
    
    if (!elementos.productoInput || !elementos.categoryMenu) {
      console.warn("⚠️ Elementos de categorías no encontrados");
      return;
    }
    
    elementos.productoInput.addEventListener('click', () => this.mostrarMenuCategorias());
    elementos.productoInput.addEventListener('input', () => this.filtrarMenuCategorias());
    elementos.productoInput.addEventListener('keydown', (e) => this.manejarTeclasMenu(e));
    
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
    
    const titulo = document.createElement('div');
    titulo.classList.add('category-title');
    titulo.textContent = categoria.nombre;
    grupo.appendChild(titulo);
    
    const lista = document.createElement('ul');
    lista.classList.add('subcategory-list');
    
    categoria.subcategorias.forEach(subcategoria => {
      const item = document.createElement('li');
      item.classList.add('subcategory-item');
      item.textContent = subcategoria;
      item.setAttribute('data-subcategoria', subcategoria);
      item.setAttribute('data-categoria-padre', categoria.id);
      
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
    
    if (elementos.productoInput) {
      elementos.productoInput.value = subcategoria;
    }
    
    this.ocultarMenuCategorias();
    
    estado.actualizar('categoria', categoria.id);
    estado.actualizar('subcategoria', subcategoria);
    
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
    
    if (elementos.categoryMenu.style.display === 'none') {
      elementos.categoryMenu.style.display = 'block';
    }
  }

  manejarTeclasMenu(event) {
    if (event.key === 'Escape') {
      this.ocultarMenuCategorias();
    }
  }

  cargarTiposProducto() {
    if (!this.dropdowns.tipoProducto) return;
    
    console.log("📦 Cargando tipos de producto...");
    
    const opciones = DATOS_DEPURADOS.tiposProducto
      .filter(tipo => tipo.activo)
      .sort((a, b) => a.orden - b.orden)
      .map(tipo => ({
        value: tipo.id,
        text: tipo.nombre,
        categoria: tipo.categoria
      }));
    
    this.dropdowns.tipoProducto.loadOptions(opciones);
    
    if (CONFIG.debug) {
      console.log(`✅ ${opciones.length} tipos de producto cargados`);
    }
  }

  filtrarTiposPorCategoria(categoriaId) {
    if (!this.dropdowns.tipoProducto) return;
    
    console.log(`🔍 Filtrando tipos de producto por categoría: ${categoriaId}`);
    
    const opcionesFiltradas = DATOS_DEPURADOS.tiposProducto
      .filter(tipo => tipo.activo && tipo.categoria === categoriaId)
      .sort((a, b) => a.orden - b.orden)
      .map(tipo => ({
        value: tipo.id,
        text: tipo.nombre,
        categoria: tipo.categoria
      }));
    
    this.dropdowns.tipoProducto.loadOptions(opcionesFiltradas);
    this.dropdowns.tipoProducto.enable();
    this.dropdowns.tipoProducto.setPlaceholder();
    
    if (CONFIG.debug) {
      console.log(`✅ ${opcionesFiltradas.length} tipos de producto filtrados para categoría ${categoriaId}`);
    }
  }

  cargarOpcionesPorTipo(tipoProducto) {
    console.log(`📋 Cargando opciones para tipo: ${tipoProducto}`);
    
    this.cargarOpcionesDropdown('marca', DATOS_DEPURADOS.marcas[tipoProducto] || []);
    this.cargarOpcionesDropdown('contenido', DATOS_DEPURADOS.contenidos[tipoProducto] || []);
    this.cargarOpcionesDropdown('variedad', DATOS_DEPURADOS.variedades[tipoProducto] || []);
  }

  cargarOpcionesDropdown(dropdownKey, opciones) {
    const dropdown = this.dropdowns[dropdownKey];
    if (!dropdown) return;
    
    const opcionesFormateadas = opciones.map(opcion => ({
      value: opcion,
      text: opcion
    }));
    
    dropdown.loadOptions(opcionesFormateadas);
    
    if (CONFIG.debug) {
      console.log(`✅ ${opciones.length} opciones cargadas en dropdown ${dropdownKey}`);
    }
  }

  mostrarFiltrosSecundarios() {
    const wrappers = [elementos.marcaWrapper, elementos.contenidoWrapper, elementos.variedadWrapper];
    
    wrappers.forEach((wrapper, index) => {
      if (!wrapper) return;
      
      wrapper.classList.remove('d-none');
      
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
    const wrappers = [elementos.marcaWrapper, elementos.contenidoWrapper, elementos.variedadWrapper];
    const dropdownKeys = ['marca', 'contenido', 'variedad'];
    
    wrappers.forEach((wrapper, index) => {
      if (!wrapper) return;
      
      wrapper.style.transition = CONFIG.animaciones.transition;
      wrapper.style.opacity = '0';
      wrapper.style.transform = 'translateY(-10px)';
      wrapper.classList.remove('active');
      
      setTimeout(() => {
        wrapper.classList.add('d-none');
        
        const dropdownKey = dropdownKeys[index];
        if (this.dropdowns[dropdownKey]) {
          this.dropdowns[dropdownKey].reset();
        }
      }, CONFIG.animaciones.duracion);
    });
    
    estado.actualizar('marca', null);
    estado.actualizar('contenido', null);
    estado.actualizar('variedad', null);
    
    if (CONFIG.debug) {
      console.log("✅ Filtros secundarios ocultados");
    }
  }

  configurarEventListeners() {
    console.log("🔗 Configurando event listeners globales...");
    
    document.addEventListener('filtrosCambiados', (e) => {
      this.manejarCambioFiltro(e.detail);
    });

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
        
        estado.actualizar('tipoProducto', valor);
        
        if (valor) {
          this.cargarOpcionesPorTipo(valor);
          this.mostrarFiltrosSecundarios();
          
          // Mostrar tabla usando función global
          if (typeof mostrarTablaProductos === 'function') {
            mostrarTablaProductos();
          }
        } else {
          this.ocultarFiltrosSecundarios();
          
          // Ocultar tabla usando función global
          if (typeof ocultarTablaProductos === 'function') {
            ocultarTablaProductos();
          }
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
          estado.actualizar(campo, valor);
          this.aplicarFiltrosATabla();
        });
      }
    });
  }

  aplicarFiltrosATabla() {
    if (typeof tablaProductosInstance === 'undefined' || !tablaProductosInstance) {
      console.log('⚠️ Tabla no disponible para filtros');
      return;
    }

    const estadoActual = estado.obtener();
    
    if (CONFIG.debug) {
      console.log('🔍 Aplicando filtros a tabla:', estadoActual);
    }

    const filtrosParaTabla = {
      marca: estadoActual.marca || '',
      contenido: estadoActual.contenido || '',
      variedad: estadoActual.variedad || ''
    };

    if (tablaProductosInstance.filtrosActivos) {
      tablaProductosInstance.filtrosActivos = filtrosParaTabla;
      
      if (typeof tablaProductosInstance.aplicarFiltros === 'function') {
        tablaProductosInstance.aplicarFiltros();
      }
    }
  }

  manejarCambioFiltro(detalle) {
    const { campo, valor, estadoCompleto } = detalle;
    
    if (CONFIG.debug) {
      console.log(`🔄 Filtro cambiado externamente: ${campo} = ${valor}`);
      console.log('📊 Estado completo de filtros:', estadoCompleto);
    }
  }

  normalizarTexto(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  obtenerEstado() {
    return estado.obtener();
  }

  /**
   * ✅ MÉTODO RESETEAR TODO MEJORADO PARA INTEGRACIÓN
   */
  resetearTodo() {
    console.log("🔄 Reseteando todos los filtros en FiltrosManager...");
    
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
    
    // Cerrar todos los dropdowns
    CustomDropdown.closeAll();
    
    // Resetear estado
    estado.resetear();
    
    console.log("✅ Todos los filtros reseteados en FiltrosManager");
  }

  configurarCallbacks(callbacks) {
    this.callbacks = callbacks || {};
  }

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

console.log("📦 FiltrosManagerV2 CON INTEGRACIÓN COMPLETA cargado - Sistema listo");

// ===============================================
// INICIALIZACIÓN Y API PÚBLICA
// ===============================================

const filtrosManager = new FiltrosManagerV2();

// Auto-inicialización
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => filtrosManager.inicializar(), 100);
  });
} else {
  setTimeout(() => filtrosManager.inicializar(), 100);
}

// API pública
window.FiltrosManager = {
  inicializar: () => filtrosManager.inicializar(),
  obtenerEstado: () => filtrosManager.obtenerEstado(),
  resetear: () => filtrosManager.resetearTodo(),
  mostrarCategorias: () => filtrosManager.mostrarMenuCategorias(),
  ocultarCategorias: () => filtrosManager.ocultarMenuCategorias(),
  mostrarFiltrosSecundarios: () => filtrosManager.mostrarFiltrosSecundarios(),
  ocultarFiltrosSecundarios: () => filtrosManager.ocultarFiltrosSecundarios(),
  aplicarFiltrosATabla: () => filtrosManager.aplicarFiltrosATabla(),
  debug: () => filtrosManager.debug(),
  configurarCallbacks: (callbacks) => filtrosManager.configurarCallbacks(callbacks),
  obtenerDatos: () => DATOS_DEPURADOS
};

// Alias para compatibilidad
window.FormManagerDinamico = window.FiltrosManager;