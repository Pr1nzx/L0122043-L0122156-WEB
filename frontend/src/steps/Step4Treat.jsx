"use client"

export default function Step4Treat({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Treatment Plan & Recommendations
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Comprehensive care and activity recommendations
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Diagnosis Display (dari backend nanti) */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
            Diagnosis Result
          </h3>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700">
            {data.diagnosisResult || "Pending analysis..."}
          </p>
          {data.severity && (
            <p className="text-xs sm:text-sm text-gray-900 mt-2">
              <span className="font-semibold">Severity:</span> {data.severity}
            </p>
          )}
        </div>

        {/* Medication */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
            Medication
          </label>
          <input
            type="text"
            value={data.medication || ""}
            onChange={(e) => handleChange("medication", e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Prescribed medication"
          />
        </div>

        {/* Dosage */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
            Dosage Instructions
          </label>
          <textarea
            value={data.dosage || ""}
            onChange={(e) => handleChange("dosage", e.target.value)}
            rows={2}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Dosage and frequency"
          />
        </div>

        {/* Therapy */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
            Therapy Plan
          </label>
          <textarea
            value={data.therapy || ""}
            onChange={(e) => handleChange("therapy", e.target.value)}
            rows={3}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Cognitive therapy, occupational therapy, etc."
          />
        </div>

        {/* Recommended Activities */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
            Recommended Activities
          </h3>
          
          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5 sm:mt-1 text-base sm:text-lg">•</span>
              <span>Regular cognitive exercises (puzzles, reading, memory games)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5 sm:mt-1 text-base sm:text-lg">•</span>
              <span>Physical exercise 30 minutes daily (walking, swimming)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5 sm:mt-1 text-base sm:text-lg">•</span>
              <span>Social engagement and group activities</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5 sm:mt-1 text-base sm:text-lg">•</span>
              <span>Mediterranean diet with omega-3 rich foods</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5 sm:mt-1 text-base sm:text-lg">•</span>
              <span>Regular sleep schedule (7-8 hours per night)</span>
            </div>
          </div>
        </div>

        {/* Lifestyle Recommendations */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
            Additional Lifestyle Recommendations
          </label>
          <textarea
            value={data.lifestyle || ""}
            onChange={(e) => handleChange("lifestyle", e.target.value)}
            rows={3}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Diet modifications, exercise routines, social activities..."
          />
        </div>

        {/* Follow-up */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
            Follow-up Schedule
          </label>
          <input
            type="text"
            value={data.followUp || ""}
            onChange={(e) => handleChange("followUp", e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Next appointment date/frequency"
          />
        </div>
      </div>
    </div>
  )
}