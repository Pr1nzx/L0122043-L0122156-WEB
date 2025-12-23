"use client"

export default function Step3Diagnose({ data, onChange, step2Data }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  // Auto-calculate hippocampal ratio from Step 2 data
  const calculateRatio = () => {
    if (!step2Data) return "N/A"
    
    const left = parseFloat(step2Data.hippoLeft) || 0
    const right = parseFloat(step2Data.hippoRight) || 0
    const icv = parseFloat(step2Data.icv) || 0
    
    if (icv === 0) return "0.0000"
    
    const totalHippo = left + right
    const ratio = (totalHippo / icv) * 100
    return ratio.toFixed(4)
  }

  const hippoRatio = calculateRatio()

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          ATN Biomarker Framework
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Complete biomarker analysis for dementia classification
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {/* A - Amyloid */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <span className="bg-purple-600 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm">
              A
            </span>
            Amyloid Beta (Aβ) Pathology
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  CSF Aβ42 Level (pg/mL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={data.amyloidCSF || ""}
                  onChange={(e) => handleChange("amyloidCSF", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="pg/mL"
                />
                <p className="text-xs text-gray-500 mt-1">
                  A+ (positive): &lt; 550 pg/mL<br/>
                  A- (negative): &gt; 550 pg/mL
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Platform/Method
                </label>
                <select
                  value={data.amyloidMethod || ""}
                  onChange={(e) => handleChange("amyloidMethod", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select method</option>
                  <option value="elecsys">Elecsys</option>
                  <option value="lumipulse">Lumipulse</option>
                  <option value="innotest">INNOTEST</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Amyloid PET (if available)
              </label>
              <select
                value={data.amyloidPET || ""}
                onChange={(e) => handleChange("amyloidPET", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Not performed</option>
                <option value="negative">Negative (no amyloid)</option>
                <option value="positive">Positive (amyloid present)</option>
              </select>
            </div>
          </div>
        </div>

        {/* T - Tau */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <span className="bg-orange-600 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm">
              T
            </span>
            Tau Pathology
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                CSF Total Tau (pg/mL)
              </label>
              <input
                type="number"
                step="0.1"
                value={data.tauCSF || ""}
                onChange={(e) => handleChange("tauCSF", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="pg/mL"
              />
              <p className="text-xs text-gray-500 mt-1">
                Normal: &lt; 300 pg/mL
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                CSF p-Tau181 (pg/mL)
              </label>
              <input
                type="number"
                step="0.1"
                value={data.ptauCSF || ""}
                onChange={(e) => handleChange("ptauCSF", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="pg/mL"
              />
              <p className="text-xs text-gray-500 mt-1">
                T+ (positive): &gt; 60 pg/mL<br/>
                T- (negative): &lt; 60 pg/mL
              </p>
            </div>
          </div>
        </div>

        {/* N - Neurodegeneration (dari Step 2) */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <span className="bg-green-600 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm">
              N
            </span>
            Neurodegeneration (from Brain Imaging)
          </h3>
          
          {step2Data && step2Data.hippoLeft && step2Data.hippoRight && step2Data.icv ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
                <div className="p-2 bg-white rounded border border-green-200">
                  <div className="text-gray-500 text-xs">Left Hippo</div>
                  <div className="font-semibold">{step2Data.hippoLeft} mm³</div>
                </div>
                <div className="p-2 bg-white rounded border border-green-200">
                  <div className="text-gray-500 text-xs">Right Hippo</div>
                  <div className="font-semibold">{step2Data.hippoRight} mm³</div>
                </div>
                <div className="p-2 bg-white rounded border border-green-200">
                  <div className="text-gray-500 text-xs">ICV</div>
                  <div className="font-semibold">{step2Data.icv} mm³</div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border-2 border-green-400">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Normalized Hippocampal Ratio:
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-green-700">
                    {hippoRatio}%
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-green-200 text-xs text-gray-600">
                  <div>Formula: (Left + Right) / ICV × 100%</div>
                  <div className="mt-1">
                    N+ (positive): Ratio &lt; 0.45%<br/>
                    N- (negative): Ratio &gt; 0.45%
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ No hippocampal volume data from Step 2. Please complete Brain Imaging step first.
              </p>
            </div>
          )}
        </div>

        {/* Clinical Interpretation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Clinical Interpretation & Notes
          </label>
          <textarea
            value={data.clinicalNotes || ""}
            onChange={(e) => handleChange("clinicalNotes", e.target.value)}
            rows={4}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Additional clinical observations and interpretation..."
          />
        </div>

        {/* ATN Profile Summary */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Expected ATN Classification Output:
          </h4>
          <div className="space-y-1 text-xs sm:text-sm text-gray-700">
            <div>• A+T+N+ → Alzheimer's Disease</div>
            <div>• A+T-N- → Preclinical AD</div>
            <div>• A-T+N+ → Suspected Non-AD Pathology</div>
            <div>• A-T-N+ → Non-AD Neurodegeneration</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Backend will process this data using SPARQL queries to Apache Jena reasoner
          </p>
        </div>
      </div>
    </div>
  )
}