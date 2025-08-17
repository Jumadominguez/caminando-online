/* ===============================================
   FOOTER MANAGER - CAMINANDO.ONLINE
   =============================================== */

/**
 * Módulo responsable de la funcionalidad del footer
 * Incluye: estadísticas en tiempo real, enlaces dinámicos, redes sociales
 */

class FooterManager {
  constructor() {
    this.stats = {
      supermercados: 5,
      productos: 1000,
      actualizacion: '24/7'
    };
    
    this.supermercados = [
      { name: 'Carrefour', icon: 'C', url: 'https://www.carrefour.com.ar/' },
      { name: 'Disco', icon: 'D', url: 'https://www.disco.com.ar/' },
      { name: 'Jumbo', icon: 'J', url: 'https://www.jumbo.com.ar/' },
      { name: 'Vea', icon: 'V', url: 'https://www.vea.com.ar/' },
      { name: 'Día', icon: 'D', url: 'https://diaonline.supermercadosdia.com.ar/' }
    ];
    
    this.redesSociales = [
      { name: 'Facebook', icon: '📘', url: '#facebook' },
      { name: 'Twitter', icon: '🐦', url: '#twitter' },
      { name: 'Instagram', icon: '📷', url: '#instagram' },
      { name: 'LinkedIn', icon: '💼', url: '#linkedin' }
    ];
    
    this.init();
  }

  /**
   * Inicializa el footer
   */
  init() {
    this.createFooter();
    this.setupEventListeners();
    this.updateStats();
    console.log('✅ Footer Manager inicializado');
  }

  /**
   * Crea el footer dinámicamente
   */
  createFooter() {
    const footerHTML = `
      <footer class="footer-moderno">
        <div class="footer-container">
          
          <!-- Grid principal del footer -->
          <div class="footer-grid">
            
            <!-- Sección principal - Marca -->
            <div class="footer-brand">
              <div class="footer-logo">
                <span class="footer-logo-icon">🛒</span>
                <span class="footer-logo-text">Caminando.Online</span>
              </div>
              
              <p class="footer-descripcion">
                La plataforma que te ayuda a encontrar los mejores precios en los principales supermercados de Argentina. 
                Comparamos productos en tiempo real para que ahorres tiempo y dinero en tus compras.
              </p>
              
              <div class="footer-stats">
                <div class="footer-stat">
                  <span class="footer-stat-number" id="footer-stat-supermercados">${this.stats.supermercados}</span>
                  <span class="footer-stat-label">Supermercados</span>
                </div>
                <div class="footer-stat">
                  <span class="footer-stat-number" id="footer-stat-productos">${this.stats.productos}+</span>
                  <span class="footer-stat-label">Productos</span>
                </div>
                <div class="footer-stat">
                  <span class="footer-stat-number" id="footer-stat-actualizacion">${this.stats.actualizacion}</span>
                  <span class="footer-stat-label">Actualización</span>
                </div>
              </div>
            </div>
            
            <!-- Navegación -->
            <div class="footer-section">
              <h4>Navegación</h4>
              <ul class="footer-links">
                <li><a href="index.html"><span class="footer-icon">🏠</span>Inicio</a></li>
                <li><a href="#productos"><span class="footer-icon">📦</span>Productos</a></li>
                <li><a href="productos-comparados.html"><span class="footer-icon">⚖️</span>Comparar</a></li>
                <li><a href="#promociones"><span class="footer-icon">🎯</span>Promociones</a></li>
                <li><a href="#ayuda"><span class="footer-icon">❓</span>Ayuda</a></li>
              </ul>
            </div>
            
            <!-- Supermercados -->
            <div class="footer-section">
              <h4>Supermercados</h4>
              <div class="footer-supermercados">
                ${this.generateSupermercadosHTML()}
              </div>
            </div>
            
            <!-- Contacto y Redes -->
            <div class="footer-section">
              <h4>Contacto</h4>
              <div class="footer-contacto">
                <div class="footer-contacto-item">
                  <span class="footer-contacto-icon">📧</span>
                  <span>info@caminando.online</span>
                </div>
                <div class="footer-contacto-item">
                  <span class="footer-contacto-icon">📞</span>
                  <span>+54 11 1234-5678</span>
                </div>
                <div class="footer-contacto-item">
                  <span class="footer-contacto-icon">📍</span>
                  <span>Buenos Aires, Argentina</span>
                </div>
              </div>
              
              <div class="footer-redes">
                ${this.generateRedesHTML()}
              </div>
            </div>
            
          </div>
          
          <!-- Footer inferior -->
          <div class="footer-bottom">
            <div class="footer-copyright">
              © ${new Date().getFullYear()} Caminando.Online. Todos los derechos reservados.
            </div>
            <div class="footer-legal">
              <a href="#privacidad">Política de Privacidad</a>
              <a href="#terminos">Términos de Uso</a>
              <a href="#cookies">Cookies</a>
            </div>
          </div>
          
        </div>
      </footer>
    `;

    // Insertar el footer al final del body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
  }

  /**
   * Genera HTML de supermercados
   */
  generateSupermercadosHTML() {
    return this.supermercados.map(super_ => `
      <div class="footer-super" data-super="${super_.name}">
        <div class="footer-super-icon">${super_.icon}</div>
        <span class="footer-super-name">${super_.name}</span>
      </div>
    `).join('');
  }

  /**
   * Genera HTML de redes sociales
   */
  generateRedesHTML() {
    return this.redesSociales.map(red => `
      <a href="${red.url}" class="footer-red" title="${red.name}" data-red="${red.name}">
        ${red.icon}
      </a>
    `).join('');
  }

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    // Event listener para supermercados
    document.addEventListener('click', (e) => {
      const superElement = e.target.closest('.footer-super');
      if (superElement) {
        const superName = superElement.dataset.super;
        this.handleSupermercadoClick(superName);
      }
    });

    // Event listener para redes sociales
    document.addEventListener('click', (e) => {
      const redElement = e.target.closest('.footer-red');
      if (redElement) {
        e.preventDefault();
        const redName = redElement.dataset.red;
        this.handleRedSocialClick(redName);
      }
    });

    // Event listener para enlaces legales
    document.addEventListener('click', (e) => {
      if (e.target.matches('.footer-legal a')) {
        e.preventDefault();
        this.handleLegalClick(e.target.href);
      }
    });
  }

  /**
   * Maneja click en supermercado
   */
  handleSupermercadoClick(superName) {
    const supermercado = this.supermercados.find(s => s.name === superName);
    if (supermercado) {
      console.log(`🏪 Navegando a ${superName}`);
      // Aquí puedes agregar lógica personalizada
      // window.open(supermercado.url, '_blank');
      
      // Por ahora solo mostramos un mensaje
      this.showToast(`Conectando con ${superName}...`);
    }
  }

  /**
   * Maneja click en red social
   */
  handleRedSocialClick(redName) {
    console.log(`📱 Abriendo ${redName}`);
    this.showToast(`Abriendo ${redName}...`);
  }

  /**
   * Maneja click en enlaces legales
   */
  handleLegalClick(href) {
    const section = href.split('#')[1];
    console.log(`📄 Abriendo sección: ${section}`);
    this.showToast(`Cargando información legal...`);
  }

  /**
   * Actualiza estadísticas del footer
   */
  updateStats() {
    // Simular actualización de productos
    setInterval(() => {
      const productosElement = document.getElementById('footer-stat-productos');
      if (productosElement) {
        const currentCount = parseInt(productosElement.textContent.replace('+', ''));
        const newCount = currentCount + Math.floor(Math.random() * 5);
        productosElement.textContent = `${newCount}+`;
        
        // Efecto de animación
        productosElement.classList.add('footer-stat-updated');
        setTimeout(() => {
          productosElement.classList.remove('footer-stat-updated');
        }, 1000);
      }
    }, 30000); // Actualizar cada 30 segundos
  }

  /**
   * Muestra un toast de notificación
   */
  showToast(message) {
    // Crear toast simple
    const toast = document.createElement('div');
    toast.className = 'footer-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-size: 0.9rem;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    `;

    document.body.appendChild(toast);

    // Animar entrada
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 100);

    // Remover después de 3 segundos
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  /**
   * Reemplaza el footer simple por el footer moderno
   */
  static replaceSimpleFooter() {
    const simpleFooter = document.querySelector('footer:not(.footer-moderno)');
    if (simpleFooter) {
      simpleFooter.remove();
    }
    
    // Crear nueva instancia del footer moderno
    new FooterManager();
  }
}

// Agregar estilos para animaciones adicionales
const footerStyles = `
  .footer-stat-updated {
    animation: footerStatPulse 1s ease-in-out;
  }
  
  @keyframes footerStatPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); color: #28a745; }
  }
  
  .footer-toast {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
`;

// Insertar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = footerStyles;
document.head.appendChild(styleSheet);

// Exportar para uso global
window.FooterManager = FooterManager;

console.log('📦 Footer Manager cargado');
