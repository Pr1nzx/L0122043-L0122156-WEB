"use client"

export default function Step3Diagnose({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  // Check if data is from diagnosis result or form data
  const isResult = data?.diagnosis || data?.severity

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Diagnosis Results
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          ATN biomarker analysis and clinical diagnosis
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Diagnosis Result */}
        {isResult && (
          <>
            {/* Main Diagnosis */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 border-2 border-blue-800 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                🧠 Primary Diagnosis
              </h3>
              <div className="space-y-2">
                {data.diagnosis && data.diagnosis.length > 0 ? (
                  data.diagnosis.map((diag, idx) => (
                    <p key={idx} className="text-xl sm:text-2xl font-bold text-yellow-200">
                      {diag}
                    </p>
                  ))
                ) : (
                  <p className="text-yellow-200">No diagnosis available</p>
                )}
              </div>
            </div>

            {/* Severity */}
            {data.severity && data.severity.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 lg:p-5">
                <h3 className="font-semibold text-orange-900 mb-3 text-sm sm:text-base">
                  Severity Level
                </h3>
                <div className="space-y-2">
                  {data.severity.map((sev, idx) => (
                    <div key={idx} className="px-4 py-2 bg-orange-100 rounded text-orange-900 font-semibold">
                      {sev}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clinical Status */}
            {data.clinical_status && data.clinical_status.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 lg:p-5">
                <h3 className="font-semibold text-purple-900 mb-3 text-sm sm:text-base">
                  ATN Biomarker Status
                </h3>
                <div className="space-y-2">
                  {data.clinical_status.map((status, idx) => (
                    <div key={idx} className="px-4 py-2 bg-purple-100 rounded text-purple-900 font-semibold">
                      {status}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Activities */}
            {data.recommended_activities && data.recommended_activities.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 lg:p-5">
                <h3 className="font-semibold text-green-900 mb-3 text-sm sm:text-base">
                  Recommended Activities & Interventions
                </h3>
                <div className="space-y-2">
                  {data.recommended_activities.map((activity, idx) => (
                    <div key={idx} className="px-4 py-2 bg-green-100 rounded text-green-900 font-semibold">
                      ✓ {activity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Actions */}
            {data.recommended_actions && data.recommended_actions.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 lg:p-5">
                <h3 className="font-semibold text-blue-900 mb-3 text-sm sm:text-base">
                  Clinical Recommendations
                </h3>
                <ul className="space-y-2">
                  {data.recommended_actions.map((action, idx) => (
                    <li key={idx} className="text-blue-900 text-sm">→ {action}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!isResult && (
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              Complete Steps 1 and 2 to generate diagnosis results.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
