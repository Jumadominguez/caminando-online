# 🗂️ Terminal Organizadora de Archivos

## 🚀 Ejecutables Disponibles

### Windows
```bash
# Doble clic en el archivo o desde terminal:
organizar.bat
```

### Linux/Mac
```bash
# Dar permisos y ejecutar:
chmod +x organizar.sh
./organizar.sh
```

### Multiplataforma (Node.js)
```bash
# Desde la carpeta software:
node organizar.js

# O usando npm:
npm start
```

## 📋 Características de la Terminal

### 🎨 **Interfaz Visual Avanzada**
- **Colores dinámicos** para diferentes tipos de mensajes
- **Barra de progreso** en tiempo real
- **Headers estilizados** con marcos ASCII
- **Estadísticas en vivo** durante el proceso

### 🔧 **Interactividad Completa**
- **Confirmación antes de ejecutar** (s/n)
- **Configuración mostrada** antes de iniciar
- **Progreso detallado** archivo por archivo
- **Pausa al final** para revisar resultados

### 📊 **Información Detallada**
```
╔══════════════════════════════════════════════════════════════╗
║                🗂️  ORGANIZADOR DE ARCHIVOS                   ║
║                   Caminando Online v1.0                     ║
║                    Terminal Interactiva                     ║
╚══════════════════════════════════════════════════════════════╝

📋 CONFIGURACIÓN ACTUAL:
   📁 Carpeta origen: E:/caminando-online
   📁 Carpeta destino: E:/caminando-online/contexto
   📄 Extensiones: .js, .html, .css, .json
   🚫 Ignorar carpetas: env, node_modules, data/db, contexto, legacy

¿Continuar con la organización? (s/n):
```

### ⚡ **Características Técnicas**

#### 🎨 **Sistema de Colores**
- 🔴 **Rojo:** Errores y advertencias
- 🟢 **Verde:** Operaciones exitosas
- 🟡 **Amarillo:** Información importante y duplicados
- 🔵 **Azul:** Directorios y configuración
- 🟣 **Magenta:** Estadísticas especiales
- 🟦 **Cyan:** Headers y prompts

#### 📊 **Barra de Progreso en Tiempo Real**
```
[████████████████████░░░░░░░░░░] 67% Procesando archivo...
```

#### 📈 **Estadísticas Finales Detalladas**
```
╔═══════════════════════════════════════╗
║           📈 ESTADÍSTICAS             ║
╚═══════════════════════════════════════╝

   📄 Total procesados: 142 archivos
   ⚙️  Backend: 45 archivos
   🎨 Frontend: 78 archivos
   🔧 Configuración: 15 archivos
   📋 Duplicados: 4 archivos
```

## 🎯 **Flujo de Ejecución**

### **1. Inicio**
- Limpia pantalla
- Muestra header estilizado
- Presenta configuración actual

### **2. Confirmación**
- Solicita confirmación del usuario
- Valida entrada (s/n/si/yes)
- Cancela si el usuario no confirma

### **3. Procesamiento**
- Crea directorios necesarios
- Escanea archivos recursivamente
- Muestra progreso en tiempo real
- Clasifica y copia cada archivo

### **4. Finalización**
- Muestra estadísticas completas
- Indica ubicación de archivos organizados
- Espera confirmación para salir

## 🔧 **Opciones de Uso**

### **Método 1: Ejecutable Directo**
```bash
# Windows
organizar.bat

# Linux/Mac  
./organizar.sh
```

### **Método 2: Node.js**
```bash
cd contexto/software
node organizar.js
```

### **Método 3: NPM Scripts**
```bash
npm run terminal    # Terminal interactiva
npm run gui         # Interfaz gráfica
npm start          # Alias para terminal
```

## 🛡️ **Validaciones y Seguridad**

### ✅ **Pre-ejecución**
- Verificación de directorios
- Validación de permisos
- Confirmación de usuario obligatoria

### ✅ **Durante Ejecución**
- Manejo de errores robusto
- Log detallado de operaciones
- Protección contra sobrescritura

### ✅ **Post-ejecución**
- Resumen completo de operaciones
- Identificación de errores (si los hay)
- Ubicación clara de archivos organizados

## 📁 **Resultado Final**

Al completar, tendrás:
```
contexto/
├── backend/
│   ├── server.js
│   ├── api-routes.js
│   └── [otros archivos backend]
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── main.js
│   └── [otros archivos frontend]
├── configuracion/
│   ├── package.json
│   ├── config.js
│   └── [otros archivos config]
└── duplicado-{carpeta}/
    └── [archivos duplicados]
```

## 🎯 **Ventajas de la Terminal**

### 🚀 **Velocidad**
- Ejecución rápida sin navegador
- Menos recursos de sistema
- Feedback inmediato

### 🎨 **Visual**
- Colores y formato profesional
- Progreso en tiempo real
- Información organizada

### 🔧 **Control**
- Confirmación antes de ejecutar
- Cancelación en cualquier momento
- Log completo de operaciones

### 📊 **Transparencia**
- Cada operación es visible
- Estadísticas detalladas
- Identificación clara de problemas

---

> **🎯 Terminal profesional lista para organizar todo el proyecto con un solo comando**