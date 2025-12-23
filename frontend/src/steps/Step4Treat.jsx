"use client"

export default function Step4Treat({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold dark:text-white text-gray-900">
          Treatment Plan
        </h2>
        <p className="text-sm sm:text-base dark:text-gray-400 text-gray-600 mt-1">
          Recommended treatment and follow-up strategy
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="dark:bg-gray-800 dark:border-gray-700 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold dark:text-white text-gray-900 mb-3 sm:mb-4">Pharmacological Intervention</h3>
          <div>
            <label className="block text-sm font-medium dark:text-gray-200 text-gray-900 mb-1.5">
              Medication Plan
            </label>
            <p className="text-xs dark:text-gray-400 text-gray-500 mb-2">Include drug names, dosages, and schedules</p>
            <textarea
              value={data.medication || ""}
              onChange={(e) => handleChange("medication", e.target.value)}
              rows="3"
              className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter medication recommendations..."
            />
          </div>
        </div>

        <div className="dark:bg-gray-800 dark:border-gray-700 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold dark:text-white text-gray-900 mb-3 sm:mb-4">Non-Pharmacological Intervention</h3>
          <div>
            <label className="block text-sm font-medium dark:text-gray-200 text-gray-900 mb-1.5">
              Therapy & Activities
            </label>
            <p className="text-xs dark:text-gray-400 text-gray-500 mb-2">Cognitive training, exercise, social engagement strategies</p>
            <textarea
              value={data.therapy || ""}
              onChange={(e) => handleChange("therapy", e.target.value)}
              rows="3"
              className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter cognitive training, physical exercise, social activities..."
            />
          </div>
        </div>

        <div className="dark:bg-gray-800 dark:border-gray-700 bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold dark:text-white text-gray-900 mb-3 sm:mb-4">Follow-up Plan</h3>
          <div>
            <label className="block text-sm font-medium dark:text-gray-200 text-gray-900 mb-1.5">
              Follow-up Schedule
            </label>
            <p className="text-xs dark:text-gray-400 text-gray-500 mb-2">Specify reassessment intervals and monitoring schedule</p>
            <textarea
              value={data.followUp || ""}
              onChange={(e) => handleChange("followUp", e.target.value)}
              rows="3"
              className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Specify follow-up appointments, monitoring intervals, and reassessment dates..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
