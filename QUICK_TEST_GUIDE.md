# ⚡ QUICK TEST - Frontend-Backend Integration

## 🟢 Status: READY TO TEST

### Services
- ✅ Backend: `http://localhost:8080` (Java Spring Boot with Pellet reasoner)
- ✅ Frontend: `http://localhost:5173` (React Vite)

---

## 🚀 Quick Test (Copy-Paste Data)

### STEP 1: Clinical Assessment
Open browser → http://localhost:5173

**Patient Information:**
- Patient ID: `PT001`
- Age: `72`

**Family History:**
- ✓ Family History of Dementia? **Yes**
- Family Member Diagnosis: **AD**

**Clinical Symptoms:**
- ✓ Subjective Complaints? **Yes**
- ✓ Behavioral Changes? **Yes**

**Cognitive Assessment:**
- MMSE Score: `22`
- MoCA Score: `20`

**Functional Independence:**
- ✗ Independent in ADL? **No**
- ✗ Independent in IADL? **No**

👉 **Click "Analyze & Continue"** → Get `sessionId`

---

### STEP 2: Brain Imaging & Biomarkers

**Additional Tests (Optional):**
- FAQ Score: `12`
- AD8 Score: `4`

**Brain Imaging:**
- Imaging Type: **Elecsys**
- MTA Score: `2`

**Biomarkers:**
- Aβ42: `500`
- P-Tau181: `60`
- T-Tau: `400`
- Aβ42/40 Ratio: `0.008` ← **CRITICAL: < 0.01 = A+**
- P-Tau/Aβ42 Ratio: `0.12` ← **CRITICAL: > 0.10 = T+**

**Hippocampal Volume:**
- Left Hippo: `1200`
- Right Hippo: `1300`
- ICV: `1500000`
- → Auto-calculates: **1667** ← **< 2000 = N+**

**Rule-out Diseases:**
- ✓ Have rule-out diseases been assessed? **Yes**
  - ✓ Vitamin B12 Deficiency
  - ✓ Hypothyroidism

👉 **Click "Analyze & Continue"** → Backend processes biomarkers

---

### STEP 3: ATN Diagnosis

**Expected Output from Backend:**
```
Diagnosis: Alzheimer's Disease - ATN Framework
ATN Profile: A+T+N+
Message: [SWRL reasoning message]

Inferred Classes:
  • Person
  • AmyloidPositive
  • TauPositive
  • NeurodegenerationPositive
```

✅ **This means SWRL RULES ARE FIRING!** 🎉

---

## 🔍 How to Verify SWRL is Working

### Check Backend Console:
Look for:
```
✅ PELLET Reasoner initialized successfully
Processing Step3 request for patient: PT001
Applying SWRL rules...
ATN Profile: A+T+N+
```

### If You See:
```
⚠️  Pellet not available, Using Structural Reasoner
```

**Solution:**
```powershell
cd backendJAVA/backend
mvn clean package -DskipTests
java -jar target/alzheimer-backend-1.0.0.jar
```

---

## 📊 Test Cutoff Values

| Biomarker | POSITIVE Threshold | Test Value | Result |
|-----------|-------------------|-----------|--------|
| Aβ42/40 Ratio | < 0.01 | 0.008 | ✅ A+ |
| P-Tau/Aβ42 | > 0.10 | 0.12 | ✅ T+ |
| Hippo Volume | < 2000 | 1667 | ✅ N+ |

All three positive = **A+T+N+** = **Alzheimer's Disease**

---

## 🧪 Test Variations

### To Test A+T-N- (Asymptomatic Amyloid):
```
Aβ42/40 Ratio: 0.008 (< 0.01) → A+
P-Tau/Aβ42: 0.05 (< 0.10) → T-
Hippo Volume: 3000 (> 2000) → N-
```

### To Test A-T+N+ (Primary Age-Related Tauopathy):
```
Aβ42/40 Ratio: 0.02 (> 0.01) → A-
P-Tau/Aβ42: 0.15 (> 0.10) → T+
Hippo Volume: 1800 (< 2000) → N+
```

---

## 💻 Test Backend API Directly (Optional)

### PowerShell cURL Test:

```powershell
# Step 1 Request
$step1 = @{
    patientId = "PT001"
    age = 72
    hasFamilyHistory = $true
    hasSubjectiveComplaints = $true
    hasBehaviorChanges = $true
    mmseScore = 22
    mocaScore = 20
    isIndependentADL = $false
    isIndependentIADL = $false
} | ConvertTo-Json

$response1 = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/diagnosis/step1" -Method POST -Body $step1 -ContentType "application/json"

Write-Host "Session ID: $($response1.sessionId)"

# Step 2 Request
$step2 = @{
    patientId = "PT001"
    mmseScore = 22
    mocaScore = 20
    brainImagingType = "Elecsys"
    mtaScore = 2
    abeta42Score = 500
    pTau181Score = 60
    tTau = 400
    abeta4240Ratio = 0.008
    pTauAbeta42Ratio = 0.12
    hippocampalVolume = 1667
    hasRuleOutDiseases = $true
    sessionId = $response1.sessionId
} | ConvertTo-Json

$response2 = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/diagnosis/step2" -Method POST -Body $step2 -ContentType "application/json"

Write-Host "Step2 Response: $(ConvertTo-Json $response2)"

# Step 3 Request
$step3 = @{
    patientId = "PT001"
    sessionId = $response1.sessionId
    abeta4240Ratio = 0.008
    pTauAbeta42Ratio = 0.12
    hippocampalVolume = 1667
    mtaScore = 2
} | ConvertTo-Json

$response3 = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/diagnosis/step3" -Method POST -Body $step3 -ContentType "application/json"

Write-Host "Step 3 Diagnosis: $($response3.diagnosis)"
Write-Host "ATN Profile: $($response3.atnProfile)"
Write-Host "Inferred Classes: $(ConvertTo-Json $response3.inferredClasses)"
```

---

## ❌ Troubleshooting

| Issue | Solution |
|-------|----------|
| "Connection refused" | Check if backend is running: `Get-Process java` |
| "CORS Error" | Already enabled - check browser console for more details |
| "A−T−N− instead of A+T+N+" | Check backend logs for "Pellet Reasoner" - rebuild if needed |
| "Session not found" | Ensure sessionId from Step1 matches in Step2/3 |
| "Invalid biomarker values" | Check if ratios calculated correctly in Step2 |

---

## ✨ What's Working

✅ Frontend-Backend Communication
✅ Session ID Propagation
✅ Step1 → Step2 → Step3 Flow
✅ Biomarker Ratio Calculations
✅ SWRL Rule Inference (with Pellet)
✅ Error Handling & User Feedback
✅ Form Validation
✅ Summary View with Edit Capability

---

## 🎯 Success Criteria

**Step 3 response contains:**
```json
{
  "diagnosis": "Alzheimer's Disease - ATN Framework",
  "atnProfile": "A+T+N+",
  "inferredClasses": ["Person", "AmyloidPositive", "TauPositive", "NeurodegenerationPositive"]
}
```

**If you see this** → **SWRL WORKING! 🎉**

---

**Ready to test? Open http://localhost:5173 and start filling the form!**
