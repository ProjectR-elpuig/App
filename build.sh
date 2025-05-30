#!/bin/bash

# Este script ejecuta los comandos para construir y abrir un proyecto Ionic con Capacitor

# 1. Construir el proyecto en modo producción
echo "Construyendo la aplicación en modo producción..."
ionic build --prod

# 2. Añadir la plataforma Android (si no está añadida)
echo "Añadiendo la plataforma Android..."
ionic cap add android

# 3. Copiar los archivos de la web a la plataforma Android
echo "Copiando archivos a la plataforma Android..."
ionic cap copy

# 4. Sincronizar con Capacitor
echo "Sincronizando con Capacitor..."
ionic cap sync

# 5. Abrir el proyecto en Android Studio
echo "Abriendo Android Studio..."
ionic cap open android

echo "¡Proceso completado!"
