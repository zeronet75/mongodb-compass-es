param(
  [switch]$Force,
  [string]$BasePath
)

$ErrorActionPreference = 'Stop'
if (-not $BasePath) { $BasePath = Join-Path $env:LOCALAPPDATA 'MongoDBCompass' }
$base = $BasePath
if (-not (Test-Path $base)) {
  Write-Host "No se encontro la instalacion de MongoDB Compass en $base" -ForegroundColor Red
  Write-Host "Si Compass esta instalado para todos los usuarios, prueba con:" -ForegroundColor Yellow
  Write-Host '  .\install-compass-es.ps1 -BasePath "C:\Program Files\MongoDB Compass"' -ForegroundColor Yellow
  exit 1
}

$running = Get-Process -Name MongoDBCompass -ErrorAction SilentlyContinue
if ($running -and -not $Force) {
  Write-Host "MongoDB Compass esta en ejecucion. Cierralo y vuelve a ejecutar este script (o usa -Force para cerrarlo)." -ForegroundColor Yellow
  exit 1
}
if ($running -and $Force) {
  Stop-Process -Name MongoDBCompass -Force
  Start-Sleep -Seconds 2
}

$nodeVersion = 'v24.22.3'
$nodeExe = $null
$runtimeDir = Join-Path $PSScriptRoot 'runtime\node'
$bundledNode = Join-Path $runtimeDir 'node.exe'

if (-not (Test-Path $bundledNode)) {
  Write-Host "Node.js no esta incluido; descargando la version portable $nodeVersion..." -ForegroundColor Yellow
  try {
    New-Item -ItemType Directory -Path $runtimeDir -Force | Out-Null
    $zip = Join-Path $env:TEMP "compass-es-node-$nodeVersion.zip"
    $tmp = Join-Path $env:TEMP "compass-es-node-$nodeVersion"
    if (-not (Test-Path $zip)) {
      Invoke-WebRequest -Uri "https://nodejs.org/dist/$nodeVersion/node-$nodeVersion-win-x64.zip" -OutFile $zip -UseBasicParsing -TimeoutSec 600
    }
    if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
    Expand-Archive -Path $zip -DestinationPath $tmp -Force
    $nodeBase = Join-Path $tmp "node-$nodeVersion-win-x64"
    Copy-Item (Join-Path $nodeBase 'node.exe') $bundledNode -Force
    Copy-Item (Join-Path $nodeBase 'LICENSE') (Join-Path $runtimeDir 'LICENSE') -Force
    Remove-Item $zip -Force -ErrorAction SilentlyContinue
    Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Node.js descargado correctamente." -ForegroundColor Green
  } catch {
    Write-Host "No se pudo descargar Node.js: $($_.Exception.Message)" -ForegroundColor Yellow
  }
}

if (Test-Path $bundledNode) {
  $nodeExe = $bundledNode
} else {
  $cmd = Get-Command node -ErrorAction SilentlyContinue
  if ($cmd) { $nodeExe = $cmd.Source }
}
if (-not $nodeExe) {
  Write-Host "No se encontro Node.js y no se pudo descargar." -ForegroundColor Red
  Write-Host "Comprueba la conexion a Internet o instala Node.js manualmente." -ForegroundColor Red
  exit 1
}

$app = Get-ChildItem -Path $base -Directory -Filter 'app-*' |
  Where-Object { Test-Path (Join-Path $_.FullName 'resources\app.asar') } |
  Sort-Object { [version]($_.Name -replace '^app-', '') } -Descending |
  Select-Object -First 1

if (-not $app) {
  Write-Host "No se encontro ninguna carpeta app-X.Y.Z con resources\app.asar." -ForegroundColor Red
  exit 1
}

Write-Host "Instalando la capa de espanol en $($app.FullName)" -ForegroundColor Cyan
& $nodeExe (Join-Path $PSScriptRoot 'install-compass-es.js') $app.FullName
if ($LASTEXITCODE -ne 0) {
  Write-Host "Fallo la instalacion." -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Listo. Abre MongoDB Compass y la interfaz aparecera en espanol." -ForegroundColor Green
Write-Host "Copia de seguridad: $($app.FullName)\resources\app.asar.orig"
