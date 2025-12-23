# 🔍 Console Logging Guide - Monitoring Data Flow

## Opening Browser Console

Press `F12` or `Ctrl+Shift+I` in your browser → Click **Console** tab

---

## What You'll See During Testing

### Step 1 - Clinical Assessment

**When you click "Analyze & Continue":**

```
🔵 STEP 1: Preparing request...
Step1 formData: {
  patientId: "PT001"
  age: 72
  hasFamilyHistory: true
  hasSubjectiveComplaints: true
  hasBehaviorChanges: true
  mmseScore: 22
  mocaScore: 20
  isIndependentADL: false
  isIndependentIADL: false
}

📤 STEP1 REQUEST - Sending data to backend: {...}
✅ STEP1 RESPONSE - Received from backend: {
  sessionId: "sess_abc123xyz"
  decision: "NEXT"
  message: "Initial assessment recorded"
  ...
}

✅ Session created: sess_abc123xyz
```

---

### Step 2 - Brain Imaging & Biomarkers

**When you click "Analyze & Continue":**

```
🔵 STEP 2: Preparing request...
Step2 payload with sessionId: {
  brainImagingType: "Elecsys"
  mtaScore: 2
  abeta42Score: 500
  pTau181Score: 60
  tTau: 400
  abeta4240Ratio: 0.008
  pTauAbeta42Ratio: 0.12
  hippoLeft: 1200
  hippoRight: 1300
  icv: 1500000
  hippocampalVolume: 1.67
  hasRuleOutDiseases: true
  patientId: "PT001"
  mmseScore: 22
  mocaScore: 20
  sessionId: "sess_abc123xyz"
}

📊 Hippo calculation: (1200 + 1300) / 1500000 * 1000 = 1.67

📤 STEP2 REQUEST - Sending data to backend: {...}
✅ STEP2 RESPONSE - Received from backend: {
  decision: "NEXT"
  message: "Biomarker data recorded"
  ...
}
```

**What to check:**
- ✅ `hippocampalVolume` shows correct calculation
- ✅ `abeta4240Ratio: 0.008` (NOT 5 or 8)
- ✅ `pTauAbeta42Ratio: 0.12` (NOT 12)
- ✅ `sessionId` present

---

### Step 3 - ATN Diagnosis

**When you click "Analyze & Continue":**

```
🔵 STEP 3: Preparing request...
Step3 payload with sessionId: {
  patientId: "PT001"
  abeta4240Ratio: 0.008
  pTauAbeta42Ratio: 0.12
  hippocampalVolume: 1.67
  mtaScore: 2
  mriFindings: ""
  sessionId: "sess_abc123xyz"
}

Full Step2 data available: {
  brainImagingType: "Elecsys"
  mtaScore: 2
  abeta42Score: 500
  pTau181Score: 60
  ...
}

📤 STEP3 REQUEST - Sending data to backend: {...}
✅ STEP3 RESPONSE - Received from backend: {
  diagnosis: "Alzheimer's Disease - ATN Framework"
  atnProfile: "A+T+N+"
  message: "All biomarkers positive..."
  inferredClasses: ["Person", "AmyloidPositive", "TauPositive", "NeurodegenerationPositive"]
  ...
}

✅ Step3 Response received: {...}
```

**What to check:**
- ✅ All three biomarker ratios sent
- ✅ `hippocampalVolume` is populated
- ✅ Response includes `diagnosis` and `atnProfile`
- ✅ `inferredClasses` array has ATN classification

---

## 🐛 Troubleshooting via Console

### Issue: CSF showing 5 instead of 0.05

**What you'd see:**
```
Step2 payload with sessionId: {
  ...
  abeta4240Ratio: 5  ❌ WRONG!
  ...
}
```

**Fix applied:** SafeParseFloat now handles empty values correctly

---

### Issue: Hippocampal volume wrong calculation

**What you'd see:**
```
📊 Hippo calculation: (1200 + 1300) / 1500000 * 1000 = 1.67
```

**If you see:**
```
📊 Hippo calculation: (1200 + 1300) / 1500000 * 1000 = 1666.67  ❌ 
```

**Explanation:**
- Left + Right = 2500 mm³
- ICV = 1,500,000 mm³ (total intracranial volume)
- Formula: (2500 / 1,500,000) × 1000 = **1.67** ✅

This is CORRECT! The adjusted volume is very small because you're normalizing brain structure volume to total ICV.

---

### Issue: Step3 is empty

**What you'd see:**
```
🔵 STEP 3: Preparing request...
Step3 payload with sessionId: {}  ❌ EMPTY!
Full Step2 data available: {}  ❌ EMPTY!
```

**This means:** Step2 data wasn't saved. Solution: Go back and fill Step2 completely.

**If Step2 has data:**
```
🔵 STEP 3: Preparing request...
Step3 payload with sessionId: {
  patientId: "PT001"
  abeta4240Ratio: 0.008
  pTauAbeta42Ratio: 0.12
  hippocampalVolume: 1.67
  ...
}

Full Step2 data available: {
  brainImagingType: "Elecsys"
  mtaScore: 2
  ...
}

❌ STEP3 API Error: 500 Internal Server Error
```

**This means:** Backend received data but had error. Check backend logs in other terminal.

---

## Backend Console Logs

In the **Java backend terminal**, you should see:

```
[INFO] Step1Controller - Received Step1 request for patient: PT001
[INFO] OntologyManagerImpl - Processing patient data...
[INFO] DiagnosisService - Storing session: sess_abc123xyz

[INFO] Step2Controller - Received Step2 request for session: sess_abc123xyz
[INFO] OntologyManagerImpl - Recording biomarker data...

[INFO] Step3Controller - Received Step3 request for session: sess_abc123xyz
[INFO] OntologyManagerImpl - Applying SWRL rules...
[INFO] OntologyManagerImpl - PELLET Reasoner initialized ✅
[INFO] DiagnosisService - ATN Profile: A+T+N+
[INFO] DiagnosisService - Inferred Classes: [Person, AmyloidPositive, TauPositive, NeurodegenerationPositive]
```

---

## Summary of Console Messages

| Message | Meaning | Status |
|---------|---------|--------|
| `🔵 STEP X: Preparing request...` | Frontend collecting form data | ℹ️ Info |
| `📤 STEPX REQUEST` | Data being sent to backend | 📤 Outgoing |
| `✅ STEPX RESPONSE` | Backend responded successfully | ✅ Success |
| `❌ STEPX API Error` | Backend returned error | ❌ Error |
| `📊 Hippo calculation:` | Hippocampal volume calculated | ℹ️ Info |
| `✅ Session created:` | Step1 successful, sessionId ready | ✅ Success |

---

## How to Copy Console Data

1. Right-click on console message
2. Select "Copy message"
3. Paste into notepad for debugging

Or use this command in console:
```javascript
// Copy all console logs
copy(sessionStorage.getItem('console-logs'))
```

---

## Best Practices

✅ Keep console open while testing
✅ Check each step's request/response
✅ Note the sessionId from Step1
✅ Verify biomarker ratios are decimal (0.008, not 8)
✅ Verify hippocampal volume auto-calculates
✅ Check Step3 response has diagnosis & ATN profile

---

**Now test and watch the console! The logs will tell you everything! 🎯**
