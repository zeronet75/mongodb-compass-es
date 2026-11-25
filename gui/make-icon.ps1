Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'
$outDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$framesDir = Join-Path $outDir 'frames'
New-Item -ItemType Directory -Path $framesDir -Force | Out-Null

function New-RoundedPath([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
    $p = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $r * 2
    $p.AddArc($x, $y, $d, $d, 180, 90)
    $p.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $p.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $p.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $p.CloseFigure()
    return $p
}

$S = 1024
$bmp = New-Object System.Drawing.Bitmap($S, $S, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)

# --- Fondo: cuadrado redondeado verde MongoDB ---
$green = [System.Drawing.Color]::FromArgb(255, 11, 59, 46)
$tile = New-RoundedPath 64 64 896 896 200
$brushTile = New-Object System.Drawing.SolidBrush($green)
$g.FillPath($brushTile, $tile)

# --- Aro de brujula ---
$cx = 512; $cy = 470; $r = 292
$penRing = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(245, 255, 255, 255), 54)
$penRing.Alignment = [System.Drawing.Drawing2D.PenAlignment]::Center
$g.DrawEllipse($penRing, $cx - $r, $cy - $r, $r * 2, $r * 2)

# --- Aguja (rojo/amarillo, colores de la bandera de Espana) ---
$red = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 198, 11, 30))
$yellow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 241, 191, 0))
$grey = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 201, 209, 217))

$leftNeedle = @(
    (New-Object System.Drawing.PointF(512, 150)),
    (New-Object System.Drawing.PointF(512, 500)),
    (New-Object System.Drawing.PointF(404, 500))
)
$rightNeedle = @(
    (New-Object System.Drawing.PointF(512, 150)),
    (New-Object System.Drawing.PointF(620, 500)),
    (New-Object System.Drawing.PointF(512, 500))
)
$g.FillPolygon($red, $leftNeedle)
$g.FillPolygon($yellow, $rightNeedle)

$tail = @(
    (New-Object System.Drawing.PointF(512, 500)),
    (New-Object System.Drawing.PointF(584, 636)),
    (New-Object System.Drawing.PointF(440, 636))
)
$g.FillPolygon($grey, $tail)

# --- Punto central ---
$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.FillEllipse($brushWhite, $cx - 44, 500 - 44, 88, 88)

# --- Insignia ES (esquina inferior derecha) ---
$badge = New-RoundedPath 664 664 296 296 96
$g.FillPath($brushWhite, $badge)
$font = New-Object System.Drawing.Font('Segoe UI', 132, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fmt = New-Object System.Drawing.StringFormat
$fmt.Alignment = [System.Drawing.StringAlignment]::Center
$fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
$textRect = New-Object System.Drawing.RectangleF(664, 650, 296, 320)
$brushText = New-Object System.Drawing.SolidBrush($green)
$g.DrawString('ES', $font, $brushText, $textRect, $fmt)

$g.Dispose()
$src = Join-Path $outDir 'icon-source.png'
$bmp.Save($src, [System.Drawing.Imaging.ImageFormat]::Png)

# --- Redimensionar a los tamanos del .ico ---
$sizes = 16, 24, 32, 48, 64, 128, 256
foreach ($s in $sizes) {
    $dst = New-Object System.Drawing.Bitmap($s, $s, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $dg = [System.Drawing.Graphics]::FromImage($dst)
    $dg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $dg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $dg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $dg.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $dg.Clear([System.Drawing.Color]::Transparent)
    $dg.DrawImage($bmp, 0, 0, $s, $s)
    $dg.Dispose()
    $dst.Save((Join-Path $framesDir "icon-$s.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $dst.Dispose()
}

$bmp.Dispose()
'icono base y frames generados'
