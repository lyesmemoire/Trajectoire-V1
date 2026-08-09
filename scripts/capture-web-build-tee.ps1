$log="$env:TEMP\trajectoire-web-build-tee.log"
Remove-Item $log -ErrorAction SilentlyContinue

Write-Host "Starting web build with full output..."
cd C:\Trajectoire
$fullOutput = pnpm --filter web build 2>&1
$fullOutput | Out-File -FilePath $log

$code = $LASTEXITCODE

Write-Host "========== EXIT CODE =========="
Write-Host $code
Write-Host "========== BUILD OUTPUT =========="
Get-Content $log

exit $code
