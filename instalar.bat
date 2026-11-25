@echo off
setlocal
cd /d "%~dp0"
echo ============================================================
echo  MongoDB Compass - Instalar traduccion al espanol
echo ============================================================
echo.
echo Si Compass esta abierto se cerrara (puedes pasar -Force).
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-compass-es.ps1" %*
echo.
echo Proceso terminado.
pause
