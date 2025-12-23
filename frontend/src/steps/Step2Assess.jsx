"use client"

export default function Step2Assess({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  // Safe number parsing - handle empty values and decimals properly
  const safeParseFloat = (value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined
    }
    const num = parseFloat(value)
    return isNaN(num) ? undefined : num
  }

  const handleImagingMethodToggle = (method) => {
    const currentMethods = data.imaging_method || []
    const newMethods = currentMethods.includes(method)
      ? currentMethods.filter(m => m !== method)
      : [...currentMethods, method]
    handleChange("imaging_method", newMethods)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Imaging & Biomarker Assessment
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Neuroimaging analysis and CSF/plasma biomarkers
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Additional Cognitive Scores (Optional) */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Additional Cognitive Assessments (Optional)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                FAQ Score (0-30)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={data.faq_score || ""}
                onChange={(e) => handleChange("faq_score", parseInt(e.target.value) || null)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 12"
              />
              <p className="text-xs text-gray-500 mt-1">Functional Activities Questionnaire</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                AD8 Score (0-8)
              </label>
              <input
                type="number"
                min="0"
                max="8"
                value={data.ad8_score || ""}
                onChange={(e) => handleChange("ad8_score", parseInt(e.target.value) || null)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 4"
              />
              <p className="text-xs text-gray-500 mt-1">AD8 Dementia Screening</p>
            </div>
          </div>
        </div>

        {/* Imaging/Biomarker Method Selection */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Imaging/Biomarker Test Method *
          </h3>
          
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={(data.imaging_method || []).includes("Elecsys")}
                onChange={() => handleImagingMethodToggle("Elecsys")}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="ml-2 text-sm sm:text-base">Elecsys (CSF immunoassay)</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={(data.imaging_method || []).includes("Innotest")}
                onChange={() => handleImagingMethodToggle("Innotest")}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="ml-2 text-sm sm:text-base">Innotest (ELISA-based CSF)</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={(data.imaging_method || []).includes("Lumipulse")}
                onChange={() => handleImagingMethodToggle("Lumipulse")}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="ml-2 text-sm sm:text-base">Lumipulse (CSF automated)</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={(data.imaging_method || []).includes("MRI")}
                onChange={() => handleImagingMethodToggle("MRI")}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="ml-2 text-sm sm:text-base">MRI (volumetric analysis)</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={(data.imaging_method || []).includes("Blood")}
                onChange={() => handleImagingMethodToggle("Blood")}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="ml-2 text-sm sm:text-base">Blood-based biomarkers (Plasma)</span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2 italic">Select at least one method</p>
        </div>

        {/* CSF/Plasma Biomarkers - Amyloid (A) */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Biomarker A: Amyloid-Beta
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Aβ42/40 Ratio
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={data.ab42_40_score || ""}
                onChange={(e) => handleChange("ab42_40_score", safeParseFloat(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 0.091"
              />
              <p className="text-xs text-gray-500 mt-1">Elecsys method threshold: ≤0.091</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Aβ42 (pg/mL)
              </label>
              <input
                type="number"
                min="0"
                value={data.ab42_score || ""}
                onChange={(e) => handleChange("ab42_score", parseInt(e.target.value) || null)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 500"
              />
              <p className="text-xs text-gray-500 mt-1">Innotest method threshold: &lt;550</p>
            </div>
          </div>
        </div>

        {/* Biomarkers - Tau (T) */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Biomarker T: Phosphorylated Tau
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                P-Tau/Aβ42 Ratio
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={data.ptau_ab42_score || ""}
                onChange={(e) => handleChange("ptau_ab42_score", safeParseFloat(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 0.02"
              />
              <p className="text-xs text-gray-500 mt-1">Elecsys method threshold: &gt;0.02</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                P-Tau181 (pg/mL)
              </label>
              <input
                type="number"
                min="0"
                value={data.ptau181_score || ""}
                onChange={(e) => handleChange("ptau181_score", parseInt(e.target.value) || null)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 60"
              />
              <p className="text-xs text-gray-500 mt-1">Innotest method threshold: &gt;60</p>
            </div>
          </div>
        </div>

        {/* Biomarkers - Neurodegeneration (N) */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Biomarker N: Neurodegeneration
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                T-Tau (pg/mL)
              </label>
              <input
                type="number"
                min="0"
                value={data.t_tau_score || ""}
                onChange={(e) => handleChange("t_tau_score", parseInt(e.target.value) || null)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 355"
              />
              <p className="text-xs text-gray-500 mt-1">Innotest threshold: ≥355</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Hippocampal Volume (mm³ adjusted)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={data.hippocampal_vol || ""}
                onChange={(e) => handleChange("hippocampal_vol", safeParseFloat(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 5.5"
              />
              <p className="text-xs text-gray-500 mt-1">Threshold: &lt;6.0 (normalized)</p>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 italic">
          * Required fields
        </p>
      </div>
    </div>
  )
}
