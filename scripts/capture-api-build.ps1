cd C:\Trajectoire\apps\api
pnpm build *> "$env:TEMP\trajectoire-api-build.log"
$code = $LASTEXITCODE
Write-Host "EXIT_CODE=$code"
Get-Content "$env:TEMP\trajectoire-api-build.log"
exit $code
