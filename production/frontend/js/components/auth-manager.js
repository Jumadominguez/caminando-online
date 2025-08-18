// ===============================================
// AUTH MANAGER - GESTIÓN DE AUTENTICACIÓN Y NAVEGACIÓN
// ===============================================

/**
 * Módulo responsable de gestionar la autenticación y navegación dinámica
 * Incluye: detección de usuario, navegación adaptativa, redirecciones
 */

// ===============================================
// CONFIGURACIÓN DEL MÓDULO
// ===============================================

const CONFIG_AUTH = {
  storage_keys: {
    user_token: "caminando_user_token",
    user_data: "caminando_user_data",
    remember_me: "caminando_remember_me"
  },
  rutas: {
    login: "/private/auth/login.html",
    registro: "/private/auth/registro.html", 
    dashboard: "/private/dashboard/dashboard.html",
    perfil: "/private/dashboard/perfil.html",
    home: "/index.html"
  },
  nav_config: {
    no_autenticado: {
      texto: "Iniciar Sesión",
      enlace: "/private/auth/login.html",
      clase: "auth-login-btn"
    },
    autenticado: {
      texto: "Mi Perfil",
      enlace: "/private/dashboard/dashboard.html", 
      clase: "user-profile-btn"
    }
  }
};

// Estado del módulo
let usuarioActual = null;
let estaAutenticado = false;
let navElement = null;

// ===============================================
// INICIALIZACIÓN
// ===============================================

/**
 * Inicializa el sistema de autenticación
 */
function inicializarAuth() {
  console.log("🔐 Inicializando AuthManager...");
  
  // Verificar estado de autenticación
  verificarEstadoAutenticacion();
  
  // Actualizar navegación
  actualizarNavegacion();
  
  // Configurar event listeners
  configurarEventListeners();
  
  console.log("✅ AuthManager inicializado");
}

/**
 * Verifica si el usuario está autenticado
 */
function verificarEstadoAutenticacion() {
  console.log("🔍 Verificando estado de autenticación...");
  
  try {
    // Buscar token en localStorage o sessionStorage
    const token = localStorage.getItem(CONFIG_AUTH.storage_keys.user_token) || 
                  sessionStorage.getItem(CONFIG_AUTH.storage_keys.user_token);
    
    const userData = localStorage.getItem(CONFIG_AUTH.storage_keys.user_data) ||
                     sessionStorage.getItem(CONFIG_AUTH.storage_keys.user_data);
    
    if (token && userData) {
      usuarioActual = JSON.parse(userData);
      estaAutenticado = true;
      console.log("✅ Usuario autenticado:", usuarioActual.email || usuarioActual.nombre);
    } else {
      usuarioActual = null;
      estaAutenticado = false;
      console.log("ℹ️ Usuario no autenticado (invitado)");
    }
  } catch (error) {
    console.error("❌ Error verificando autenticación:", error);
    usuarioActual = null;
    estaAutenticado = false;
  }
  
  return estaAutenticado;
}

// ===============================================
// GESTIÓN DE NAVEGACIÓN
// ===============================================

/**
 * Actualiza la navegación según el estado de autenticación
 */
function actualizarNavegacion() {
  console.log("🧭 Actualizando navegación...");
  
  // VERIFICAR SI ESTAMOS EN UNA PÁGINA DEL DASHBOARD
  const isDashboardPage = window.location.pathname.includes('/private/dashboard/');
  
  if (isDashboardPage) {
    console.log("📊 Página del dashboard detectada - no modificar navegación");
    return; // No modificar la navegación en páginas del dashboard
  }
  
  // Buscar elemento de navegación
  navElement = document.querySelector("header nav ul");
  
  if (!navElement) {
    console.warn("⚠️ Elemento de navegación no encontrado");
    return;
  }
  
  // Limpiar navegación actual
  navElement.innerHTML = "";
  
  // Generar navegación según estado
  if (estaAutenticado) {
    generarNavegacionAutenticado();
  } else {
    generarNavegacionInvitado();
  }
  
  console.log("✅ Navegación actualizada");
}

/**
 * Genera navegación para usuario no autenticado (invitado)
 */
function generarNavegacionInvitado() {
  const navItems = [
    {
      texto: "Iniciar Sesión",
      enlace: CONFIG_AUTH.rutas.login,
      clase: "nav-auth-login",
      icono: ""
    },
    {
      texto: "Registrarse",
      enlace: CONFIG_AUTH.rutas.registro,
      clase: "nav-auth-registro", 
      icono: ""
    }
  ];
  
  navItems.forEach(item => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    
    a.href = item.enlace;
    a.className = item.clase;
    
    // Envolver el texto en span para el botón de registro (para efectos CSS)
    if (item.clase === "nav-auth-registro") {
      const span = document.createElement("span");
      span.textContent = item.texto;
      a.appendChild(span);
    } else {
      a.textContent = item.texto;
    }
    
    // Event listener para navegación
    a.addEventListener("click", (e) => {
      e.preventDefault();
      navegarA(item.enlace);
    });
    
    li.appendChild(a);
    navElement.appendChild(li);
  });
  
  console.log("✅ Navegación de invitado generada");
}

/**
 * Genera navegación para usuario autenticado
 */
function generarNavegacionAutenticado() {
  const navItems = [
    {
      texto: "Dashboard",
      enlace: CONFIG_AUTH.rutas.dashboard,
      clase: "nav-dashboard",
      icono: ""
    },
    {
      texto: "Mi Perfil",
      enlace: CONFIG_AUTH.rutas.perfil,
      clase: "nav-perfil",
      icono: ""
    },
    {
      texto: "Cerrar Sesión",
      enlace: "#logout",
      clase: "nav-logout",
      icono: "",
      accion: "logout"
    }
  ];
  
  navItems.forEach(item => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    
    a.href = item.enlace;
    a.className = item.clase;
    a.textContent = item.texto;
    
    // Event listener especial para logout
    if (item.accion === "logout") {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        cerrarSesion();
      });
    } else {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        navegarA(item.enlace);
      });
    }
    
    li.appendChild(a);
    navElement.appendChild(li);
  });
  
  console.log("✅ Navegación de usuario autenticado generada");
}

// ===============================================
// GESTIÓN DE SESIONES
// ===============================================

/**
 * Inicia sesión del usuario
 */
function iniciarSesion(userData, token, recordarme = false) {
  console.log("🔐 Iniciando sesión...", userData.email);
  
  try {
    usuarioActual = userData;
    estaAutenticado = true;
    
    // Guardar en storage apropiado
    const storage = recordarme ? localStorage : sessionStorage;
    
    storage.setItem(CONFIG_AUTH.storage_keys.user_token, token);
    storage.setItem(CONFIG_AUTH.storage_keys.user_data, JSON.stringify(userData));
    
    if (recordarme) {
      localStorage.setItem(CONFIG_AUTH.storage_keys.remember_me, "true");
    }
    
    // Actualizar navegación
    actualizarNavegacion();
    
    // Notificar cambio de estado
    notificarCambioAuth("login", userData);
    
    console.log("✅ Sesión iniciada correctamente");
    return true;
  } catch (error) {
    console.error("❌ Error iniciando sesión:", error);
    return false;
  }
}

/**
 * Cierra sesión del usuario
 */
function cerrarSesion() {
  console.log("🚪 Cerrando sesión...");
  
  // Confirmar logout
  if (confirm("¿Estás seguro que querés cerrar sesión?")) {
    try {
      // Limpiar storage
      localStorage.removeItem(CONFIG_AUTH.storage_keys.user_token);
      localStorage.removeItem(CONFIG_AUTH.storage_keys.user_data);
      localStorage.removeItem(CONFIG_AUTH.storage_keys.remember_me);
      
      sessionStorage.removeItem(CONFIG_AUTH.storage_keys.user_token);
      sessionStorage.removeItem(CONFIG_AUTH.storage_keys.user_data);
      
      // Resetear estado
      usuarioActual = null;
      estaAutenticado = false;
      
      // Actualizar navegación
      actualizarNavegacion();
      
      // Notificar cambio de estado
      notificarCambioAuth("logout", null);
      
      // Redirigir a home
      navegarA(CONFIG_AUTH.rutas.home);
      
      console.log("✅ Sesión cerrada correctamente");
    } catch (error) {
      console.error("❌ Error cerrando sesión:", error);
    }
  }
}

// ===============================================
// NAVEGACIÓN Y REDIRECCIONES
// ===============================================

/**
 * Navega a una URL específica
 */
function navegarA(url) {
  console.log(`🧭 Navegando a: ${url}`);
  
  // Verificar si necesita autenticación
  if (url.includes("/private/dashboard/") && !estaAutenticado) {
    console.log("🔒 Ruta protegida, redirigiendo a login");
    redirigirALogin(url);
    return;
  }
  
  // Navegar
  window.location.href = url;
}

/**
 * Redirige al login guardando la URL de destino
 */
function redirigirALogin(urlDestino = null) {
  console.log("🔐 Redirigiendo a login...");
  
  if (urlDestino) {
    sessionStorage.setItem("redirect_after_login", urlDestino);
  }
  
  window.location.href = CONFIG_AUTH.rutas.login;
}

/**
 * Redirige después del login exitoso
 */
function redirigirDespuesLogin() {
  const redirectUrl = sessionStorage.getItem("redirect_after_login");
  
  if (redirectUrl) {
    sessionStorage.removeItem("redirect_after_login");
    console.log("🎯 Redirigiendo a URL guardada:", redirectUrl);
    window.location.href = redirectUrl;
  } else {
    console.log("🏠 Redirigiendo a dashboard");
    window.location.href = CONFIG_AUTH.rutas.dashboard;
  }
}

// ===============================================
// UTILIDADES Y VALIDACIONES
// ===============================================

/**
 * Verifica si una ruta requiere autenticación
 */
function rutaRequiereAuth(url) {
  return url.includes("/private/dashboard/");
}

/**
 * Obtiene información del usuario actual
 */
function obtenerUsuarioActual() {
  return usuarioActual;
}

/**
 * Verifica si el usuario está autenticado
 */
function estaLogueado() {
  return estaAutenticado;
}

/**
 * Valida token de sesión (simulado - en producción verificar con backend)
 */
function validarToken(token) {
  // Simulación - en producción hacer request al backend
  return token && token.length > 10;
}

// ===============================================
// EVENTOS Y NOTIFICACIONES
// ===============================================

/**
 * Configura event listeners globales
 */
function configurarEventListeners() {
  // Event listener para enlaces protegidos - DESHABILITADO EN DASHBOARD
  document.addEventListener("click", (e) => {
    // No interferir con navegación en páginas del dashboard
    if (window.location.pathname.includes('/private/dashboard/')) {
      return;
    }
    
    if (e.target.tagName === "A" && e.target.href) {
      const url = e.target.href;
      
      if (rutaRequiereAuth(url) && !estaAutenticado) {
        e.preventDefault();
        redirigirALogin(url);
      }
    }
  });
  
  // Event listener para cambios de storage (múltiples tabs)
  window.addEventListener("storage", (e) => {
    if (e.key === CONFIG_AUTH.storage_keys.user_token) {
      console.log("🔄 Cambio de autenticación detectado en otra tab");
      verificarEstadoAutenticacion();
      actualizarNavegacion();
    }
  });
  
  console.log("🔗 Event listeners de auth configurados");
}

/**
 * Notifica cambios de estado de autenticación
 */
function notificarCambioAuth(tipo, data) {
  const evento = new CustomEvent("authStateChanged", {
    detail: {
      tipo: tipo, // "login" o "logout"
      usuario: data,
      estaAutenticado: estaAutenticado
    }
  });
  
  document.dispatchEvent(evento);
  
  console.log("📡 Evento authStateChanged disparado:", tipo);
}

// ===============================================
// API PÚBLICA DEL MÓDULO
// ===============================================

window.AuthManager = {
  // Inicialización
  inicializar: inicializarAuth,
  
  // Estado
  estaLogueado: estaLogueado,
  obtenerUsuario: obtenerUsuarioActual,
  verificarEstado: verificarEstadoAutenticacion,
  
  // Sesiones
  iniciarSesion: iniciarSesion,
  cerrarSesion: cerrarSesion,
  
  // Navegación
  navegarA: navegarA,
  redirigirALogin: redirigirALogin,
  redirigirDespuesLogin: redirigirDespuesLogin,
  
  // Utilidades
  rutaRequiereAuth: rutaRequiereAuth,
  validarToken: validarToken,
  
  // Navegación
  actualizarNav: actualizarNavegacion,
  
  // Configuración
  configuracion: CONFIG_AUTH
};

console.log("📦 AuthManager cargado");
