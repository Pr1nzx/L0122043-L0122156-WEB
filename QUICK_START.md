# Quick Start Guide - Updated Frontend

## What Changed?

The frontend has been **completely rebuilt** to match the latest backend (`main.py`) which uses a **single `/diagnose` endpoint** instead of separate step endpoints.

## Key Difference

| Aspect | Old | New |
|--------|-----|-----|
| API Calls | 3 endpoints (/step1, /step2, /step3) | 1 endpoint (/diagnose) |
| Data Flow | Step-by-step submission | Collect all → Submit once |
| Session Management | Session ID tracking | Stateless requests |
| Field Names | PascalCase | snake_case |

## Starting the Application

### Prerequisites
- Python 3.8+ (for backend)
- Node.js 20+ (for frontend)
- Backend running on port 8000

### Step 1: Start Backend
```bash
cd backend
python main.py
```
✅ Backend ready at: `http://localhost:8000`

### Step 2: Start Frontend  
```bash
cd frontend
npm install      # Only needed first time
npm run dev      # Starts development server
```
✅ Frontend ready at: `http://localhost:5173`

### Step 3: Open Browser
Visit: `http://localhost:5173`

## What to Test

### ✅ Test Workflow

1. **Step 1 - Clinical Assessment**
   - Enter Age: `72`
   - MMSE Score: `22`
   - MoCA Score: `20`
   - Behavior Changes: Select `Yes`
   - Independent: Select `No`
   - Click "Continue →"

2. **Step 2 - Imaging & Biomarkers**
   - Select at least one Imaging Method (e.g., "Elecsys")
   - Enter Biomarker A (Amyloid):
     - Aβ42/40 Ratio: `0.085` (positive when ≤0.091)
   - Enter Biomarker T (Tau):
     - P-Tau/Aβ42 Ratio: `0.025` (positive when >0.02)
   - Enter Biomarker N (Neurodegeneration):
     - T-Tau: `380` (positive when ≥355)
     - Hippocampal Vol: `5.5` (positive when <6.0)
   - Click "Analyze & Continue →"

3. **Step 3 - Diagnosis Results**
   - Backend processes data and returns:
     - Diagnoses (e.g., "Alzheimer's Disease Dementia")
     - Severity (e.g., "Moderate Condition")
     - Biomarker Status (e.g., "AmyloidPositive", "TauPositive")
     - Recommended Activities (e.g., "MusicTherapy", "CognitiveTraining")
   - Click "Continue to Treatment →"

4. **Step 4 - Treatment Plan**
   - Shows treatment recommendations
   - Click "Review Summary →"

5. **Summary Page**
   - View all collected data
   - View all diagnosis results
   - Option to edit any step
   - Click "Submit Assessment" to complete

## Field Mapping Reference

### Step 1 Fields → Backend Schema
```
Age                    → age
MMSE Score             → mmse_score
MoCA Score             → moca_score
Behavior Changes       → behavior_change
Independent (ADL/IADL) → is_independent
Other Diseases         → has_other_diseases
```

### Step 2 Fields → Backend Schema
```
Imaging Method         → imaging_method (array)
Aβ42/40 Ratio         → ab42_40_score
P-Tau/Aβ42 Ratio      → ptau_ab42_score
T-Tau                 → t_tau_score
Hippocampal Volume    → hippocampal_vol
FAQ Score             → faq_score (optional)
AD8 Score             → ad8_score (optional)
```

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Cannot connect to backend" | Backend not running | Start backend with `python main.py` |
| "CORS error" | API path mismatch | Verify backend at `localhost:8000` |
| "Analysis failed" | Imaging method not selected | Select at least one imaging method |
| "Form incomplete" | Missing required fields | Check all required fields are filled |
| Build errors | Old Node version | Upgrade to Node 20+ |

## Expected Behavior

✅ **After filling Step 2 and clicking "Analyze":**
- Frontend collects all data from Steps 1-2
- Sends single request to `POST /diagnose`
- Backend processes using Python logic
- Returns diagnosis results
- Step 3 displays formatted results

✅ **Results Include:**
- Primary diagnosis(es)
- Severity classification
- Biomarker status (A/T/N)
- Recommended activities/interventions

## File Structure Changes

```
frontend/src/
├── api.js                 ← NEW: sendDiagnoseData() function
├── DecisionFlow.jsx       ← UPDATED: Single-submission workflow
├── steps/
│   ├── Step1Detect.jsx    ← UPDATED: snake_case fields
│   ├── Step2Assess.jsx    ← UPDATED: ATN biomarkers
│   ├── Step3Diagnose.jsx  ← UPDATED: Results display
│   └── Step4Treat.jsx     ← Unchanged
```

## Testing with curl

```bash
# Test backend directly
curl -X POST http://localhost:8000/diagnose \
  -H "Content-Type: application/json" \
  -d '{
    "age": 72,
    "mmse_score": 22,
    "moca_score": 20,
    "ab42_40_score": 0.085,
    "ptau_ab42_score": 0.025,
    "t_tau_score": 380,
    "hippocampal_vol": 5.5,
    "imaging_method": ["Elecsys"],
    "behavior_change": true,
    "is_independent": false
  }'
```

## Build Status

✅ **No compilation errors**
- 86 modules successfully transformed
- Build completed in 1.86s
- Ready for testing

## Next Steps

1. ✅ Updated frontend with latest backend integration
2. ⏭️ Start backend server
3. ⏭️ Start frontend dev server
4. ⏭️ Test with sample data
5. ⏭️ Verify diagnosis results display correctly

---

**Questions or Issues?** Check `FRONTEND_UPDATES.md` for detailed documentation.
