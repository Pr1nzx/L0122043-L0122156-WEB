# Quick Start: Updated Frontend with Dark Mode ⚡

## What Changed?
- ✅ All form fields match new `main.py` schema
- ✅ API responses now handle diagnosis, risk, recommendations, biomarkers
- ✅ 100% dark mode support (light & dark themes)
- ✅ Build: Zero errors, ready to run

## Run It Now

### Backend
```bash
cd backend && python main.py
```
Expected: `Uvicorn running on http://0.0.0.0:8000`

### Frontend
```bash
cd frontend && npm run dev
```
Expected: `Local: http://localhost:5173`

## Test Data Example

**Step 1 - Clinical Assessment**
- Age: 72
- Family History: No
- MMSE Score: 22
- MoCA Score: 23
- Independent: Yes
- Behavioral Changes: No

**Step 2 - Imaging & Biomarkers**
- FAQ Score: (leave empty)
- Imaging Method: Check "Innotest"
- Aβ42: 500
- Aβ42/40: 0.063
- P-Tau181: 85
- P-Tau/Aβ42: 0.15
- T-Tau: 355
- Hippocampal Vol: 7.2

**Click "Get Diagnosis →"** → Results in Step 3

## Dark Mode Toggle

Add to your App.jsx:
```jsx
const [dark, setDark] = useState(false)
return (
  <div className={dark ? 'dark' : ''}>
    <button onClick={() => setDark(!dark)}>
      {dark ? '☀️' : '🌙'}
    </button>
  </div>
)
```

## Field Mapping Reference

| Backend | Frontend | Step |
|---------|----------|------|
| age | Age input | 1 |
| family_history | Family History radio | 1 |
| mmse_score | MMSE Score | 1 |
| moca_score | MoCA Score | 1 |
| faq_score | FAQ Score | 2 |
| is_independent | Independence radio | 1 |
| abeta42_score | Aβ42 input | 2 |
| abeta42_40_ratio | Aβ42/40 Ratio input | 2 |
| ptau181_score | P-Tau181 input | 2 |
| ptau_abeta_ratio | P-Tau/Aβ42 input | 2 |
| ttau_score | T-Tau input | 2 |
| adj_hippocampal_vol | Hippocampal Vol input | 2 |
| imaging_method | Checkboxes | 2 |
| has_behavior_change | Behavioral Changes radio | 1 |

## Files Updated

```
frontend/src/
├── api.js                  ✅ New schema mapping
├── DecisionFlow.jsx        ✅ Updated payload & response
└── steps/
    ├── Step1Detect.jsx     ✅ Dark mode + family_history
    ├── Step2Assess.jsx     ✅ Dark mode + new biomarkers
    ├── Step3Diagnose.jsx   ✅ New response format
    └── Step4Treat.jsx      ✅ Dark mode
```

## Build Status
```
✓ 86 modules transformed
✓ built in 1.73s
✅ No errors
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API fails to respond | Check backend: `lsof -i :8000` |
| Build errors | `npm install && npm run build` |
| Dark mode not visible | Check `tailwind.config.js` has `darkMode: 'class'` |
| Fields not sending | Check console (F12): should show `📤 DIAGNOSIS PAYLOAD` |
| CORS error | Ensure backend has CORSMiddleware |

## Browser Console Logs

When you submit Step 2:
```
🔵 DIAGNOSIS: Preparing request with all data...
📤 DIAGNOSE REQUEST - Sending data to backend: {...}
✅ DIAGNOSE RESPONSE - Received from backend: {...}
```

Check these logs to debug!

---

**Status**: 🟢 Ready to Test  
**Version**: 1.2.0  
**Last Updated**: Dec 23, 2025
