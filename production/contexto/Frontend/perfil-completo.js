/* =====================================================
   👤 LÓGICA DEL PERFIL COMPLETO - perfil-completo.js
   ===================================================== */

class ProfileManager {
  constructor() {
    this.user = null;
    this.editingProfile = false;
    this.originalProfileData = {};
    this.addresses = [];
    this.editingAddressId = null;
    
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
    
    console.log('✅ Profile manager inicializado');
  }

  async loadUserData() {
    try {
      // Cargar perfil
      const profileResponse = await APIUtils.get('/auth/profile', AuthUtils.getToken());
      
      if (profileResponse.success) {
        this.user = profileResponse.usuario;
        this.updateProfileForm();
        this.updateUserHeader();
        this.updateSettings();
      }

    } catch (error) {
      console.error('❌ Error cargando perfil:', error);
      
      if (error.message.includes('Token') || error.message.includes('401')) {
        AuthUtils.logout();
      }
    }
  }

  updateUserHeader() {
    if (!this.user) return;

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

  updateProfileForm() {
    if (!this.user) return;

    document.getElementById('nombre').value = this.user.nombre || '';
    document.getElementById('apellido').value = this.user.apellido || '';
    document.getElementById('email').value = this.user.email || '';
    document.getElementById('telefono').value = this.user.telefono || '';
    document.getElementById('dni').value = this.user.dni || '';
    
    if (this.user.fechaNacimiento) {
      const fecha = new Date(this.user.fechaNacimiento);
      document.getElementById('fecha-nacimiento').value = fecha.toISOString().split('T')[0];
    }

    // Actualizar estado de verificación de email
    const emailStatus = document.getElementById('email-verification-status');
    if (emailStatus) {
      if (this.user.emailVerificado) {
        emailStatus.innerHTML = '<span class="status-badge status-success">✓ Verificado</span>';
      } else {
        emailStatus.innerHTML = '<span class="status-badge status-warning">⚠ Pendiente</span>';
      }
    }

    // Actualizar direcciones
    this.addresses = this.user.direcciones || [];
    this.updateAddressesList();
  }

  updateSettings() {
    if (!this.user || !this.user.configuraciones) return;

    const config = this.user.configuraciones;

    // Notificaciones
    document.getElementById('notifications-email').checked = config.notificaciones?.email || false;
    document.getElementById('notifications-offers').checked = config.notificaciones?.ofertas || false;

    // Privacidad
    document.getElementById('privacy-share-data').checked = config.privacidad?.compartirDatos || false;
    document.getElementById('privacy-marketing').checked = config.privacidad?.recibirMarketing || false;
  }

  updateAddressesList() {
    const addressesList = document.getElementById('addresses-list');
    
    if (!this.addresses || this.addresses.length === 0) {
      addressesList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🏠</div>
          <div class="empty-text">
            <div class="empty-title">No hay direcciones guardadas</div>
            <div class="empty-subtitle">Agregá tu primera dirección para realizar compras</div>
          </div>
          <button class="btn btn-outline-primary btn-sm" id="add-first-address-btn">
            Agregar dirección
          </button>
        </div>
      `;
      
      // Re-attach event listener
      document.getElementById('add-first-address-btn').addEventListener('click', () => {
        this.openAddressModal();
      });
      
      return;
    }

    const addressesHTML = this.addresses.map(address => `
      <div class="address-item ${address.esPrincipal ? 'address-primary' : ''}" data-address-id="${address._id}">
        <div class="address-info">
          <div class="address-header">
            <div class="address-alias">${address.alias}</div>
            ${address.esPrincipal ? '<span class="badge bg-primary">Principal</span>' : ''}
          </div>
          <div class="address-details">
            ${address.calle} ${address.numero}${address.piso ? `, Piso ${address.piso}` : ''}${address.departamento ? `, Depto ${address.departamento}` : ''}
          </div>
          <div class="address-location">
            ${address.localidad}, ${address.provincia} (${address.codigoPostal})
          </div>
          ${address.contacto?.instrucciones ? `<div class="address-instructions">${address.contacto.instrucciones}</div>` : ''}
        </div>
        <div class="address-actions">
          <button class="btn btn-outline-primary btn-sm" onclick="profileManager.editAddress('${address._id}')">
            <i class="btn-icon">✏️</i>
            Editar
          </button>
          <button class="btn btn-outline-danger btn-sm" onclick="profileManager.deleteAddress('${address._id}')">
            <i class="btn-icon">🗑️</i>
            Eliminar
          </button>
        </div>
      </div>
    `).join('');

    addressesList.innerHTML = addressesHTML;
  }

  setupUI() {
    // Configurar título de la página
    document.title = 'Mi Perfil - Caminando Online';
  }

  setupEventListeners() {
    // Editar perfil
    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', () => {
        this.toggleProfileEdit();
      });
    }

    // Guardar perfil
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        this.handleSaveProfile(e);
      });
    }

    // Cancelar edición
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    if (cancelEditBtn) {
      cancelEditBtn.addEventListener('click', () => {
        this.cancelProfileEdit();
      });
    }

    // Agregar dirección
    const addAddressBtn = document.getElementById('add-address-btn');
    if (addAddressBtn) {
      addAddressBtn.addEventListener('click', () => {
        this.openAddressModal();
      });
    }

    // Guardar dirección
    const saveAddressBtn = document.getElementById('save-address-btn');
    if (saveAddressBtn) {
      saveAddressBtn.addEventListener('click', () => {
        this.handleSaveAddress();
      });
    }

    // Guardar configuraciones
    const settingsForm = document.getElementById('save-settings-btn');
    if (settingsForm) {
      settingsForm.addEventListener('click', (e) => {
        this.handleSaveSettings(e);
      });
    }

    // Cambiar contraseña
    const changePasswordBtn = document.getElementById('change-password-btn');
    if (changePasswordBtn) {
      changePasswordBtn.addEventListener('click', () => {
        this.openChangePasswordModal();
      });
    }

    // Eliminar cuenta
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
      deleteAccountBtn.addEventListener('click', () => {
        this.handleDeleteAccount();
      });
    }

    // Menú de usuario
    this.setupUserMenu();
  }

  setupUserMenu() {
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userDropdown = document.getElementById('user-dropdown');
    let menuOpen = false;
    
    if (userMenuBtn) {
      userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuOpen = !menuOpen;
        document.querySelector('.user-menu').classList.toggle('open', menuOpen);
      });
    }

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', () => {
      if (menuOpen) {
        menuOpen = false;
        document.querySelector('.user-menu').classList.remove('open');
      }
    });

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Usar popup personalizado para cerrar sesión
        mostrarPopupCerrarSesion(() => {
          AuthUtils.logout();
        });
      });
    }
  }

  toggleProfileEdit() {
    this.editingProfile = !this.editingProfile;
    
    if (this.editingProfile) {
      // Guardar datos originales
      this.originalProfileData = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        telefono: document.getElementById('telefono').value,
        fechaNacimiento: document.getElementById('fecha-nacimiento').value
      };

      // Habilitar campos editables
      document.getElementById('nombre').disabled = false;
      document.getElementById('apellido').disabled = false;
      document.getElementById('telefono').disabled = false;
      document.getElementById('fecha-nacimiento').disabled = false;

      // Mostrar botones de acción
      document.getElementById('profile-actions').style.display = 'block';
      document.getElementById('edit-profile-btn').style.display = 'none';

    } else {
      this.cancelProfileEdit();
    }
  }

  cancelProfileEdit() {
    // Restaurar datos originales
    if (this.originalProfileData) {
      document.getElementById('nombre').value = this.originalProfileData.nombre;
      document.getElementById('apellido').value = this.originalProfileData.apellido;
      document.getElementById('telefono').value = this.originalProfileData.telefono;
      document.getElementById('fecha-nacimiento').value = this.originalProfileData.fechaNacimiento;
    }

    // Deshabilitar campos
    document.getElementById('nombre').disabled = true;
    document.getElementById('apellido').disabled = true;
    document.getElementById('telefono').disabled = true;
    document.getElementById('fecha-nacimiento').disabled = true;

    // Ocultar botones de acción
    document.getElementById('profile-actions').style.display = 'none';
    document.getElementById('edit-profile-btn').style.display = 'inline-flex';

    this.editingProfile = false;
    UIUtils.clearAllErrors();
  }

  async handleSaveProfile(e) {
    e.preventDefault();

    try {
      // Validar campos
      const formData = {
        nombre: document.getElementById('nombre').value.trim(),
        apellido: document.getElementById('apellido').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        fechaNacimiento: document.getElementById('fecha-nacimiento').value
      };

      // Validaciones básicas
      if (!formData.nombre || !formData.apellido || !formData.telefono) {
        UIUtils.showMessage('error-general', 'Todos los campos son obligatorios', 'danger');
        return;
      }

      UIUtils.showButtonLoading('save-profile-btn', true);

      const response = await APIUtils.put('/auth/profile', formData, AuthUtils.getToken());

      if (response.success) {
        this.user = response.usuario;
        AuthUtils.saveUserData(this.user);
        
        UIUtils.showMessage('success-message', 'Perfil actualizado exitosamente', 'success');
        this.cancelProfileEdit();
        this.updateUserHeader();
      }

    } catch (error) {
      console.error('❌ Error guardando perfil:', error);
      UIUtils.showMessage('error-general', 'Error al guardar el perfil. Intenta nuevamente.', 'danger');
    } finally {
      UIUtils.showButtonLoading('save-profile-btn', false);
    }
  }

  openAddressModal(addressId = null) {
    this.editingAddressId = addressId;
    
    const modal = new bootstrap.Modal(document.getElementById('addressModal'));
    const title = document.getElementById('addressModalTitle');
    
    if (addressId) {
      title.textContent = 'Editar Dirección';
      const address = this.addresses.find(addr => addr._id === addressId);
      if (address) {
        this.fillAddressForm(address);
      }
    } else {
      title.textContent = 'Agregar Dirección';
      this.clearAddressForm();
    }
    
    modal.show();
  }

  fillAddressForm(address) {
    document.getElementById('address-alias').value = address.alias || '';
    document.getElementById('address-street').value = address.calle || '';
    document.getElementById('address-number').value = address.numero || '';
    document.getElementById('address-floor').value = address.piso || '';
    document.getElementById('address-apartment').value = address.departamento || '';
    document.getElementById('address-postal-code').value = address.codigoPostal || '';
    document.getElementById('address-city').value = address.localidad || '';
    document.getElementById('address-province').value = address.provincia || '';
    document.getElementById('address-instructions').value = address.contacto?.instrucciones || '';
    document.getElementById('address-is-main').checked = address.esPrincipal || false;
  }

  clearAddressForm() {
    document.getElementById('address-form').reset();
  }

  async handleSaveAddress() {
    try {
      const formData = {
        alias: document.getElementById('address-alias').value.trim(),
        calle: document.getElementById('address-street').value.trim(),
        numero: document.getElementById('address-number').value.trim(),
        piso: document.getElementById('address-floor').value.trim(),
        departamento: document.getElementById('address-apartment').value.trim(),
        codigoPostal: document.getElementById('address-postal-code').value.trim(),
        localidad: document.getElementById('address-city').value.trim(),
        provincia: document.getElementById('address-province').value,
        esPrincipal: document.getElementById('address-is-main').checked,
        contacto: {
          instrucciones: document.getElementById('address-instructions').value.trim()
        }
      };

      // Validaciones básicas
      if (!formData.alias || !formData.calle || !formData.numero || !formData.codigoPostal || !formData.localidad || !formData.provincia) {
        UIUtils.showMessage('error-general', 'Completá todos los campos obligatorios', 'danger');
        return;
      }

      UIUtils.showButtonLoading('save-address-btn', true);

      let response;
      if (this.editingAddressId) {
        response = await APIUtils.put(`/auth/address/${this.editingAddressId}`, formData, AuthUtils.getToken());
      } else {
        response = await APIUtils.post('/auth/address', formData, AuthUtils.getToken());
      }

      if (response.success) {
        await this.loadUserData(); // Recargar datos
        bootstrap.Modal.getInstance(document.getElementById('addressModal')).hide();
        UIUtils.showMessage('success-message', 'Dirección guardada exitosamente', 'success');
      }

    } catch (error) {
      console.error('❌ Error guardando dirección:', error);
      UIUtils.showMessage('error-general', 'Error al guardar la dirección. Intenta nuevamente.', 'danger');
    } finally {
      UIUtils.showButtonLoading('save-address-btn', false);
    }
  }

  editAddress(addressId) {
    this.openAddressModal(addressId);
  }

  async deleteAddress(addressId) {
    // Buscar el alias de la dirección para mostrarlo en el popup
    const address = this.addresses.find(addr => addr._id === addressId);
    const alias = address ? address.alias : 'esta dirección';
    
    // Usar popup personalizado
    mostrarPopupEliminarDireccion(alias, async () => {
      try {
        const response = await APIUtils.delete(`/auth/address/${addressId}`, AuthUtils.getToken());
        
        if (response.success) {
          await this.loadUserData(); // Recargar datos
          mostrarPopupExito(
            "Dirección Eliminada",
            `La dirección "${alias}" ha sido eliminada exitosamente.`
          );
        }

      } catch (error) {
        console.error('❌ Error eliminando dirección:', error);
        mostrarPopupError(
          "Error al Eliminar",
          "Error al eliminar la dirección. Intentá nuevamente."
        );
      }
    });
  }

  async handleSaveSettings(e) {
    e.preventDefault();

    // Usar popup personalizado para confirmar guardado
    mostrarPopupGuardarConfiguraciones(async () => {
      try {
        const configuraciones = {
          notificaciones: {
            email: document.getElementById('notifications-email').checked,
            ofertas: document.getElementById('notifications-offers').checked
          },
          privacidad: {
            compartirDatos: document.getElementById('privacy-share-data').checked,
            recibirMarketing: document.getElementById('privacy-marketing').checked
          }
        };

        UIUtils.showButtonLoading('save-settings-btn', true);

        const response = await APIUtils.put('/auth/profile', { configuraciones }, AuthUtils.getToken());

        if (response.success) {
          this.user = response.usuario;
          AuthUtils.saveUserData(this.user);
          
          mostrarPopupExito(
            "Configuraciones Guardadas",
            "Todas tus configuraciones han sido guardadas exitosamente."
          );
        }

      } catch (error) {
        console.error('❌ Error guardando configuraciones:', error);
        mostrarPopupError(
          "Error al Guardar",
          "Error al guardar las configuraciones. Intentá nuevamente."
        );
      } finally {
        UIUtils.showButtonLoading('save-settings-btn', false);
      }
    });
  }

  openChangePasswordModal() {
    // Usar popup personalizado
    mostrarPopupCambiarContrasena(() => {
      console.log('📧 Función de cambio de contraseña próximamente');
      // TODO: Implementar lógica real de cambio de contraseña
    });
  }

  async handleDeleteAccount() {
    // Usar popup personalizado para eliminar cuenta
    mostrarPopupEliminarCuenta(async () => {
      try {
        // Primero pedir la contraseña con un prompt
        const password = prompt('Para confirmar, ingresá tu contraseña:');
        
        if (!password) {
          return;
        }
      const response = await APIUtils.delete('/auth/account', { password }, AuthUtils.getToken());
      
      if (response.success) {
        mostrarPopupExito(
          "Cuenta Eliminada",
          "Tu cuenta ha sido eliminada exitosamente. Serás redirigido al inicio.",
          () => {
            AuthUtils.logout();
          }
        );
      }

    } catch (error) {
      console.error('❌ Error eliminando cuenta:', error);
      alert('Error al eliminar la cuenta. Verificá tu contraseña e intenta nuevamente.');
    }
  }
}

// Variable global para acceso desde HTML
let profileManager;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  profileManager = new ProfileManager();
});