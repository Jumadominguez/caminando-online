# 🗂️ Organizador de Archivos - Instrucciones de Uso

## 🚀 Ejecutar la Aplicación Completa

### Opción 1: Usando el Script Automático (Recomendado)
```bash
# Doble clic en:
iniciar-gui.bat
```

### Opción 2: Manual
```bash
# 1. Instalar dependencias (solo la primera vez)
npm install

# 2. Iniciar servidor
npm start

# 3. Abrir navegador en:
http://localhost:3030
```

## 🎯 Cómo Funciona

### 🔧 **Backend (Node.js + Express)**
- **Servidor web** en puerto 3030
- **API REST** para ejecutar organización
- **Validación** de directorios y permisos
- **Ejecución real** del organizador de archivos

### 🎨 **Frontend (HTML + JavaScript)**
- **Interfaz gráfica** moderna y configurable
- **Configuración en tiempo real** de parámetros
- **Progreso visual** durante el proceso
- **Estadísticas detalladas** al finalizar

### ⚡ **Flujo de Ejecución Real**
1. **Frontend** envía configuración al servidor
2. **Backend** valida directorios y permisos
3. **Node.js** ejecuta el organizador real
4. **Progreso** se muestra en tiempo real
5. **Resultados** reales se muestran al finalizar

## 📁 **Archivos del Sistema**

```
contexto/software/
├── server.js              # Servidor Express
├── file-organizer.js      # Organizador principal  
├── file-organizer-gui.html # Interfaz gráfica
├── iniciar-gui.bat        # Script de inicio automático
├── package.json           # Configuración NPM
├── organizar.bat          # Versión terminal Windows
└── organizar.sh           # Versión terminal Linux/Mac
```

## 🔄 **Diferencias entre Versiones**

### **GUI Web (Recomendada)**
✅ Interfaz visual moderna  
✅ Configuración completa editable  
✅ Progreso en tiempo real  
✅ Validación automática  
✅ Ejecución real del organizador  

### **Terminal**
✅ Ejecución rápida  
✅ Sin dependencias del navegador  
✅ Configuración fija  
⚠️ Menos feedback visual  

## 🛠️ **Solución de Problemas**

### **Error: "Cannot find module 'express'"**
```bash
npm install express
```

### **Error: "Node.js no encontrado"**
- Instalar Node.js desde: https://nodejs.org

### **Error: "Puerto 3030 en uso"**
- Cerrar otras aplicaciones que usen el puerto
- O cambiar el puerto en `server.js`

### **Error: "Cannot access directory"**
- Ejecutar como administrador
- Verificar permisos de carpetas

## 🎯 **Funcionalidades Avanzadas**

### **Validación en Tiempo Real**
- ✅ Verificación de directorios existentes
- ✅ Validación de permisos de lectura/escritura
- ✅ Prevención de configuraciones inválidas

### **Ejecución Segura**
- 🛡️ No elimina archivos originales
- 🛡️ Validación previa de configuración
- 🛡️ Manejo robusto de errores

### **Feedback Completo**
- 📊 Estadísticas reales de archivos procesados
- 📋 Log detallado de todas las operaciones
- ⚡ Progreso visual durante el proceso

---

> **🎯 Ahora tienes un organizador completo con backend real y frontend moderno**