@echo off
setlocal
cd /d "%~dp0"
echo ============================================================
echo  MongoDB Compass - Restaurar el original (ingles)
echo ============================================================
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0restore-compass-es.ps1" %*
echo.
echo Proceso terminado.
pause
