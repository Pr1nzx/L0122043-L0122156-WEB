"use client"

export default function Step2Assess({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Clinical Assessment</h2>
        <p className="text-gray-600 mt-1">Detailed cognitive and medical evaluation</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">MMSE Score</label>
          <input
            type="number"
            min="0"
            max="30"
            value={data.mmseScore || ""}
            onChange={(e) => handleChange("mmseScore", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Score (0-30)"
          />
          <p className="text-xs text-gray-500 mt-1">Mini-Mental State Examination score</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">MRI Results</label>
          <select
            value={data.mriResults || ""}
            onChange={(e) => handleChange("mriResults", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select</option>
            <option value="normal">Normal</option>
            <option value="mild-atrophy">Mild Atrophy</option>
            <option value="moderate-atrophy">Moderate Atrophy</option>
            <option value="severe-atrophy">Severe Atrophy</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Test Results</label>
          <textarea
            value={data.bloodTest || ""}
            onChange={(e) => handleChange("bloodTest", e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter blood test results"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
          <textarea
            value={data.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Additional clinical observations"
          />
        </div>
      </div>
    </div>
  )
}
