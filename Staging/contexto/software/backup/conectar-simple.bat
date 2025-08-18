@echo off
cls

echo ============================================
echo    CONECTADOR SIMPLE - DEBUG MODE
echo ============================================
echo.

REM Ir al directorio del script
cd /d "%~dp0"

echo Directorio: %CD%
echo.

echo Verificando Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js no encontrado
    echo.
    echo Instala Node.js desde: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo.
echo Verificando archivos...
if exist "servidor-conexion.js" (
    echo OK: servidor-conexion.js encontrado
) else (
    echo ERROR: servidor-conexion.js no encontrado
    echo.
    pause
    exit /b 1
)

echo.
echo Instalando Express (si es necesario)...
if not exist "node_modules\express" (
    npm install express
    if errorlevel 1 (
        echo ERROR: Fallo instalando Express
        pause
        exit /b 1
    )
) else (
    echo Express ya esta instalado
)

echo.
echo ============================================
echo  INICIANDO SERVIDOR EN PUERTO 3030
echo  MANTENER ESTA VENTANA ABIERTA
echo ============================================
echo.

REM Matar procesos previos
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3030 2^>nul') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo Ejecutando: node servidor-conexion.js
echo.

REM Ejecutar servidor (esto mantendra la ventana abierta)
node servidor-conexion.js

echo.
echo ============================================
echo Servidor detenido
echo ============================================
pause