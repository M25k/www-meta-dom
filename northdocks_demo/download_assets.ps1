$baseUrl = "https://northdocks.com/"
$images = @(
    "data/images/bruecke_logo_titel.jpg",
    "data/images/verticals/grid_pos_01.png",
    "data/images/verticals/grid_pos_02.png",
    "data/images/verticals/grid_pos_03.png",
    "data/images/verticals/grid_pos_04.png",
    "data/images/verticals/grid_pos_05.png",
    "data/images/turmorange.jpg",
    "data/images/anlage-yan2.jpg",
    "data/images/scycrane.jpg",
    "data/images/hubschrauber.jpg",
    "data/images/glas-motor3.jpg",
    "data/images/Hoennetal_5.jpg"
)

foreach ($img in $images) {
    $url = $baseUrl + $img
    $filename = $img -replace "data/images/", ""
    $filepath = Join-Path "img" $filename
    # Ensure directory exists for nested paths
    $dir = Split-Path $filepath -Parent
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force }
    
    Write-Host "Downloading $url to $filepath"
    try {
        Invoke-WebRequest -Uri $url -OutFile $filepath
    } catch {
        Write-Error "Failed to download $url"
    }
}
