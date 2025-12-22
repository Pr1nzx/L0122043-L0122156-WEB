# POSTMAN TEST - Alzheimer Detection with Staging
# Complete Workflow Example with Expected Results

## ✅ PREREQUISITE
- Server running: `java -jar target/alzheimer-backend-1.0.0.jar`
- Base URL: `http://localhost:8080`

---

## 1️⃣ STEP 1: Initial Assessment (Demographics & Cognitive Tests)

### POST /api/v1/diagnosis/step1

**Request Headers:**
```
Content-Type: application/json
```

**Request Body - Patient with Cognitive Decline:**
```json
{
  "patientId": "PT001",
  "age": 72,
  "hasFamilyHistory": true,
  "familyMemberDiagnosis": "AD",
  "hasSubjectiveComplaints": true,
  "hasBehaviorChanges": true,
  "mmseScore": 22,
  "mocaScore": 20,
  "isIndependentADL": false,
  "isIndependentIADL": false,
  "clinicalNotes": "Patient reports memory decline for 2 years"
}
```

**Expected Response (200 OK):**
```json
{
  "sessionId": "sess_09d894d5c2e8f4a1",
  "patientId": "PT001",
  "stepNumber": 1,
  "status": "completed",
  "findings": {
    "cognitive_status": "Mild Cognitive Impairment",
    "adl_status": "Dependent",
    "risk_factors_detected": [
      "Positive family history of AD",
      "Subjective complaints",
      "Behavior changes",
      "Low MMSE score (22 - Normal: 24-30)",
      "Low MoCA score (20 - Normal: 23-30)"
    ]
  },
  "inferredClasses": [
    "PatientWithCognitiveCognitiveDysfunction",
    "PatientAtRisk",
    "PersonWithSubjectiveComplaint"
  ],
  "timestamp": "2025-12-23T10:15:00"
}
```

---

## 2️⃣ STEP 2: Brain Imaging & Biomarkers (ATN Assessment)

### POST /api/v1/diagnosis/step2

**Request Headers:**
```
Content-Type: application/json
```

**Request Body - Abnormal Biomarkers (ATN+ Profile):**
```json
{
  "patientId": "PT001",
  "brainImagingType": "Elecsys",
  "mtaScore": 3,
  "abeta4240Ratio": 0.007,
  "pTauAbeta42Ratio": 0.12,
  "hippocampalVolumeRatio": 0.75
}
```

**Expected Response (200 OK):**
```json
{
  "sessionId": "sess_09d894d5c2e8f4a1",
  "patientId": "PT001",
  "stepNumber": 2,
  "status": "completed",
  "findings": {
    "imaging_type": "Elecsys",
    "mta_score": 3,
    "atn_profile": "A+T+N+",
    "biomarker_abnormalities": [
      "Amyloid-beta 42/40 ratio: 0.007 (ABNORMAL - Cutoff: 0.08)",
      "P-Tau/Aβ42 ratio: 0.12 (ABNORMAL - Cutoff: 0.05)",
      "Hippocampal volume ratio: 0.75 (ABNORMAL - Cutoff: 0.80)"
    ]
  },
  "inferredClasses": [
    "AmyloidPositive",
    "TauPositive",
    "NeurodeGenerationPositive",
    "ADPathologyPresent"
  ],
  "triggeredRules": [
    "AmyloidPositive_Elecsys",
    "TauPositive_Elecsys",
    "ADPathology_ATNPositive"
  ],
  "timestamp": "2025-12-23T10:20:00"
}
```

---

## 3️⃣ STEP 3: Final Diagnosis & Disease Staging

### POST /api/v1/diagnosis/step3

**Request Headers:**
```
Content-Type: application/json
```

**Request Body - Complete Clinical Picture:**
```json
{
  "patientId": "PT001",
  "sessionId": "sess_09d894d5c2e8f4a1",
  "abeta4240Ratio": 0.007,
  "pTauAbeta42Ratio": 0.12,
  "hippocampalVolume": 2400.5,
  "mtaScore": 3,
  "mriFindings": "Hippocampal atrophy, ventricular enlargement, white matter changes",
  "mmseScore": 22,
  "mocaScore": 20,
  "adlStatus": "dependent",
  "iadlStatus": "dependent"
}
```

**Expected Response (200 OK) - WITH STAGING & RECOMMENDATIONS:**
```json
{
  "patientId": "PT001",
  "sessionId": "sess_09d894d5c2e8f4a1",
  "timestamp": "2025-12-23T10:25:00",
  "diagnosis": "Alzheimer's Disease Dementia (Probable)",
  "confidenceLevel": "High",
  "diseaseStage": "Moderate",
  "atnProfile": "A+T+N+",
  "inferredClasses": [
    "PersonWithAlzheimersDiseaseDementia",
    "PersonWithADPathology",
    "ModerateStage",
    "AmyloidPositive",
    "TauPositive",
    "NeurodeGenerationPositive",
    "ADDementia"
  ],
  "triggeredRules": [
    {
      "ruleName": "AmyloidPositive_Elecsys",
      "body": "ClinicalTest(?t) ∧ hasBrainImagingWith(?t, Elecsys) ∧ hasAbeta42Score(?t, ?score) ∧ greaterThan(?score, 0.008)",
      "conclusion": "AmyloidPositive(?t)"
    },
    {
      "ruleName": "TauPositive_Elecsys",
      "body": "ClinicalTest(?t) ∧ hasBrainImagingWith(?t, Elecsys) ∧ hasPTauScore(?t, ?score) ∧ greaterThan(?score, 0.05)",
      "conclusion": "TauPositive(?t)"
    },
    {
      "ruleName": "S2_ModerateStage",
      "body": "PersonWithAlzheimersDiseaseDementia(?p) ∧ hasMMSEScore(?p, ?mmse) ∧ lessThan(?mmse, 21) ∧ greaterThan(?mmse, 10)",
      "conclusion": "ModerateStage(?p)"
    }
  ],
  "recommendedActions": [
    "Start cholinesterase inhibitor therapy (e.g., Donepezil 10mg daily)",
    "Initiate NMDA receptor antagonist (Memantine 20mg daily)",
    "Refer to neurologist for disease management",
    "Consider caregiver support programs",
    "Implement cognitive rehabilitation",
    "Screen for behavioral disturbances"
  ],
  "recommendedActivities": [
    "Cognitive training exercises",
    "Memory rehabilitation",
    "Physical exercise program (30 min/day)",
    "Social engagement activities",
    "Structured daily routines"
  ],
  "requiredTests": [
    "3-month follow-up cognitive assessment",
    "6-month repeat biomarker testing",
    "Annual MRI with volumetric analysis",
    "Neuropsychological testing",
    "Caregiver stress assessment"
  ],
  "evidence": {
    "cognitive_decline": "MMSE: 22/30 (abnormal), MoCA: 20/30 (abnormal)",
    "atn_biomarkers": "A+ (Aβ42/40: 0.007), T+ (P-Tau: 0.12), N+ (Hippo volume: 2400.5)",
    "neuroimaging": "MRI shows hippocampal atrophy (MTA: 3/4) and ventricular enlargement",
    "functional_decline": "ADL dependent, IADL dependent",
    "disease_mechanism": "All three pillars of AD pathology confirmed"
  },
  "biomarkerResults": {
    "abeta4240Ratio": 0.007,
    "abeta4240Status": "ABNORMAL (Cutoff: 0.08)",
    "pTauAbeta42Ratio": 0.12,
    "pTauAbeta42Status": "ABNORMAL (Cutoff: 0.05)",
    "hippocampalVolume": 2400.5,
    "hippocampalStatus": "ATROPHY (Abnormal < 2800 mm³)",
    "mtaScore": 3,
    "mtaStatus": "ABNORMAL (Score: 3/4 = Significant atrophy)"
  }
}
```

---

## 🔄 ALTERNATIVE SCENARIOS

### Scenario A: Normal/No AD
```json
{
  "patientId": "PT002",
  "age": 70,
  "hasFamilyHistory": false,
  "familyMemberDiagnosis": "Unknown",
  "hasSubjectiveComplaints": false,
  "hasBehaviorChanges": false,
  "mmseScore": 28,
  "mocaScore": 28,
  "isADLIndependent": true,
  "iadlDependency": false,
  "gdsScore": 2
}
```
Expected: `diagnosis: "Normal Aging"`, `diseaseStage: "None"`, `atnProfile: "A-T-N-"`

### Scenario B: Mild Cognitive Impairment (MCI)
```json
{
  "patientId": "PT003",
  "age": 68,
  "hasFamilyHistory": true,
  "familyMemberDiagnosis": "AD",
  "hasSubjectiveComplaints": true,
  "hasBehaviorChanges": false,
  "mmseScore": 26,
  "mocaScore": 24,
  "isADLIndependent": true,
  "iadlDependency": false,
  "gdsScore": 4
}
```
Step 2 with partial biomarkers: `atnProfile: "A+T-N-"`
Expected: `diagnosis: "MCI due to AD"`, `diseaseStage: "Preclinical/MCI"`, 
`recommendedActions: ["Annual cognitive monitoring", "Lifestyle interventions"]`

### Scenario C: Severe/Advanced AD
```json
{
  "patientId": "PT004",
  "mmseScore": 8,
  "mocaScore": 5,
  "isADLIndependent": false,
  "iadlDependency": true,
  "gdsScore": 14,
  "mtaScore": 4,
  "abeta4240Ratio": 0.004,
  "pTauAbeta42Ratio": 0.18,
  "hippocampalVolumeRatio": 0.60
}
```
Expected: `diseaseStage: "Severe"`, `inferredClasses: ["SevereStage"]`,
`recommendedActions: ["Palliative care", "Institutional care consideration", ...]`

---

## 📊 POSTMAN COLLECTION JSON

Save this as `Alzheimer_DSS.postman_collection.json` and import to Postman:

```json
{
  "info": {
    "name": "Alzheimer DSS API",
    "description": "Complete 3-Step Diagnosis Workflow",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Step 1 - Initial Assessment",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"patientId\": \"PT001\",\n  \"age\": 72,\n  \"hasFamilyHistory\": true,\n  \"familyMemberDiagnosis\": \"AD\",\n  \"hasSubjectiveComplaints\": true,\n  \"hasBehaviorChanges\": true,\n  \"mmseScore\": 22,\n  \"mocaScore\": 20,\n  \"isADLIndependent\": false,\n  \"iadlDependency\": true,\n  \"gdsScore\": 8\n}"
        },
        "url": {
          "raw": "http://localhost:8080/api/v1/diagnosis/step1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "diagnosis", "step1"]
        }
      }
    },
    {
      "name": "Step 2 - Brain Imaging & Biomarkers",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"patientId\": \"PT001\",\n  \"brainImagingType\": \"Elecsys\",\n  \"mtaScore\": 3,\n  \"abeta4240Ratio\": 0.007,\n  \"pTauAbeta42Ratio\": 0.12,\n  \"hippocampalVolumeRatio\": 0.75\n}"
        },
        "url": {
          "raw": "http://localhost:8080/api/v1/diagnosis/step2",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "diagnosis", "step2"]
        }
      }
    },
    {
      "name": "Step 3 - Final Diagnosis & Staging",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"patientId\": \"PT001\",\n  \"sessionId\": \"sess_09d894d5c2e8f4a1\",\n  \"abeta4240Ratio\": 0.007,\n  \"pTauAbeta42Ratio\": 0.12,\n  \"hippocampalVolume\": 2400.5,\n  \"mtaScore\": 3,\n  \"mriFindings\": \"Hippocampal atrophy, ventricular enlargement, white matter changes\",\n  \"mmseScore\": 22,\n  \"mocaScore\": 20,\n  \"adlStatus\": \"dependent\",\n  \"iadlStatus\": \"dependent\"\n}"
        },
        "url": {
          "raw": "http://localhost:8080/api/v1/diagnosis/step3",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "v1", "diagnosis", "step3"]
        }
      }
    }
  ]
}
```

---

## ✅ VALIDATION CHECKLIST

Run all 3 steps in order, check:

- [ ] **Step 1 Response** contains `sessionId` (save for Step 3)
- [ ] **Step 1 Response** shows `inferredClasses` with cognitive status
- [ ] **Step 2 Response** contains `atnProfile: "A+T+N+"` (all abnormal)
- [ ] **Step 2 Response** lists triggered SWRL rules like `AmyloidPositive_Elecsys`
- [ ] **Step 3 Response** contains `diagnosis: "Alzheimer's Disease Dementia"`
- [ ] **Step 3 Response** contains `diseaseStage: "Moderate"` (based on MMSE 22)
- [ ] **Step 3 Response** has `triggeredRules` with rule names and logic
- [ ] **Step 3 Response** has `recommendedActions` (pharmacological + non-pharma)
- [ ] **Step 3 Response** has `requiredTests` for follow-up
- [ ] All SWRL rules fire correctly via ontology reasoning

---

## 📝 INTERPRETATION

### Expected Flow:
1. **Step 1**: Detect cognitive dysfunction + risk factors → `PatientAtRisk`
2. **Step 2**: Confirm ATN+ pathology → `ADPathologyPresent`
3. **Step 3**: Diagnose AD + Stage → `ModerateStage` with recommendations

### Key SWRL Rules That Fire:
- `AmyloidPositive_Elecsys`: Detects A+ status
- `TauPositive_Elecsys`: Detects T+ status
- `S2_ModerateStage`: Classifies as Moderate (MMSE 10-21)
- `ModerateStageFollowUp`: Assigns 6-month follow-ups

### Staging Rules (MMSE-based):
- MMSE 24-30: Normal / Preclinical
- MMSE 18-23: Mild
- MMSE 10-17: Moderate
- MMSE < 10: Severe

