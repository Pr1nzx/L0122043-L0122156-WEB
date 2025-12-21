"use client"

export default function Step3Diagnose({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  // Auto-calculate hippocampal ratio
  const calculateRatio = () => {
    const left = parseFloat(data.hippoLeft) || 0
    const right = parseFloat(data.hippoRight) || 0
    const icv = parseFloat(data.icv) || 0
    
    if (icv === 0) return "0.0000"
    
    const totalHippo = left + right
    const ratio = (totalHippo / icv) * 100
    return ratio.toFixed(4)
  }

  const ratio = calculateRatio()

  // Auto-update ratio when inputs change
  const handleVolumeChange = (field, value) => {
    handleChange(field, value)
    
    setTimeout(() => {
      const newRatio = calculateRatio()
      handleChange("hippoRatio", newRatio)
    }, 0)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          ATN Biomarker Framework
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Amyloid, Tau, and Neurodegeneration assessment
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {/* A - Amyloid */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <span className="bg-purple-600 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm">
              A
            </span>
            Amyloid (CSF Aβ42)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                CSF Aβ42 Level
              </label>
              <input
                type="number"
                step="0.1"
                value={data.amyloidCSF || ""}
                onChange={(e) => handleChange("amyloidCSF", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="pg/mL"
              />
              <p className="text-xs text-gray-500 mt-1">Normal: &gt; 550 pg/mL</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Platform/Method
              </label>
              <input
                type="text"
                value={data.amyloidMethod || ""}
                onChange={(e) => handleChange("amyloidMethod", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Elecsys"
              />
            </div>
          </div>
        </div>

        {/* T - Tau */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <span className="bg-orange-600 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm">
              T
            </span>
            Tau (CSF p-Tau)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                CSF Total Tau
              </label>
              <input
                type="number"
                step="0.1"
                value={data.tauCSF || ""}
                onChange={(e) => handleChange("tauCSF", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="pg/mL"
              />
              <p className="text-xs text-gray-500 mt-1">Normal: &lt; 300 pg/mL</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                CSF p-Tau181
              </label>
              <input
                type="number"
                step="0.1"
                value={data.ptauCSF || ""}
                onChange={(e) => handleChange("ptauCSF", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="pg/mL"
              />
              <p className="text-xs text-gray-500 mt-1">Normal: &lt; 60 pg/mL</p>
            </div>
          </div>
        </div>

        {/* N - Neurodegeneration */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 lg:p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <span className="bg-green-600 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm">
              N
            </span>
            Neurodegeneration (Hippocampal Volume)
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Left Hippocampus
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={data.hippoLeft || ""}
                  onChange={(e) => handleVolumeChange("hippoLeft", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="mm³"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Right Hippocampus
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={data.hippoRight || ""}
                  onChange={(e) => handleVolumeChange("hippoRight", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="mm³"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Total ICV
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={data.icv || ""}
                  onChange={(e) => handleVolumeChange("icv", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="mm³"
                />
              </div>
            </div>

            {/* Auto-calculated Ratio */}
            {data.hippoLeft && data.hippoRight && data.icv && (
              <div className="mt-4 p-3 sm:p-4 bg-white rounded-lg border-2 border-green-300">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    Normalized Hippocampal Ratio:
                  </span>
                  <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700">
                    {ratio}%
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-green-200">
                  <p className="text-xs text-gray-500">
                    Formula: (Left + Right) / ICV × 100%
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    = ({data.hippoLeft} + {data.hippoRight}) / {data.icv} × 100%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Clinical Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Clinical Notes
          </label>
          <textarea
            value={data.clinicalNotes || ""}
            onChange={(e) => handleChange("clinicalNotes", e.target.value)}
            rows={4}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Additional observations or interpretations..."
          />
        </div>
      </div>
    </div>
  )
}