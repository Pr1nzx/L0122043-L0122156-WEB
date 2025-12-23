"use client"

import { useState } from "react"
import Stepper from "./Stepper"
import Step1Detect from "./steps/Step1Detect"
import Step2Assess from "./steps/Step2Assess"
import Step3Diagnose from "./steps/Step3Diagnose"
import Step4Treat from "./steps/Step4Treat"
import { sendDiagnoseData } from "./api"

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
  const [diagnosisResult, setDiagnosisResult] = useState(null)

  const steps = [
    { title: "Clinical", description: "Initial Assessment" },
    { title: "Imaging", description: "Brain & Biomarkers" },
    { title: "Diagnosis", description: "Results & Analysis" },
    { title: "Treatment", description: "Plan & Follow-up" },
  ]

  const updateFormData = (step, data) => {
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }))
  }

  // Handle analyze button - submits all data when moving from Step 2 to Step 3
  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    
    try {
      const stepNumber = currentStep + 1

      if (stepNumber === 1) {
        // Just move to next step (Step 1 → Step 2)
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1)
        }
      } else if (stepNumber === 2) {
        // Step 2: Collect all data and send to backend for diagnosis before moving to Step 3
        console.log('🔵 DIAGNOSIS: Preparing request with all data...')
        console.log('Step1 data:', formData.step1)
        console.log('Step2 data:', formData.step2)
        
        // Merge all form data into payload according to PatientData schema
        const payload = {
          // Basic patient info
          age: formData.step1.age || null,
          
          // Cognitive assessments
          mmse_score: formData.step1.mmse_score || null,
          moca_score: formData.step1.moca_score || null,
          faq_score: formData.step2.faq_score || null,
          ad8_score: formData.step2.ad8_score || null,
          
          // Biomarkers - Amyloid (A)
          ab42_40_score: formData.step2.ab42_40_score || null,
          ab42_score: formData.step2.ab42_score || null,
          
          // Biomarkers - Tau (T)
          ptau_ab42_score: formData.step2.ptau_ab42_score || null,
          ptau181_score: formData.step2.ptau181_score || null,
          
          // Biomarkers - Neurodegeneration (N)
          t_tau_score: formData.step2.t_tau_score || null,
          hippocampal_vol: formData.step2.hippocampal_vol || null,
          
          // Imaging method selection
          imaging_method: formData.step2.imaging_method || [],
          
          // Clinical flags
          behavior_change: formData.step1.behavior_change || false,
          has_other_diseases: formData.step1.has_other_diseases || false,
          
          // Independence status (based on ADL/IADL)
          is_independent: formData.step1.is_independent !== undefined ? formData.step1.is_independent : null,
        }

        console.log('📤 DIAGNOSIS PAYLOAD:', payload)
        const response = await sendDiagnoseData(payload)
        
        if (response.success) {
          console.log('✅ Diagnosis received:', response)
          setDiagnosisResult(response)
          
          // Update step3 with diagnosis results
          updateFormData("step3", {
            diagnosis: response.diagnosis,
            severity: response.severity,
            clinical_status: response.clinical_status,
            recommended_actions: response.recommended_actions,
            recommended_activities: response.recommended_activities,
            message: response.message || "Diagnosis completed"
          })
          
          // Move to step 3 to show results
          setCurrentStep(2)
        }
        
      } else if (stepNumber === 3) {
        // Step 3 → Step 4: Move to treatment
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1)
        }
      } else if (stepNumber === 4) {
        // Move to summary
        setShowSummary(true)
      }

    } catch (error) {
      console.error("Analysis failed:", error)
      alert(error.message || "Failed to process diagnosis. Please check backend connection and try again.")
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
      console.log("Assessment submission complete with results:", diagnosisResult)
      alert("Assessment completed successfully!")
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
    const step1Data = formData.step1
    const step2Data = formData.step2
    
    switch(currentStep) {
      case 0: // Step 1: Clinical Assessment
        return !!step1Data.age &&
               typeof step1Data.mmse_score === 'number' && !isNaN(step1Data.mmse_score) &&
               typeof step1Data.moca_score === 'number' && !isNaN(step1Data.moca_score) &&
               typeof step1Data.behavior_change === 'boolean' &&
               step1Data.is_independent !== undefined
               
      case 1: // Step 2: Imaging & Biomarkers
        return step2Data.imaging_method && step2Data.imaging_method.length > 0
               
      case 2: // Step 3: Diagnosis (shown after analysis)
        return diagnosisResult !== null
        
      case 3: // Step 4: Treatment
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
                1. Clinical Assessment
              </h3>
              <button 
                onClick={(e) => { e.preventDefault(); handleEdit(0); }} 
                className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm"
              >
                Edit
              </button>
            </summary>
            <div className="px-3 sm:px-4 py-3 bg-gray-50 border-t grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div><span className="font-medium">Age:</span> {formData.step1.age || "-"} years</div>
              <div><span className="font-medium">MMSE:</span> {formData.step1.mmse_score || "-"}/30</div>
              <div><span className="font-medium">MoCA:</span> {formData.step1.moca_score || "-"}/30</div>
              <div><span className="font-medium">Behavior Changes:</span> {formData.step1.behavior_change ? "Yes" : "No"}</div>
              <div><span className="font-medium">Independent:</span> {formData.step1.is_independent ? "Yes" : "No"}</div>
            </div>
          </details>

          {/* Step 2 Summary */}
          <details className="border border-gray-200 rounded-lg overflow-hidden">
            <summary className="px-3 sm:px-4 py-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                2. Brain Imaging & Biomarkers
              </h3>
              <button 
                onClick={(e) => { e.preventDefault(); handleEdit(1); }} 
                className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm"
              >
                Edit
              </button>
            </summary>
            <div className="px-3 sm:px-4 py-3 bg-gray-50 border-t space-y-2 text-xs sm:text-sm">
              <div><span className="font-medium">Imaging Method:</span> {formData.step2.imaging_method?.join(", ") || "-"}</div>
              <div><span className="font-medium">Aβ42/40 Score:</span> {formData.step2.ab42_40_score || "-"}</div>
              <div><span className="font-medium">P-Tau/Aβ42 Score:</span> {formData.step2.ptau_ab42_score || "-"}</div>
              <div><span className="font-medium">Hippocampal Volume:</span> {formData.step2.hippocampal_vol || "-"}</div>
            </div>
          </details>

          {/* Step 3 Summary - Diagnosis Results */}
          <details open className="border-2 border-blue-300 rounded-lg overflow-hidden bg-blue-50">
            <summary className="px-3 sm:px-4 py-3 cursor-pointer hover:bg-blue-100 flex justify-between items-center">
              <h3 className="font-semibold text-blue-900 text-sm sm:text-base">
                3. Diagnosis Results
              </h3>
            </summary>
            <div className="px-3 sm:px-4 py-3 bg-white border-t space-y-3">
              {diagnosisResult && (
                <>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Diagnoses:</h4>
                    <ul className="space-y-1">
                      {diagnosisResult.diagnosis && diagnosisResult.diagnosis.length > 0 ? (
                        diagnosisResult.diagnosis.map((d, idx) => (
                          <li key={idx} className="text-sm text-gray-700">• {d}</li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-500">-</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Severity:</h4>
                    <ul className="space-y-1">
                      {diagnosisResult.severity && diagnosisResult.severity.length > 0 ? (
                        diagnosisResult.severity.map((s, idx) => (
                          <li key={idx} className="text-sm text-gray-700">• {s}</li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-500">-</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Clinical Status:</h4>
                    <ul className="space-y-1">
                      {diagnosisResult.clinical_status && diagnosisResult.clinical_status.length > 0 ? (
                        diagnosisResult.clinical_status.map((cs, idx) => (
                          <li key={idx} className="text-sm text-gray-700">• {cs}</li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-500">-</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Recommended Activities:</h4>
                    <ul className="space-y-1">
                      {diagnosisResult.recommended_activities && diagnosisResult.recommended_activities.length > 0 ? (
                        diagnosisResult.recommended_activities.map((ra, idx) => (
                          <li key={idx} className="text-sm text-gray-700">• {ra}</li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-500">-</li>
                      )}
                    </ul>
                  </div>
                </>
              )}
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
        {currentStep === 2 && <Step3Diagnose data={diagnosisResult || formData.step3} onChange={(data) => updateFormData("step3", data)} />}
        {currentStep === 3 && <Step4Treat data={formData.step4} onChange={(data) => updateFormData("step4", data)} />}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 font-medium text-sm sm:text-base order-2 sm:order-1"
          >
            ← Previous
          </button>
          
          {currentStep === 0 ? (
            <button
              onClick={handleAnalyze}
              disabled={!isStepComplete() || isAnalyzing}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-sm sm:text-base order-1 sm:order-2"
            >
              {isAnalyzing ? "Loading..." : "Continue →"}
            </button>
          ) : currentStep === 1 ? (
            <button
              onClick={handleAnalyze}
              disabled={!isStepComplete() || isAnalyzing}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-sm sm:text-base order-1 sm:order-2"
            >
              {isAnalyzing ? "Analyzing..." : "Get Diagnosis →"}
            </button>
          ) : currentStep === 2 ? (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !diagnosisResult}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-sm sm:text-base order-1 sm:order-2"
            >
              {isAnalyzing ? "Processing..." : "Continue to Treatment →"}
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
