/* =====================================================
   🔄 LÓGICA DE RECUPERACIÓN DE CONTRASEÑA - password-recovery.js
   ===================================================== */

class PasswordRecoveryManager {
  constructor() {
    this.form = document.getElementById('recovery-form');
    this.emailField = document.getElementById('email');
    
    this.init();
  }

  init() {
    // Redirigir si ya está logueado
    AuthUtils.redirectIfLoggedIn();
    
    // Configurar event listeners
    this.setupEventListeners();
    
    // Configurar validación en tiempo real
    this.setupRealTimeValidation();
    
    // Auto-focus en email
    this.emailField.focus();
    
    console.log('✅ Password recovery manager inicializado');
  }

  setupEventListeners() {
    // Submit del formulario
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Auto-formateo de email (convertir a minúsculas)
    this.emailField.addEventListener('input', (e) => {
      e.target.value = e.target.value.toLowerCase().trim();
    });
    
    // Enter en el campo email
    this.emailField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.form.dispatchEvent(new Event('submit'));
      }
    });
  }

  setupRealTimeValidation() {
    // Validación de email al perder foco
    this.emailField.addEventListener('blur', () => {
      this.validateEmail();
    });
    
    // Limpiar errores cuando el usuario empiece a escribir
    this.emailField.addEventListener('input', () => {
      UIUtils.clearFieldError('email');
    });
  }

  validateEmail() {
    const email = this.emailField.value.trim();
    
    UIUtils.clearFieldError('email');
    
    if (!email) {
      UIUtils.showFieldError('email', 'Email es obligatorio');
      return false;
    }
    
    if (!ValidationUtils.validateEmail(email)) {
      UIUtils.showFieldError('email', 'Email inválido');
      return false;
    }
    
    UIUtils.showFieldValid('email');
    return true;
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    // Limpiar mensajes anteriores
    UIUtils.clearAllErrors();
    document.getElementById('success-message').style.display = 'none';
    document.getElementById('error-general').style.display = 'none';
    
    // Validar email
    if (!this.validateEmail()) {
      UIUtils.showMessage('error-general', 'Por favor ingresa un email válido', 'danger');
      return;
    }
    
    // Mostrar loading
    UIUtils.showButtonLoading('btn-recovery', true);
    
    try {
      const email = this.emailField.value.trim().toLowerCase();
      
      console.log('📤 Enviando solicitud de recuperación para:', email);
      
      // Enviar petición al backend
      const response = await APIUtils.post('/auth/forgot-password', { email });
      
      console.log('✅ Solicitud de recuperación enviada');
      
      // Mostrar mensaje de éxito
      UIUtils.showMessage('success-message', '', 'success');
      
      // Deshabilitar el formulario temporalmente
      this.disableFormTemporarily();
      
    } catch (error) {
      console.error('❌ Error en recuperación:', error);
      
      let errorMessage = 'Error al enviar las instrucciones. Intenta nuevamente.';
      
      // Manejar errores específicos
      if (error.message.includes('Email inválido') || error.message.includes('requerido')) {
        errorMessage = 'Por favor ingresa un email válido';
        UIUtils.showFieldError('email', 'Email inválido');
      } else if (error.message.includes('rate limit') || error.message.includes('muchas peticiones')) {
        errorMessage = 'Demasiadas solicitudes. Espera unos minutos antes de intentar nuevamente.';
      }
      
      UIUtils.showMessage('error-general', errorMessage, 'danger');
      
    } finally {
      // Ocultar loading
      UIUtils.showButtonLoading('btn-recovery', false);
    }
  }

  disableFormTemporarily() {
    // Deshabilitar el campo email y botón por 60 segundos
    this.emailField.disabled = true;
    const submitBtn = document.getElementById('btn-recovery');
    
    let countdown = 60;
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    
    const countdownInterval = setInterval(() => {
      submitBtn.querySelector('.btn-text').textContent = `Espera ${countdown}s`;
      submitBtn.disabled = true;
      
      countdown--;
      
      if (countdown < 0) {
        clearInterval(countdownInterval);
        submitBtn.querySelector('.btn-text').textContent = originalText;
        submitBtn.disabled = false;
        this.emailField.disabled = false;
        this.emailField.focus();
      }
    }, 1000);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new PasswordRecoveryManager();
});