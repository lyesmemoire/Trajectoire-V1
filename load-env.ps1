# Script pour charger les variables d'environnement depuis .env.local
# Usage: .\load-env.ps1

$envFile = ".env.local"

if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            
            # Supprimer les guillemets si présents
            if ($value -match '^"(.*)"$') {
                $value = $matches[1]
            }
            
            [Environment]::SetEnvironmentVariable($name, $value)
            Write-Host "Loaded: $name" -ForegroundColor Green
        }
    }
    Write-Host "Environment variables loaded from $envFile" -ForegroundColor Cyan
} else {
    Write-Host "Error: $envFile not found" -ForegroundColor Red
}
