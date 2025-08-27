@echo off
REM Auto-starter que se ejecuta en background sin mostrar ventana
chcp 65001 >nul

REM Cambiar al directorio del script
pushd "%~dp0"

REM Verificar si el servidor ya está corriendo
netstat -an | find "3030" | find "LISTENING" >nul
if %errorlevel% == 0 (
    exit /b 0
)

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    exit /b 1
)

REM Instalar dependencias si no existen
if not exist "node_modules\express" (
    npm install express >nul 2>&1
)

REM Iniciar servidor en background sin ventana
start /B /MIN node server.js >nul 2>&1

REM Esperar un momento
timeout /t 3 /nobreak >nul

exit /b 0