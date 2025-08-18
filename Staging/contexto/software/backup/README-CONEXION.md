# 🌐 Conectador Automático al Servidor

## 🎯 Propósito
Este programa resuelve problemas de permisos y establece automáticamente una conexión al servidor localhost:3030.

## 🚀 Uso Rápido

### Método Principal
```bash
# Doble clic en:
conectar-servidor.bat
```

### Resultado Esperado
Al ejecutar correctamente verás en la terminal:
```
╔══════════════════════════════════════════════════════════════╗
║                🌐 SERVIDOR CONECTADO                         ║
╚══════════════════════════════════════════════════════════════╝

✅ Servidor ejecutándose en: http://localhost:3030
🌐 Estado: CONECTADO Y OPERACIONAL
🕐 Hora de inicio: [timestamp]
🔧 Ready para operaciones
```

## 📋 Qué Hace el Programa

### 🔧 Verificaciones Automáticas
1. **Node.js** - Verifica instalación y versión
2. **Express** - Instala automáticamente si no existe
3. **Puerto 3030** - Libera procesos previos
4. **Archivos** - Crea servidor básico si es necesario

### 🌐 Conexión Establecida
- **Servidor funcional** en puerto 3030
- **Interfaz web** accesible desde navegador
- **Endpoints de test** para verificar conectividad
- **Logs detallados** de todas las operaciones

### ✅ Verificación Final
- **Test de conectividad** automático
- **Estado CONECTADO** confirmado en terminal
- **Ready para integración** con otros sistemas

## 📁 Archivos Generados

```
contexto/software/
├── conectar-servidor.bat      # Script principal de conexión
├── servidor-conexion.js       # Servidor Express básico
├── package-conexion.json      # Configuración NPM
└── README-CONEXION.md         # Esta documentación
```

## 🔧 Métodos Alternativos

### Manual con Node.js
```bash
cd "E:\caminando-online\contexto\software"
npm install express
node servidor-conexion.js
```

### Verificar Estado
```bash
# Abrir navegador en:
http://localhost:3030

# O usar curl/PowerShell:
curl http://localhost:3030/test
```

## 🛡️ Solución de Problemas

### ❌ "Node.js no encontrado"
- Instalar desde: https://nodejs.org
- Usar versión LTS recomendada

### ❌ "Error instalando Express"
- Ejecutar como administrador
- Verificar conexión a internet

### ❌ "Puerto 3030 en uso"
- El script mata automáticamente procesos previos
- Si persiste, reiniciar y ejecutar de nuevo

## 🎯 Integración

Una vez conectado exitosamente:
1. ✅ **Terminal muestra "SERVIDOR CONECTADO"**
2. ✅ **Navegador accede a localhost:3030**
3. ✅ **Ready para integrar con software organizador**

---

> **🌐 Conectador listo para establecer comunicación con localhost:3030**