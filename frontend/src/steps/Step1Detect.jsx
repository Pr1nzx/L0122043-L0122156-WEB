"use client"

export default function Step1Detect({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Initial Clinical Assessment
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Patient information and cognitive screening
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Patient Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Patient Information
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Patient ID *
              </label>
              <input
                type="text"
                value={data.patientId || ""}
                onChange={(e) => handleChange("patientId", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., PT001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
          </div>
        </div>

        {/* Family History */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Family History
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Family History of Dementia? *
              </label>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="hasFamilyHistory"
                    checked={data.hasFamilyHistory === true}
                    onChange={() => handleChange("hasFamilyHistory", true)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm sm:text-base">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="hasFamilyHistory"
                    checked={data.hasFamilyHistory === false}
                    onChange={() => handleChange("hasFamilyHistory", false)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm sm:text-base">No</span>
                </label>
              </div>
            </div>

            {data.hasFamilyHistory && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Family Member Diagnosis
                </label>
                <select
                  value={data.familyMemberDiagnosis || ""}
                  onChange={(e) => handleChange("familyMemberDiagnosis", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select diagnosis type</option>
                  <option value="AD">Alzheimer's Disease (AD)</option>
                  <option value="Non-AD Dementia">Non-AD Dementia</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Clinical Symptoms */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Clinical Symptoms
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subjective Complaints (patient-reported memory issues)? *
              </label>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="hasSubjectiveComplaints"
                    checked={data.hasSubjectiveComplaints === true}
                    onChange={() => handleChange("hasSubjectiveComplaints", true)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm sm:text-base">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="hasSubjectiveComplaints"
                    checked={data.hasSubjectiveComplaints === false}
                    onChange={() => handleChange("hasSubjectiveComplaints", false)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm sm:text-base">No</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Behavioral Changes (mood, personality, sleep)? *
              </label>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="hasBehaviorChanges"
                    checked={data.hasBehaviorChanges === true}
                    onChange={() => handleChange("hasBehaviorChanges", true)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm sm:text-base">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="hasBehaviorChanges"
                    checked={data.hasBehaviorChanges === false}
                    onChange={() => handleChange("hasBehaviorChanges", false)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                MMSE Score (0-30) *
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={data.mmseScore || ""}
                onChange={(e) => handleChange("mmseScore", parseInt(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 22"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Mini-Mental State Examination</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                MoCA Score (0-30) *
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={data.mocaScore || ""}
                onChange={(e) => handleChange("mocaScore", parseInt(e.target.value))}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 20"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Montreal Cognitive Assessment</p>
            </div>
          </div>
        </div>

        {/* Functional Independence */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Functional Independence
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Independent in ADL (Activities of Daily Living)? *
              </label>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="isIndependentADL"
                    checked={data.isIndependentADL === true}
                    onChange={() => handleChange("isIndependentADL", true)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm sm:text-base">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="isIndependentADL"
                    checked={data.isIndependentADL === false}
                    onChange={() => handleChange("isIndependentADL", false)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm sm:text-base">No</span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">Bathing, dressing, eating, toileting</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Independent in IADL (Instrumental Activities)? *
              </label>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="isIndependentIADL"
                    checked={data.isIndependentIADL === true}
                    onChange={() => handleChange("isIndependentIADL", true)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm sm:text-base">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="isIndependentIADL"
                    checked={data.isIndependentIADL === false}
                    onChange={() => handleChange("isIndependentIADL", false)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm sm:text-base">No</span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">Managing finances, shopping, cooking, transportation</p>
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
