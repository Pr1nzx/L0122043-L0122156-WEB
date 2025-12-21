# Test Step 1
Write-Host "=== Testing Step 1 ===" -ForegroundColor Green
$step1_url = "http://localhost:8080/api/v1/diagnosis/step1"
$step1_body = @{
    patientId = "P001"
    age = 72
    gender = "Male"
    educationLevel = "Bachelor"
    medicalHistory = @("Hypertension", "Type2Diabetes")
    currentMedications = @("Amlodipine", "Metformin")
    familyHistoryOfAD = $true
    apoeGenotype = "e4e4"
} | ConvertTo-Json

$headers = @{"Content-Type" = "application/json"}

try {
    $response = Invoke-WebRequest -Uri $step1_url -Method POST -Headers $headers -Body $step1_body
    Write-Host "Status: $($response.StatusCode)"
    $responseObj = $response.Content | ConvertFrom-Json
    Write-Host "SessionId: $($responseObj.sessionId)"
    Write-Host "PatientId: $($responseObj.patientId)"
    
    $sessionId = $responseObj.sessionId
    
    # Test Step 2
    Write-Host "`n=== Testing Step 2 ===" -ForegroundColor Green
    $step2_url = "http://localhost:8080/api/v1/diagnosis/step2"
    $step2_body = @{
        patientId = "P001"
        sessionId = $sessionId
        mmseScore = 18
        mmseVersion = "3.11"
        cdrScore = 1.0
        cdrSum = 6.5
        gdsScore = 8
        iadlScore = 7
    } | ConvertTo-Json
    
    $response2 = Invoke-WebRequest -Uri $step2_url -Method POST -Headers $headers -Body $step2_body
    Write-Host "Status: $($response2.StatusCode)"
    $response2Obj = $response2.Content | ConvertFrom-Json
    Write-Host "Cognitive Impairment Detected: $($response2Obj.cognitiveImpairmentDetected)"
    
    # Test Step 3
    Write-Host "`n=== Testing Step 3 ===" -ForegroundColor Green
    $step3_url = "http://localhost:8080/api/v1/diagnosis/step3"
    $step3_body = @{
        patientId = "P001"
        sessionId = $sessionId
        abeta4240Ratio = 0.008
        pTauAbeta42Ratio = 0.12
        hippocampalVolume = 2400.5
        mtaScore = 2
        mmseScore = 18
        mriFindings = "Hippocampal atrophy with entorhinal cortex involvement"
        apoeGenotype = "e4e4"
        needsBiomarkersTest = $false
        needsStructuralImaging = $false
        needsFollowUp6Months = $true
        clinicalNotes = "Patient showing signs of mild cognitive impairment with suspected early Alzheimer's pathology"
    } | ConvertTo-Json
    
    $response3 = Invoke-WebRequest -Uri $step3_url -Method POST -Headers $headers -Body $step3_body
    Write-Host "Status: $($response3.StatusCode)"
    $response3Obj = $response3.Content | ConvertFrom-Json
    Write-Host "Diagnosis: $($response3Obj.diagnosis)"
    Write-Host "Disease Stage: $($response3Obj.diseaseStage)"
    Write-Host "ATN Profile: $($response3Obj.atnProfile)"
    Write-Host "Confidence Level: $($response3Obj.confidenceLevel)"
    Write-Host "`nFull Response:"
    Write-Host ($response3Obj | ConvertTo-Json)
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}
