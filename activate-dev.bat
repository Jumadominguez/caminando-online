@echo off
echo ========================================
echo   CAMINANDO ONLINE V2 - DESARROLLO
echo ========================================
echo.
echo Activando entorno virtual...
call venv\Scripts\activate.bat
echo.
echo Entorno virtual activado correctamente!
echo.
echo COMANDOS DISPONIBLES:
echo   npm run frontend  - Servidor frontend (puerto 3000)
echo   npm run backend   - Servidor backend (puerto 8000)
echo.
echo Para salir del entorno virtual: deactivate
echo ========================================
cmd /k
