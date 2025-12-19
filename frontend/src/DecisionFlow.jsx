"use client"

import { useState } from "react"
import Stepper from "./Stepper"
import Step1Detect from "./steps/Step1Detect"
import Step2Assess from "./steps/Step2Assess"
import Step3Diagnose from "./steps/Step3Diagnose"
import Step4Treat from "./steps/Step4Treat"
import { sendStepData } from "./api"

export default function DecisionFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

  const steps = [
    { title: "Detect", description: "Early Detection" },
    { title: "Assess", description: "Clinical Assessment" },
    { title: "Diagnose", description: "Diagnosis" },
    { title: "Treat", description: "Treatment Plan" },
  ]

  const updateFormData = (step, data) => {
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowSummary(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const result = await sendStepData(4, formData)
      console.log("Submission successful:", result)
      alert("Assessment submitted successfully!")
    } catch (error) {
      console.error("Submission failed:", error)
      alert("Failed to submit assessment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (step) => {
    setShowSummary(false)
    setCurrentStep(step)
  }

  if (showSummary) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessment Summary</h2>

        <div className="space-y-6">
          {/* Step 1 Summary */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">1. Early Detection</h3>
              <button onClick={() => handleEdit(0)} className="text-blue-600 hover:text-blue-800 font-medium">
                Edit
              </button>
            </div>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Patient ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.step1.patientId || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Age</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.step1.age || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Memory Issues</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.step1.memoryIssues || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Family History</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.step1.familyHistory || "-"}</dd>
              </div>
            </dl>
          </div>

          {/* Step 2 Summary */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">2. Clinical Assessment</h3>
              <button onClick={() => handleEdit(1)} className="text-blue-600 hover:text-blue-800 font-medium">
                Edit
              </button>
            </div>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">MMSE Score</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.step2.mmseScore || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">MRI Results</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.step2.mriResults || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Blood Test</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.step2.bloodTest || "-"}</dd>
              </div>
            </dl>
          </div>

          {/* Step 3 Summary */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">3. Diagnosis</h3>
              <button onClick={() => handleEdit(2)} className="text-blue-600 hover:text-blue-800 font-medium">
                Edit
              </button>
            </div>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Diagnosis</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.step3.diagnosis || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Severity</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.step3.severity || "-"}</dd>
              </div>
            </dl>
          </div>

          {/* Step 4 Summary */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">4. Treatment Plan</h3>
              <button onClick={() => handleEdit(3)} className="text-blue-600 hover:text-blue-800 font-medium">
                Edit
              </button>
            </div>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Medication</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.step4.medication || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Therapy</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.step4.therapy || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Follow-up</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.step4.followUp || "-"}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setShowSummary(false)}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
          >
            Back to Edit
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 font-medium"
          >
            {isSubmitting ? "Submitting..." : "Submit Assessment"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Stepper steps={steps} currentStep={currentStep} />

      <div className="bg-white rounded-lg shadow-md p-6">
        {currentStep === 0 && <Step1Detect data={formData.step1} onChange={(data) => updateFormData("step1", data)} />}
        {currentStep === 1 && <Step2Assess data={formData.step2} onChange={(data) => updateFormData("step2", data)} />}
        {currentStep === 2 && (
          <Step3Diagnose data={formData.step3} onChange={(data) => updateFormData("step3", data)} />
        )}
        {currentStep === 3 && <Step4Treat data={formData.step4} onChange={(data) => updateFormData("step4", data)} />}

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 font-medium"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            {currentStep === steps.length - 1 ? "Review" : "Next"}
          </button>
        </div>
      </div>
    </div>
  )
}
