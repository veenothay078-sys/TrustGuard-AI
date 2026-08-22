Add-Type -AssemblyName System.Drawing
$iconsDir = 'c:\Users\veeno\OneDrive\Desktop\TRUSTGUARD AI\extension\assets\icons'
if (-not (Test-Path $iconsDir)) { New-Item -ItemType Directory -Force -Path $iconsDir }

function Make-Icon {
    param([int]$sz, [string]$name)
    $bmp = New-Object System.Drawing.Bitmap $sz, $sz
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    # Shield background (blue)
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(79, 142, 247))
    $g.FillEllipse($brush, 0, 0, $sz, $sz)

    # Shield inner (white)
    $whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $inner = [int]($sz * 0.5)
    $off = [int](($sz - $inner) / 2)
    $g.FillEllipse($whiteBrush, $off, $off, $inner, $inner)

    $g.Dispose()
    $p = Join-Path $iconsDir $name
    $bmp.Save($p, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created: $p"
}

Make-Icon 16 'icon16.png'
Make-Icon 48 'icon48.png'
Make-Icon 128 'icon128.png'
