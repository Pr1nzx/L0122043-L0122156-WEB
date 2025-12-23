"use client"

export default function Step2Assess({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  const safeParseFloat = (value) => {
    if (value === '' || value === null || value === undefined) return undefined
    const num = parseFloat(value)
    return isNaN(num) ? undefined : num
  }

  const handleNumberInput = (field, value) => {
    // Allow empty values
    if (value === '') {
      handleChange(field, undefined)
      return
    }
    // Allow decimal numbers including those starting with 0 (0.091, 0.01, etc)
    const parsed = safeParseFloat(value)
    if (parsed !== undefined) {
      handleChange(field, parsed)
    }
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
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold dark:text-white text-gray-900">
          Imaging & Biomarker Assessment
        </h2>
        <p className="text-sm sm:text-base dark:text-gray-400 text-gray-600 mt-1">
          Neuroimaging analysis and CSF/plasma biomarkers
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="dark:bg-gray-800 dark:border-gray-700 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold dark:text-white text-gray-900 mb-3 sm:mb-4">FAQ Score (Optional)</h3>
          <div>
            <label className="block text-sm font-medium dark:text-gray-200 text-gray-900 mb-1.5">Score (0-30)</label>
            <input type="number" min="0" max="30" value={data.faq_score || ""} onChange={(e) => handleChange("faq_score", safeParseFloat(e.target.value))} className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., 12" />
            <p className="text-xs dark:text-gray-400 text-gray-500 mt-1">Functional Activities Questionnaire (ADL assessment)</p>
          </div>
        </div>

        <div className="dark:bg-gray-800 dark:border-gray-700 bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold dark:text-white text-gray-900 mb-3 sm:mb-4">Imaging Method *</h3>
          <p className="text-xs dark:text-gray-400 text-gray-500 mb-3">Select at least one imaging modality used</p>
          <div className="space-y-2">
            {["Elecsys", "Innotest", "Lumipulse", "MRI", "Blood"].map(method => (
              <label key={method} className="flex items-center cursor-pointer">
                <input type="checkbox" checked={(data.imaging_method || []).includes(method)} onChange={() => handleImagingMethodToggle(method)} className="w-4 h-4 text-blue-600" />
                <span className="ml-2 text-sm dark:text-gray-300">{method}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="dark:bg-gray-800 dark:border-gray-700 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold dark:text-white text-gray-900 mb-3 sm:mb-4">Amyloid-Beta</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium dark:text-gray-200 text-gray-900 mb-1">Aβ42 (pg/mL)</label>
              <input type="text" value={data.abeta42_score || ""} onChange={(e) => handleNumberInput("abeta42_score", e.target.value)} className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., 500" />
              <p className="text-xs dark:text-gray-400 text-gray-500 mt-1">Amyloid-Beta 42 concentration</p>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-200 text-gray-900 mb-1">Aβ42/40 Ratio</label>
              <input type="text" value={data.abeta42_40_ratio || ""} onChange={(e) => handleNumberInput("abeta42_40_ratio", e.target.value)} className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., 0.063" />
              <p className="text-xs dark:text-gray-400 text-gray-500 mt-1">Aβ42/40 ratio (accepts 0.xxx)</p>
            </div>
          </div>
        </div>

        <div className="dark:bg-gray-800 dark:border-gray-700 bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold dark:text-white text-gray-900 mb-3 sm:mb-4">Tau Biomarkers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium dark:text-gray-200 text-gray-900 mb-1">P-Tau181 (pg/mL)</label>
              <input type="text" value={data.ptau181_score || ""} onChange={(e) => handleNumberInput("ptau181_score", e.target.value)} className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., 85" />
              <p className="text-xs dark:text-gray-400 text-gray-500 mt-1">Phosphorylated tau 181</p>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-200 text-gray-900 mb-1">P-Tau/Aβ42 Ratio</label>
              <input type="text" value={data.ptau_abeta_ratio || ""} onChange={(e) => handleNumberInput("ptau_abeta_ratio", e.target.value)} className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., 0.15" />
              <p className="text-xs dark:text-gray-400 text-gray-500 mt-1">p-tau/Aβ42 ratio (accepts 0.xxx)</p>
            </div>
          </div>
        </div>

        <div className="dark:bg-gray-800 dark:border-gray-700 bg-cyan-50 border border-cyan-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold dark:text-white text-gray-900 mb-3 sm:mb-4">Neurodegeneration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium dark:text-gray-200 text-gray-900 mb-1">T-Tau (pg/mL)</label>
              <input type="text" value={data.ttau_score || ""} onChange={(e) => handleNumberInput("ttau_score", e.target.value)} className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., 355" />
              <p className="text-xs dark:text-gray-400 text-gray-500 mt-1">Total tau protein</p>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-200 text-gray-900 mb-1">Hippocampal Vol (mm³)</label>
              <input type="text" value={data.adj_hippocampal_vol || ""} onChange={(e) => handleNumberInput("adj_hippocampal_vol", e.target.value)} className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., 7.2" />
              <p className="text-xs dark:text-gray-400 text-gray-500 mt-1">Adjusted hippocampal volume</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
