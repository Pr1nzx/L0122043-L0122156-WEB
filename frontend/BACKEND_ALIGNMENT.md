# Frontend Updated to Match New Backend Architecture ✅

## Summary of Changes

Your frontend has been completely refactored to align with your new `main.py` backend. All field mappings, response handlers, and UI components now support dark mode.

---

## 1. BACKEND SCHEMA CHANGES → FRONTEND UPDATES

### PatientData Schema (Backend → Frontend)

| Backend Field | Frontend Form | Type | Notes |
|---------------|---------------|------|-------|
| `age` | Step1: Age input | int | Years (0-120) |
| `family_history` | Step1: Family History radio | bool | New field |
| `mmse_score` | Step1: MMSE Score | int | 0-30 |
| `moca_score` | Step1: MoCA Score | int | 0-30 |
| `faq_score` | Step2: FAQ Score | int | Functional Activities (0-30) |
| `is_independent` | Step1: Independence radio | bool | Optional manual override |
| `abeta42_score` | Step2: Aβ42 | float | New name (was ab42_score) |
| `abeta42_40_ratio` | Step2: Aβ42/40 Ratio | float | New name |
| `ptau181_score` | Step2: P-Tau181 | float | New name (was ptau181_score) |
| `ptau_abeta_ratio` | Step2: P-Tau/Aβ42 | float | New name (was ptau_ab42_score) |
| `ttau_score` | Step2: T-Tau | float | New name (was t_tau_score) |
| `adj_hippocampal_vol` | Step2: Hippocampal Vol | float | New name (was hippocampal_vol) |
| `imaging_method` | Step2: Checkboxes | list[str] | Elecsys, Innotest, Lumipulse, MRI, Blood |
| `has_behavior_change` | Step1: Behavioral Changes | bool | New name (was behavior_change) |

### Response Schema (Backend → Frontend)

```javascript
{
  "diagnosis": [...],      // Array of diagnosis strings
  "risk": [...],           // Risk assessment array
  "recommendations": [...],// Clinical recommendations
  "biomarkers": [...]      // Biomarker status array
}
```

---

## 2. FILE STRUCTURE & DARK MODE

All components now have **full dark mode support** using Tailwind's `dark:` prefix:

### Updated Files:
- ✅ `src/api.js` - New field mappings in sendDiagnoseData()
- ✅ `src/DecisionFlow.jsx` - Updated payload structure & response handling
- ✅ `src/steps/Step1Detect.jsx` - New family_history field, dark mode
- ✅ `src/steps/Step2Assess.jsx` - New biomarker field names, dark mode
- ✅ `src/steps/Step3Diagnose.jsx` - New response format (diagnosis, risk, recommendations, biomarkers)
- ✅ `src/steps/Step4Treat.jsx` - Dark mode support

---

## 3. NEW DARK MODE SUPPORT

### How to Add Dark Mode Toggle

Add this to your `App.jsx` or main component:

```jsx
import { useState } from 'react'

export default function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={darkMode ? 'dark' : ''}>
      {/* Your app content */}
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
    </div>
  )
}
```

### Tailwind Config

Ensure your `tailwind.config.js` has:

```javascript
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  // ... rest of config
}
```

### Color Scheme:
- **Light Mode**: bg-blue-50, bg-green-50, bg-red-50, etc.
- **Dark Mode**: dark:bg-gray-800, dark:text-white, dark:border-gray-700

---

## 4. WORKFLOW: STEP BY STEP

### Step 1: Clinical Assessment
- **Age** (required): 0-120 years
- **Family History** (required): Yes/No
- **MMSE Score** (required): 0-30
- **MoCA Score** (optional): 0-30
- **Independence** (optional): Yes/No
- **Behavioral Changes** (optional): Yes/No

### Step 2: Imaging & Biomarkers
- **FAQ Score** (optional): 0-30
- **Imaging Method** (required): Select at least one
  - Elecsys
  - Innotest
  - Lumipulse
  - MRI
  - Blood
- **Aβ42 & Aβ42/40 Ratio** (optional)
- **P-Tau181 & P-Tau/Aβ42 Ratio** (optional)
- **T-Tau & Hippocampal Volume** (optional)

### Step 3: Diagnosis Results
- **Diagnosis**: Primary diagnosis from backend
- **Risk**: Risk assessment results
- **Biomarkers**: ATN biomarker status
- **Recommendations**: Clinical recommendations

### Step 4: Treatment Plan
- **Medication Plan**: Pharmacological recommendations
- **Therapy & Activities**: Non-pharmacological interventions
- **Follow-up**: Follow-up schedule

---

## 5. API ENDPOINT INTEGRATION

**Endpoint**: `POST http://localhost:8000/diagnose`

**Request Payload** (from Step1 & Step2):
```json
{
  "age": 72,
  "family_history": false,
  "mmse_score": 22,
  "moca_score": 23,
  "faq_score": null,
  "is_independent": true,
  "abeta42_score": 500,
  "abeta42_40_ratio": 0.063,
  "ptau181_score": 85,
  "ptau_abeta_ratio": 0.15,
  "ttau_score": 355,
  "adj_hippocampal_vol": 7.2,
  "imaging_method": ["Innotest", "MRI"],
  "has_behavior_change": false
}
```

**Response** (handled in Step3):
```json
{
  "diagnosis": ["Alzheimer's Continuum"],
  "risk": ["HighRisk"],
  "recommendations": ["CognitiveTraining", "PhysicalExercise"],
  "biomarkers": ["AmyloidPositive", "NeurodegenerationPositive"]
}
```

---

## 6. TESTING INSTRUCTIONS

### 1. Start Backend
```bash
cd backend
python main.py
# Should output: Uvicorn running on http://0.0.0.0:8000
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
# Should output: VITE v7.3.0  Local:   http://localhost:5173/
```

### 3. Test the Flow
1. Navigate to http://localhost:5173
2. **Step 1**: Fill in age (e.g., 72), family history (No), MMSE (22), MoCA (23)
3. Click **"Continue →"**
4. **Step 2**: Select imaging method (e.g., Innotest), fill biomarkers
5. Click **"Get Diagnosis →"** (API call happens here)
6. **Step 3**: View diagnosis results
7. Click **"Continue to Treatment →"**
8. **Step 4**: Review/enter treatment recommendations
9. Click **"Review Summary →"** to see full assessment

### 4. Check Dark Mode
- Open browser DevTools
- Toggle dark mode on system (usually Ctrl+Shift+D on Linux)
- Or add dark mode toggle button to UI

---

## 7. BUILD STATUS

✅ **Build Successful**
```
✓ 86 modules transformed
✓ built in 1.73s
No errors or warnings
```

---

## 8. KEY DIFFERENCES FROM OLD VERSION

| Old | New | Reason |
|-----|-----|--------|
| `has_other_diseases` | `family_history` | Aligned with ontology risk assessment |
| `behavior_change` | `has_behavior_change` | Consistent naming convention |
| `ab42_score` | `abeta42_score` | Clearer field naming |
| `ab42_40_score` | `abeta42_40_ratio` | Better semantics |
| `ptau_ab42_score` | `ptau_abeta_ratio` | Consistent naming |
| `t_tau_score` | `ttau_score` | Unified field naming |
| `hippocampal_vol` | `adj_hippocampal_vol` | Specify it's adjusted for ICV |
| Response: 5 fields | Response: 4 fields | Cleaner result structure |
| No dark mode | Full dark mode | Better UX |

---

## 9. TROUBLESHOOTING

**Build fails?**
```bash
rm -rf node_modules dist
npm install
npm run build
```

**API call fails?**
- Check backend is running: `lsof -i :8000`
- Check CORS is enabled in main.py
- Check network tab in DevTools (F12)

**Fields not sending?**
- Verify field names match schema in DecisionFlow.jsx
- Check console (F12) for `📤 DIAGNOSIS PAYLOAD` logs
- Ensure form is marked as complete before submit

**Dark mode not working?**
- Check `tailwind.config.js` has `darkMode: 'class'`
- Verify dark: classes are in JSX files
- Clear cache: `npm run build`

---

## 10. NEXT STEPS

1. ✅ Frontend fully integrated with new backend
2. ✅ All field mappings corrected
3. ✅ Dark mode support added
4. ✅ Build verified (zero errors)
5. 🔄 **Next**: Test complete flow with backend running
6. 🔄 **Then**: Fine-tune ontology logic and recommendations
7. 🔄 **Finally**: Deploy and gather feedback

---

**Status**: 🟢 READY FOR TESTING  
**Last Updated**: December 23, 2025  
**Build Version**: v1.2.0 (Backend-aligned)
