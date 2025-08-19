# 🍎 Compatibilidad con Mac - Optimizer Dashboard

## ✅ Estado de Compatibilidad

El dashboard de Optimizer es **100% compatible con Mac** y funciona en:

### 🌐 Navegadores Soportados en Mac:
- ✅ **Safari** (recomendado para Mac)
- ✅ **Chrome** 
- ✅ **Firefox**
- ✅ **Edge**

### 📱 Dispositivos Compatibles:
- ✅ **MacBook Pro/Air** (todas las resoluciones)
- ✅ **iMac** (24", 27", Pro Display XDR)
- ✅ **iPad** (modo responsive)
- ✅ **iPhone** (modo responsive)

## 🚀 Cómo Abrir en Mac:

### Opción 1: Archivo Local
```bash
# Navegar a la carpeta del proyecto
cd /ruta/a/tu/Optimizer/dashboard

# Abrir con Safari (recomendado)
open -a Safari index.html

# O con Chrome
open -a "Google Chrome" index.html
```

### Opción 2: Servidor Local
```bash
# Usando Python (viene preinstalado en Mac)
cd /ruta/a/tu/Optimizer/dashboard
python3 -m http.server 8000

# Luego abrir: http://localhost:8000
```

### Opción 3: Live Server (si tienes VS Code)
```bash
# Instalar extensión Live Server en VS Code
# Hacer clic derecho en index.html > "Open with Live Server"
```

## 🎨 Características Optimizadas para Mac:

### ✅ Tipografía
- Usa **Inter** de Google Fonts (excelente en pantallas Retina)
- Fallback a `-apple-system` para texto del sistema Mac

### ✅ Interacciones
- Compatible con **trackpad gestures**
- Funciona con **Magic Mouse**
- Soporte para **keyboard shortcuts** Mac (Cmd+...)

### ✅ Performance
- Optimizado para **Safari WebKit**
- Compatible con **GPU acceleration** de Mac
- Funciona bien con **múltiples pantallas**

## 🔧 Requisitos Mínimos:

- **macOS**: 10.14 (Mojave) o superior
- **Navegador**: Safari 14+ o Chrome 90+
- **JavaScript**: Habilitado
- **Conexión**: Para cargar fuentes de CDN

## 🐛 Solución de Problemas:

### Si no cargan las fuentes:
1. Verificar conexión a internet
2. Permitir cargar contenido externo en Safari
3. Limpiar caché del navegador

### Si no funcionan las animaciones:
1. Verificar que no esté activado "Reducir movimiento" en Accesibilidad
2. Actualizar el navegador

### Si hay problemas de rendimiento:
1. Cerrar pestañas innecesarias
2. Reiniciar el navegador
3. Verificar Activity Monitor para uso de CPU

## 📞 Soporte:

Si tienes algún problema específico en Mac, por favor reporta:
1. **Versión de macOS**
2. **Navegador y versión**
3. **Descripción del problema**
4. **Screenshots si es posible**

---

**¡El dashboard funciona perfectamente en Mac! 🎉**