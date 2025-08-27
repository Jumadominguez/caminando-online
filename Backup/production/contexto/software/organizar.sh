#!/bin/bash

# Limpiar pantalla
clear

echo "========================================"
echo "   ORGANIZADOR DE ARCHIVOS v1.0"
echo "      Caminando Online Project"
echo "========================================"
echo ""
echo "Proyecto: E:/caminando-online"
echo "Destino: E:/caminando-online/contexto"
echo "Extensiones: .js, .html, .css, .json"
echo ""
echo "Iniciando organización de archivos..."
echo ""

# Cambiar al directorio de software
cd "$(dirname "$0")"

# Ejecutar el organizador
node file-organizer.js

echo ""
echo "========================================"
echo "Organización completada."
echo "Presiona cualquier tecla para salir..."
read -n 1 -s