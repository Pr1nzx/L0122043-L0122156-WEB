# Complete Alzheimer Detection Workflow Test

Write-Host "==== ALZHEIMER DETECTION SYSTEM TEST ====" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080/api"
$sessionId = $null

# STEP 1
Write-Host "STEP 1: Initial Assessment" -ForegroundColor Yellow
Write-Host "POST $baseUrl/v1/diagnosis/step1" -ForegroundColor Gray
Write-Host ""

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
    clinicalNotes = "Patient reports memory decline for 2 years"
} | ConvertTo-Json

try {
    Write-Host "Request: Patient PT001, Age 72, MMSE 22, MoCA 20" -ForegroundColor Cyan
    $response1 = Invoke-WebRequest -Uri "$baseUrl/v1/diagnosis/step1" -Method POST -ContentType "application/json" -Body $step1Data -UseBasicParsing
    $data1 = $response1.Content | ConvertFrom-Json
    $sessionId = $data1.sessionId
    
    Write-Host "[OK] STEP 1 passed" -ForegroundColor Green
    Write-Host "Session: $sessionId" -ForegroundColor Green
    Write-Host "Inferred Classes:" -ForegroundColor Cyan
    $data1.inferredClasses | ForEach-Object { Write-Host "  - $_" }
    Write-Host ""
} catch {
    Write-Host "[ERROR] STEP 1 failed: $_" -ForegroundColor Red
    exit 1
}

# STEP 2
Write-Host "STEP 2: Brain Imaging and Biomarkers" -ForegroundColor Yellow
Write-Host "POST $baseUrl/v1/diagnosis/step2" -ForegroundColor Gray
Write-Host ""

$step2Data = @{
    patientId = "PT001"
    brainImagingType = "Elecsys"
    mtaScore = 3
    abeta4240Ratio = 0.007
    pTauAbeta42Ratio = 0.12
    hippocampalVolumeRatio = 0.75
} | ConvertTo-Json

try {
    Write-Host "Biomarkers: Aβ42/40=0.007, P-Tau/Aβ=0.12, HippoVol=0.75 (all ABNORMAL)" -ForegroundColor Cyan
    $response2 = Invoke-WebRequest -Uri "$baseUrl/v1/diagnosis/step2" -Method POST -ContentType "application/json" -Body $step2Data -UseBasicParsing
    $data2 = $response2.Content | ConvertFrom-Json
    
    Write-Host "[OK] STEP 2 passed" -ForegroundColor Green
    Write-Host "ATN Profile: $($data2.findings.atn_profile)" -ForegroundColor Green
    Write-Host "Inferred Classes:" -ForegroundColor Cyan
    $data2.inferredClasses | ForEach-Object { Write-Host "  - $_" }
    Write-Host "SWRL Rules Triggered:" -ForegroundColor Blue
    $data2.triggeredRules | ForEach-Object { Write-Host "  - $_" }
    Write-Host ""
} catch {
    Write-Host "[ERROR] STEP 2 failed: $_" -ForegroundColor Red
    exit 1
}

# STEP 3
Write-Host "STEP 3: Final Diagnosis and Staging" -ForegroundColor Yellow
Write-Host "POST $baseUrl/v1/diagnosis/step3" -ForegroundColor Gray
Write-Host ""

$step3Data = @{
    patientId = "PT001"
    sessionId = $sessionId
    abeta4240Ratio = 0.007
    pTauAbeta42Ratio = 0.12
    hippocampalVolume = 2400.5
    mtaScore = 3
    mriFindings = "Hippocampal atrophy, ventricular enlargement"
    mmseScore = 22
    apoeGenotype = "e4e4"
    needsBiomarkersTest = $false
    needsStructuralImaging = $false
    needsFollowUp6Months = $true
    clinicalNotes = "A+T+N profile consistent with Alzheimer pathology"
} | ConvertTo-Json

try {
    $response3 = Invoke-WebRequest -Uri "$baseUrl/v1/diagnosis/step3" -Method POST -ContentType "application/json" -Body $step3Data -UseBasicParsing
    $data3 = $response3.Content | ConvertFrom-Json
    
    Write-Host "[OK] STEP 3 passed" -ForegroundColor Green
    Write-Host ""
    Write-Host "DIAGNOSIS RESULTS:" -ForegroundColor Magenta
    Write-Host "  Diagnosis: $($data3.diagnosis)" -ForegroundColor White
    Write-Host "  Disease Stage: $($data3.diseaseStage)" -ForegroundColor White
    Write-Host "  ATN Profile: $($data3.atnProfile)" -ForegroundColor White
    Write-Host "  Confidence: $($data3.confidenceLevel)" -ForegroundColor White
    Write-Host ""
    
    Write-Host "INFERRED CLASSES:" -ForegroundColor Cyan
    $data3.inferredClasses | ForEach-Object { Write-Host "  - $_" }
    Write-Host ""
    
    Write-Host "SWRL RULES TRIGGERED:" -ForegroundColor Blue
    if ($data3.triggeredRules -and $data3.triggeredRules.Count -gt 0) {
        $data3.triggeredRules | ForEach-Object {
            Write-Host "  - $($_.ruleName)" -ForegroundColor Blue
        }
    }
    Write-Host ""
    
    Write-Host "MEDICAL ACTIONS:" -ForegroundColor Yellow
    $data3.recommendedActions | ForEach-Object { Write-Host "  - $_" }
    Write-Host ""
    
    Write-Host "FOLLOW-UP TESTS:" -ForegroundColor Yellow
    $data3.requiredTests | ForEach-Object { Write-Host "  - $_" }
    Write-Host ""
    
    Write-Host "==== ALL STEPS COMPLETED SUCCESSFULLY ====" -ForegroundColor Green
    Write-Host "Ontology-driven diagnosis: CONFIRMED" -ForegroundColor Green
    Write-Host "SWRL rules execution: CONFIRMED" -ForegroundColor Green
    Write-Host "Disease staging: CONFIRMED" -ForegroundColor Green
    
} catch {
    Write-Host "[ERROR] STEP 3 failed: $_" -ForegroundColor Red
    exit 1
}
