/* =====================================================
   📊 LÓGICA DEL DASHBOARD PRINCIPAL - dashboard-main.js
   ===================================================== */

class DashboardManager {
  constructor() {
    this.user = null;
    this.stats = null;
    this.userMenuOpen = false;
    
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
    
    // Cargar estadísticas
    await this.loadUserStats();
    
    console.log('✅ Dashboard inicializado');
  }

  async loadUserData() {
    try {
      // Intentar cargar desde localStorage primero
      this.user = AuthUtils.getUserData();
      
      if (this.user) {
        this.updateUserInfo();
      }

      // Verificar token y obtener datos actualizados
      const response = await APIUtils.get('/auth/profile', AuthUtils.getToken());
      
      if (response.success) {
        this.user = response.usuario;
        AuthUtils.saveUserData(this.user);
        this.updateUserInfo();
      }

    } catch (error) {
      console.error('❌ Error cargando datos del usuario:', error);
      
      if (error.message.includes('Token') || error.message.includes('401')) {
        // Token inválido o expirado
        AuthUtils.logout();
      } else {
        // Usar datos en caché si hay error de red
        if (this.user) {
          this.updateUserInfo();
        }
      }
    }
  }

  async loadUserStats() {
    try {
      const response = await APIUtils.get('/auth/stats', AuthUtils.getToken());
      
      if (response.success) {
        this.stats = response.estadisticas;
        this.updateStatsCards();
      }

    } catch (error) {
      console.error('❌ Error cargando estadísticas:', error);
      this.setDefaultStats();
    }
  }

  updateUserInfo() {
    if (!this.user) return;

    // Actualizar nombre de bienvenida
    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName) {
      welcomeName.textContent = this.user.nombre || 'Usuario';
    }

    // Actualizar nombre en el menú
    const userName = document.getElementById('user-name');
    if (userName) {
      userName.textContent = this.user.nombre || 'Usuario';
    }

    // Actualizar email en el dropdown
    const userEmail = document.getElementById('user-email');
    if (userEmail) {
      userEmail.textContent = this.user.email || '';
    }

    // Actualizar iniciales en el avatar
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

  updateStatsCards() {
    if (!this.stats) return;

    // Total ahorrado
    const totalAhorro = document.getElementById('total-ahorro');
    if (totalAhorro) {
      totalAhorro.textContent = this.formatCurrency(this.stats.totalAhorro || 0);
    }

    // Total compras
    const totalCompras = document.getElementById('total-compras');
    if (totalCompras) {
      totalCompras.textContent = this.stats.totalCompras || 0;
    }

    // Supermercados conectados
    const supermercadosConectados = document.getElementById('supermercados-conectados');
    if (supermercadosConectados) {
      // Por ahora usamos un valor por defecto, luego se conectará con la API real
      supermercadosConectados.textContent = '0';
    }

    // Días como miembro
    const diasMiembro = document.getElementById('dias-miembro');
    if (diasMiembro) {
      diasMiembro.textContent = this.stats.diasDesdeRegistro || 0;
    }
  }

  setDefaultStats() {
    // Valores por defecto si no se pueden cargar las estadísticas
    const totalAhorro = document.getElementById('total-ahorro');
    const totalCompras = document.getElementById('total-compras');
    const supermercadosConectados = document.getElementById('supermercados-conectados');
    const diasMiembro = document.getElementById('dias-miembro');

    if (totalAhorro) totalAhorro.textContent = '$0';
    if (totalCompras) totalCompras.textContent = '0';
    if (supermercadosConectados) supermercadosConectados.textContent = '0';
    if (diasMiembro) diasMiembro.textContent = '0';
  }

  setupUI() {
    // Marcar navegación activa
    this.setActiveNavigation();
    
    // Configurar título de la página
    document.title = 'Dashboard - Caminando Online';
  }

  setActiveNavigation() {
    // Remover active de todos los nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Agregar active al dashboard
    const dashboardNavItem = document.querySelector('.nav-item:first-child');
    if (dashboardNavItem) {
      dashboardNavItem.classList.add('active');
    }
  }

  setupEventListeners() {
    // Menú de usuario
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userMenuBtn) {
      userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleUserMenu();
      });
    }

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', () => {
      if (this.userMenuOpen) {
        this.closeUserMenu();
      }
    });

    // Prevenir que el dropdown se cierre al hacer click dentro
    if (userDropdown) {
      userDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLogout();
      });
    }

    // Refresh de datos cada 5 minutos
    setInterval(() => {
      this.refreshData();
    }, 5 * 60 * 1000);
  }

  toggleUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    
    if (this.userMenuOpen) {
      this.closeUserMenu();
    } else {
      this.openUserMenu();
    }
  }

  openUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
      userMenu.classList.add('open');
      this.userMenuOpen = true;
    }
  }

  closeUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
      userMenu.classList.remove('open');
      this.userMenuOpen = false;
    }
  }

  async handleLogout() {
    try {
      // Intentar notificar al servidor sobre el logout
      try {
        await APIUtils.post('/auth/logout', {}, AuthUtils.getToken());
      } catch (error) {
        // Ignorar errores del servidor para logout
        console.warn('Error en logout del servidor:', error);
      }

      // Limpiar datos locales
      AuthUtils.logout();
      
    } catch (error) {
      console.error('❌ Error en logout:', error);
      // Forzar logout local
      AuthUtils.logout();
    }
  }

  async refreshData() {
    try {
      // Verificar si el token sigue siendo válido
      const response = await APIUtils.get('/auth/verify-token', AuthUtils.getToken());
      
      if (!response.success) {
        AuthUtils.logout();
        return;
      }

      // Actualizar estadísticas
      await this.loadUserStats();

    } catch (error) {
      console.warn('Error refrescando datos:', error);
      
      if (error.message.includes('Token') || error.message.includes('401')) {
        AuthUtils.logout();
      }
    }
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Método público para navegar desde otros scripts
  navigateTo(page) {
    const routes = {
      'dashboard': '/private/dashboard/dashboard.html',
      'profile': '/private/dashboard/perfil.html',
      'payments': '/private/dashboard/pagos.html',
      'supermarkets': '/private/dashboard/supermercados.html',
      'compare': '/index.html'
    };

    if (routes[page]) {
      window.location.href = routes[page];
    } else {
      console.warn('Ruta no encontrada:', page);
    }
  }
}

// Funciones globales para uso desde HTML
window.CaminandoDashboard = {
  // Navegar a una página específica
  navigateTo: (page) => {
    if (window.dashboardManager) {
      window.dashboardManager.navigateTo(page);
    }
  },

  // Refresh manual de datos
  refresh: () => {
    if (window.dashboardManager) {
      window.dashboardManager.refreshData();
    }
  },

  // Obtener datos del usuario actual
  getCurrentUser: () => {
    return window.dashboardManager ? window.dashboardManager.user : null;
  }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.dashboardManager = new DashboardManager();
});

// Manejar navegación hacia atrás/adelante
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Página cargada desde caché, verificar autenticación
    if (!AuthUtils.isLoggedIn()) {
      AuthUtils.redirectIfNotLoggedIn();
    } else if (window.dashboardManager) {
      window.dashboardManager.refreshData();
    }
  }
});