"use client"

export default function Step1Detect({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Blood Test Analysis
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Laboratory results for initial screening
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6 xl:gap-8">
        {/* TSH */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            TSH (Thyroid Stimulating Hormone)
          </label>
          <input
            type="number"
            step="0.01"
            value={data.tsh || ""}
            onChange={(e) => handleChange("tsh", e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter value"
          />
          <p className="text-xs text-gray-500 mt-1">Normal: 0.4-4.0 mIU/L</p>
        </div>

        {/* Blood Glucose */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Blood Glucose (BG)
          </label>
          <input
            type="number"
            step="0.1"
            value={data.bloodGlucose || ""}
            onChange={(e) => handleChange("bloodGlucose", e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter value"
          />
          <p className="text-xs text-gray-500 mt-1">Fasting: 70-100 mg/dL</p>
        </div>

        {/* Serum B12 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Serum B12
          </label>
          <input
            type="number"
            value={data.serumB12 || ""}
            onChange={(e) => handleChange("serumB12", e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter value"
          />
          <p className="text-xs text-gray-500 mt-1">Normal: 200-900 pg/mL</p>
        </div>

        {/* Liver Function */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Liver Function Test
          </label>
          <select
            value={data.liverFunction || ""}
            onChange={(e) => handleChange("liverFunction", e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select result</option>
            <option value="normal">Normal</option>
            <option value="mild-abnormal">Mild Abnormal</option>
            <option value="moderate-abnormal">Moderate Abnormal</option>
            <option value="severe-abnormal">Severe Abnormal</option>
          </select>
        </div>

        {/* Renal Function */}
        <div className="md:col-span-2 xl:col-span-3 2xl:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Renal Function Test
          </label>
          <select
            value={data.renalFunction || ""}
            onChange={(e) => handleChange("renalFunction", e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select result</option>
            <option value="normal">Normal</option>
            <option value="mild-impairment">Mild Impairment</option>
            <option value="moderate-impairment">Moderate Impairment</option>
            <option value="severe-impairment">Severe Impairment</option>
          </select>
        </div>

        {/* Notes */}
        <div className="md:col-span-2 xl:col-span-3 2xl:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Additional Notes
          </label>
          <textarea
            value={data.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={3}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Any additional observations..."
          />
        </div>
      </div>
    </div>
  )
}