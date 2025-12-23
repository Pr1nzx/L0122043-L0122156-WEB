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
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

  const steps = [
    { title: "Blood Test", description: "Laboratory Analysis" },
    { title: "Cognitive", description: "Mental Assessment" },
    { title: "ATN", description: "Biomarker Analysis" },
    { title: "Treatment", description: "Plan & Recommendations" },
  ]

  const updateFormData = (step, data) => {
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }))
  }

  // Handle analyze button untuk setiap step
  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    
    try {
      // TODO: Replace dengan actual API call ke backend
      // const response = await sendStepData(currentStep + 1, formData[`step${currentStep + 1}`])
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // TODO: Backend return { canProceed: true/false, message: "..." }
      const mockResponse = {
        canProceed: true,
        message: "Analysis complete. Proceeding to next step."
      }
      
      if (mockResponse.canProceed) {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1)
        } else {
          setShowSummary(true)
        }
      } else {
        alert(mockResponse.message || "Assessment stopped based on results.")
      }
      
    } catch (error) {
      console.error("Analysis failed:", error)
      alert("Failed to analyze results. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
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
      // TODO: Replace dengan actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log("Submission successful:", formData)
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

  // Check if current step is complete
  const isStepComplete = () => {
    // TEMPORARY: Always return true untuk UI preview
    // TODO: Uncomment logic di bawah setelah selesai review UI
    // return true
    
    
    const currentData = formData[`step${currentStep + 1}`]
    
    switch(currentStep) {
      case 0:
        return currentData.tsh && currentData.bloodGlucose && 
               currentData.serumB12 && currentData.liverFunction && 
               currentData.renalFunction
      case 1:
        return (currentData.assessmentType && currentData.cognitiveScore) || 
               currentData.mriResults
      case 2:
        return currentData.amyloidCSF && currentData.tauCSF && 
               currentData.ptauCSF && currentData.hippoLeft && 
               currentData.hippoRight && currentData.icv
      case 3:
        return true
      default:
        return false
    }
    
  }

  if (showSummary) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          Assessment Summary
        </h2>

        <div className="space-y-4 sm:space-y-6">
          {/* Step 1 Summary */}
          <details className="border border-gray-200 rounded-lg overflow-hidden">
            <summary className="px-3 sm:px-4 py-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                1. Blood Test Analysis
              </h3>
              <button 
                onClick={(e) => { e.preventDefault(); handleEdit(0); }} 
                className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm"
              >
                Edit
              </button>
            </summary>
            <div className="px-3 sm:px-4 py-3 bg-gray-50 border-t grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div><span className="font-medium">TSH:</span> {formData.step1.tsh || "-"} mIU/L</div>
              <div><span className="font-medium">Blood Glucose:</span> {formData.step1.bloodGlucose || "-"} mg/dL</div>
              <div><span className="font-medium">Serum B12:</span> {formData.step1.serumB12 || "-"} pg/mL</div>
              <div><span className="font-medium">Liver:</span> {formData.step1.liverFunction || "-"}</div>
              <div className="sm:col-span-2"><span className="font-medium">Renal:</span> {formData.step1.renalFunction || "-"}</div>
            </div>
          </details>

          {/* Step 2 Summary */}
          <details className="border border-gray-200 rounded-lg overflow-hidden">
            <summary className="px-3 sm:px-4 py-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                2. Cognitive Assessment
              </h3>
              <button 
                onClick={(e) => { e.preventDefault(); handleEdit(1); }} 
                className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm"
              >
                Edit
              </button>
            </summary>
            <div className="px-3 sm:px-4 py-3 bg-gray-50 border-t grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div><span className="font-medium">Test:</span> {formData.step2.assessmentType?.toUpperCase() || "-"}</div>
              <div><span className="font-medium">Score:</span> {formData.step2.cognitiveScore || "-"}/30</div>
              <div className="sm:col-span-2"><span className="font-medium">MRI:</span> {formData.step2.mriResults || "-"}</div>
            </div>
          </details>

          {/* Step 3 Summary */}
          <details className="border border-gray-200 rounded-lg overflow-hidden">
            <summary className="px-3 sm:px-4 py-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                3. ATN Biomarkers
              </h3>
              <button 
                onClick={(e) => { e.preventDefault(); handleEdit(2); }} 
                className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm"
              >
                Edit
              </button>
            </summary>
            <div className="px-3 sm:px-4 py-3 bg-gray-50 border-t space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Amyloid (Aβ42):</span>
                <span>{formData.step3.amyloidCSF || "-"} pg/mL</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Tau:</span>
                <span>{formData.step3.tauCSF || "-"} pg/mL</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">p-Tau181:</span>
                <span>{formData.step3.ptauCSF || "-"} pg/mL</span>
              </div>
              <div className="flex justify-between font-bold text-green-700 pt-2 border-t">
                <span>Hippo Ratio:</span>
                <span>{formData.step3.hippoRatio || "-"}%</span>
              </div>
            </div>
          </details>

          {/* Step 4 Summary */}
          <details className="border border-gray-200 rounded-lg overflow-hidden">
            <summary className="px-3 sm:px-4 py-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                4. Treatment Plan
              </h3>
              <button 
                onClick={(e) => { e.preventDefault(); handleEdit(3); }} 
                className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm"
              >
                Edit
              </button>
            </summary>
            <div className="px-3 sm:px-4 py-3 bg-gray-50 border-t space-y-3 text-xs sm:text-sm">
              <div>
                <span className="font-medium">Medication:</span>
                <p className="mt-1">{formData.step4.medication || "-"}</p>
              </div>
              <div>
                <span className="font-medium">Therapy:</span>
                <p className="mt-1">{formData.step4.therapy || "-"}</p>
              </div>
              <div>
                <span className="font-medium">Follow-up:</span>
                <p className="mt-1">{formData.step4.followUp || "-"}</p>
              </div>
            </div>
          </details>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
          <button
            onClick={() => setShowSummary(false)}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm sm:text-base"
          >
            Back to Edit
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 font-medium text-sm sm:text-base"
          >
            {isSubmitting ? "Submitting..." : "Submit Assessment"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Stepper steps={steps} currentStep={currentStep} />

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
        {currentStep === 0 && <Step1Detect data={formData.step1} onChange={(data) => updateFormData("step1", data)} />}
        {currentStep === 1 && <Step2Assess data={formData.step2} onChange={(data) => updateFormData("step2", data)} />}
        {currentStep === 2 && <Step3Diagnose data={formData.step3} onChange={(data) => updateFormData("step3", data)} />}
        {currentStep === 3 && <Step4Treat data={formData.step4} onChange={(data) => updateFormData("step4", data)} />}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 font-medium text-sm sm:text-base order-2 sm:order-1"
          >
            ← Previous
          </button>
          
          {currentStep < 3 ? (
            <button
              onClick={handleAnalyze}
              disabled={!isStepComplete() || isAnalyzing}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-sm sm:text-base order-1 sm:order-2"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze & Continue →"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base order-1 sm:order-2"
            >
              Review Summary →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}