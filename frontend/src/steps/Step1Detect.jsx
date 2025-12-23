"use client"

export default function Step1Detect({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold dark:text-white text-gray-900">
          Clinical Assessment
        </h2>
        <p className="text-sm sm:text-base dark:text-gray-400 text-gray-600 mt-1">
          Patient demographics and cognitive screening
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="dark:bg-gray-800 dark:border-gray-700 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold dark:text-white text-gray-900 mb-3 sm:mb-4">Patient Demographics</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium dark:text-gray-200 text-gray-900 mb-1.5">Age (years) *</label>
              <input type="number" min="0" max="120" value={data.age || ""} onChange={(e) => handleChange("age", parseInt(e.target.value) || null)} className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., 72" required />
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-gray-200 text-gray-900 mb-1.5">Family History? *</label>
              <p className="text-xs dark:text-gray-400 text-gray-500 mb-2">History of neurodegenerative disease in family</p>
              <div className="flex flex-wrap gap-3 mt-2">
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="family_history" checked={data.family_history === true} onChange={() => handleChange("family_history", true)} className="w-4 h-4 text-blue-600" />
                  <span className="ml-2 text-sm dark:text-gray-300">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="family_history" checked={data.family_history === false} onChange={() => handleChange("family_history", false)} className="w-4 h-4 text-blue-600" />
                  <span className="ml-2 text-sm dark:text-gray-300">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="dark:bg-gray-800 dark:border-gray-700 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold dark:text-white text-gray-900 mb-3 sm:mb-4">Cognitive Assessment</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium dark:text-gray-200 text-gray-900 mb-1.5">MMSE Score (0-30) *</label>
              <input type="number" min="0" max="30" value={data.mmse_score || ""} onChange={(e) => handleChange("mmse_score", parseInt(e.target.value) || null)} className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., 22" />
              <p className="text-xs dark:text-gray-400 text-gray-500 mt-1">Mini-Mental State Exam</p>
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-gray-200 text-gray-900 mb-1.5">MoCA Score (0-30)</label>
              <input type="number" min="0" max="30" value={data.moca_score || ""} onChange={(e) => handleChange("moca_score", parseInt(e.target.value) || null)} className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., 23" />
              <p className="text-xs dark:text-gray-400 text-gray-500 mt-1">Montreal Cognitive Assessment</p>
            </div>
          </div>
        </div>

        <div className="dark:bg-gray-800 dark:border-gray-700 bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold dark:text-white text-gray-900 mb-3 sm:mb-4">Functional Status & Behavior</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium dark:text-gray-200 text-gray-900 mb-1.5">Independent in Daily Activities?</label>
              <p className="text-xs dark:text-gray-400 text-gray-500 mb-2">Ability to perform Activities of Daily Living (ADL)</p>
              <div className="flex flex-wrap gap-3 mt-2">
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="is_independent" checked={data.is_independent === true} onChange={() => handleChange("is_independent", true)} className="w-4 h-4 text-green-600" />
                  <span className="ml-2 text-sm dark:text-gray-300">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="is_independent" checked={data.is_independent === false} onChange={() => handleChange("is_independent", false)} className="w-4 h-4 text-green-600" />
                  <span className="ml-2 text-sm dark:text-gray-300">No</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-gray-200 text-gray-900 mb-1.5">Behavioral Changes?</label>
              <p className="text-xs dark:text-gray-400 text-gray-500 mb-2">Notable changes in personality or behavior (apathy, irritability, etc)</p>
              <div className="flex flex-wrap gap-3 mt-2">
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="has_behavior_change" checked={data.has_behavior_change === true} onChange={() => handleChange("has_behavior_change", true)} className="w-4 h-4 text-amber-600" />
                  <span className="ml-2 text-sm dark:text-gray-300">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="has_behavior_change" checked={data.has_behavior_change === false} onChange={() => handleChange("has_behavior_change", false)} className="w-4 h-4 text-amber-600" />
                  <span className="ml-2 text-sm dark:text-gray-300">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
