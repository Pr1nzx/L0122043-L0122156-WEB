import DecisionFlow from "./DecisionFlow"

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Clinical Decision Support System</h1>
          <p className="text-blue-100 mt-1">Alzheimer's Disease Assessment Tool</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <DecisionFlow />
      </main>
    </div>
  )
}
