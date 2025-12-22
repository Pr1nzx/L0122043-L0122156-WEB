$ErrorActionPreference = "Continue"

# Test 1: Health endpoint
Write-Host "Testing health endpoint..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/diagnostic/health" -Method GET
    $health = $response.Content | ConvertFrom-Json
    Write-Host "✓ Health OK" -ForegroundColor Green
    Write-Host "  SWRL Rules Loaded: $($health.swrlRulesLoaded)"
    Write-Host "  Reasoner Status: $($health.reasonerStatus)"
} catch {
    Write-Host "✗ Health check failed: $_" -ForegroundColor Red
}

# Test 2: Step 1 - Detection
Write-Host "`nTesting Step 1 (Detection)..." -ForegroundColor Cyan
$step1 = @{
    patientId = "P001"
    age = 72
    gender = "M"
    mmseScore = 22
    mocaScore = 20
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/diagnosis/step1" -Method POST -Body $step1 -ContentType "application/json"
    $result = $response.Content | ConvertFrom-Json
    Write-Host "✓ Step 1 completed" -ForegroundColor Green
    Write-Host "  Risk Level: $($result.riskLevel)"
    Write-Host "  Recommendation: $($result.recommendation)"
} catch {
    Write-Host "✗ Step 1 failed: $_" -ForegroundColor Red
}

# Test 3: Step 2 - Assessment with biomarkers
Write-Host "`nTesting Step 2 (Assessment)..." -ForegroundColor Cyan
$step2 = @{
    sessionId = "P001"
    patientId = "P001"
    abeta4240Ratio = 0.34
    pTauAbeta42Ratio = 0.021
    hippocampalVolumeRatio = 0.75
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/diagnosis/step2" -Method POST -Body $step2 -ContentType "application/json"
    $result = $response.Content | ConvertFrom-Json
    Write-Host "✓ Step 2 completed" -ForegroundColor Green
    Write-Host "  Inferred Classes: $($result.inferredClasses -join ', ')"
    Write-Host "  Triggered Rules: $($result.triggeredRules -join ', ')"
} catch {
    Write-Host "✗ Step 2 failed: $_" -ForegroundColor Red
}

# Test 4: Step 3 - Diagnosis
Write-Host "`nTesting Step 3 (Diagnosis)..." -ForegroundColor Cyan
$step3 = @{
    sessionId = "P001"
    patientId = "P001"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/diagnosis/step3" -Method POST -Body $step3 -ContentType "application/json"
    $result = $response.Content | ConvertFrom-Json
    Write-Host "✓ Step 3 completed" -ForegroundColor Green
    Write-Host "  Diagnosis: $($result.diagnosis)"
    Write-Host "  Disease Stage: $($result.diseaseStage)"
    Write-Host "  ATN Classification: A=$($result.atnClassification.amyloid), T=$($result.atnClassification.tau), N=$($result.atnClassification.neurodegeneration)"
} catch {
    Write-Host "✗ Step 3 failed: $_" -ForegroundColor Red
}
