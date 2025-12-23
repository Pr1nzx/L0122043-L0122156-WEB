"use client"

export default function Step1Detect({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Clinical Diagnosis
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Patient data, behavioral changes, and cognitive assessment
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Data Diri Pasien */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
            Patient Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Patient ID
              </label>
              <input
                type="text"
                value={data.patientId || ""}
                onChange={(e) => handleChange("patientId", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter patient ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Age
              </label>
              <input
                type="number"
                value={data.age || ""}
                onChange={(e) => handleChange("age", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Years"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Gender
              </label>
              <select
                value={data.gender || ""}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Education Level
              </label>
              <select
                value={data.education || ""}
                onChange={(e) => handleChange("education", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select level</option>
                <option value="primary">Primary School</option>
                <option value="secondary">Secondary School</option>
                <option value="higher">Higher Education</option>
              </select>
            </div>
          </div>
        </div>

        {/* Perubahan Perilaku */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
            Behavioral Changes Assessment
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Memory Issues
              </label>
              <select
                value={data.memoryIssues || ""}
                onChange={(e) => handleChange("memoryIssues", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select severity</option>
                <option value="none">None</option>
                <option value="mild">Mild (forgets recent events)</option>
                <option value="moderate">Moderate (impacts daily activities)</option>
                <option value="severe">Severe (significant impairment)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confusion / Disorientation
              </label>
              <select
                value={data.confusion || ""}
                onChange={(e) => handleChange("confusion", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select severity</option>
                <option value="none">None</option>
                <option value="mild">Mild (occasionally confused)</option>
                <option value="moderate">Moderate (frequently confused)</option>
                <option value="severe">Severe (always disoriented)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Language Difficulties
              </label>
              <select
                value={data.languageDifficulty || ""}
                onChange={(e) => handleChange("languageDifficulty", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select severity</option>
                <option value="none">None</option>
                <option value="mild">Mild (word-finding difficulty)</option>
                <option value="moderate">Moderate (trouble expressing)</option>
                <option value="severe">Severe (cannot communicate)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mood Changes
              </label>
              <select
                value={data.moodChanges || ""}
                onChange={(e) => handleChange("moodChanges", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select severity</option>
                <option value="none">None</option>
                <option value="mild">Mild (irritability)</option>
                <option value="moderate">Moderate (depression/anxiety)</option>
                <option value="severe">Severe (personality changes)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Behavioral Notes
              </label>
              <textarea
                value={data.behavioralNotes || ""}
                onChange={(e) => handleChange("behavioralNotes", e.target.value)}
                rows={3}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Additional behavioral observations..."
              />
            </div>
          </div>
        </div>

        {/* Tes Kognitif */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
            Cognitive Test (MMSE/MoCA)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Test Type
              </label>
              <select
                value={data.cognitiveTestType || ""}
                onChange={(e) => handleChange("cognitiveTestType", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select test</option>
                <option value="mmse">MMSE (Mini-Mental State Examination)</option>
                <option value="moca">MoCA (Montreal Cognitive Assessment)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Score
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={data.cognitiveScore || ""}
                onChange={(e) => handleChange("cognitiveScore", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0-30"
              />
              <p className="text-xs text-gray-500 mt-1">
                {data.cognitiveTestType === "mmse" && "Normal: 24-30 | MCI: 18-23 | Dementia: <18"}
                {data.cognitiveTestType === "moca" && "Normal: 26-30 | MCI: 18-25 | Dementia: <18"}
                {!data.cognitiveTestType && "Select test type first"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}