# Frontend Updates for Latest Backend (main.py)

## Overview
The frontend has been completely refactored to match the latest backend implementation using a **single `/diagnose` endpoint** instead of the previous multi-step architecture (`/step1`, `/step2`, `/step3`).

## Key Changes

### 1. **API Layer** (`src/api.js`)
**Changed from:**
- `sendStep1Data()`, `sendStep2Data()`, `sendStep3Data()` - Three separate endpoint calls

**Changed to:**
- `sendDiagnoseData()` - Single unified endpoint call
- API Base URL: `http://localhost:8000` (changed from `http://localhost:8080/api/v1/diagnosis`)
- All patient data collected across all steps is sent to the `/diagnose` endpoint in one request
- Response includes: `diagnosis`, `severity`, `clinical_status`, `recommended_actions`, `recommended_activities`

### 2. **Decision Flow** (`src/DecisionFlow.jsx`)
**Architecture Change:**
- **Old**: Multi-step submissions (Step 1 → Step 2 → Step 3 → Step 4)
- **New**: Collect data in Steps 1-2, send all data at Step 3 for single diagnosis call

**Workflow:**
```
Step 1: Clinical Assessment (collect data)
   ↓
Step 2: Imaging & Biomarkers (collect data)
   ↓
Step 3: Diagnosis (submit all collected data → display results)
   ↓
Step 4: Treatment Plan (view recommendations)
```

**Removed:** Session ID concept (no longer needed with single endpoint)

### 3. **Step 1 - Clinical Assessment** (`src/steps/Step1Detect.jsx`)
**Field Mapping (Old → New):**
- Removed: `patientId` (not required by backend)
- Removed: `hasFamilyHistory`, `familyMemberDiagnosis`
- Removed: `hasSubjectiveComplaints`
- Removed: `isIndependentADL`, `isIndependentIADL` (combined into single field)
- Removed: `mocaScore` → `moca_score`
- Removed: `mmseScore` → `mmse_score`

**New Fields:**
- `age` (number)
- `has_other_diseases` (boolean)
- `mmse_score` (number)
- `moca_score` (number)
- `behavior_change` (boolean) - replaces `hasBehaviorChanges`
- `is_independent` (boolean) - combined ADL/IADL assessment

### 4. **Step 2 - Imaging & Biomarkers** (`src/steps/Step2Assess.jsx`)
**Major Restructure - Now matches PatientData schema:**

**Biomarker A (Amyloid-Beta):**
- `ab42_40_score` - Aβ42/40 ratio (threshold: ≤0.091 for positive)
- `ab42_score` - Aβ42 level (threshold: <550 for positive)

**Biomarker T (Phosphorylated Tau):**
- `ptau_ab42_score` - P-Tau/Aβ42 ratio (threshold: >0.02 for positive)
- `ptau181_score` - P-Tau181 level (threshold: >60 for positive)

**Biomarker N (Neurodegeneration):**
- `t_tau_score` - Total Tau (threshold: ≥355 for positive)
- `hippocampal_vol` - Adjusted hippocampal volume (threshold: <6.0 for positive)

**Imaging Method Selection:**
- `imaging_method` (array) - Supports multiple selection:
  - "Elecsys" (CSF immunoassay)
  - "Innotest" (ELISA-based CSF)
  - "Lumipulse" (CSF automated)
  - "MRI" (volumetric analysis)
  - "Blood" (plasma biomarkers)

**Optional Fields:**
- `faq_score` - Functional Activities Questionnaire
- `ad8_score` - AD8 Dementia Screening

**Removed:**
- `brainImagingType` (dropdown) → `imaging_method` (multi-select checkbox)
- `mtaScore`
- `abeta4240Ratio`, `pTauAbeta42Ratio` (now direct values)
- `hippoLeft`, `hippoRight`, `icv` (auto-calculation)
- `mriFindings`
- `hasRuleOutDiseases` and related checkboxes

### 5. **Step 3 - Diagnosis Results** (`src/steps/Step3Diagnose.jsx`)
**Complete Redesign:**
- Now displays backend diagnosis results instead of collecting input
- Shows:
  - **Primary Diagnosis** - List of diagnoses (e.g., "Alzheimer's Disease Dementia", "Mild Cognitive Impairment")
  - **Severity Level** - Cognitive severity (e.g., "Mild Condition", "Moderate Condition")
  - **Clinical Status** - ATN biomarker status (e.g., "AmyloidPositive", "TauPositive")
  - **Recommended Activities** - Evidence-based interventions (e.g., "CognitiveTraining", "MusicTherapy")
  - **Clinical Recommendations** - Action items for clinician

### 6. **Backend Integration**

**PatientData Schema (Expected by `/diagnose` endpoint):**
```python
{
  "age": int,
  "has_other_diseases": bool,
  "mmse_score": int,
  "moca_score": int,
  "faq_score": int,
  "ad8_score": int,
  "ab42_40_score": float,
  "ab42_score": int,
  "ptau_ab42_score": float,
  "ptau181_score": int,
  "t_tau_score": int,
  "hippocampal_vol": float,
  "imaging_method": ["Elecsys"|"Innotest"|"Lumipulse"|"MRI"|"Blood"],
  "behavior_change": bool,
  "is_independent": bool
}
```

**Response Schema:**
```python
{
  "diagnosis": ["AD Dementia", ...],
  "severity": ["Moderate Condition"],
  "clinical_status": ["AmyloidPositive", "TauPositive"],
  "recommended_actions": ["..."],
  "recommended_activities": ["CognitiveTraining", ...]
}
```

## Testing Checklist

- [x] Frontend builds successfully (no compilation errors)
- [ ] Backend running on `http://localhost:8000`
- [ ] Step 1 data collection works
- [ ] Step 2 data collection works
- [ ] Step 3 diagnosis call succeeds
- [ ] Diagnosis results display correctly
- [ ] Step 4 Treatment Plan shows recommendations
- [ ] Summary page displays all collected data and results

## How to Test

1. **Start Backend:**
```bash
cd backend
python main.py
```

2. **Start Frontend:**
```bash
cd frontend
npm run dev
```

3. **Access Application:**
Open `http://localhost:5173` (Vite dev server default)

4. **Sample Data Entry:**
- Step 1:
  - Age: 72
  - MMSE: 22
  - MoCA: 20
  - Behavior Change: Yes
  - Independent: No

- Step 2:
  - Imaging Method: Select "Elecsys" or "Innotest"
  - Aβ42/40: 0.085 (positive)
  - P-Tau/Aβ42: 0.025 (positive)
  - T-Tau: 380 (positive)
  - Hippocampal Vol: 5.5 (positive)

5. **Analyze:**
   - Click "Continue" to move through steps
   - Click "Analyze & Continue" at Step 3 to trigger diagnosis

## Important Notes

1. **Removed Session Management** - Each request to `/diagnose` is stateless
2. **Null Values** - Optional fields can be `null` if not provided
3. **Boolean Fields** - Must be properly set (not undefined) for logic validation
4. **Imaging Method** - At least one method should be selected
5. **Thresholds** - Backend uses fixed thresholds for biomarker classification (see main.py logic)

## Dependencies

- React 18+
- Axios (for API calls)
- Tailwind CSS (for styling)
- Vite (for build tool)

## Future Improvements

- Add patient ID/tracking
- Save assessment history
- Export reports
- Multi-language support
- Real-time validation feedback
