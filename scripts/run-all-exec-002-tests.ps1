# Run all EXEC-002 tests sequentially
Write-Host "=== EXEC-002 PHASE 16: COMPLETE EXECUTION ===" -ForegroundColor Cyan

$tests = @(
    "exec-002-auth.ts",
    "exec-002-cv.ts",
    "exec-002-job.ts",
    "exec-002-matching.ts",
    "exec-002-search.ts",
    "exec-002-billing.ts",
    "exec-002-data-lineage.ts",
    "exec-002-observability.ts",
    "exec-002-resilience.ts",
    "exec-002-security.ts",
    "exec-002-database-integrity.ts",
    "exec-002-cleanup.ts"
)

$passed = 0
$failed = 0

foreach ($test in $tests) {
    Write-Host "`nRunning $test..." -ForegroundColor Yellow
    $result = npx tsx scripts/$test
    if ($LASTEXITCODE -eq 0) {
        Write-Host "${test}: PASS" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "${test}: FAIL" -ForegroundColor Red
        $failed++
    }
}

Write-Host "`n=== EXECUTION SUMMARY ===" -ForegroundColor Cyan
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host "Total: $($tests.Count)" -ForegroundColor White

if ($failed -eq 0) {
    Write-Host "`nALL TESTS PASSED" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`nSOME TESTS FAILED" -ForegroundColor Red
    exit 1
}
