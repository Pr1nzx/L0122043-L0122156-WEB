export default function Stepper({ steps, currentStep }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
      {/* Mobile View (< 640px) - Vertical Stack */}
      <div className="sm:hidden space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${
                index <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <div className="flex-1">
              <div className={`font-semibold text-sm ${index <= currentStep ? "text-blue-600" : "text-gray-400"}`}>
                {step.title}
              </div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
            {index === currentStep && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                Current
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Tablet & Desktop View (>= 640px) - Horizontal */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex items-center gap-2 md:gap-3 flex-1">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm md:text-base shrink-0 ${
                  index <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              <div className="min-w-0">
                <div className={`font-semibold text-sm md:text-base ${index <= currentStep ? "text-blue-600" : "text-gray-400"}`}>
                  {step.title}
                </div>
                <div className="text-xs md:text-sm text-gray-500 truncate">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 md:mx-4 ${index < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}