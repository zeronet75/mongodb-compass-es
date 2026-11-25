param(
  [switch]$Force,
  [string]$BasePath
)

$ErrorActionPreference = 'Stop'
if (-not $BasePath) { $BasePath = Join-Path $env:LOCALAPPDATA 'MongoDBCompass' }
$base = $BasePath

$running = Get-Process -Name MongoDBCompass -ErrorAction SilentlyContinue
if ($running -and -not $Force) {
  Write-Host "MongoDB Compass esta en ejecucion. Cierralo y vuelve a ejecutar este script." -ForegroundColor Yellow
  exit 1
}
if ($running -and $Force) {
  Stop-Process -Name MongoDBCompass -Force
  Start-Sleep -Seconds 2
}

$restored = 0
foreach ($app in (Get-ChildItem -Path $base -Directory -Filter 'app-*')) {
  $resources = Join-Path $app.FullName 'resources'
  $orig = Join-Path $resources 'app.asar.orig'
  $dest = Join-Path $resources 'app.asar'
  if (Test-Path $orig) {
    Copy-Item $orig $dest -Force
    Remove-Item $orig -Force
    Write-Host "Restaurado: $dest" -ForegroundColor Green
    $restored++
  }
}

if ($restored -eq 0) {
  Write-Host "No habia copias de seguridad que restaurar." -ForegroundColor Yellow
}
