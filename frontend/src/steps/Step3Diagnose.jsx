"use client"

export default function Step3Diagnose({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Diagnosis</h2>
        <p className="text-gray-600 mt-1">Clinical diagnosis and severity classification</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
          <select
            value={data.diagnosis || ""}
            onChange={(e) => handleChange("diagnosis", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select diagnosis</option>
            <option value="normal">Normal Cognitive Function</option>
            <option value="mci">Mild Cognitive Impairment</option>
            <option value="early-ad">Early-Stage Alzheimer's</option>
            <option value="moderate-ad">Moderate Alzheimer's</option>
            <option value="severe-ad">Severe Alzheimer's</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Severity Level</label>
          <select
            value={data.severity || ""}
            onChange={(e) => handleChange("severity", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select severity</option>
            <option value="none">None</option>
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes</label>
          <textarea
            value={data.clinicalNotes || ""}
            onChange={(e) => handleChange("clinicalNotes", e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Detailed diagnosis notes"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ICD-10 Code</label>
          <input
            type="text"
            value={data.icdCode || ""}
            onChange={(e) => handleChange("icdCode", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter ICD-10 code"
          />
        </div>
      </div>
    </div>
  )
}
