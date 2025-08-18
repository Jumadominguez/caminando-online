/* =====================================================
   📝 LÓGICA DE REGISTRO - registro.js
   ===================================================== */

class RegistroManager {
  constructor() {
    this.form = document.getElementById('registro-form');
    this.fields = {
      nombre: document.getElementById('nombre'),
      apellido: document.getElementById('apellido'),
      email: document.getElementById('email'),
      telefono: document.getElementById('telefono'),
      dni: document.getElementById('dni'),
      password: document.getElementById('password'),
      confirmPassword: document.getElementById('confirm-password'),
      terminos: document.getElementById('terminos'),
      newsletter: document.getElementById('newsletter')
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
    
    console.log('✅ Registro manager inicializado');
  }

  setupEventListeners() {
    // Submit del formulario
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Toggle de contraseñas
    document.getElementById('password-toggle').addEventListener('click', () => {
      UIUtils.togglePasswordVisibility('password', 'password-toggle');
    });
    
    document.getElementById('confirm-password-toggle').addEventListener('click', () => {
      UIUtils.togglePasswordVisibility('confirm-password', 'confirm-password-toggle');
    });
    
    // Formateo automático de campos
    this.fields.telefono.addEventListener('input', (e) => {
      e.target.value = FormatUtils.formatPhone(e.target.value);
    });
    
    this.fields.dni.addEventListener('input', (e) => {
      e.target.value = FormatUtils.formatDNI(e.target.value);
    });
    
    this.fields.nombre.addEventListener('input', (e) => {
      e.target.value = FormatUtils.capitalizeName(e.target.value);
    });
    
    this.fields.apellido.addEventListener('input', (e) => {
      e.target.value = FormatUtils.capitalizeName(e.target.value);
    });
  }

  setupRealTimeValidation() {
    // Validación de nombre
    this.fields.nombre.addEventListener('blur', () => {
      this.validateField('nombre');
    });
    
    // Validación de apellido
    this.fields.apellido.addEventListener('blur', () => {
      this.validateField('apellido');
    });
    
    // Validación de email
    this.fields.email.addEventListener('blur', () => {
      this.validateField('email');
    });
    
    // Validación de teléfono
    this.fields.telefono.addEventListener('blur', () => {
      this.validateField('telefono');
    });
    
    // Validación de DNI
    this.fields.dni.addEventListener('blur', () => {
      this.validateField('dni');
    });
    
    // Validación de contraseña
    this.fields.password.addEventListener('blur', () => {
      this.validateField('password');
    });
    
    // Validación de confirmación de contraseña
    this.fields.confirmPassword.addEventListener('blur', () => {
      this.validateField('confirmPassword');
    });
  }

  validateField(fieldName) {
    const field = this.fields[fieldName];
    const value = field.value.trim();
    
    UIUtils.clearFieldError(fieldName === 'confirmPassword' ? 'confirm-password' : fieldName);
    
    switch (fieldName) {
      case 'nombre':
      case 'apellido':
        if (!value) {
          UIUtils.showFieldError(fieldName, `${fieldName === 'nombre' ? 'Nombre' : 'Apellido'} es obligatorio`);
          return false;
        }
        if (!ValidationUtils.validateName(value)) {
          UIUtils.showFieldError(fieldName, `${fieldName === 'nombre' ? 'Nombre' : 'Apellido'} inválido`);
          return false;
        }
        UIUtils.showFieldValid(fieldName);
        return true;
        
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
        
      case 'telefono':
        if (!value) {
          UIUtils.showFieldError('telefono', 'Teléfono es obligatorio');
          return false;
        }
        if (!ValidationUtils.validatePhone(value)) {
          UIUtils.showFieldError('telefono', 'Teléfono inválido');
          return false;
        }
        UIUtils.showFieldValid('telefono');
        return true;
        
      case 'dni':
        if (!value) {
          UIUtils.showFieldError('dni', 'DNI es obligatorio');
          return false;
        }
        if (!ValidationUtils.validateDNI(value)) {
          UIUtils.showFieldError('dni', 'DNI inválido (7-8 dígitos)');
          return false;
        }
        UIUtils.showFieldValid('dni');
        return true;
        
      case 'password':
        if (!value) {
          UIUtils.showFieldError('password', 'Contraseña es obligatoria');
          return false;
        }
        if (!ValidationUtils.validatePassword(value)) {
          UIUtils.showFieldError('password', 'Contraseña debe tener mín. 8 caracteres, una mayúscula, una minúscula y un número');
          return false;
        }
        UIUtils.showFieldValid('password');
        // Re-validar confirmación si ya tiene valor
        if (this.fields.confirmPassword.value) {
          this.validateField('confirmPassword');
        }
        return true;
        
      case 'confirmPassword':
        if (!value) {
          UIUtils.showFieldError('confirm-password', 'Confirmar contraseña es obligatorio');
          return false;
        }
        if (value !== this.fields.password.value) {
          UIUtils.showFieldError('confirm-password', 'Las contraseñas no coinciden');
          return false;
        }
        UIUtils.showFieldValid('confirm-password');
        return true;
        
      default:
        return true;
    }
  }

  validateForm() {
    let isValid = true;
    
    // Validar todos los campos
    Object.keys(this.fields).forEach(fieldName => {
      if (fieldName !== 'newsletter') { // Newsletter es opcional
        if (!this.validateField(fieldName)) {
          isValid = false;
        }
      }
    });
    
    // Validar términos y condiciones
    if (!this.fields.terminos.checked) {
      UIUtils.showFieldError('terminos', 'Debes aceptar los términos y condiciones');
      isValid = false;
    } else {
      UIUtils.clearFieldError('terminos');
    }
    
    return isValid;
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
    UIUtils.showButtonLoading('btn-registro', true);
    
    try {
      // Preparar datos para enviar
      const formData = {
        nombre: this.fields.nombre.value.trim(),
        apellido: this.fields.apellido.value.trim(),
        email: this.fields.email.value.trim().toLowerCase(),
        telefono: this.fields.telefono.value.trim(),
        dni: this.fields.dni.value.trim(),
        password: this.fields.password.value,
        configuraciones: {
          notificaciones: {
            email: this.fields.newsletter.checked,
            sms: false,
            ofertas: this.fields.newsletter.checked
          },
          privacidad: {
            compartirDatos: false,
            recibirMarketing: this.fields.newsletter.checked
          }
        }
      };
      
      console.log('📤 Enviando datos de registro:', { ...formData, password: '[OCULTO]' });
      
      // Enviar petición al backend
      const response = await APIUtils.post('/users/register', formData);
      
      console.log('✅ Registro exitoso:', response);
      
      // Guardar token y datos del usuario
      AuthUtils.saveToken(response.token);
      AuthUtils.saveUserData(response.usuario);
      
      // Mostrar mensaje de éxito
      UIUtils.showMessage('success-message', '¡Cuenta creada exitosamente! Redirigiendo al dashboard...', 'success');
      
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        window.location.href = '/private/dashboard/dashboard.html';
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error en registro:', error);
      
      let errorMessage = 'Error al crear la cuenta. Intenta nuevamente.';
      
      // Manejar errores específicos
      if (error.message.includes('ya existe')) {
        errorMessage = 'Este email ya está registrado. ¿Quieres iniciar sesión?';
        UIUtils.showFieldError('email', 'Este email ya está en uso');
      } else if (error.message.includes('inválido')) {
        errorMessage = 'Algunos datos son inválidos. Revisa la información.';
      }
      
      UIUtils.showMessage('error-general', errorMessage, 'danger');
      
    } finally {
      // Ocultar loading
      UIUtils.showButtonLoading('btn-registro', false);
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new RegistroManager();
});