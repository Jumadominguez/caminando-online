/* =====================================================
   🔐 LÓGICA DE LOGIN - login.js
   ===================================================== */

class LoginManager {
  constructor() {
    this.form = document.getElementById('login-form');
    this.fields = {
      email: document.getElementById('email'),
      password: document.getElementById('password'),
      remember: document.getElementById('remember')
    };
    
    this.init();
  }

  init() {
    // Redirigir si ya está logueado
    AuthUtils.redirectIfLoggedIn();
    
    // Configurar event listeners
    this.setupEventListeners();
    
    // Configurar validación en tiempo real
    this.setupRealTimeValidation();
    
    // Mostrar credenciales demo en desarrollo
    this.setupDemoMode();
    
    // Auto-fill si hay datos recordados
    this.loadRememberedData();
    
    console.log('✅ Login manager inicializado');
  }

  setupEventListeners() {
    // Submit del formulario
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Toggle de contraseña
    document.getElementById('password-toggle').addEventListener('click', () => {
      UIUtils.togglePasswordVisibility('password', 'password-toggle');
    });
    
    // Auto-formateo de email (convertir a minúsculas)
    this.fields.email.addEventListener('input', (e) => {
      e.target.value = e.target.value.toLowerCase();
    });
    
    // Enter en los campos
    this.fields.email.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.fields.password.focus();
      }
    });
    
    this.fields.password.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.form.dispatchEvent(new Event('submit'));
      }
    });
  }

  setupRealTimeValidation() {
    // Validación de email al perder foco
    this.fields.email.addEventListener('blur', () => {
      this.validateField('email');
    });
    
    // Limpiar errores cuando el usuario empiece a escribir
    this.fields.email.addEventListener('input', () => {
      UIUtils.clearFieldError('email');
    });
    
    this.fields.password.addEventListener('input', () => {
      UIUtils.clearFieldError('password');
    });
  }

  setupDemoMode() {
    // Solo mostrar en desarrollo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const demoSection = document.getElementById('demo-credentials');
      const fillDemoBtn = document.getElementById('fill-demo');
      
      if (demoSection && fillDemoBtn) {
        demoSection.style.display = 'block';
        
        fillDemoBtn.addEventListener('click', () => {
          this.fields.email.value = 'demo@caminando.online';
          this.fields.password.value = 'Demo123456';
          this.fields.remember.checked = true;
          
          // Validar campos
          this.validateField('email');
          UIUtils.showFieldValid('password');
        });
      }
    }
  }

  loadRememberedData() {
    // Cargar email recordado si existe
    const rememberedEmail = localStorage.getItem('caminando_remembered_email');
    if (rememberedEmail) {
      this.fields.email.value = rememberedEmail;
      this.fields.remember.checked = true;
      this.fields.password.focus();
    } else {
      this.fields.email.focus();
    }
  }

  validateField(fieldName) {
    const field = this.fields[fieldName];
    const value = field.value.trim();
    
    UIUtils.clearFieldError(fieldName);
    
    switch (fieldName) {
      case 'email':
        if (!value) {
          UIUtils.showFieldError('email', 'Email es obligatorio');
          return false;
        }
        if (!ValidationUtils.validateEmail(value)) {
          UIUtils.showFieldError('email', 'Email inválido');
          return false;
        }
        UIUtils.showFieldValid('email');
        return true;
        
      case 'password':
        if (!value) {
          UIUtils.showFieldError('password', 'Contraseña es obligatoria');
          return false;
        }
        UIUtils.showFieldValid('password');
        return true;
        
      default:
        return true;
    }
  }

  validateForm() {
    let isValid = true;
    
    // Validar email
    if (!this.validateField('email')) {
      isValid = false;
    }
    
    // Validar contraseña
    if (!this.validateField('password')) {
      isValid = false;
    }
    
    return isValid;
  }

  handleRememberMe() {
    if (this.fields.remember.checked) {
      // Guardar email para la próxima vez
      localStorage.setItem('caminando_remembered_email', this.fields.email.value);
    } else {
      // Eliminar email guardado
      localStorage.removeItem('caminando_remembered_email');
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    // Limpiar mensajes anteriores
    UIUtils.clearAllErrors();
    document.getElementById('success-message').style.display = 'none';
    document.getElementById('error-general').style.display = 'none';
    
    // Validar formulario
    if (!this.validateForm()) {
      UIUtils.showMessage('error-general', 'Por favor corrige los errores antes de continuar', 'danger');
      return;
    }
    
    // Mostrar loading
    UIUtils.showButtonLoading('btn-login', true);
    
    try {
      // Preparar datos para enviar
      const loginData = {
        email: this.fields.email.value.trim().toLowerCase(),
        password: this.fields.password.value
      };
      
      console.log('📤 Enviando datos de login:', { email: loginData.email, password: '[OCULTO]' });
      
      // Enviar petición al backend
      const response = await APIUtils.post('/auth/login', loginData);
      
      console.log('✅ Login exitoso:', { usuario: response.usuario.email, id: response.usuario.id });
      
      // Guardar token y datos del usuario
      AuthUtils.saveToken(response.token);
      AuthUtils.saveUserData(response.usuario);
      
      // Manejar "recordarme"
      this.handleRememberMe();
      
      // Mostrar mensaje de éxito
      UIUtils.showMessage('success-message', '¡Login exitoso! Redirigiendo al dashboard...', 'success');
      
      // Determinar redirección
      const redirectUrl = this.getRedirectUrl();
      
      // Redirigir después de 1 segundo
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error en login:', error);
      
      let errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';
      
      // Manejar errores específicos
      if (error.message.includes('Credenciales incorrectas')) {
        errorMessage = 'Email o contraseña incorrectos';
        UIUtils.showFieldError('password', 'Credenciales incorrectas');
      } else if (error.message.includes('Email inválido')) {
        errorMessage = 'Por favor ingresa un email válido';
        UIUtils.showFieldError('email', 'Email inválido');
      } else if (error.message.includes('suspendida') || error.message.includes('inactiva')) {
        errorMessage = 'Tu cuenta está suspendida. Contacta soporte.';
      } else if (error.message.includes('no encontrado')) {
        errorMessage = 'No encontramos una cuenta con ese email';
        UIUtils.showFieldError('email', 'Email no registrado');
      }
      
      UIUtils.showMessage('error-general', errorMessage, 'danger');
      
    } finally {
      // Ocultar loading
      UIUtils.showButtonLoading('btn-login', false);
    }
  }

  getRedirectUrl() {
    // Verificar si hay una URL de redirección en los parámetros
    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get('redirect');
    
    if (redirectParam) {
      // Validar que sea una URL interna segura
      try {
        const redirectUrl = decodeURIComponent(redirectParam);
        if (redirectUrl.startsWith('/') && !redirectUrl.startsWith('//')) {
          return redirectUrl;
        }
      } catch (e) {
        console.warn('URL de redirección inválida:', redirectParam);
      }
    }
    
    // Redirección por defecto
    return '/private/dashboard/dashboard.html';
  }

  // Método público para login programático (usado por otros scripts)
  async loginProgrammatically(email, password) {
    this.fields.email.value = email;
    this.fields.password.value = password;
    
    return this.handleSubmit(new Event('submit'));
  }
}

// Función global para uso externo
window.CaminandoLogin = {
  // Redirigir a login con URL de retorno
  redirectToLogin: (returnUrl = null) => {
    const loginUrl = '/private/auth/login.html';
    if (returnUrl) {
      window.location.href = `${loginUrl}?redirect=${encodeURIComponent(returnUrl)}`;
    } else {
      window.location.href = loginUrl;
    }
  },
  
  // Verificar si necesita login
  requireAuth: () => {
    if (!AuthUtils.isLoggedIn()) {
      CaminandoLogin.redirectToLogin(window.location.pathname);
      return false;
    }
    return true;
  }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new LoginManager();
});

// Manejar navegación hacia atrás
window.addEventListener('pageshow', (event) => {
  if (event.persisted && AuthUtils.isLoggedIn()) {
    // Si la página se carga desde caché y ya está logueado, redirigir
    window.location.href = '/private/dashboard/dashboard.html';
  }
});