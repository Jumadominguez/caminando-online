@echo off
chcp 65001 >nul
cls

echo.
echo ========================================
echo    ORGANIZADOR DE ARCHIVOS v2.0
echo       Caminando Online Project
echo ========================================
echo.
echo Iniciando servidor web...
echo.

cd /d "E:\caminando-online\contexto\software"

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no está instalado
    echo.
    echo 💡 Instala Node.js desde: https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Verificar si express está instalado
if not exist "node_modules\express" (
    echo 📦 Instalando dependencias...
    npm install express
    echo.
)

echo 🚀 Iniciando servidor...
echo.
echo 💡 Se abrirá automáticamente en tu navegador
echo    Si no se abre, ve a: http://localhost:3030
echo.

REM Iniciar servidor
start "" "http://localhost:3030"
node server.js

pause