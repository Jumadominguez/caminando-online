/* =====================================================
   🔑 UTILIDADES DE AUTENTICACIÓN - auth-utils.js
   ===================================================== */

// Configuración de la API
const API_BASE_URL = '/api';

/**
 * 🛡️ Utilidades de Validación
 */
const ValidationUtils = {
  
  // Validar email
  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Validar contraseña
  validatePassword(password) {
    // Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  },

  // Validar teléfono argentino
  validatePhone(phone) {
    // Formatos: +54 9 11 1234 5678, 11 1234 5678, 1112345678
    const regex = /^(\+54\s?9?\s?)?(\d{2,4}\s?\d{4}\s?\d{4}|\d{10,11})$/;
    return regex.test(phone.replace(/\s/g, ''));
  },

  // Validar DNI argentino
  validateDNI(dni) {
    const regex = /^\d{7,8}$/;
    return regex.test(dni);
  },

  // Validar nombre (solo letras y espacios)
  validateName(name) {
    const regex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
    return regex.test(name.trim());
  }
};

/**
 * 🎨 Utilidades de UI
 */
const UIUtils = {
  
  // Mostrar error en campo específico
  showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(`error-${fieldId}`);
    
    if (field && errorDiv) {
      field.classList.add('is-invalid', 'field-invalid');
      field.classList.remove('is-valid', 'field-valid');
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  },

  // Limpiar error de campo
  clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(`error-${fieldId}`);
    
    if (field && errorDiv) {
      field.classList.remove('is-invalid', 'field-invalid');
      errorDiv.textContent = '';
      errorDiv.style.display = 'none';
    }
  },

  // Mostrar campo como válido
  showFieldValid(fieldId) {
    const field = document.getElementById(fieldId);
    
    if (field) {
      field.classList.add('is-valid', 'field-valid');
      field.classList.remove('is-invalid', 'field-invalid');
    }
  },

  // Mostrar mensaje general
  showMessage(elementId, message, type = 'success') {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
      element.className = `alert alert-${type}`;
      element.style.display = 'block';
      
      // Auto-ocultar después de 5 segundos si es éxito
      if (type === 'success') {
        setTimeout(() => {
          element.style.display = 'none';
        }, 5000);
      }
    }
  },

  // Limpiar todos los errores
  clearAllErrors() {
    const errorDivs = document.querySelectorAll('[id^="error-"]');
    errorDivs.forEach(div => {
      div.textContent = '';
      div.style.display = 'none';
    });

    const fields = document.querySelectorAll('.is-invalid, .is-valid, .field-invalid, .field-valid');
    fields.forEach(field => {
      field.classList.remove('is-invalid', 'is-valid', 'field-invalid', 'field-valid');
    });
  },

  // Toggle password visibility
  togglePasswordVisibility(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    const icon = toggle.querySelector('.eye-icon');
    
    if (input.type === 'password') {
      input.type = 'text';
      icon.textContent = '🙈';
    } else {
      input.type = 'password';
      icon.textContent = '👁️';
    }
  },

  // Mostrar loading en botón
  showButtonLoading(buttonId, show = true) {
    const button = document.getElementById(buttonId);
    const textSpan = button.querySelector('.btn-text');
    const loadingSpan = button.querySelector('.btn-loading');
    
    if (show) {
      button.disabled = true;
      textSpan.style.display = 'none';
      loadingSpan.style.display = 'flex';
    } else {
      button.disabled = false;
      textSpan.style.display = 'block';
      loadingSpan.style.display = 'none';
    }
  }
};

/**
 * 🌐 Utilidades de API
 */
const APIUtils = {
  
  // Realizar petición POST
  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.mensaje || 'Error en la petición');
      }

      return result;
    } catch (error) {
      console.error('Error en petición API:', error);
      throw error;
    }
  },

  // Realizar petición GET con token
  async get(endpoint, token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.mensaje || 'Error en la petición');
      }

      return result;
    } catch (error) {
      console.error('Error en petición API:', error);
      throw error;
    }
  }
};

/**
 * 🔐 Utilidades de Autenticación
 */
const AuthUtils = {
  
  // Guardar token en localStorage
  saveToken(token) {
    localStorage.setItem('caminando_token', token);
  },

  // Obtener token de localStorage
  getToken() {
    return localStorage.getItem('caminando_token');
  },

  // Eliminar token
  removeToken() {
    localStorage.removeItem('caminando_token');
  },

  // Verificar si usuario está logueado
  isLoggedIn() {
    return !!this.getToken();
  },

  // Guardar datos del usuario
  saveUserData(userData) {
    localStorage.setItem('caminando_user', JSON.stringify(userData));
  },

  // Obtener datos del usuario
  getUserData() {
    const userData = localStorage.getItem('caminando_user');
    return userData ? JSON.parse(userData) : null;
  },

  // Limpiar datos del usuario
  clearUserData() {
    localStorage.removeItem('caminando_user');
  },

  // Logout completo
  logout() {
    this.removeToken();
    this.clearUserData();
    window.location.href = '/index.html';
  },

  // Redirigir si ya está logueado
  redirectIfLoggedIn() {
    if (this.isLoggedIn()) {
      window.location.href = '/private/dashboard/dashboard.html';
    }
  },

  // Redirigir si NO está logueado
  redirectIfNotLoggedIn() {
    if (!this.isLoggedIn()) {
      window.location.href = '/private/auth/login.html';
    }
  }
};

/**
 * 🎯 Utilidades de Formato
 */
const FormatUtils = {
  
  // Formatear teléfono argentino
  formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.startsWith('549')) {
      // +54 9 11 1234 5678
      return `+54 9 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 9)} ${cleaned.slice(9)}`;
    } else if (cleaned.startsWith('54')) {
      // +54 11 1234 5678
      return `+54 ${cleaned.slice(2, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
    } else if (cleaned.length === 10) {
      // 11 1234 5678
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`;
    }
    
    return phone;
  },

  // Formatear DNI
  formatDNI(dni) {
    return dni.replace(/\D/g, '').slice(0, 8);
  },

  // Capitalizar nombre
  capitalizeName(name) {
    return name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }
};

// Exportar utilidades globalmente
window.ValidationUtils = ValidationUtils;
window.UIUtils = UIUtils;
window.APIUtils = APIUtils;
window.AuthUtils = AuthUtils;
window.FormatUtils = FormatUtils;