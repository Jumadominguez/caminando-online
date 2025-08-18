# 🗂️ Organizador de Archivos - Caminando Online

## 📋 Descripción
Herramienta automatizada para extraer y organizar archivos `.js`, `.html`, `.css` y `.json` del proyecto Caminando Online en carpetas categorizadas.

## 🎯 Funcionalidades

### ✅ Extracción Inteligente
- **Archivos objetivo:** `.js`, `.html`, `.css`, `.json`
- **Carpetas ignoradas:** `/env`, `/node_modules`, `/data/db`, `/contexto`, `/legacy`
- **Clasificación automática:** Backend, Frontend, Configuración

### 🧠 Clasificación Inteligente

#### 🔧 Backend
- Archivos en carpetas: `backend`, `server`, `api`, `controller`, `service`, `model`
- Archivos específicos: `server.js`, `app.js`
- Archivos `.js` por defecto (si no clasifican como frontend)

#### 🎨 Frontend  
- Archivos en carpetas: `frontend`, `public`, `css`, `js`, `html`
- Todos los archivos `.html` y `.css`
- Archivos JavaScript en carpetas de frontend

#### ⚙️ Configuración
- Archivos en carpetas: `config`
- Archivos específicos: `package.json`, `.env`, `tsconfig`, `webpack`, `babel`
- Archivos `.json` por defecto
- Archivos con `.config.` en el nombre

### 📁 Manejo de Duplicados
- **Duplicados detectados automáticamente**
- **Carpeta de duplicados:** `duplicado-{carpeta-origen}`
- **Sin sobrescritura:** Los archivos originales se mantienen intactos

## 🚀 Uso

### Opción 1: Interfaz Gráfica (Recomendada)
1. Abrir `file-organizer-gui.html` en el navegador
2. Revisar configuración
3. Hacer clic en "🚀 Ejecutar Organización"
4. Seguir el progreso en tiempo real

### Opción 2: Línea de Comandos
```bash
cd contexto/software
node file-organizer.js
```

## 📊 Estructura de Salida

```
contexto/
├── backend/
│   ├── server.js
│   ├── api-routes.js
│   └── duplicado-controllers/
│       └── api-routes.js
├── frontend/
│   ├── main.js
│   ├── styles.css
│   ├── index.html
│   └── duplicado-assets/
│       └── styles.css
└── configuracion/
    ├── package.json
    ├── webpack.config.js
    └── duplicado-config/
        └── package.json
```

## 📈 Estadísticas

La herramienta proporciona estadísticas detalladas:
- ✅ **Total archivos procesados**
- ⚙️ **Archivos Backend**
- 🎨 **Archivos Frontend** 
- 🔧 **Archivos Configuración**
- 📋 **Duplicados encontrados**
- ❌ **Errores (si los hay)**

## 🛡️ Seguridad

### ✅ No Destructivo
- **NUNCA elimina archivos originales**
- **Solo copia, no mueve**
- **Preserva estructura original**

### ✅ Validaciones
- Verificación de permisos antes de copiar
- Manejo de errores robusto
- Log detallado de todas las operaciones

## 🔧 Configuración Avanzada

### Modificar Carpetas Ignoradas
```javascript
this.ignoredFolders = ['env', 'node_modules', 'data/db', 'contexto', 'legacy'];
```

### Agregar Extensiones
```javascript
this.targetExtensions = ['.js', '.html', '.css', '.json', '.ts', '.jsx'];
```

### Personalizar Clasificación
```javascript
classifyFile(filePath, fileName) {
    // Lógica personalizada aquí
}
```

## 📋 Casos de Uso

### 🎯 Análisis de Proyecto
- **Inventario completo** de todos los archivos del proyecto
- **Identificación rápida** de backend vs frontend
- **Detección de duplicados** y archivos huérfanos

### 🔄 Migración y Refactoring
- **Preparación para modularización**
- **Organización antes de deploy**
- **Limpieza de estructura de proyecto**

### 📊 Auditoría de Código
- **Revisión de arquitectura**
- **Análisis de dependencias**
- **Documentación de estructura**

## ⚠️ Consideraciones

### 📁 Espacio en Disco
- La herramienta **copia** archivos, no los mueve
- Asegurar espacio suficiente en disco
- Los duplicados pueden aumentar el uso de espacio

### 🔒 Permisos
- Verificar permisos de lectura en carpeta origen
- Verificar permisos de escritura en carpeta destino
- Ejecutar como administrador si es necesario

## 🐛 Troubleshooting

### Error: "Cannot access directory"
- **Causa:** Permisos insuficientes
- **Solución:** Ejecutar como administrador

### Error: "File already exists"
- **Causa:** Duplicado detectado
- **Solución:** Automática (se crea carpeta de duplicados)

### Error: "EMFILE: too many open files"
- **Causa:** Demasiados archivos abiertos simultáneamente
- **Solución:** La herramienta procesa archivos secuencialmente para evitar esto

## 📞 Soporte

Si encuentras problemas:
1. **Revisar logs** en la consola/interfaz
2. **Verificar permisos** de archivos y carpetas
3. **Comprobar espacio** en disco disponible
4. **Revisar README.md** del proyecto principal

---

## 🏆 Resultado Esperado

Al completar la organización tendrás:
- ✅ **Inventario completo** de todos los archivos del proyecto
- ✅ **Clasificación automática** por tipo y funcionalidad  
- ✅ **Base organizada** para análisis y desarrollo
- ✅ **Identificación de duplicados** y estructura
- ✅ **Contexto completo** para continuar el desarrollo

---

> **🔧 Herramienta creada para facilitar el análisis y organización del proyecto Caminando Online**