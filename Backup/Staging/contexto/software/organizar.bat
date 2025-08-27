@echo off
chcp 65001 >nul
cls

echo.
echo ========================================
echo    ORGANIZADOR DE ARCHIVOS v1.0
echo       Caminando Online Project
echo ========================================
echo.
echo Proyecto: E:\caminando-online
echo Destino: E:\caminando-online\contexto
echo Extensiones: .js, .html, .css, .json
echo.
echo Iniciando organizacion de archivos...
echo.

cd /d "E:\caminando-online\contexto\software"
node file-organizer.js

echo.
echo ========================================
echo Organizacion completada.
echo Presiona cualquier tecla para salir...
pause >nul