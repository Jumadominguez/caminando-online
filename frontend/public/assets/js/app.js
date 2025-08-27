/**
 * CAMINANDO ONLINE V2 - APP.JS
 * JavaScript principal de la aplicación
 * Fecha: 27 Agosto 2025
 */

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Caminando Online v2 iniciado');
    
    // Ocultar loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1000);
    
    // Inicializar componentes
    initializeHeader();
    // initializeNavigation(); // Removida
    initializeMobileMenu();
    
    console.log('✅ Aplicación lista');
});

// Inicializar header
function initializeHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    // Scroll effect para el header
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(255, 107, 53, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--color-primary)';
            header.style.backdropFilter = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// Navegación removida - ya no es necesaria
// function initializeNavigation() { ... }

// Inicializar menú móvil
function initializeMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
    });
    
    // Cerrar menú al hacer click en un botón (ya no hay links)
    // const mobileLinks = document.querySelectorAll('.mobile-menu__link');
    // mobileLinks.forEach(link => {
    //     link.addEventListener('click', () => {
    //         toggle.classList.remove('active');
    //         menu.classList.remove('active');
    //     });
    // });
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
        }
    });
}