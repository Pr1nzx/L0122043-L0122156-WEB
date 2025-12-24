import DecisionFlow from "./DecisionFlow"

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Alzheimer's Assessment System
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Evaluasi klinis komprehensif mengikuti kerangka ATN
              </p>
            </div>
            <div className="flex items-center gap-2">
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <DecisionFlow />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Buatan mahasiswa informatika UNS 2022 L0122043 - L0122156. 2025
          </p>
        </div>
      </footer>
    </div>
  )
}