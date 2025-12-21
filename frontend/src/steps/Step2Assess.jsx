"use client"

export default function Step2Assess({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Cognitive Assessment & MRI
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Cognitive function and brain imaging evaluation
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Cognitive Test Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
            Cognitive Test
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Assessment Type
              </label>
              <select
                value={data.assessmentType || ""}
                onChange={(e) => handleChange("assessmentType", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Select test</option>
                <option value="mmse">MMSE (Mini-Mental State)</option>
                <option value="moca">MoCA (Montreal Cognitive)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Score
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={data.cognitiveScore || ""}
                onChange={(e) => handleChange("cognitiveScore", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0-30"
              />
              <p className="text-xs text-gray-500 mt-1">
                {data.assessmentType === "mmse" && "MMSE Normal: 24-30"}
                {data.assessmentType === "moca" && "MoCA Normal: 26-30"}
                {!data.assessmentType && "Select test first"}
              </p>
            </div>
          </div>
        </div>

        {/* MRI Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
            MRI Results
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Brain Atrophy Assessment
              </label>
              <select
                value={data.mriResults || ""}
                onChange={(e) => handleChange("mriResults", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Select finding</option>
                <option value="normal">Normal</option>
                <option value="mild-atrophy">Mild Atrophy</option>
                <option value="moderate-atrophy">Moderate Atrophy</option>
                <option value="severe-atrophy">Severe Atrophy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                MRI Notes
              </label>
              <textarea
                value={data.mriNotes || ""}
                onChange={(e) => handleChange("mriNotes", e.target.value)}
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Additional MRI findings..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}