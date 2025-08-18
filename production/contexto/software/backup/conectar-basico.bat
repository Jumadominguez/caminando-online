@echo off

echo Conectando a localhost:3030...
echo.

cd /d "%~dp0"

echo Directorio: %CD%
echo.

node servidor-conexion.js

pause