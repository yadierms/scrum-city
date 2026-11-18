@echo off
title SCRUM CITY - tuneando el equipo SOLTI
cd /d "%~dp0"
where node >nul 2>nul || (echo No se encontro Node.js. Instalalo desde https://nodejs.org y vuelve a intentar. & pause & exit /b)
set ABRIR=1
node server.js
pause
