"use client"

export default function Step1Detect({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Clinical Assessment
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Patient demographics and cognitive screening
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Patient Demographics */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Patient Demographics
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Age (years) *
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={data.age || ""}
                onChange={(e) => handleChange("age", parseInt(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 72"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Other Diseases Present? *
              </label>
              <div className="flex flex-wrap gap-3 mt-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="has_other_diseases"
                    checked={data.has_other_diseases === true}
                    onChange={() => handleChange("has_other_diseases", true)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm sm:text-base">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="has_other_diseases"
                    checked={data.has_other_diseases === false}
                    onChange={() => handleChange("has_other_diseases", false)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm sm:text-base">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Cognitive Assessment Scores */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Cognitive Assessment Scores
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                MMSE Score (0-30) *
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={data.mmse_score || ""}
                onChange={(e) => handleChange("mmse_score", parseInt(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 22"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Mini-Mental State Examination</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                MoCA Score (0-30) *
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={data.moca_score || ""}
                onChange={(e) => handleChange("moca_score", parseInt(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 20"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Montreal Cognitive Assessment</p>
            </div>
          </div>
        </div>

        {/* Clinical Symptoms */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Clinical Presentation
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Behavioral Changes (mood, personality, sleep)? *
              </label>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="behavior_change"
                    checked={data.behavior_change === true}
                    onChange={() => handleChange("behavior_change", true)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm sm:text-base">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="behavior_change"
                    checked={data.behavior_change === false}
                    onChange={() => handleChange("behavior_change", false)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm sm:text-base">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Functional Independence */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Functional Status
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Independent in Activities of Daily Living (ADL/IADL)? *
              </label>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="is_independent"
                    checked={data.is_independent === true}
                    onChange={() => handleChange("is_independent", true)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm sm:text-base">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="is_independent"
                    checked={data.is_independent === false}
                    onChange={() => handleChange("is_independent", false)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm sm:text-base">No</span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">Independent in bathing, dressing, eating, finances, shopping</p>
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