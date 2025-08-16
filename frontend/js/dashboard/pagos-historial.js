/* =====================================================
   💳 LÓGICA DE PAGOS E HISTORIAL - pagos-historial.js
   ===================================================== */

class PaymentsManager {
  constructor() {
    this.user = null;
    this.paymentMethods = [];
    this.purchaseHistory = [];
    this.currentPage = 1;
    this.filters = {};
    this.stats = null;
    
    this.init();
  }

  async init() {
    // Verificar autenticación
    if (!AuthUtils.isLoggedIn()) {
      AuthUtils.redirectIfNotLoggedIn();
      return;
    }

    // Cargar datos del usuario
    await this.loadUserData();
    
    // Configurar UI
    this.setupUI();
    
    // Configurar event listeners
    this.setupEventListeners();
    
    // Cargar datos
    await this.loadPaymentMethods();
    await this.loadPurchaseHistory();
    await this.loadPaymentStats();
    
    console.log('✅ Payments manager inicializado');
  }

  async loadUserData() {
    try {
      const response = await APIUtils.get('/auth/profile', AuthUtils.getToken());
      
      if (response.success) {
        this.user = response.usuario;
        this.updateUserHeader();
      }

    } catch (error) {
      console.error('❌ Error cargando datos del usuario:', error);
      
      if (error.message.includes('Token') || error.message.includes('401')) {
        AuthUtils.logout();
      }
    }
  }

  updateUserHeader() {
    if (!this.user) return;

    const userName = document.getElementById('user-name');
    if (userName) {
      userName.textContent = this.user.nombre || 'Usuario';
    }

    const userEmail = document.getElementById('user-email');
    if (userEmail) {
      userEmail.textContent = this.user.email || '';
    }

    const userInitials = document.getElementById('user-initials');
    if (userInitials) {
      const initials = this.generateInitials(this.user.nombre, this.user.apellido);
      userInitials.textContent = initials;
    }
  }

  generateInitials(nombre, apellido) {
    const first = nombre ? nombre.charAt(0).toUpperCase() : '';
    const last = apellido ? apellido.charAt(0).toUpperCase() : '';
    return (first + last) || 'CU';
  }

  async loadPaymentMethods() {
    try {
      // Por ahora simulamos datos, luego conectaremos con la API real
      this.paymentMethods = this.getMockPaymentMethods();
      this.updatePaymentMethodsList();

    } catch (error) {
      console.error('❌ Error cargando métodos de pago:', error);
      this.setEmptyPaymentMethods();
    }
  }

  async loadPurchaseHistory() {
    try {
      // Por ahora simulamos datos, luego conectaremos con la API real
      this.purchaseHistory = this.getMockPurchaseHistory();
      this.updatePurchaseHistoryList();

    } catch (error) {
      console.error('❌ Error cargando historial:', error);
      this.setEmptyPurchaseHistory();
    }
  }

  async loadPaymentStats() {
    try {
      // Por ahora simulamos datos, luego conectaremos con la API real
      this.stats = this.getMockStats();
      this.updateStatsCards();

    } catch (error) {
      console.error('❌ Error cargando estadísticas:', error);
      this.setDefaultStats();
    }
  }

  getMockPaymentMethods() {
    return [
      {
        id: '1',
        tipo: 'tarjeta_credito',
        alias: 'Visa Personal',
        ultimosDigitos: '1234',
        banco: 'Santander',
        esPrincipal: true,
        fechaCreacion: new Date('2024-01-15')
      },
      {
        id: '2',
        tipo: 'mercadopago',
        alias: 'MercadoPago',
        email: 'usuario@email.com',
        esPrincipal: false,
        fechaCreacion: new Date('2024-02-10')
      }
    ];
  }

  getMockPurchaseHistory() {
    return [
      {
        id: 'CO-2025-001',
        fecha: new Date('2025-08-10'),
        supermercados: ['Carrefour', 'Disco'],
        total: 15420,
        ahorro: 2340,
        estado: 'entregado',
        productos: [
          { nombre: 'Leche La Serenísima 1L', cantidad: 2, precio: 890 },
          { nombre: 'Pan Lactal Bimbo', cantidad: 1, precio: 650 },
          { nombre: 'Yogur Ser 200g x4', cantidad: 1, precio: 980 }
        ]
      },
      {
        id: 'CO-2025-002',
        fecha: new Date('2025-08-05'),
        supermercados: ['Jumbo'],
        total: 8900,
        ahorro: 1200,
        estado: 'procesando',
        productos: [
          { nombre: 'Aceite Natura 900ml', cantidad: 1, precio: 1200 },
          { nombre: 'Arroz Gallo 1kg', cantidad: 2, precio: 890 }
        ]
      }
    ];
  }

  getMockStats() {
    return {
      totalGastado: 45620,
      totalAhorrado: 8340,
      comprasMes: 5,
      promedioAhorro: 18.5
    };
  }

  updateStatsCards() {
    if (!this.stats) return;

    const totalGastado = document.getElementById('total-gastado');
    if (totalGastado) {
      totalGastado.textContent = this.formatCurrency(this.stats.totalGastado);
    }

    const totalAhorrado = document.getElementById('total-ahorrado');
    if (totalAhorrado) {
      totalAhorrado.textContent = this.formatCurrency(this.stats.totalAhorrado);
    }

    const comprasMes = document.getElementById('compras-mes');
    if (comprasMes) {
      comprasMes.textContent = this.stats.comprasMes;
    }

    const promedioAhorro = document.getElementById('promedio-ahorro');
    if (promedioAhorro) {
      promedioAhorro.textContent = `${this.stats.promedioAhorro}%`;
    }
  }

  setDefaultStats() {
    document.getElementById('total-gastado').textContent = '$0';
    document.getElementById('total-ahorrado').textContent = '$0';
    document.getElementById('compras-mes').textContent = '0';
    document.getElementById('promedio-ahorro').textContent = '0%';
  }

  updatePaymentMethodsList() {
    const list = document.getElementById('payment-methods-list');
    
    if (!this.paymentMethods || this.paymentMethods.length === 0) {
      this.setEmptyPaymentMethods();
      return;
    }

    const methodsHTML = this.paymentMethods.map(method => {
      const icon = this.getPaymentMethodIcon(method.tipo);
      const displayText = this.getPaymentMethodDisplayText(method);
      
      return `
        <div class="payment-method-item ${method.esPrincipal ? 'payment-method-primary' : ''}" data-method-id="${method.id}">
          <div class="payment-method-info">
            <div class="payment-method-header">
              <div class="payment-method-icon">${icon}</div>
              <div class="payment-method-details">
                <div class="payment-method-alias">${method.alias}</div>
                <div class="payment-method-text">${displayText}</div>
              </div>
              ${method.esPrincipal ? '<span class="badge bg-primary">Principal</span>' : ''}
            </div>
            <div class="payment-method-meta">
              Agregado el ${this.formatDate(method.fechaCreacion)}
            </div>
          </div>
          <div class="payment-method-actions">
            <button class="btn btn-outline-primary btn-sm" onclick="paymentsManager.editPaymentMethod('${method.id}')">
              <i class="btn-icon">✏️</i>
              Editar
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="paymentsManager.deletePaymentMethod('${method.id}')">
              <i class="btn-icon">🗑️</i>
              Eliminar
            </button>
          </div>
        </div>
      `;
    }).join('');

    list.innerHTML = methodsHTML;
  }

  setEmptyPaymentMethods() {
    const list = document.getElementById('payment-methods-list');
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💳</div>
        <div class="empty-text">
          <div class="empty-title">No hay métodos de pago guardados</div>
          <div class="empty-subtitle">Agregá una tarjeta o cuenta para realizar compras</div>
        </div>
        <button class="btn btn-outline-primary btn-sm" id="add-first-payment-btn">
          Agregar método de pago
        </button>
      </div>
    `;

    // Re-attach event listener
    document.getElementById('add-first-payment-btn').addEventListener('click', () => {
      this.openPaymentMethodModal();
    });
  }

  updatePurchaseHistoryList() {
    const list = document.getElementById('purchases-list');
    
    if (!this.purchaseHistory || this.purchaseHistory.length === 0) {
      this.setEmptyPurchaseHistory();
      return;
    }

    const historyHTML = this.purchaseHistory.map(purchase => {
      const statusBadge = this.getStatusBadge(purchase.estado);
      const supermercadosText = purchase.supermercados.join(', ');
      
      return `
        <div class="purchase-item" data-purchase-id="${purchase.id}">
          <div class="purchase-header">
            <div class="purchase-info">
              <div class="purchase-id">#${purchase.id}</div>
              <div class="purchase-date">${this.formatDate(purchase.fecha)}</div>
            </div>
            <div class="purchase-status">
              ${statusBadge}
            </div>
          </div>
          <div class="purchase-details">
            <div class="purchase-summary">
              <div class="purchase-stores">
                <strong>Supermercados:</strong> ${supermercadosText}
              </div>
              <div class="purchase-products">
                <strong>Productos:</strong> ${purchase.productos.length} artículos
              </div>
            </div>
            <div class="purchase-amounts">
              <div class="purchase-total">
                <strong>Total:</strong> ${this.formatCurrency(purchase.total)}
              </div>
              <div class="purchase-savings">
                <strong>Ahorro:</strong> ${this.formatCurrency(purchase.ahorro)}
              </div>
            </div>
          </div>
          <div class="purchase-actions">
            <button class="btn btn-outline-primary btn-sm" onclick="paymentsManager.viewPurchaseDetails('${purchase.id}')">
              <i class="btn-icon">👁️</i>
              Ver detalles
            </button>
            <button class="btn btn-outline-secondary btn-sm" onclick="paymentsManager.reorderPurchase('${purchase.id}')">
              <i class="btn-icon">🔄</i>
              Comprar nuevamente
            </button>
          </div>
        </div>
      `;
    }).join('');

    list.innerHTML = historyHTML;
  }

  setEmptyPurchaseHistory() {
    const list = document.getElementById('purchases-list');
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛍️</div>
        <div class="empty-text">
          <div class="empty-title">No hay compras registradas</div>
          <div class="empty-subtitle">¡Realizá tu primera compra para ver el historial aquí!</div>
        </div>
        <a href="/index.html" class="btn btn-outline-primary btn-sm">
          Comparar productos
        </a>
      </div>
    `;
  }

  getPaymentMethodIcon(tipo) {
    const icons = {
      'tarjeta_credito': '💳',
      'tarjeta_debito': '💳',
      'mercadopago': '🔵',
      'modo': '🟣',
      'cuenta_corriente': '🏦'
    };
    return icons[tipo] || '💳';
  }

  getPaymentMethodDisplayText(method) {
    switch (method.tipo) {
      case 'tarjeta_credito':
      case 'tarjeta_debito':
        return `***${method.ultimosDigitos} - ${method.banco}`;
      case 'mercadopago':
        return method.email;
      case 'modo':
        return `CBU: ***${method.cbu?.slice(-4) || '0000'}`;
      default:
        return 'Método de pago';
    }
  }

  getStatusBadge(estado) {
    const badges = {
      'pendiente': '<span class="badge bg-warning">⏳ Pendiente</span>',
      'procesando': '<span class="badge bg-info">⚙️ Procesando</span>',
      'confirmado': '<span class="badge bg-primary">✅ Confirmado</span>',
      'entregado': '<span class="badge bg-success">📦 Entregado</span>',
      'cancelado': '<span class="badge bg-danger">❌ Cancelado</span>'
    };
    return badges[estado] || '<span class="badge bg-secondary">❓ Desconocido</span>';
  }

  setupUI() {
    document.title = 'Pagos e Historial - Caminando Online';
    
    // Configurar fechas por defecto en filtros
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    document.getElementById('filter-fecha-desde').value = thirtyDaysAgo.toISOString().split('T')[0];
    document.getElementById('filter-fecha-hasta').value = today.toISOString().split('T')[0];
  }

  setupEventListeners() {
    // Agregar método de pago
    document.getElementById('add-payment-method-btn').addEventListener('click', () => {
      this.openPaymentMethodModal();
    });

    // Guardar método de pago
    document.getElementById('save-payment-method-btn').addEventListener('click', () => {
      this.handleSavePaymentMethod();
    });

    // Cambiar tipo de pago en modal
    document.querySelectorAll('input[name="payment-type"]').forEach(radio => {
      radio.addEventListener('change', () => {
        this.togglePaymentForm(radio.value);
      });
    });

    // Filtros
    document.getElementById('filters-form').addEventListener('submit', (e) => {
      this.handleApplyFilters(e);
    });

    document.getElementById('clear-filters-btn').addEventListener('click', () => {
      this.clearFilters();
    });

    // Exportar historial
    document.getElementById('export-history-btn').addEventListener('click', () => {
      this.exportHistory();
    });

    // Formateo de campos de tarjeta
    this.setupCardFormatting();

    // Menú de usuario
    this.setupUserMenu();
  }

  setupCardFormatting() {
    // Formatear número de tarjeta
    document.getElementById('card-number').addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });

    // Formatear fecha de vencimiento
    document.getElementById('card-expiry').addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0,2) + '/' + value.substring(2,4);
      }
      e.target.value = value;
    });

    // Solo números en CVC
    document.getElementById('card-cvc').addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
  }

  setupUserMenu() {
    const userMenuBtn = document.getElementById('user-menu-btn');
    let menuOpen = false;
    
    if (userMenuBtn) {
      userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuOpen = !menuOpen;
        document.querySelector('.user-menu').classList.toggle('open', menuOpen);
      });
    }

    document.addEventListener('click', () => {
      if (menuOpen) {
        menuOpen = false;
        document.querySelector('.user-menu').classList.remove('open');
      }
    });

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        AuthUtils.logout();
      });
    }
  }

  openPaymentMethodModal() {
    const modal = new bootstrap.Modal(document.getElementById('paymentMethodModal'));
    this.clearPaymentMethodForm();
    modal.show();
  }

  clearPaymentMethodForm() {
    document.getElementById('payment-method-form').reset();
    document.getElementById('payment-type-card').checked = true;
    this.togglePaymentForm('tarjeta');
  }

  togglePaymentForm(type) {
    // Ocultar todos los formularios
    document.getElementById('card-form').style.display = 'none';
    document.getElementById('mercadopago-form').style.display = 'none';
    document.getElementById('modo-form').style.display = 'none';

    // Mostrar el formulario correspondiente
    switch (type) {
      case 'tarjeta':
        document.getElementById('card-form').style.display = 'block';
        break;
      case 'mercadopago':
        document.getElementById('mercadopago-form').style.display = 'block';
        break;
      case 'modo':
        document.getElementById('modo-form').style.display = 'block';
        break;
    }
  }

  async handleSavePaymentMethod() {
    try {
      const paymentType = document.querySelector('input[name="payment-type"]:checked').value;
      
      // Validar según el tipo
      if (!this.validatePaymentMethod(paymentType)) {
        return;
      }

      UIUtils.showButtonLoading('save-payment-method-btn', true);

      // Simular guardado (luego conectar con API)
      await new Promise(resolve => setTimeout(resolve, 1000));

      bootstrap.Modal.getInstance(document.getElementById('paymentMethodModal')).hide();
      UIUtils.showMessage('success-message', 'Método de pago guardado exitosamente', 'success');
      
      // Recargar lista
      await this.loadPaymentMethods();

    } catch (error) {
      console.error('❌ Error guardando método de pago:', error);
      UIUtils.showMessage('error-general', 'Error al guardar el método de pago. Intenta nuevamente.', 'danger');
    } finally {
      UIUtils.showButtonLoading('save-payment-method-btn', false);
    }
  }

  validatePaymentMethod(type) {
    // Validaciones básicas según el tipo
    switch (type) {
      case 'tarjeta':
        return this.validateCardForm();
      case 'mercadopago':
        return this.validateMercadoPagoForm();
      case 'modo':
        return this.validateModoForm();
      default:
        return false;
    }
  }

  validateCardForm() {
    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCvc = document.getElementById('card-cvc').value;
    const cardHolder = document.getElementById('card-holder').value.trim();
    const cardAlias = document.getElementById('card-alias').value.trim();

    if (!cardAlias || !cardNumber || !cardExpiry || !cardCvc || !cardHolder) {
      UIUtils.showMessage('error-general', 'Completá todos los campos obligatorios', 'danger');
      return false;
    }

    if (cardNumber.length < 13 || cardNumber.length > 19) {
      UIUtils.showMessage('error-general', 'Número de tarjeta inválido', 'danger');
      return false;
    }

    return true;
  }

  validateMercadoPagoForm() {
    const alias = document.getElementById('mp-alias').value.trim();
    const email = document.getElementById('mp-email').value.trim();

    if (!alias || !email) {
      UIUtils.showMessage('error-general', 'Completá todos los campos obligatorios', 'danger');
      return false;
    }

    if (!ValidationUtils.validateEmail(email)) {
      UIUtils.showMessage('error-general', 'Email inválido', 'danger');
      return false;
    }

    return true;
  }

  validateModoForm() {
    const alias = document.getElementById('modo-alias').value.trim();
    const cbu = document.getElementById('modo-cbu').value.trim();

    if (!alias || !cbu) {
      UIUtils.showMessage('error-general', 'Completá todos los campos obligatorios', 'danger');
      return false;
    }

    if (cbu.length !== 22) {
      UIUtils.showMessage('error-general', 'CBU debe tener 22 dígitos', 'danger');
      return false;
    }

    return true;
  }

  editPaymentMethod(methodId) {
    // TODO: Implementar edición de método de pago
    console.log('Editando método de pago:', methodId);
    alert('Función de edición próximamente');
  }

  async deletePaymentMethod(methodId) {
    if (!confirm('¿Estás seguro de que querés eliminar este método de pago?')) {
      return;
    }

    try {
      // Simular eliminación (luego conectar con API)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      UIUtils.showMessage('success-message', 'Método de pago eliminado exitosamente', 'success');
      await this.loadPaymentMethods();

    } catch (error) {
      console.error('❌ Error eliminando método de pago:', error);
      UIUtils.showMessage('error-general', 'Error al eliminar el método de pago', 'danger');
    }
  }

  handleApplyFilters(e) {
    e.preventDefault();
    
    this.filters = {
      fechaDesde: document.getElementById('filter-fecha-desde').value,
      fechaHasta: document.getElementById('filter-fecha-hasta').value,
      supermercado: document.getElementById('filter-supermercado').value,
      estado: document.getElementById('filter-estado').value
    };

    console.log('Aplicando filtros:', this.filters);
    this.loadPurchaseHistory(); // Recargar con filtros
  }

  clearFilters() {
    document.getElementById('filters-form').reset();
    this.filters = {};
    this.setupUI(); // Restaurar fechas por defecto
    this.loadPurchaseHistory();
  }

  viewPurchaseDetails(purchaseId) {
    const purchase = this.purchaseHistory.find(p => p.id === purchaseId);
    if (!purchase) return;

    const detailsHTML = `
      <div class="purchase-details-content">
        <div class="row mb-3">
          <div class="col-6">
            <strong>Número de orden:</strong> #${purchase.id}
          </div>
          <div class="col-6">
            <strong>Fecha:</strong> ${this.formatDateTime(purchase.fecha)}
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-6">
            <strong>Estado:</strong> ${this.getStatusBadge(purchase.estado)}
          </div>
          <div class="col-6">
            <strong>Supermercados:</strong> ${purchase.supermercados.join(', ')}
          </div>
        </div>
        
        <h6>Productos:</h6>
        <div class="table-responsive mb-3">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${purchase.productos.map(p => `
                <tr>
                  <td>${p.nombre}</td>
                  <td>${p.cantidad}</td>
                  <td>${this.formatCurrency(p.precio)}</td>
                  <td>${this.formatCurrency(p.precio * p.cantidad)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="row">
          <div class="col-6">
            <strong>Total:</strong> ${this.formatCurrency(purchase.total)}
          </div>
          <div class="col-6">
            <strong>Ahorro:</strong> ${this.formatCurrency(purchase.ahorro)}
          </div>
        </div>
      </div>
    `;

    document.getElementById('purchase-details-content').innerHTML = detailsHTML;
    const modal = new bootstrap.Modal(document.getElementById('purchaseDetailsModal'));
    modal.show();
  }

  reorderPurchase(purchaseId) {
    // TODO: Implementar reordenar compra
    console.log('Reordenando compra:', purchaseId);
    alert('Te redirigiremos al comparador con estos productos');
    // window.location.href = '/index.html?reorder=' + purchaseId;
  }

  exportHistory() {
    // TODO: Implementar exportación
    console.log('Exportando historial...');
    alert('Función de exportación próximamente');
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString('es-AR');
  }

  formatDateTime(date) {
    return new Date(date).toLocaleDateString('es-AR') + ' ' + 
           new Date(date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  }
}

// Variable global para acceso desde HTML
let paymentsManager;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  paymentsManager = new PaymentsManager();
});