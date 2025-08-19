# 🚀 Guía para Subir Optimizer a GitHub

## 📋 PASO A PASO

### 1. Preparar Git Local
```bash
# Navegar a la carpeta del proyecto
cd E:\caminando-online\Optimizer

# Inicializar repositorio Git
git init

# Configurar usuario (si no lo has hecho antes)
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

### 2. Crear el Repositorio en GitHub
1. Ve a [GitHub.com](https://github.com)
2. Click en **"New repository"** (botón verde)
3. Nombre del repositorio: **`optimizer`**
4. Descripción: **"Sistema de Análisis y Optimización de Código Generado por IA"**
5. Selecciona **"Public"** (o Private si prefieres)
6. **NO** inicializar con README (ya tenemos uno)
7. **NO** agregar .gitignore (ya tenemos uno)
8. **NO** agregar licencia (ya tenemos una)
9. Click **"Create repository"**

### 3. Subir el Código
```bash
# Agregar todos los archivos
git add .

# Primer commit
git commit -m "🚀 Initial commit: Optimizer Dashboard v1.0

✨ Features:
- Dashboard completo del proyecto
- Navegación por 5 fases detalladas
- Gestión avanzada de tareas
- 100% compatible con Mac
- Responsive design
- Sistema de métricas en tiempo real

📊 Progreso: 4% (2/45 tareas completadas)
🎯 Próximo: Setup GitHub y selección de framework"

# Conectar con GitHub (reemplaza TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/optimizer.git

# Subir código
git branch -M main
git push -u origin main
```

### 4. Verificar la Subida
1. Refresca la página de tu repositorio en GitHub
2. Deberías ver todos los archivos subidos
3. El README.md se mostrará automáticamente

### 5. Configurar GitHub Pages (Opcional)
Para tener el dashboard online:

```bash
# Crear rama gh-pages
git checkout -b gh-pages

# Copiar dashboard a la raíz para GitHub Pages
git add .
git commit -m "📦 Setup GitHub Pages for dashboard"
git push origin gh-pages
```

Luego en GitHub:
1. Ve a **Settings** de tu repo
2. Scroll hasta **"Pages"**
3. Source: **"Deploy from a branch"**
4. Branch: **"gh-pages"**
5. Folder: **"/ (root)"**
6. Save

Tu dashboard estará en: `https://TU-USUARIO.github.io/optimizer/dashboard/`

## 🔧 Comandos de Uso Diario

### Actualizar cambios
```bash
# Ver estado
git status

# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "✨ Add: Nueva funcionalidad"

# Subir cambios
git push
```

### Tipos de commits recomendados
```bash
git commit -m "✨ Add: Nueva funcionalidad"
git commit -m "🐛 Fix: Corrección de bug"
git commit -m "📝 Docs: Actualizar documentación"
git commit -m "💄 Style: Mejoras de diseño"
git commit -m "♻️ Refactor: Reestructurar código"
git commit -m "⚡ Perf: Optimización de performance"
git commit -m "🚀 Deploy: Nueva versión"
```

## 🎯 Siguiente Paso

Una vez subido, actualiza el README.md con tu usuario real:

```bash
# Editar README.md y cambiar "TU-USUARIO" por tu usuario real
git add README.md
git commit -m "📝 Update: URLs with real GitHub username"
git push
```

## ✅ Checklist de Verificación

- [ ] Repositorio creado en GitHub
- [ ] Código subido exitosamente
- [ ] README.md se ve correctamente
- [ ] Dashboard funcional (probar abrir dashboard/index.html)
- [ ] URLs actualizadas con tu usuario real
- [ ] GitHub Pages configurado (opcional)

¡Tu proyecto Optimizer ya está en GitHub! 🎉