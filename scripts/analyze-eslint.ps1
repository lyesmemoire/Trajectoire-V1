$output = pnpm lint 2>&1
$lines = $output -split "`n"

$errorCounts = @{}
$warningCounts = @{}

foreach ($line in $lines) {
    if ($line -match "error") {
        if ($line -match "@typescript-eslint/([^\s`"]+)") {
            $rule = $matches[1]
            $errorCounts[$rule] = ($errorCounts[$rule] + 1)
        }
    }
    if ($line -match "warning") {
        if ($line -match "@typescript-eslint/([^\s`"]+)") {
            $rule = $matches[1]
            $warningCounts[$rule] = ($warningCounts[$rule] + 1)
        }
    }
}

$totalErrors = ($errorCounts.Values | Measure-Object -Sum).Sum
$totalWarnings = ($warningCounts.Values | Measure-Object -Sum).Sum

$report = @{
    errors = $errorCounts
    warnings = $warningCounts
    totalErrors = $totalErrors
    totalWarnings = $totalWarnings
} | ConvertTo-Json -Depth 10

$report | Out-File -FilePath "C:/Temp/eslint-analysis.json" -Encoding utf8
Write-Host "ESLint analysis saved to C:/Temp/eslint-analysis.json"
Write-Host $report
