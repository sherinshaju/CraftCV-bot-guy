Add-Type -AssemblyName System.Drawing

$logoPath = Join-Path (Get-Location) "public\logo.png"
$publicDir = Join-Path (Get-Location) "public"

if (Test-Path $logoPath) {
    $srcImg = [System.Drawing.Image]::FromFile($logoPath)

    function Save-ResizedImage($width, $height, $outputPath) {
        $bmp = New-Object System.Drawing.Bitmap($width, $height)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.Clear([System.Drawing.Color]::Transparent)
        $g.DrawImage($srcImg, 0, 0, $width, $height)
        $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $g.Dispose()
        $bmp.Dispose()
        Write-Host "Created:" $outputPath
    }

    Save-ResizedImage 16 16 (Join-Path $publicDir "favicon-16x16.png")
    Save-ResizedImage 32 32 (Join-Path $publicDir "favicon-32x32.png")
    Save-ResizedImage 180 180 (Join-Path $publicDir "apple-touch-icon.png")
    Save-ResizedImage 192 192 (Join-Path $publicDir "android-chrome-192x192.png")
    Save-ResizedImage 512 512 (Join-Path $publicDir "android-chrome-512x512.png")

    # Save favicon.ico (32x32)
    $icoBmp = New-Object System.Drawing.Bitmap 32, 32
    $gIco = [System.Drawing.Graphics]::FromImage($icoBmp)
    $gIco.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gIco.DrawImage($srcImg, 0, 0, 32, 32)
    $hIcon = $icoBmp.GetHicon()
    $icon = [System.Drawing.Icon]::FromHandle($hIcon)
    $icoStream = [System.IO.File]::Create((Join-Path $publicDir "favicon.ico"))
    $icon.Save($icoStream)
    $icoStream.Close()
    $gIco.Dispose()
    $icoBmp.Dispose()
    Write-Host "Created favicon.ico"

    $srcImg.Dispose()
} else {
    Write-Error "public/logo.png not found"
}
