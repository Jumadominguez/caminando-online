@echo off
chcp 65001 >nul

echo.
echo ========================================
echo    ORGANIZADOR DE ARCHIVOS v2.0
echo        INICIO AUTOMATICO
echo ========================================
echo.

REM Cambiar al directorio correcto
pushd "%~dp0"
cd /d "%~dp0"

echo Directorio actual: %CD%
echo.

REM Verificar Node.js
echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no encontrado
    echo.
    echo INSTALAR NODE.JS:
    echo 1. Ir a: https://nodejs.org
    echo 2. Descargar version LTS
    echo 3. Instalar y reiniciar
    echo.
    echo Presiona cualquier tecla para salir...
    pause >nul
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION%

echo.
echo [2/4] Verificando archivos...
if not exist "server.js" (
    echo ❌ server.js no encontrado
    echo Ubicacion esperada: %CD%\server.js
    pause
    exit /b 1
)
if not exist "file-organizer.js" (
    echo ❌ file-organizer.js no encontrado
    pause
    exit /b 1
)
echo ✅ Archivos verificados

echo.
echo [3/4] Instalando dependencias...
if not exist "node_modules\express" (
    echo Instalando Express...
    call npm install express
    if errorlevel 1 (
        echo ❌ Error instalando Express
        echo.
        echo Presiona cualquier tecla para continuar...
        pause >nul
        exit /b 1
    )
)
echo ✅ Dependencias listas

echo.
echo [4/4] Iniciando servidor...
echo.
echo 🚀 Servidor iniciando en puerto 3030...
echo ⚠️  MANTENER ESTA VENTANA ABIERTA
echo.

REM Matar procesos node anteriores en puerto 3030
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3030') do (
    taskkill /f /pid %%a >nul 2>&1
)

REM Esperar un momento
timeout /t 2 /nobreak >nul

REM Iniciar servidor
echo Ejecutando: node server.js
echo.

node server.js

echo.
echo Servidor terminado.
echo Presiona cualquier tecla para salir...
pause >nul