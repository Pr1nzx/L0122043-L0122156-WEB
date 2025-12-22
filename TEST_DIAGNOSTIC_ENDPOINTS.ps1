# Test Diagnostic Endpoints
# This proves SWRL is loaded and working

Write-Host "Testing Diagnostic Endpoints..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "TEST 1: Health Check" -ForegroundColor Yellow
Write-Host "GET http://localhost:8080/api/v1/diagnostic/health" -ForegroundColor Gray
try {
    $health = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/diagnostic/health" -Method GET -UseBasicParsing
    $data = $health.Content | ConvertFrom-Json
    Write-Host "Status: $($health.StatusCode)" -ForegroundColor Green
    Write-Host ($data | ConvertTo-Json -Depth 10) -ForegroundColor Green
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: SWRL Test Execution
Write-Host "TEST 2: SWRL Execution Test" -ForegroundColor Yellow
Write-Host "POST http://localhost:8080/api/v1/diagnostic/test-swrl" -ForegroundColor Gray
try {
    $test = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/diagnostic/test-swrl" -Method POST -UseBasicParsing
    $data = $test.Content | ConvertFrom-Json
    Write-Host "Status: $($test.StatusCode)" -ForegroundColor Green
    Write-Host ($data | ConvertTo-Json -Depth 10) -ForegroundColor Green
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: SWRL Rules List
Write-Host "TEST 3: SWRL Rules List" -ForegroundColor Yellow
Write-Host "GET http://localhost:8080/api/v1/diagnostic/swrl-rules" -ForegroundColor Gray
try {
    $rules = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/diagnostic/swrl-rules" -Method GET -UseBasicParsing
    $data = $rules.Content | ConvertFrom-Json
    Write-Host "Status: $($rules.StatusCode)" -ForegroundColor Green
    Write-Host "SWRL Rules Found: $($data.swrl_rules_found)" -ForegroundColor Cyan
    if ($data.swrl_rules_found -gt 0) {
        Write-Host "Status: $($data.status)" -ForegroundColor Green
        Write-Host "Sample Rules:" -ForegroundColor Gray
        $data.swrl_rules | Select-Object -First 3 | ForEach-Object {
            Write-Host "  - $_" -ForegroundColor Green
        }
    } else {
        Write-Host "WARNING: No SWRL rules found!" -ForegroundColor Red
    }
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Diagnostic Test Complete" -ForegroundColor Cyan
