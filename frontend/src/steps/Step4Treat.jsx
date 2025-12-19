"use client"

export default function Step4Treat({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Treatment Plan</h2>
        <p className="text-gray-600 mt-1">Recommended treatment and care plan</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Medication</label>
          <input
            type="text"
            value={data.medication || ""}
            onChange={(e) => handleChange("medication", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Prescribed medication"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Instructions</label>
          <textarea
            value={data.dosage || ""}
            onChange={(e) => handleChange("dosage", e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Dosage and frequency"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Therapy Plan</label>
          <textarea
            value={data.therapy || ""}
            onChange={(e) => handleChange("therapy", e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Cognitive therapy, occupational therapy, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lifestyle Recommendations</label>
          <textarea
            value={data.lifestyle || ""}
            onChange={(e) => handleChange("lifestyle", e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Diet, exercise, social activities"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Schedule</label>
          <input
            type="text"
            value={data.followUp || ""}
            onChange={(e) => handleChange("followUp", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Next appointment date/frequency"
          />
        </div>
      </div>
    </div>
  )
}
