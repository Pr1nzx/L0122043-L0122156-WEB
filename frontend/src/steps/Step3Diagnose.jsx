"use client"

export default function Step3Diagnose({ data }) {
  const isResult = data?.diagnosis || data?.risk || data?.recommendations || data?.biomarkers

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold dark:text-white text-gray-900">
          Diagnosis Results
        </h2>
        <p className="text-sm sm:text-base dark:text-gray-400 text-gray-600 mt-1">
          ATN biomarker analysis and clinical diagnosis
        </p>
      </div>

      {isResult ? (
        <div className="space-y-4 sm:space-y-6">
          {data.diagnosis && data.diagnosis.length > 0 && (
            <div className="dark:bg-blue-900 dark:border-blue-700 bg-gradient-to-r from-blue-600 to-blue-700 border-2 border-blue-800 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold dark:text-blue-100 text-white mb-3">
                🧠 Primary Diagnosis
              </h3>
              <div className="space-y-2">
                {data.diagnosis.map((d, idx) => (
                  <p key={idx} className="text-lg sm:text-xl font-bold dark:text-blue-200 text-yellow-200">
                    {d}
                  </p>
                ))}
              </div>
            </div>
          )}

          {data.risk && data.risk.length > 0 && (
            <div className="dark:bg-red-800 dark:border-red-700 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold dark:text-red-100 text-red-900 mb-3">Risk Assessment</h3>
              <div className="space-y-2">
                {data.risk.map((r, idx) => (
                  <div key={idx} className="dark:bg-red-700 px-4 py-2 bg-red-100 rounded dark:text-red-100 text-red-900 font-semibold">
                    ⚠️ {r}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.biomarkers && data.biomarkers.length > 0 && (
            <div className="dark:bg-purple-800 dark:border-purple-700 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold dark:text-purple-100 text-purple-900 mb-3">Biomarker Status</h3>
              <div className="space-y-2">
                {data.biomarkers.map((b, idx) => (
                  <div key={idx} className="dark:bg-purple-700 px-4 py-2 bg-purple-100 rounded dark:text-purple-100 text-purple-900 font-semibold">
                    🔬 {b}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.recommendations && data.recommendations.length > 0 && (
            <div className="dark:bg-green-800 dark:border-green-700 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold dark:text-green-100 text-green-900 mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {data.recommendations.map((rec, idx) => (
                  <li key={idx} className="dark:text-green-100 text-green-900 text-sm">
                    ✓ {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-100 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          <p>Waiting for diagnosis results...</p>
        </div>
      )}
    </div>
  )
}
