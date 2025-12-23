"use client"

export default function Step3Diagnose({ data, onChange, step2Data }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          ATN Framework Diagnosis
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Amyloid (A), Tau (T), Neurodegeneration (N) biomarker classification
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Diagnostic Summary from Backend */}
        {data.diagnosis && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 border-2 border-blue-800 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
              🧠 Diagnosis Result
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-200 mb-3">
              {data.diagnosis}
            </p>
            
            {data.atnProfile && (
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">ATN Profile</h4>
                <p className="text-lg font-mono text-blue-900 font-bold">{data.atnProfile}</p>
              </div>
            )}

            {data.message && (
              <p className="mt-3 text-sm text-blue-50 border-t border-blue-400 pt-3">
                {data.message}
              </p>
            )}

            {data.inferredClasses && data.inferredClasses.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-white mb-2">Inferred Classifications:</h4>
                <div className="flex flex-wrap gap-2">
                  {data.inferredClasses.map((cls, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-yellow-300 text-blue-900 text-sm rounded-full font-semibold"
                    >
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ATN Biomarker Summary */}
        <div className="bg-purple-100 border border-purple-300 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-purple-900 mb-3 sm:mb-4 text-sm sm:text-base">
            ATN Biomarker Summary
          </h3>
          
          <div className="space-y-3">
            {/* Amyloid (A) */}
            <div className="p-3 bg-blue-600 rounded-lg border-l-4 border-blue-800">
              <h4 className="font-semibold text-white mb-2">
                A - Amyloid Status
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-blue-100">Aβ42/40 Ratio:</span>
                  <p className="font-mono font-semibold text-yellow-200">
                    {step2Data?.abeta4240Ratio || data.abeta4240Ratio || '-'}
                  </p>
                </div>
                <div>
                  <span className="text-blue-100">Status:</span>
                  <p className="font-semibold text-white">
                    {data.amyloidStatus || 'Pending'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tau (T) */}
            <div className="p-3 bg-orange-600 rounded-lg border-l-4 border-orange-800">
              <h4 className="font-semibold text-white mb-2">
                T - Tau Status
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-orange-100">P-Tau/Aβ42 Ratio:</span>
                  <p className="font-mono font-semibold text-yellow-200">
                    {step2Data?.pTauAbeta42Ratio || data.pTauAbeta42Ratio || '-'}
                  </p>
                </div>
                <div>
                  <span className="text-orange-100">Status:</span>
                  <p className="font-semibold text-white">
                    {data.tauStatus || 'Pending'}
                  </p>
                </div>
              </div>
            </div>

            {/* Neurodegeneration (N) */}
            <div className="p-3 bg-green-600 rounded-lg border-l-4 border-green-800">
              <h4 className="font-semibold text-white mb-2">
                N - Neurodegeneration Status
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-green-100">Adjusted Hippo Volume:</span>
                  <p className="font-mono font-semibold text-yellow-200">
                    {step2Data?.hippocampalVolume || data.hippocampalVolume || '-'}
                  </p>
                </div>
                <div>
                  <span className="text-green-100">Status:</span>
                  <p className="font-semibold text-white">
                    {data.neurodegenerationStatus || 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Clinical Context */}
        {step2Data && (
          <div className="bg-yellow-600 border border-yellow-800 rounded-lg p-3 sm:p-4 lg:p-5">
            <h3 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">
              Clinical Context from Step 2
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {step2Data.brainImagingType && (
                <div>
                  <span className="text-yellow-100">Imaging Type:</span>
                  <p className="font-semibold text-white">{step2Data.brainImagingType}</p>
                </div>
              )}
              
              {step2Data.mtaScore !== undefined && (
                <div>
                  <span className="text-yellow-100">MTA Score:</span>
                  <p className="font-semibold text-white">{step2Data.mtaScore}/4</p>
                </div>
              )}

              {step2Data.abeta42Score && (
                <div>
                  <span className="text-yellow-100">Aβ42:</span>
                  <p className="font-mono text-xs text-yellow-200">{step2Data.abeta42Score} pg/mL</p>
                </div>
              )}

              {step2Data.pTau181Score && (
                <div>
                  <span className="text-yellow-100">P-Tau181:</span>
                  <p className="font-mono text-xs text-yellow-200">{step2Data.pTau181Score} pg/mL</p>
                </div>
              )}

              {step2Data.tTau && (
                <div>
                  <span className="text-yellow-100">T-Tau:</span>
                  <p className="font-mono text-xs text-yellow-200">{step2Data.tTau} pg/mL</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clinical Notes (Optional) */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Clinical Notes (Optional)
          </h3>
          
          <textarea
            value={data.clinicalNotes || ""}
            onChange={(e) => handleChange("clinicalNotes", e.target.value)}
            rows={4}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Additional observations, differential diagnoses, or clinical recommendations..."
          />
        </div>

        {!data.diagnosis && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">
              Click <strong>"Analyze & Continue"</strong> to get ATN diagnosis from the ontology reasoning system
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
