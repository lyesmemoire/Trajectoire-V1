# scripts/audit-duplicates.ps1
# Audit des doublons Trajectoire - PowerShell version
# Lancer depuis la racine du projet

Write-Host "=== AUDIT DOUBLONS TRAJECTOIRE ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "--- PAGES DUPLIQUÉES ---" -ForegroundColor Yellow
Write-Host ""

Write-Host "Dashboard :"
Get-ChildItem -Path . -Recurse -Filter "page.tsx" -Exclude node_modules, .next, dist, build 2>$null | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue | Out-String
    if ($content -match "dashboard") {
        Write-Host "  $($_.FullName)"
    }
}

Write-Host ""
Write-Host "Interview :"
Get-ChildItem -Path . -Recurse -Filter "page.tsx" -Exclude node_modules, .next, dist, build 2>$null | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue | Out-String
    if ($content -match "interview") {
        Write-Host "  $($_.FullName)"
    }
}

Write-Host ""
Write-Host "Simulation :"
Get-ChildItem -Path . -Recurse -Filter "page.tsx" -Exclude node_modules, .next, dist, build 2>$null | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue | Out-String
    if ($content -match "simulation") {
        Write-Host "  $($_.FullName)"
    }
}

Write-Host ""
Write-Host "Report :"
Get-ChildItem -Path . -Recurse -Filter "page.tsx" -Exclude node_modules, .next, dist, build 2>$null | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue | Out-String
    if ($content -match "report") {
        Write-Host "  $($_.FullName)"
    }
}

Write-Host ""
Write-Host "--- ROUTES API DUPLIQUÉES ---" -ForegroundColor Yellow
Write-Host ""

Write-Host "Stripe :"
Get-ChildItem -Path . -Recurse -Filter "route.ts" -Exclude node_modules, .next, dist, build 2>$null | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue | Out-String
    if ($content -match "stripe") {
        Write-Host "  $($_.FullName)"
    }
}

Write-Host ""
Write-Host "CV :"
Get-ChildItem -Path . -Recurse -Filter "route.ts" -Exclude node_modules, .next, dist, build 2>$null | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue | Out-String
    if ($content -match "cv|resume|curriculum") {
        Write-Host "  $($_.FullName)"
    }
}

Write-Host ""
Write-Host "Auth :"
Get-ChildItem -Path . -Recurse -Filter "route.ts" -Exclude node_modules, .next, dist, build 2>$null | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue | Out-String
    if ($content -match "auth|session|login") {
        Write-Host "  $($_.FullName)"
    }
}

Write-Host ""
Write-Host "--- MOTEURS HIIOS DUPLIQUÉS ---" -ForegroundColor Yellow
Write-Host ""

Write-Host "Evidence :"
Get-ChildItem -Path . -Recurse -Filter "*.ts" -Exclude node_modules, .next, dist, build 2>$null | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue | Out-String
    if ($content -match "EvidenceEngine|class Evidence") {
        Write-Host "  $($_.FullName)"
    }
}

Write-Host ""
Write-Host "Hypothesis :"
Get-ChildItem -Path . -Recurse -Filter "*.ts" -Exclude node_modules, .next, dist, build 2>$null | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue | Out-String
    if ($content -match "HypothesisEngine|class Hypothesis") {
        Write-Host "  $($_.FullName)"
    }
}

Write-Host ""
Write-Host "Question Planner :"
Get-ChildItem -Path . -Recurse -Filter "*.ts" -Exclude node_modules, .next, dist, build 2>$null | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue | Out-String
    if ($content -match "QuestionPlanner|class Question") {
        Write-Host "  $($_.FullName)"
    }
}

Write-Host ""
Write-Host "Report Generator :"
Get-ChildItem -Path . -Recurse -Filter "*.ts" -Exclude node_modules, .next, dist, build 2>$null | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue | Out-String
    if ($content -match "ReportGenerator|class Report") {
        Write-Host "  $($_.FullName)"
    }
}

Write-Host ""
Write-Host "Decision :"
Get-ChildItem -Path . -Recurse -Filter "*.ts" -Exclude node_modules, .next, dist, build 2>$null | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue | Out-String
    if ($content -match "DecisionEngine|DecisionLedger") {
        Write-Host "  $($_.FullName)"
    }
}

Write-Host ""
Write-Host "--- COMPOSANTS UI DUPLIQUÉS ---" -ForegroundColor Yellow
Write-Host ""

Write-Host "Button :"
Get-ChildItem -Path . -Recurse -Filter "*.tsx" -Exclude node_modules, .next, dist, build 2>$null | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue | Out-String
    if ($content -match "export.*Button|export default Button") {
        Write-Host "  $($_.FullName)"
    }
}

Write-Host ""
Write-Host "Card :"
Get-ChildItem -Path . -Recurse -Filter "*.tsx" -Exclude node_modules, .next, dist, build 2>$null | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue | Out-String
    if ($content -match "export.*Card|export default Card") {
        Write-Host "  $($_.FullName)"
    }
}

Write-Host ""
Write-Host "Modal/Dialog :"
Get-ChildItem -Path . -Recurse -Filter "*.tsx" -Exclude node_modules, .next, dist, build 2>$null | ForEach-Object {
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue | Out-String
    if ($content -match "export.*Modal|export.*Dialog") {
        Write-Host "  $($_.FullName)"
    }
}

Write-Host ""
Write-Host "--- HOOKS DUPLIQUÉS ---" -ForegroundColor Yellow
Get-ChildItem -Path . -Recurse -Filter "use*.ts" -Exclude node_modules, .next, dist, build 2>$null | ForEach-Object {
    Write-Host "  $($_.FullName)"
}
Get-ChildItem -Path . -Recurse -Filter "use*.tsx" -Exclude node_modules, .next, dist, build 2>$null | ForEach-Object {
    Write-Host "  $($_.FullName)"
}

Write-Host ""
Write-Host "--- SERVICES DUPLIQUÉS ---" -ForegroundColor Yellow
Get-ChildItem -Path . -Recurse -Filter "*.service.ts" -Exclude node_modules, .next, dist, build 2>$null | ForEach-Object {
    Write-Host "  $($_.FullName)"
}

Write-Host ""
Write-Host "=== FIN AUDIT ===" -ForegroundColor Green
