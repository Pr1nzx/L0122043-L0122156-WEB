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

  // Auto-calculate hippocampal volume from left/right volumes and ICV
  const calculateHippocampalVolume = (hippoLeft, hippoRight, icv) => {
    if (hippoLeft && hippoRight && icv && icv > 0) {
      const left = parseFloat(hippoLeft)
      const right = parseFloat(hippoRight)
      const volume = parseFloat(icv)
      const totalHippo = left + right
      // Formula: (L + R) / ICV * 1000
      const adjustedVolume = (totalHippo / volume) * 1000
      return parseFloat(adjustedVolume.toFixed(2))
    }
    return null
  }

  const handleHippocampalInput = (field, value) => {
    const numValue = safeParseFloat(value)
    const updates = { [field]: numValue }
    
    // Update the field first
    const newHippoLeft = field === 'hippoLeft' ? numValue : data.hippoLeft
    const newHippoRight = field === 'hippoRight' ? numValue : data.hippoRight
    const newIcv = field === 'icv' ? numValue : data.icv
    
    // Calculate adjusted volume
    const adjustedVolume = calculateHippocampalVolume(newHippoLeft, newHippoRight, newIcv)
    if (adjustedVolume !== null) {
      updates.hippocampalVolume = adjustedVolume
      console.log(`📊 Hippo calculation: (${newHippoLeft} + ${newHippoRight}) / ${newIcv} * 1000 = ${adjustedVolume}`)
    }
    
    onChange(updates)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Brain Imaging & Biomarker Assessment
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Neuroimaging analysis and CSF/plasma biomarkers
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Additional Cognitive Scores (Optional) */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Additional Cognitive Tests (Optional)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                FAQ Score (0-30)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={data.faqScore || ""}
                onChange={(e) => handleChange("faqScore", parseInt(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 12"
              />
              <p className="text-xs text-gray-500 mt-1">Functional Activities Questionnaire</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                AD8 Score (0-8)
              </label>
              <input
                type="number"
                min="0"
                max="8"
                value={data.ad8Score || ""}
                onChange={(e) => handleChange("ad8Score", parseInt(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 4"
              />
              <p className="text-xs text-gray-500 mt-1">AD8 Dementia Screening Interview</p>
            </div>
          </div>
        </div>

        {/* Brain Imaging Analysis */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Brain Imaging Analysis *
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Imaging/Biomarker Test Type *
              </label>
              <select
                value={data.brainImagingType || ""}
                onChange={(e) => handleChange("brainImagingType", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select imaging type</option>
                <option value="Elecsys">Elecsys (CSF immunoassay)</option>
                <option value="Innotest">Innotest (ELISA-based CSF)</option>
                <option value="Lumipulse">Lumipulse (CSF automated)</option>
                <option value="MRIFreesurfer">MRI Freesurfer (volumetric analysis)</option>
                <option value="PlasmaSimoa">Plasma Simoa (blood-based)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                MTA Score (Medial Temporal Atrophy, 0-4)
              </label>
              <input
                type="number"
                min="0"
                max="4"
                value={data.mtaScore || ""}
                onChange={(e) => handleChange("mtaScore", parseInt(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2"
              />
              <p className="text-xs text-gray-500 mt-1">Visual rating scale for hippocampal atrophy</p>
            </div>
          </div>
        </div>

        {/* CSF/Plasma Biomarkers */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            CSF/Plasma Biomarkers
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Aβ42 (pg/mL)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={data.abeta42Score || ""}
                onChange={(e) => handleChange("abeta42Score", safeParseFloat(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                P-Tau181 (pg/mL)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={data.pTau181Score || ""}
                onChange={(e) => handleChange("pTau181Score", safeParseFloat(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                T-Tau (pg/mL)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={data.tTau || ""}
                onChange={(e) => handleChange("tTau", safeParseFloat(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Aβ42/40 Ratio
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={data.abeta4240Ratio || ""}
                onChange={(e) => handleChange("abeta4240Ratio", safeParseFloat(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 0.05"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                P-Tau/Aβ42 Ratio
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={data.pTauAbeta42Ratio || ""}
                onChange={(e) => handleChange("pTauAbeta42Ratio", safeParseFloat(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 0.03"
              />
            </div>
          </div>
        </div>

        {/* Hippocampal Volume Calculation */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Hippocampal Volume (for N marker calculation)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Left Hippo (mm³)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={data.hippoLeft || ""}
                onChange={(e) => handleHippocampalInput("hippoLeft", safeParseFloat(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 1200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Right Hippo (mm³)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={data.hippoRight || ""}
                onChange={(e) => handleHippocampalInput("hippoRight", safeParseFloat(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 1300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                ICV (mm³)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={data.icv || ""}
                onChange={(e) => handleHippocampalInput("icv", safeParseFloat(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 1500000"
              />
              <p className="text-xs text-gray-500 mt-1">Intracranial Volume</p>
            </div>
          </div>

          {data.hippocampalVolume && (
            <div className="mt-3 p-3 bg-white border-2 border-yellow-400 rounded-lg">
              <p className="text-sm font-semibold text-gray-700">
                Adjusted Hippocampal Volume: <span className="text-yellow-700">{data.hippocampalVolume}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                = (Left + Right) / ICV × 1000
              </p>
            </div>
          )}
        </div>

        {/* Rule-out Diseases */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Rule-out Diseases *
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Have rule-out diseases been assessed? *
              </label>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="hasRuleOutDiseases"
                    checked={data.hasRuleOutDiseases === true}
                    onChange={() => handleChange("hasRuleOutDiseases", true)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm sm:text-base">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="hasRuleOutDiseases"
                    checked={data.hasRuleOutDiseases === false}
                    onChange={() => handleChange("hasRuleOutDiseases", false)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm sm:text-base">No</span>
                </label>
              </div>
            </div>

            {data.hasRuleOutDiseases && (
              <div className="space-y-2 pl-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.hasVitaminB12Deficiency || false}
                    onChange={(e) => handleChange("hasVitaminB12Deficiency", e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="ml-2 text-sm sm:text-base">Vitamin B12 Deficiency</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.hasHypothyroidism || false}
                    onChange={(e) => handleChange("hasHypothyroidism", e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="ml-2 text-sm sm:text-base">Hypothyroidism</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.hasUncontrolledDiabetes || false}
                    onChange={(e) => handleChange("hasUncontrolledDiabetes", e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="ml-2 text-sm sm:text-base">Uncontrolled Diabetes</span>
                </label>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 italic">
          * Required fields
        </p>
      </div>
    </div>
  )
}
