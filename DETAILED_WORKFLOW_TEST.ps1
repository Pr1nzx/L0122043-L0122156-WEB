# Detailed Workflow Test with Full Response Display

Write-Host "==== ALZHEIMER DSS - DETAILED WORKFLOW TEST ====" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080/api"

# STEP 1
Write-Host "STEP 1: Initial Assessment" -ForegroundColor Yellow
$step1Data = @{
    patientId = "PT001"
    age = 72
    hasFamilyHistory = $true
    familyMemberDiagnosis = "AD"
    hasSubjectiveComplaints = $true
    hasBehaviorChanges = $true
    mmseScore = 22
    mocaScore = 20
    isIndependentADL = $false
    isIndependentIADL = $false
} | ConvertTo-Json

try {
    $r1 = Invoke-WebRequest -Uri "$baseUrl/v1/diagnosis/step1" -Method POST -ContentType "application/json" -Body $step1Data -UseBasicParsing
    $d1 = $r1.Content | ConvertFrom-Json
    $sid = $d1.sessionId
    
    Write-Host "HTTP 200 OK" -ForegroundColor Green
    Write-Host "Session ID: $sid" -ForegroundColor Cyan
    Write-Host "Status: $($d1.status)" -ForegroundColor Cyan
    Write-Host "Full Response:" -ForegroundColor Gray
    $r1.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor DarkGray
    Write-Host ""
    
} catch {
    Write-Host "[ERROR] $_" -ForegroundColor Red
    Write-Host "$($_.Exception.Response.StatusCode): $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    exit 1
}

# STEP 2
Write-Host "STEP 2: Brain Imaging & Biomarkers" -ForegroundColor Yellow
$step2Data = @{
    patientId = "PT001"
    brainImagingType = "Elecsys"
    mtaScore = 3
    abeta4240Ratio = 0.007
    pTauAbeta42Ratio = 0.12
    hippocampalVolumeRatio = 0.75
} | ConvertTo-Json

try {
    $r2 = Invoke-WebRequest -Uri "$baseUrl/v1/diagnosis/step2" -Method POST -ContentType "application/json" -Body $step2Data -UseBasicParsing
    $d2 = $r2.Content | ConvertFrom-Json
    
    Write-Host "HTTP 200 OK" -ForegroundColor Green
    Write-Host "ATN Profile: $($d2.findings.atn_profile)" -ForegroundColor Cyan
    Write-Host "Full Response:" -ForegroundColor Gray
    $r2.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor DarkGray
    Write-Host ""
    
} catch {
    Write-Host "[ERROR] $_" -ForegroundColor Red
    exit 1
}

# STEP 3
Write-Host "STEP 3: Final Diagnosis" -ForegroundColor Yellow
$step3Data = @{
    patientId = "PT001"
    sessionId = $sid
    abeta4240Ratio = 0.007
    pTauAbeta42Ratio = 0.12
    hippocampalVolume = 2400.5
    mtaScore = 3
    mriFindings = "Hippocampal atrophy"
    mmseScore = 22
    needsBiomarkersTest = $false
    needsStructuralImaging = $false
    needsFollowUp6Months = $true
} | ConvertTo-Json

try {
    $r3 = Invoke-WebRequest -Uri "$baseUrl/v1/diagnosis/step3" -Method POST -ContentType "application/json" -Body $step3Data -UseBasicParsing
    $d3 = $r3.Content | ConvertFrom-Json
    
    Write-Host "HTTP 200 OK" -ForegroundColor Green
    Write-Host "Diagnosis: $($d3.diagnosis)" -ForegroundColor Green
    Write-Host "Stage: $($d3.diseaseStage)" -ForegroundColor Green
    Write-Host "Full Response:" -ForegroundColor Gray
    $r3.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor DarkGray
    
} catch {
    Write-Host "[ERROR] $_" -ForegroundColor Red
    exit 1
}
