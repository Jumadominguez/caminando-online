/* =====================================================
   🛒 LÓGICA DE SUPERMERCADOS - supermercados-manager.js
   ===================================================== */

class SupermarketsManager {
  constructor() {
    this.user = null;
    this.supermarkets = [];
    this.connectedSupermarkets = [];
    this.activityLog = [];
    this.currentSupermarket = null;
    
    // Configuración de supermercados disponibles
    this.availableSupermarkets = {
      carrefour: {
        id: 'carrefour',
        name: 'Carrefour',
        url: 'https://www.carrefour.com.ar/',
        logo: '/assets/img/logos/carrefour_logo.png',
        description: 'Supermercado francés con amplia variedad de productos',
        features: ['Delivery 24hs', 'Promociones semanales', 'Productos importados']
      },
      disco: {
        id: 'disco',
        name: 'Disco',
        url: 'https://www.disco.com.ar/',
        logo: '/assets/img/logos/disco_logo.png',
        description: 'Cadena argentina especializada en productos frescos',
        features: ['Productos frescos', 'Ofertas diarias', 'Club de descuentos']
      },
      jumbo: {
        id: 'jumbo',
        name: 'Jumbo',
        url: 'https://www.jumbo.com.ar/',
        logo: '/assets/img/logos/jumbo_logo.png',
        description: 'Hipermercado con gran variedad y mejores precios',
        features: ['Precios bajos', 'Gran variedad', 'Productos a granel']
      },
      vea: {
        id: 'vea',
        name: 'Vea',
        url: 'https://www.vea.com.ar/',
        logo: '/assets/img/logos/vea_logo.png',
        description: 'Supermercado de proximidad con buenos precios',
        features: ['Precios competitivos', 'Promociones familiares', 'Delivery rápido']
      },
      dia: {
        id: 'dia',
        name: 'Día',
        url: 'https://diaonline.supermercadosdia.com.ar/',
        logo: '/assets/img/logos/dia_logo.png',
        description: 'Supermercado español con enfoque en ahorro',
        features: ['Precios de descuento', 'Marcas propias', 'Ofertas especiales']
      }
    };
    
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
    await this.loadSupermarketConnections();
    await this.loadActivityLog();
    
    console.log('✅ Supermarkets manager inicializado');
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

  async loadSupermarketConnections() {
    try {
      // Por ahora simulamos datos, luego conectaremos con la API real
      this.connectedSupermarkets = this.getMockConnections();
      this.updateSupermarketsList();
      this.updateConnectionStats();

    } catch (error) {
      console.error('❌ Error cargando conexiones:', error);
      this.setEmptyConnections();
    }
  }

  async loadActivityLog() {
    try {
      // Por ahora simulamos datos
      this.activityLog = this.getMockActivityLog();
      this.updateActivityLog();

    } catch (error) {
      console.error('❌ Error cargando log de actividad:', error);
      this.setEmptyActivityLog();
    }
  }

  getMockConnections() {
    return [
      {
        id: 'carrefour',
        nombre: 'Carrefour',
        estado: 'conectado',
        email: 'usuario@email.com',
        fechaConexion: new Date('2025-07-15'),
        ultimaVerificacion: new Date('2025-08-15'),
        autoCompra: true,
        sincronizarPromociones: true,
        estadoUltimaCompra: 'exitoso',
        errorCount: 0
      },
      {
        id: 'disco',
        nombre: 'Disco',
        estado: 'error',
        email: 'usuario@email.com',
        fechaConexion: new Date('2025-07-20'),
        ultimaVerificacion: new Date('2025-08-14'),
        autoCompra: false,
        sincronizarPromociones: true,
        estadoUltimaCompra: 'error',
        errorCount: 3,
        ultimoError: 'Credenciales inválidas'
      },
      {
        id: 'jumbo',
        nombre: 'Jumbo',
        estado: 'conectado',
        email: 'usuario@email.com',
        fechaConexion: new Date('2025-08-01'),
        ultimaVerificacion: new Date('2025-08-15'),
        autoCompra: true,
        sincronizarPromociones: true,
        estadoUltimaCompra: 'exitoso',
        errorCount: 0
      }
    ];
  }

  getMockActivityLog() {
    return [
      {
        timestamp: new Date('2025-08-15T10:30:00'),
        tipo: 'conexion',
        supermercado: 'carrefour',
        mensaje: 'Verificación exitosa de credenciales',
        estado: 'exitoso'
      },
      {
        timestamp: new Date('2025-08-15T10:25:00'),
        tipo: 'compra',
        supermercado: 'jumbo',
        mensaje: 'Compra automática realizada - Orden #CO-2025-003',
        estado: 'exitoso'
      },
      {
        timestamp: new Date('2025-08-15T09:15:00'),
        tipo: 'error',
        supermercado: 'disco',
        mensaje: 'Error de autenticación - verificar credenciales',
        estado: 'error'
      },
      {
        timestamp: new Date('2025-08-14T16:45:00'),
        tipo: 'sincronizacion',
        supermercado: 'carrefour',
        mensaje: 'Sincronización de promociones completada - 15 ofertas actualizadas',
        estado: 'exitoso'
      }
    ];
  }

  updateConnectionStats() {
    const connectedCount = this.connectedSupermarkets.filter(s => s.estado === 'conectado').length;
    const autoBuyCount = this.connectedSupermarkets.filter(s => s.autoCompra && s.estado === 'conectado').length;
    
    document.getElementById('connected-count').textContent = connectedCount;
    document.getElementById('auto-buy-enabled').textContent = autoBuyCount;
    
    // Última sincronización
    const lastSync = this.activityLog.find(log => log.tipo === 'sincronizacion');
    const lastSyncElement = document.getElementById('last-sync');
    if (lastSync) {
      lastSyncElement.textContent = this.formatRelativeTime(lastSync.timestamp);
    } else {
      lastSyncElement.textContent = 'Nunca';
    }
  }

  updateSupermarketsList() {
    const list = document.getElementById('supermarkets-list');
    
    // Crear lista completa incluyendo no conectados
    const allSupermarkets = Object.values(this.availableSupermarkets).map(supermarket => {
      const connection = this.connectedSupermarkets.find(c => c.id === supermarket.id);
      return {
        ...supermarket,
        connection: connection || null,
        connected: !!connection
      };
    });

    const supermarketsHTML = allSupermarkets.map(supermarket => {
      const statusInfo = this.getSupermarketStatusInfo(supermarket);
      
      return `
        <div class="supermarket-item ${supermarket.connected ? 'supermarket-connected' : 'supermarket-disconnected'}" data-supermarket-id="${supermarket.id}">
          <div class="supermarket-header">
            <div class="supermarket-logo-container">
              <img src="${supermarket.logo}" alt="${supermarket.name}" class="supermarket-logo" 
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
              <div class="supermarket-name-fallback" style="display: none;">${supermarket.name}</div>
            </div>
            <div class="supermarket-info">
              <div class="supermarket-name">${supermarket.name}</div>
              <div class="supermarket-status">
                ${statusInfo.badge}
                <span class="status-text">${statusInfo.text}</span>
              </div>
            </div>
            <div class="supermarket-actions">
              ${this.getSupermarketActions(supermarket)}
            </div>
          </div>
          
          ${supermarket.connected ? `
            <div class="supermarket-details">
              <div class="connection-details">
                <div class="detail-item">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${supermarket.connection.email}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Conectado:</span>
                  <span class="detail-value">${this.formatDate(supermarket.connection.fechaConexion)}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Compra automática:</span>
                  <span class="detail-value">
                    ${supermarket.connection.autoCompra ? 
                      '<span class="badge bg-success">✅ Habilitada</span>' : 
                      '<span class="badge bg-secondary">❌ Deshabilitada</span>'
                    }
                  </span>
                </div>
              </div>
              
              ${supermarket.connection.estado === 'error' ? `
                <div class="error-details">
                  <div class="alert alert-danger">
                    <strong>Error de conexión:</strong> ${supermarket.connection.ultimoError || 'Error desconocido'}
                    <br><small>Errores consecutivos: ${supermarket.connection.errorCount}</small>
                  </div>
                </div>
              ` : ''}
            </div>
          ` : `
            <div class="supermarket-features">
              <div class="features-list">
                ${supermarket.features.map(feature => `<span class="feature-badge">${feature}</span>`).join('')}
              </div>
            </div>
          `}
        </div>
      `;
    }).join('');

    list.innerHTML = supermarketsHTML;
  }

  getSupermarketStatusInfo(supermarket) {
    if (!supermarket.connected) {
      return {
        badge: '<span class="status-badge status-disconnected">⚪</span>',
        text: 'No conectado'
      };
    }

    switch (supermarket.connection.estado) {
      case 'conectado':
        return {
          badge: '<span class="status-badge status-connected">🟢</span>',
          text: 'Conectado'
        };
      case 'error':
        return {
          badge: '<span class="status-badge status-error">🔴</span>',
          text: 'Error de conexión'
        };
      case 'verificando':
        return {
          badge: '<span class="status-badge status-verifying">🟡</span>',
          text: 'Verificando...'
        };
      default:
        return {
          badge: '<span class="status-badge status-unknown">⚫</span>',
          text: 'Estado desconocido'
        };
    }
  }

  getSupermarketActions(supermarket) {
    if (!supermarket.connected) {
      return `
        <button class="btn btn-primary btn-sm" onclick="supermarketsManager.connectSupermarket('${supermarket.id}')">
          <i class="btn-icon">🔗</i>
          Conectar
        </button>
      `;
    }

    const actions = [`
      <button class="btn btn-outline-primary btn-sm" onclick="supermarketsManager.editConnection('${supermarket.id}')">
        <i class="btn-icon">⚙️</i>
        Configurar
      </button>
    `];

    if (supermarket.connection.estado === 'error') {
      actions.unshift(`
        <button class="btn btn-warning btn-sm" onclick="supermarketsManager.testConnection('${supermarket.id}')">
          <i class="btn-icon">🔍</i>
          Verificar
        </button>
      `);
    }

    actions.push(`
      <button class="btn btn-outline-danger btn-sm" onclick="supermarketsManager.disconnectSupermarket('${supermarket.id}')">
        <i class="btn-icon">🔌</i>
        Desconectar
      </button>
    `);

    return actions.join('');
  }

  updateActivityLog() {
    const logContainer = document.getElementById('activity-log');
    
    if (!this.activityLog || this.activityLog.length === 0) {
      this.setEmptyActivityLog();
      return;
    }

    const logHTML = this.activityLog.map(entry => {
      const icon = this.getActivityIcon(entry.tipo, entry.estado);
      const timeAgo = this.formatRelativeTime(entry.timestamp);
      
      return `
        <div class="activity-entry activity-${entry.estado}" data-entry-id="${entry.timestamp.getTime()}">
          <div class="activity-icon">${icon}</div>
          <div class="activity-content">
            <div class="activity-message">${entry.mensaje}</div>
            <div class="activity-meta">
              <span class="activity-supermarket">${entry.supermercado}</span>
              <span class="activity-time">${timeAgo}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    logContainer.innerHTML = logHTML;
  }

  setEmptyActivityLog() {
    const logContainer = document.getElementById('activity-log');
    logContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-text">
          <div class="empty-title">No hay actividad reciente</div>
          <div class="empty-subtitle">Las conexiones y sincronizaciones aparecerán aquí</div>
        </div>
      </div>
    `;
  }

  getActivityIcon(tipo, estado) {
    const icons = {
      conexion: estado === 'exitoso' ? '🔗' : '⚠️',
      compra: estado === 'exitoso' ? '🛍️' : '❌',
      sincronizacion: estado === 'exitoso' ? '🔄' : '⚠️',
      error: '🚨',
      configuracion: '⚙️'
    };
    return icons[tipo] || '📝';
  }

  setupUI() {
    document.title = 'Mis Supermercados - Caminando Online';
  }

  setupEventListeners() {
    // Sincronizar todo
    document.getElementById('sync-all-btn').addEventListener('click', () => {
      this.syncAllSupermarkets();
    });

    // Guardar configuraciones globales
    document.getElementById('global-settings-form').addEventListener('submit', (e) => {
      this.handleSaveGlobalSettings(e);
    });

    // Limpiar log
    document.getElementById('clear-log-btn').addEventListener('click', () => {
      this.clearActivityLog();
    });

    // Conectar supermercado
    document.getElementById('connect-supermarket-btn').addEventListener('click', () => {
      this.handleConnectSupermarket();
    });

    // Cambiar tipo de conexión en modal
    document.querySelectorAll('input[name="connection-type"]').forEach(radio => {
      radio.addEventListener('change', () => {
        this.toggleConnectionForm(radio.value);
      });
    });

    // Toggle password visibility
    document.getElementById('supermarket-password-toggle').addEventListener('click', () => {
      UIUtils.togglePasswordVisibility('supermarket-password', 'supermarket-password-toggle');
    });

    // Menú de usuario
    this.setupUserMenu();
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

  connectSupermarket(supermarketId) {
    this.currentSupermarket = this.availableSupermarkets[supermarketId];
    
    if (!this.currentSupermarket) {
      console.error('Supermercado no encontrado:', supermarketId);
      return;
    }

    this.openConnectModal();
  }

  openConnectModal() {
    const modal = new bootstrap.Modal(document.getElementById('connectSupermarketModal'));
    
    // Actualizar información del supermercado en el modal
    document.getElementById('connectModalTitle').textContent = `Conectar ${this.currentSupermarket.name}`;
    document.getElementById('modal-supermarket-logo').src = this.currentSupermarket.logo;
    document.getElementById('modal-supermarket-logo').alt = this.currentSupermarket.name;
    document.getElementById('modal-supermarket-name').textContent = this.currentSupermarket.name;
    document.getElementById('modal-supermarket-description').textContent = this.currentSupermarket.description;
    
    // Prellenar formulario de crear cuenta con datos del usuario
    if (this.user) {
      document.getElementById('new-account-name').value = this.user.nombre || '';
      document.getElementById('new-account-lastname').value = this.user.apellido || '';
      document.getElementById('new-account-email').value = this.user.email || '';
      document.getElementById('new-account-phone').value = this.user.telefono || '';
      document.getElementById('new-account-dni').value = this.user.dni || '';
    }
    
    // Resetear formularios
    document.getElementById('existing-account-form').reset();
    document.getElementById('existing-account').checked = true;
    this.toggleConnectionForm('existing');
    
    modal.show();
  }

  toggleConnectionForm(type) {
    const existingForm = document.getElementById('existing-account-form');
    const createForm = document.getElementById('create-account-form');
    
    if (type === 'existing') {
      existingForm.style.display = 'block';
      createForm.style.display = 'none';
    } else {
      existingForm.style.display = 'none';
      createForm.style.display = 'block';
    }
  }

  async handleConnectSupermarket() {
    try {
      const connectionType = document.querySelector('input[name="connection-type"]:checked').value;
      
      if (!this.validateConnectionForm(connectionType)) {
        return;
      }

      UIUtils.showButtonLoading('connect-supermarket-btn', true);

      // Simular proceso de conexión
      await this.processConnection(connectionType);

      bootstrap.Modal.getInstance(document.getElementById('connectSupermarketModal')).hide();
      UIUtils.showMessage('success-message', `${this.currentSupermarket.name} conectado exitosamente`, 'success');
      
      // Recargar conexiones
      await this.loadSupermarketConnections();
      
      // Agregar entrada al log
      this.addActivityLogEntry('conexion', this.currentSupermarket.id, `Conexión exitosa con ${this.currentSupermarket.name}`, 'exitoso');

    } catch (error) {
      console.error('❌ Error conectando supermercado:', error);
      UIUtils.showMessage('error-general', 'Error al conectar el supermercado. Intenta nuevamente.', 'danger');
    } finally {
      UIUtils.showButtonLoading('connect-supermarket-btn', false);
    }
  }

  validateConnectionForm(type) {
    if (type === 'existing') {
      const email = document.getElementById('supermarket-email').value.trim();
      const password = document.getElementById('supermarket-password').value;

      if (!email || !password) {
        UIUtils.showMessage('error-general', 'Completá todos los campos obligatorios', 'danger');
        return false;
      }

      if (!ValidationUtils.validateEmail(email)) {
        UIUtils.showMessage('error-general', 'Email inválido', 'danger');
        return false;
      }
    } else {
      const name = document.getElementById('new-account-name').value.trim();
      const lastname = document.getElementById('new-account-lastname').value.trim();
      const email = document.getElementById('new-account-email').value.trim();
      const phone = document.getElementById('new-account-phone').value.trim();
      const dni = document.getElementById('new-account-dni').value.trim();

      if (!name || !lastname || !email || !phone || !dni) {
        UIUtils.showMessage('error-general', 'Completá todos los campos obligatorios', 'danger');
        return false;
      }

      if (!ValidationUtils.validateEmail(email)) {
        UIUtils.showMessage('error-general', 'Email inválido', 'danger');
        return false;
      }
    }

    return true;
  }

  async processConnection(type) {
    // Simular tiempo de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (type === 'create') {
      // Simular creación de cuenta
      console.log('🤖 Creando cuenta automáticamente...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // Simular verificación de credenciales
    console.log('🔍 Verificando credenciales...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('✅ Conexión establecida exitosamente');
  }

  async testConnection(supermarketId) {
    try {
      const connection = this.connectedSupermarkets.find(c => c.id === supermarketId);
      if (!connection) return;

      // Simular verificación
      console.log(`🔍 Verificando conexión con ${connection.nombre}...`);
      
      // Cambiar estado a verificando
      connection.estado = 'verificando';
      this.updateSupermarketsList();
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular resultado (80% éxito, 20% error)
      const success = Math.random() > 0.2;
      
      if (success) {
        connection.estado = 'conectado';
        connection.errorCount = 0;
        connection.ultimoError = null;
        this.addActivityLogEntry('conexion', supermarketId, 'Verificación exitosa de credenciales', 'exitoso');
        UIUtils.showMessage('success-message', 'Conexión verificada exitosamente', 'success');
      } else {
        connection.estado = 'error';
        connection.errorCount += 1;
        connection.ultimoError = 'Error de autenticación';
        this.addActivityLogEntry('error', supermarketId, 'Error de autenticación - verificar credenciales', 'error');
        UIUtils.showMessage('error-general', 'Error de verificación. Revisa tus credenciales.', 'danger');
      }
      
      this.updateSupermarketsList();
      this.updateConnectionStats();

    } catch (error) {
      console.error('❌ Error verificando conexión:', error);
    }
  }

  editConnection(supermarketId) {
    // TODO: Implementar edición de conexión
    console.log('Editando conexión:', supermarketId);
    alert('Función de edición de conexión próximamente');
  }

  async disconnectSupermarket(supermarketId) {
    const connection = this.connectedSupermarkets.find(c => c.id === supermarketId);
    if (!connection) return;

    if (!confirm(`¿Estás seguro de que querés desconectar ${connection.nombre}?`)) {
      return;
    }

    try {
      // Simular desconexión
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remover de la lista
      this.connectedSupermarkets = this.connectedSupermarkets.filter(c => c.id !== supermarketId);
      
      this.updateSupermarketsList();
      this.updateConnectionStats();
      
      this.addActivityLogEntry('configuracion', supermarketId, `Desconectado de ${connection.nombre}`, 'exitoso');
      UIUtils.showMessage('success-message', `${connection.nombre} desconectado exitosamente`, 'success');

    } catch (error) {
      console.error('❌ Error desconectando supermercado:', error);
      UIUtils.showMessage('error-general', 'Error al desconectar el supermercado', 'danger');
    }
  }

  async syncAllSupermarkets() {
    try {
      const connectedSupermarkets = this.connectedSupermarkets.filter(s => s.estado === 'conectado');
      
      if (connectedSupermarkets.length === 0) {
        UIUtils.showMessage('error-general', 'No hay supermercados conectados para sincronizar', 'warning');
        return;
      }

      UIUtils.showButtonLoading('sync-all-btn', true);
      
      console.log('🔄 Iniciando sincronización de todos los supermercados...');
      
      for (const supermarket of connectedSupermarkets) {
        console.log(`🔄 Sincronizando ${supermarket.nombre}...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.addActivityLogEntry('sincronizacion', supermarket.id, `Sincronización completada - ${Math.floor(Math.random() * 20) + 5} ofertas actualizadas`, 'exitoso');
      }
      
      UIUtils.showMessage('success-message', `Sincronización completada para ${connectedSupermarkets.length} supermercados`, 'success');
      this.updateActivityLog();

    } catch (error) {
      console.error('❌ Error en sincronización:', error);
      UIUtils.showMessage('error-general', 'Error durante la sincronización', 'danger');
    } finally {
      UIUtils.showButtonLoading('sync-all-btn', false);
    }
  }

  async handleSaveGlobalSettings(e) {
    e.preventDefault();

    try {
      const settings = {
        autoCompraGlobal: document.getElementById('auto-buy-global').checked,
        verificarStock: document.getElementById('verify-stock').checked,
        montoMaximo: parseInt(document.getElementById('max-order-amount').value),
        notificarErrores: document.getElementById('notify-errors').checked,
        confirmarAntes: document.getElementById('confirm-before-buy').checked
      };

      UIUtils.showButtonLoading('save-global-settings-btn', true);

      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));

      UIUtils.showMessage('success-message', 'Configuraciones guardadas exitosamente', 'success');
      this.addActivityLogEntry('configuracion', 'global', 'Configuraciones globales actualizadas', 'exitoso');

    } catch (error) {
      console.error('❌ Error guardando configuraciones:', error);
      UIUtils.showMessage('error-general', 'Error al guardar las configuraciones', 'danger');
    } finally {
      UIUtils.showButtonLoading('save-global-settings-btn', false);
    }
  }

  clearActivityLog() {
    if (!confirm('¿Estás seguro de que querés limpiar todo el registro de actividad?')) {
      return;
    }

    this.activityLog = [];
    this.setEmptyActivityLog();
    UIUtils.showMessage('success-message', 'Registro de actividad limpiado', 'success');
  }

  addActivityLogEntry(tipo, supermercado, mensaje, estado) {
    const entry = {
      timestamp: new Date(),
      tipo,
      supermercado,
      mensaje,
      estado
    };
    
    this.activityLog.unshift(entry);
    
    // Mantener solo los últimos 50 registros
    if (this.activityLog.length > 50) {
      this.activityLog = this.activityLog.slice(0, 50);
    }
    
    this.updateActivityLog();
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString('es-AR');
  }

  formatRelativeTime(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} hs`;
    if (days < 7) return `Hace ${days} días`;
    return this.formatDate(date);
  }
}

// Variable global para acceso desde HTML
let supermarketsManager;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  supermarketsManager = new SupermarketsManager();
});