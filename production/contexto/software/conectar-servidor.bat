@echo off
cls

REM Verificar si se debe mostrar consola o ejecutar oculto
if "%1"=="visible" goto :visible
if "%1"=="debug" goto :visible

REM Modo oculto por defecto
goto :hidden

:visible
echo ============================================
echo    ORGANIZADOR DE ARCHIVOS v2.0
echo    Conexion Automatica Integrada
echo ============================================
echo.

REM Cambiar al directorio correcto
cd /d "%~dp0"

echo Directorio actual: %CD%
echo.

echo [1/6] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no encontrado
    echo.
    echo INSTALAR NODE.JS:
    echo    1. Ir a: https://nodejs.org
    echo    2. Descargar version LTS
    echo    3. Instalar y reiniciar
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo OK: Node.js %NODE_VERSION% detectado
echo.

echo [2/6] Verificando dependencias...
if not exist "node_modules\express" (
    echo Instalando Express...
    echo.
    call npm install express
    if errorlevel 1 (
        echo ERROR: Fallo instalando Express
        pause
        exit /b 1
    )
    echo OK: Express instalado correctamente
) else (
    echo OK: Express ya esta disponible
)
echo.

echo [3/6] Verificando sistema organizador...
if not exist "server.js" (
    echo ERROR: server.js no encontrado
    echo El organizador de archivos no esta completo
    echo.
    pause
    exit /b 1
) else (
    echo OK: Servidor organizador encontrado
)

if not exist "file-organizer.js" (
    echo ERROR: file-organizer.js no encontrado
    echo El organizador de archivos no esta completo
    echo.
    pause
    exit /b 1
) else (
    echo OK: Motor organizador encontrado
)

if not exist "file-organizer-gui.html" (
    echo ERROR: file-organizer-gui.html no encontrado
    echo La interfaz grafica no esta disponible
    echo.
    pause
    exit /b 1
) else (
    echo OK: Interfaz grafica encontrada
)
echo.

echo [4/6] Liberando puerto 3030...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3030 2^>nul') do (
    taskkill /f /pid %%a >nul 2>&1
)
echo OK: Puerto 3030 liberado
echo.

echo [5/6] Iniciando organizador con auto-conexion...
echo.
echo ============================================
echo  SERVIDOR ORGANIZADOR INICIANDO
echo  Puerto: 3030
echo  Auto-conexion: ACTIVADA
echo  MANTENER ESTA VENTANA ABIERTA
echo ============================================
echo.

REM Iniciar servidor organizador integrado (SIN abrir navegador nuevo)
set DISABLE_AUTO_BROWSER=1
node server.js
goto :end

:hidden
REM Modo oculto - ejecutar sin mostrar consola
cd /d "%~dp0"

REM Matar procesos previos
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3030 2^>nul') do (
    taskkill /f /pid %%a >nul 2>&1
) >nul 2>&1

REM Verificar Node.js silenciosamente
node --version >nul 2>&1
if errorlevel 1 (
    REM Si no hay Node.js, mostrar error
    echo Node.js no encontrado. Instala desde: https://nodejs.org
    pause
    exit /b 1
)

REM Instalar dependencias silenciosamente
if not exist "node_modules\express" (
    npm install express >nul 2>&1
)

REM Iniciar servidor en background sin ventana (SIN abrir navegador)
set DISABLE_AUTO_BROWSER=1
start /B /MIN node server.js >nul 2>&1

:end
exit /b 0