# Frontend - Caminando Online v2

## Estructura Public/Private

### 📁 Public (Acceso Libre)
- **Ubicación:** `/frontend/public/`
- **Acceso:** Sin autenticación
- **Contenido:** Homepage, comparador, landing pages

### 🔒 Private (Acceso Restringido)
- **Ubicación:** `/frontend/private/`
- **Acceso:** Requiere autenticación
- **Secciones:**
  - **Admin:** Panel administrativo
  - **Dashboard:** Dashboard personal del usuario
  - **Profile:** Configuración de perfil de usuario

## Desarrollo

### Public Area
```bash
cd E:/caminando-online/staging/frontend/public/
python -m http.server 3000
# Abre http://localhost:3000
```

### Private Areas
```bash
# Admin Panel
cd E:/caminando-online/staging/frontend/private/admin/
python -m http.server 3001

# User Dashboard
cd E:/caminando-online/staging/frontend/private/dashboard/
python -m http.server 3002

# User Profile
cd E:/caminando-online/staging/frontend/private/profile/
python -m http.server 3003
```

## Estructura Completa
```
frontend/
├── public/                  # Área pública
│   ├── index.html          # Homepage principal
│   └── assets/             # CSS, JS, imágenes compartidas
├── private/                # Área privada
│   ├── admin/              # Panel administrativo
│   │   ├── index.html      # Admin dashboard
│   │   └── assets/         # CSS/JS específicos admin
│   ├── dashboard/          # Dashboard usuario
│   │   ├── index.html      # Panel personal
│   │   └── assets/         # CSS/JS específicos dashboard
│   └── profile/            # Perfil usuario
│       ├── index.html      # Configuración perfil
│       └── assets/         # CSS/JS específicos profile
├── package.json            # Config general frontend
└── README.md               # Documentación
```

## Autenticación
- **Public:** Acceso libre
- **Private:** JWT token requerido
- **Admin:** Rol administrativo + JWT
- **Redirects:** Login automático si no autenticado

## Tecnologías
- **HTML5** - Estructura semántica
- **CSS3** - Variables, Grid, Flexbox  
- **JavaScript ES6+** - Módulos, async/await
- **Responsive** - Mobile-first design