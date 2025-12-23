# Frontend-Backend Integration Test Guide

## ✅ Setup Complete!

### What Was Fixed:
1. ✅ **api.js** - Real axios HTTP calls ke backend (bukan stub lagi)
2. ✅ **Step1Detect.jsx** - Clinical Assessment (Patient ID, Age, MMSE, MoCA, ADL/IADL)
3. ✅ **Step2Assess.jsx** - Brain Imaging & Biomarkers (Aβ42, Tau, Hippocampal volume)
4. ✅ **Step3Diagnose.jsx** - ATN Diagnosis dengan hasil dari ontology reasoning
5. ✅ **DecisionFlow.jsx** - Session management & API integration

### Services Running:
- **Backend (Java Spring Boot)**: http://localhost:8080
- **Frontend (React Vite)**: http://localhost:5173

---

## 🧪 Testing Workflow

### Step 1: Clinical Assessment

**Open browser**: http://localhost:5173

**Fill form dengan data berikut:**

```
Patient Information:
  Patient ID: PT001
  Age: 72

Family History:
  Family History of Dementia? Yes
  Family Member Diagnosis: AD

Clinical Symptoms:
  Subjective Complaints? Yes
  Behavioral Changes? Yes

Cognitive Assessment Scores:
  MMSE Score: 22
  MoCA Score: 20

Functional Independence:
  Independent in ADL? No
  Independent in IADL? No
```

**Click**: "Analyze & Continue" → Backend akan return **Session ID**

---

### Step 2: Brain Imaging & Biomarkers

**Fill form:**

```
Additional Cognitive Tests (Optional):
  FAQ Score: 12
  AD8 Score: 4

Brain Imaging Analysis:
  Imaging Type: Elecsys
  MTA Score: 2

CSF/Plasma Biomarkers:
  Aβ42: 500
  P-Tau181: 60
  T-Tau: 400
  Aβ42/40 Ratio: 0.008  ← CRITICAL untuk A+ classification
  P-Tau/Aβ42 Ratio: 0.12  ← CRITICAL untuk T+ classification

Hippocampal Volume:
  Left Hippo: 1200
  Right Hippo: 1300
  ICV: 1500000
  → Auto-calculates Adjusted Hippo Volume: ~1.67

Rule-out Diseases:
  Have rule-out diseases been assessed? Yes
    ✓ Vitamin B12 Deficiency
    ✓ Hypothyroidism
```

**Click**: "Analyze & Continue" → Backend processes biomarkers

---

### Step 3: ATN Diagnosis

**Expected Results dari Backend:**

```json
{
  "diagnosis": "Alzheimer's Disease - ATN Framework",
  "atnProfile": "A+T+N+",
  "amyloidStatus": "Positive (Aβ42/40 < 0.01)",
  "tauStatus": "Positive (P-Tau/Aβ42 > 0.1)",
  "neurodegenerationStatus": "Positive (Hippo < 2000)",
  "inferredClasses": [
    "Person",
    "AmyloidPositive",
    "TauPositive", 
    "NeurodegenerationPositive"
  ]
}
```

**This means SWRL rules are FIRING! 🎉**

Jika masih return `A−T−N−`, itu artinya SWRL rules belum aktif (masih pakai cutoff fallback).

---

## 🔍 Debugging Backend

### Check Backend Logs:

Backend console seharusnya show:
```
✅ PELLET Reasoner initialized successfully
Processing Step3 request for patient: PT001
Applying SWRL rules...
ATN Profile: A+T+N+
```

Jika muncul:
```
⚠️  Pellet not available, Using Structural Reasoner
```

Artinya dependency issue - perlu rebuild backend.

### Test Backend Directly (cURL):

```powershell
# Step 1
$body1 = @{
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

Invoke-RestMethod -Uri "http://localhost:8080/api/v1/diagnosis/step1" -Method POST -Body $body1 -ContentType "application/json"

# Capture sessionId from response, then:

# Step 3 (simplified test)
$body3 = @{
  patientId = "PT001"
  sessionId = "sess_xxxxx"  # dari Step1 response
  abeta4240Ratio = 0.008
  pTauAbeta42Ratio = 0.12
  hippocampalVolume = 1667
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/v1/diagnosis/step3" -Method POST -Body $body3 -ContentType "application/json"
```

---

## 📊 Expected Flow

```
Frontend (Step1) 
  → POST /api/v1/diagnosis/step1
  ← { sessionId: "sess_abc123", decision: "NEXT" }

Frontend (Step2)
  → POST /api/v1/diagnosis/step2 (with sessionId)
  ← { decision: "NEXT" }

Frontend (Step3)
  → POST /api/v1/diagnosis/step3 (with sessionId + biomarker ratios)
  ← { 
      diagnosis: "Alzheimer's Disease",
      atnProfile: "A+T+N+",
      inferredClasses: ["AmyloidPositive", "TauPositive", "NeurodegenerationPositive"]
    }
```

---

## 🐛 Common Issues

### 1. CORS Error
**Symptom**: Browser console shows "blocked by CORS policy"

**Fix**: Backend already has CORS enabled for http://localhost:5173

### 2. Session ID Mismatch
**Symptom**: Step3 returns "Clinical data not found"

**Fix**: Check sessionId propagation di frontend console logs

### 3. A−T−N− Instead of A+T+N+
**Symptom**: Backend returns negative profile despite positive cutoffs

**Fix**: 
- Check backend logs untuk "PELLET Reasoner initialized"
- Jika belum, rebuild: `mvn clean package -DskipTests`
- Restart backend

### 4. Network Error / Connection Refused
**Symptom**: Frontend can't reach backend

**Fix**:
```powershell
# Check backend health
Invoke-RestMethod http://localhost:8080/api/v1/health

# Check Java process
Get-Process | Where-Object {$_.ProcessName -like "*java*"}
```

---

## 🎯 Next Steps

Setelah Step3 success dengan A+T+N+:

1. **Validate SWRL Rules** - Confirm ontology inference working
2. **Test Edge Cases** - Try A−T+N−, A+T−N+, etc.
3. **Add Step4 Integration** - Treatment recommendations from diagnosis
4. **Implement Export** - Save final report as PDF/JSON

---

## 📝 Notes

- Backend menggunakan **Pellet reasoner** untuk SWRL inference
- Frontend sekarang **fully connected** dengan real API calls
- Session ID di-track across all steps
- Biomarker ratios auto-calculated di Step2
- Step3 receives diagnosis dari ontology reasoning

**Good luck testing! 🚀**
