@echo off
setlocal
call "C:\Program Files\Microsoft Visual Studio\18\Community\Common7\Tools\VsDevCmd.bat" -arch=x64 -host_arch=x64 >nul
if errorlevel 1 (
  echo No se pudo inicializar el entorno de Visual Studio.
  exit /b 1
)
cd /d "%~dp0"
rc /nologo /fo "%~dp0app.res" "%~dp0app.rc"
if errorlevel 1 (
  echo Error al compilar los recursos.
  exit /b 1
)
cl /nologo /utf-8 /EHsc /O2 /DUNICODE /D_UNICODE /W3 CompassES.cpp app.res /link /SUBSYSTEM:WINDOWS /OUT:"%~dp0..\CompassES.exe"
if errorlevel 1 exit /b 1
echo Compilado: %~dp0..\CompassES.exe
