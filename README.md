# Caminando Online v2 🛒

**Comparador de Precios de Supermercados Argentinos**

## 📋 Descripción

Plataforma web para comparar precios entre los principales supermercados de Argentina: **Carrefour**, **Disco**, **Jumbo**, **Día** y **Vea**, con funcionalidad de compra automática y gestión de listas de compras.

## 🚀 Stack Tecnológico

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Backend:** Python (Flask/FastAPI)
- **Base de Datos:** MongoDB
- **Scraping:** BeautifulSoup, Selenium
- **Responsive:** CSS Grid, Flexbox
- **API:** REST con JSON

## 🗂️ Estructura del Proyecto

```
caminando-online/
├── staging/                 # Desarrollo y testing
│   ├── index.html
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   ├── images/
│   │   └── fonts/
│   ├── config/
│   ├── data/
│   └── package.json
│
├── production/              # Versión en vivo
│   └── [estructura similar]
│
└── progress-dashboard.md    # Control de desarrollo
```

## 📦 Instalación y Configuración

### Desarrollo (Staging)
```bash
cd E:/caminando-online/staging/
npm run dev
# Abre http://localhost:3000
```

### Producción
```bash
cd E:/caminando-online/production/
npm run serve
# Abre http://localhost:8080
```

## 🛠️ Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `npm run dev` | Servidor desarrollo (puerto 3000) |
| `serve` | `npm run serve` | Servidor producción (puerto 8080) |
| `build` | `npm run build` | Compilar para producción |
| `test` | `npm run test` | Ejecutar testing manual |

## 🎯 Funcionalidades Principales

### ✅ Implementadas
- [ ] Estructura base del proyecto
- [ ] Layout responsivo
- [ ] Sección selección de supermercados
- [ ] Comparador de precios
- [ ] Sistema de autenticación

### 🔄 En Desarrollo
- Sistema de scraping automatizado
- API REST con Python
- Base de datos MongoDB
- Notificaciones de precios

### 📋 Por Implementar
- Aplicación móvil (PWA)
- Análisis de tendencias de precios
- Sistema de cupones y descuentos
- Integración con delivery

## 🎨 Paleta de Colores

```css
/* Colores Principales */
--naranja-caminando: #FF6B35;
--verde-oscuro: #2C5F41;
--turquesa: #4ECDC4;
--azul-acento: #45B7D1;

/* Colores Neutros */
--blanco: #F8F9FA;
--gris-claro: #E9ECEF;
--gris-medio: #6C757D;
--gris-oscuro: #212529;
```

## 🏪 Supermercados Integrados

| Supermercado | Status | API | Scraping |
|-------------|--------|-----|----------|
| **Carrefour** | 🟡 Desarrollo | ❌ | ✅ |
| **Disco** | 🟡 Desarrollo | ❌ | ✅ |
| **Jumbo** | 🟡 Desarrollo | ❌ | ✅ |
| **Día** | 🟡 Desarrollo | ❌ | ✅ |
| **Vea** | 🟡 Desarrollo | ❌ | ✅ |

## 📱 Responsive Breakpoints

```css
/* Mobile First */
320px  /* Mobile Small */
375px  /* Mobile */
768px  /* Tablet */
1024px /* Desktop */
1440px /* Desktop Large */
1920px /* Desktop XL */
```

## 🧪 Testing

### Manual Testing
- Abrir `index.html` en diferentes navegadores
- Testear responsividad en dispositivos móviles
- Validar funcionalidades de comparación

### Automated Testing
- Performance: Lighthouse audit
- Accesibilidad: WAVE, aXe
- Compatibilidad: BrowserStack

## 📈 Performance

### Objetivos
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms

### Optimizaciones
- Lazy loading de imágenes
- Minificación CSS/JS
- Compresión de assets
- CDN para recursos estáticos

## 🔒 Seguridad

- Sanitización de inputs
- Validación cliente y servidor
- Rate limiting en APIs
- Encriptación de datos sensibles

## 🤝 Contribución

### Workflow de Desarrollo
1. **Desarrollo:** Trabajar en `/staging/`
2. **Testing:** Validar funcionalidades
3. **Review:** Revisión de código
4. **Deploy:** Migrar a `/production/`

### Convenciones
- **Commits:** Conventional Commits (feat, fix, docs)
- **CSS:** Metodología BEM
- **JS:** ES6+, funciones puras
- **Variables:** Español para UI, inglés para lógica

## 📞 Soporte

- **Documentación:** Ver `progress-dashboard.md`
- **Issues:** Reportar en sección de issues del dashboard
- **Contacto:** juan@caminandoonline.com

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

---

**Caminando Online v2** - Comparando precios, ahorrando dinero 💰

*Última actualización: 27 Agosto 2025*