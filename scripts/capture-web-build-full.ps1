$log="$env:TEMP\trajectoire-web-build.log"
Remove-Item $log -ErrorAction SilentlyContinue

Write-Host "Starting web build..."
pnpm --filter web build *> $log

$code=$LASTEXITCODE

Write-Host "========== EXIT CODE =========="
Write-Host $code
Write-Host "========== BUILD OUTPUT =========="
Get-Content $log

exit $code
