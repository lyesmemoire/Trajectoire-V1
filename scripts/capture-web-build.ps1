cd C:\Trajectoire
pnpm --filter web build *> "$env:TEMP\trajectoire-web-build.log"
$code = $LASTEXITCODE
Write-Host "EXIT_CODE=$code"
Get-Content "$env:TEMP\trajectoire-web-build.log"
exit $code
