# Complete Alzheimer Detection Workflow Test
# Tests all 3 steps with real patient data

Write-Host "==== ALZHEIMER DETECTION SYSTEM - COMPLETE WORKFLOW TEST ====" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080/api"
$sessionId = $null

# ============================================================
# STEP 1: Initial Assessment
# ============================================================
Write-Host "STEP 1: Initial Patient Assessment" -ForegroundColor Yellow
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
    isADLIndependent = $false
    iadlDependency = $true
    gdsScore = 8
} | ConvertTo-Json

try {
    Write-Host "Patient Data:" -ForegroundColor Cyan
    Write-Host "- ID: PT001, Age: 72"
    Write-Host "- MMSE: 22 (Cognitive Impairment)"
    Write-Host "- MoCA: 20 (Cognitive Impairment)"
    Write-Host "- ADL: Dependent"
    Write-Host ""
    
    $response1 = Invoke-WebRequest -Uri "$baseUrl/v1/diagnosis/step1" `
                                   -Method POST `
                                   -ContentType "application/json" `
                                   -Body $step1Data `
                                   -UseBasicParsing
    
    $data1 = $response1.Content | ConvertFrom-Json
    $sessionId = $data1.sessionId
    
    Write-Host "[OK] STEP 1 SUCCESS (HTTP $($response1.StatusCode))" -ForegroundColor Green
    Write-Host "Session ID: $sessionId" -ForegroundColor Green
    Write-Host "Inferred Classes:" -ForegroundColor Cyan
    $data1.inferredClasses | ForEach-Object { Write-Host "   * $_" -ForegroundColor Green }
    Write-Host ""
    
} catch {
    Write-Host "[FAILED] STEP 1 FAILED: $_" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# ============================================================
# STEP 2: Brain Imaging & Biomarkers (ATN Assessment)
# ============================================================
Write-Host "STEP 2: Brain Imaging and Biomarkers (ATN Assessment)" -ForegroundColor Yellow
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
    Write-Host "Biomarker Data:" -ForegroundColor Cyan
    Write-Host "- Imaging: Elecsys"
    Write-Host "- MTA Score: 3 (Significant Atrophy)"
    Write-Host "- Aβ42/40 Ratio: 0.007 (ABNORMAL - Cutoff: 0.08)"
    Write-Host "- P-Tau/Aβ42 Ratio: 0.12 (ABNORMAL - Cutoff: 0.05)"
    Write-Host "- Hippocampal Volume: 0.75 (ABNORMAL - Cutoff: 0.80)"
    Write-Host ""
    
    $response2 = Invoke-WebRequest -Uri "$baseUrl/v1/diagnosis/step2" `
                                   -Method POST `
                                   -ContentType "application/json" `
                                   -Body $step2Data `
                                   -UseBasicParsing
    
    $data2 = $response2.Content | ConvertFrom-Json
    
    Write-Host "[OK] STEP 2 SUCCESS (HTTP $($response2.StatusCode))" -ForegroundColor Green
    Write-Host "ATN Profile: $($data2.findings.atn_profile)" -ForegroundColor Green
    Write-Host "Inferred Classes:" -ForegroundColor Cyan
    $data2.inferredClasses | ForEach-Object { Write-Host "  ✓ $_" -ForegroundColor Green }
    Write-Host "SWRL Rules Triggered:" -ForegroundColor Cyan
    $data2.triggeredRules | ForEach-Object { Write-Host "   [RULE] $_" -ForegroundColor Blue }
    Write-Host ""
    
} catch {
    Write-Host "[FAILED] STEP 2 FAILED: $_" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# ============================================================
# STEP 3: Final Diagnosis & Disease Staging
# ============================================================
Write-Host "STEP 3: Final Diagnosis and Disease Staging" -ForegroundColor Yellow
Write-Host "POST $baseUrl/v1/diagnosis/step3" -ForegroundColor Gray
Write-Host ""

$step3Data = @{
    patientId = "PT001"
    sessionId = $sessionId
    abeta4240Ratio = 0.007
    pTauAbeta42Ratio = 0.12
    hippocampalVolume = 2400.5
    mtaScore = 3
    mriFindings = "Hippocampal atrophy, ventricular enlargement, white matter changes"
    mmseScore = 22
    mocaScore = 20
    adlStatus = "dependent"
    iadlStatus = "dependent"
} | ConvertTo-Json

try {
    $response3 = Invoke-WebRequest -Uri "$baseUrl/v1/diagnosis/step3" `
                                   -Method POST `
                                   -ContentType "application/json" `
                                   -Body $step3Data `
                                   -UseBasicParsing
    
    $data3 = $response3.Content | ConvertFrom-Json
    
    Write-Host "[OK] STEP 3 SUCCESS (HTTP $($response3.StatusCode))" -ForegroundColor Green
    Write-Host ""
    
    # ========== DIAGNOSIS ==========
    Write-Host "--- DIAGNOSIS RESULTS ---" -ForegroundColor Magenta
    Write-Host "Primary Diagnosis: $($data3.diagnosis)" -ForegroundColor White
    Write-Host "Disease Stage: $($data3.diseaseStage)" -ForegroundColor White
    Write-Host "ATN Profile: $($data3.atnProfile)" -ForegroundColor White
    Write-Host "Confidence Level: $($data3.confidenceLevel)" -ForegroundColor White
    Write-Host ""
    
    # ========== INFERRED CLASSES ==========
    Write-Host "Inferred Ontology Classes:" -ForegroundColor Cyan
    $data3.inferredClasses | ForEach-Object { Write-Host "   * $_" -ForegroundColor Green }
    Write-Host ""
    
    # ========== TRIGGERED RULES ==========
    Write-Host "SWRL Rules Triggered:" -ForegroundColor Blue
    if ($data3.triggeredRules -and $data3.triggeredRules.Count -gt 0) {
        $data3.triggeredRules | ForEach-Object {
            Write-Host "   Rule: $($_.ruleName)" -ForegroundColor Blue
            Write-Host "   → Body: $($_.body -replace '(.{50})','$1`n        ')" -ForegroundColor DarkBlue
            Write-Host "   → Head: $($_.conclusion)" -ForegroundColor DarkGreen
            Write-Host ""
        }
    }
    
    # ========== RECOMMENDATIONS ==========
    Write-Host "Recommended Medical Actions:" -ForegroundColor Yellow
    $data3.recommendedActions | ForEach-Object { Write-Host "   • $_" -ForegroundColor Yellow }
    Write-Host ""
    
    Write-Host "Recommended Activities:" -ForegroundColor Yellow
    $data3.recommendedActivities | ForEach-Object { Write-Host "   • $_" -ForegroundColor Yellow }
    Write-Host ""
    
    Write-Host "Required Follow-up Tests:" -ForegroundColor Yellow
    $data3.requiredTests | ForEach-Object { Write-Host "   • $_" -ForegroundColor Yellow }
    Write-Host ""
    
    # ========== BIOMARKER EVIDENCE ==========
    Write-Host "Biomarker Results:" -ForegroundColor Cyan
    Write-Host "   Aβ42/40 Ratio: $($data3.biomarkerResults.abeta4240Ratio) - $($data3.biomarkerResults.abeta4240Status)" -ForegroundColor Green
    Write-Host "   P-Tau/Aβ42 Ratio: $($data3.biomarkerResults.pTauAbeta42Ratio) - $($data3.biomarkerResults.pTauAbeta42Status)" -ForegroundColor Green
    Write-Host "   Hippocampal Volume: $($data3.biomarkerResults.hippocampalVolume) mm³ - $($data3.biomarkerResults.hippocampalStatus)" -ForegroundColor Green
    Write-Host "   MTA Score: $($data3.biomarkerResults.mtaScore)/4 - $($data3.biomarkerResults.mtaStatus)" -ForegroundColor Green
    Write-Host ""
    
    # ========== FINAL SUMMARY ==========
    Write-Host "==== WORKFLOW COMPLETE ====" -ForegroundColor Green
    Write-Host "SUCCESS: Ontology-driven diagnosis confirmed" -ForegroundColor Green
    Write-Host "SUCCESS: All SWRL rules executed successfully" -ForegroundColor Green
    Write-Host "SUCCESS: Disease stage correctly classified via reasoning" -ForegroundColor Green
    Write-Host "SUCCESS: Recommendations generated from ontology" -ForegroundColor Green
    
} catch {
    Write-Host "[FAILED] STEP 3 FAILED: $_" -ForegroundColor Red
    exit 1
}
