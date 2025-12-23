"use client"

export default function Step2Assess({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Brain Imaging Analysis
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Exclude other diseases and assess neurodegeneration
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Exclude Other Diseases */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
            Differential Diagnosis (Exclude Other Diseases)
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Stroke / Vascular Issues
              </label>
              <select
                value={data.strokeEvidence || ""}
                onChange={(e) => handleChange("strokeEvidence", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select finding</option>
                <option value="none">No evidence</option>
                <option value="mild">Mild vascular changes</option>
                <option value="moderate">Moderate vascular disease</option>
                <option value="severe">Severe stroke/vascular disease</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tumor / Mass Lesion
              </label>
              <select
                value={data.tumorEvidence || ""}
                onChange={(e) => handleChange("tumorEvidence", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select finding</option>
                <option value="none">No tumor detected</option>
                <option value="suspicious">Suspicious lesion</option>
                <option value="confirmed">Tumor confirmed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Hydrocephalus
              </label>
              <select
                value={data.hydrocephalus || ""}
                onChange={(e) => handleChange("hydrocephalus", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select finding</option>
                <option value="none">No hydrocephalus</option>
                <option value="mild">Mild ventricular enlargement</option>
                <option value="moderate">Moderate hydrocephalus</option>
                <option value="severe">Severe hydrocephalus</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Other Findings
              </label>
              <textarea
                value={data.otherFindings || ""}
                onChange={(e) => handleChange("otherFindings", e.target.value)}
                rows={2}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                placeholder="Other pathological findings..."
              />
            </div>
          </div>
        </div>

        {/* Neurodegeneration (N) */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <span className="bg-green-600 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm">
              N
            </span>
            Neurodegeneration Assessment
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Brain Atrophy Pattern
              </label>
              <select
                value={data.atrophyPattern || ""}
                onChange={(e) => handleChange("atrophyPattern", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select pattern</option>
                <option value="normal">Normal</option>
                <option value="hippocampal">Hippocampal atrophy</option>
                <option value="cortical">Cortical atrophy</option>
                <option value="global">Global atrophy</option>
                <option value="focal">Focal atrophy</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Left Hippocampus (mm³)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={data.hippoLeft || ""}
                  onChange={(e) => handleChange("hippoLeft", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Volume"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Right Hippocampus (mm³)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={data.hippoRight || ""}
                  onChange={(e) => handleChange("hippoRight", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Volume"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Total ICV (mm³)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={data.icv || ""}
                  onChange={(e) => handleChange("icv", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Intracranial Vol"
                />
              </div>
            </div>

            {/* Auto-calculated ratio will be shown in Step 3 */}
            {data.hippoLeft && data.hippoRight && data.icv && (
              <div className="p-3 bg-white rounded-lg border border-green-300">
                <p className="text-xs sm:text-sm text-gray-600">
                  ℹ️ Hippocampal ratio will be calculated and used in ATN assessment
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                MRI Notes
              </label>
              <textarea
                value={data.mriNotes || ""}
                onChange={(e) => handleChange("mriNotes", e.target.value)}
                rows={3}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Additional MRI observations..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}