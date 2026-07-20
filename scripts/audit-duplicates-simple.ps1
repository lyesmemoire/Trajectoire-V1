# scripts/audit-duplicates-simple.ps1
# Audit des doublons Trajectoire - Version simplifiée

Write-Host "=== AUDIT DOUBLONS TRAJECTOIRE ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "--- PAGES DUPLIQUÉES ---" -ForegroundColor Yellow
Write-Host ""

Write-Host "Dashboard pages:"
Get-ChildItem -Path . -Recurse -Filter "page.tsx" -Depth 5 2>$null | Where-Object { $_.FullName -notmatch "node_modules" } | ForEach-Object {
    if ($_.FullName -match "dashboard") {
        Write-Host "  $($_.FullName)"
    }
}

Write-Host ""
Write-Host "Interview pages:"
Get-ChildItem -Path . -Recurse -Filter "page.tsx" -Depth 5 2>$null | Where-Object { $_.FullName -notmatch "node_modules" } | ForEach-Object {
    if ($_.FullName -match "interview") {
        Write-Host "  $($_.FullName)"
    }
}

Write-Host ""
Write-Host "--- ROUTES API ---" -ForegroundColor Yellow
Write-Host ""

Write-Host "API routes:"
Get-ChildItem -Path . -Recurse -Filter "route.ts" -Depth 5 2>$null | Where-Object { $_.FullName -notmatch "node_modules" } | ForEach-Object {
    Write-Host "  $($_.FullName)"
}

Write-Host ""
Write-Host "--- MOTEURS HIIOS ---" -ForegroundColor Yellow
Write-Host ""

Write-Host "EvidenceEngine:"
Get-ChildItem -Path . -Recurse -Filter "EvidenceEngine.ts" -Depth 5 2>$null | Where-Object { $_.FullName -notmatch "node_modules" } | ForEach-Object {
    Write-Host "  $($_.FullName)"
}

Write-Host ""
Write-Host "HypothesisEngine:"
Get-ChildItem -Path . -Recurse -Filter "HypothesisEngine.ts" -Depth 5 2>$null | Where-Object { $_.FullName -notmatch "node_modules" } | ForEach-Object {
    Write-Host "  $($_.FullName)"
}

Write-Host ""
Write-Host "QuestionPlanner:"
Get-ChildItem -Path . -Recurse -Filter "QuestionPlanner.ts" -Depth 5 2>$null | Where-Object { $_.FullName -notmatch "node_modules" } | ForEach-Object {
    Write-Host "  $($_.FullName)"
}

Write-Host ""
Write-Host "ReportGenerator:"
Get-ChildItem -Path . -Recurse -Filter "ReportGenerator.ts" -Depth 5 2>$null | Where-Object { $_.FullName -notmatch "node_modules" } | ForEach-Object {
    Write-Host "  $($_.FullName)"
}

Write-Host ""
Write-Host "DecisionEngine:"
Get-ChildItem -Path . -Recurse -Filter "DecisionEngine.ts" -Depth 5 2>$null | Where-Object { $_.FullName -notmatch "node_modules" } | ForEach-Object {
    Write-Host "  $($_.FullName)"
}

Write-Host ""
Write-Host "--- HOOKS ---" -ForegroundColor Yellow
Write-Host ""

Write-Host "Custom hooks:"
Get-ChildItem -Path . -Recurse -Filter "use*.ts" -Depth 5 2>$null | Where-Object { $_.FullName -notmatch "node_modules" } | ForEach-Object {
    Write-Host "  $($_.FullName)"
}

Write-Host ""
Write-Host "--- SERVICES ---" -ForegroundColor Yellow
Write-Host ""

Write-Host "Service files:"
Get-ChildItem -Path . -Recurse -Filter "*.service.ts" -Depth 5 2>$null | Where-Object { $_.FullName -notmatch "node_modules" } | ForEach-Object {
    Write-Host "  $($_.FullName)"
}

Write-Host ""
Write-Host "=== FIN AUDIT ===" -ForegroundColor Green
