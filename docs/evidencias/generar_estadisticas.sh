#!/bin/bash

echo "=== ESTADÍSTICAS DEL PROYECTO INTEGRADOR PAE ===" > estadisticas_proyecto.txt
echo "Generado el: $(date)" >> estadisticas_proyecto.txt
echo "" >> estadisticas_proyecto.txt

echo "1. INFORMACIÓN DEL REPOSITORIO:" >> estadisticas_proyecto.txt
echo "Nombre: $(basename $(git rev-parse --show-toplevel))" >> estadisticas_proyecto.txt
echo "Rama actual: $(git branch --show-current)" >> estadisticas_proyecto.txt
echo "Último commit: $(git log -1 --format='%h - %s (%an, %ad)' --date=short)" >> estadisticas_proyecto.txt
echo "" >> estadisticas_proyecto.txt

echo "2. ESTADÍSTICAS DE COMMITS:" >> estadisticas_proyecto.txt
echo "Total de commits: $(git rev-list --all --count)" >> estadisticas_proyecto.txt
echo "Commits por autor:" >> estadisticas_proyecto.txt
git shortlog -sn >> estadisticas_proyecto.txt
echo "" >> estadisticas_proyecto.txt

echo "3. TAGS Y RELEASES:" >> estadisticas_proyecto.txt
echo "Tags creados:" >> estadisticas_proyecto.txt
git tag -l >> estadisticas_proyecto.txt
echo "" >> estadisticas_proyecto.txt

echo "4. RAMAS:" >> estadisticas_proyecto.txt
echo "Ramas locales:" >> estadisticas_proyecto.txt
git branch >> estadisticas_proyecto.txt
echo "" >> estadisticas_proyecto.txt

echo "5. ARCHIVOS DEL PROYECTO:" >> estadisticas_proyecto.txt
echo "Estructura principal:" >> estadisticas_proyecto.txt
find . -type f -name "*.php" -o -name "*.js" -o -name "*.ts" -o -name "*.html" -o -name "*.css" -o -name "*.sql" | head -20 >> estadisticas_proyecto.txt
echo "" >> estadisticas_proyecto.txt

echo "6. COMMITS RECIENTES (últimos 10):" >> estadisticas_proyecto.txt
git log --oneline -10 >> estadisticas_proyecto.txt

echo "Estadísticas generadas en: estadisticas_proyecto.txt"
