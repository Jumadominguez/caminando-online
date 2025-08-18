@echo off
chcp 65001 >nul
cls

echo.
echo ========================================
echo    ORGANIZADOR DE ARCHIVOS v2.0
echo        DEBUG MODE ACTIVADO
echo ========================================
echo.

cd /d "E:\caminando-online\contexto\software"

REM Verificar si Node.js está instalado
echo [DEBUG] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ [ERROR] Node.js no está instalado
    echo.
    echo 💡 Instala Node.js desde: https://nodejs.org
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ [OK] Node.js %NODE_VERSION% encontrado

REM Verificar si express está instalado
echo [DEBUG] Verificando Express...
if not exist "node_modules\express" (
    echo 📦 [INFO] Instalando dependencias...
    echo [DEBUG] Ejecutando: npm install express
    npm install express
    if errorlevel 1 (
        echo ❌ [ERROR] Falló la instalación de Express
        pause
        exit /b 1
    )
    echo ✅ [OK] Express instalado
) else (
    echo ✅ [OK] Express ya está instalado
)

REM Verificar archivos necesarios
echo [DEBUG] Verificando archivos del sistema...
if not exist "file-organizer.js" (
    echo ❌ [ERROR] file-organizer.js no encontrado
    pause
    exit /b 1
)
echo ✅ [OK] file-organizer.js encontrado

if not exist "server.js" (
    echo ❌ [ERROR] server.js no encontrado
    pause
    exit /b 1
)
echo ✅ [OK] server.js encontrado

if not exist "file-organizer-gui.html" (
    echo ❌ [ERROR] file-organizer-gui.html no encontrado
    pause
    exit /b 1
)
echo ✅ [OK] file-organizer-gui.html encontrado

echo.
echo [DEBUG] Todos los componentes verificados
echo [DEBUG] Directorio actual: %CD%
echo [DEBUG] Iniciando servidor en puerto 3030...
echo.
echo 🚀 Iniciando servidor...
echo.
echo 💡 DEBUGGING ACTIVADO - Revisa la consola para logs detallados
echo 💡 Se abrirá automáticamente en tu navegador
echo 💡 Si no se abre, ve a: http://localhost:3030
echo 💡 Presiona F12 en el navegador para ver debug del cliente
echo.

REM Esperar un momento antes de abrir el navegador
timeout /t 2 /nobreak >nul

REM Iniciar servidor y abrir navegador
start "" "http://localhost:3030"
echo [DEBUG] Navegador iniciado
echo [DEBUG] Ejecutando: node server.js
echo.

node server.js

echo.
echo [DEBUG] Servidor terminado
pause