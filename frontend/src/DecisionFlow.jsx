"use client"

import { useState } from "react"
import Stepper from "./Stepper"
import Step1Detect from "./steps/Step1Detect"
import Step2Assess from "./steps/Step2Assess"
import Step3Diagnose from "./steps/Step3Diagnose"
import Step4Treat from "./steps/Step4Treat"
import { sendStep1Data, sendStep2Data, sendStep3Data } from "./api"

export default function DecisionFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [sessionId, setSessionId] = useState(null)
  const [formData, setFormData] = useState({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

  // Update step titles to match backend workflow
  const steps = [
    { title: "Clinical", description: "Initial Assessment" },
    { title: "Imaging", description: "Brain & Biomarkers" },
    { title: "ATN", description: "Diagnosis" },
    { title: "Treatment", description: "Plan & Follow-up" },
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
      const stepNumber = currentStep + 1
      let response

      if (stepNumber === 1) {
        // Step 1: Clinical Assessment
        console.log('🔵 STEP 1: Preparing request...')
        console.log('Step1 formData:', formData.step1)
        const s1 = formData.step1
        const s1Valid = !!s1.patientId &&
          typeof s1.age === 'number' && !isNaN(s1.age) &&
          typeof s1.hasFamilyHistory === 'boolean' &&
          typeof s1.hasSubjectiveComplaints === 'boolean' &&
          typeof s1.hasBehaviorChanges === 'boolean' &&
          typeof s1.mmseScore === 'number' && !isNaN(s1.mmseScore) &&
          typeof s1.mocaScore === 'number' && !isNaN(s1.mocaScore) &&
          typeof s1.isIndependentADL === 'boolean' &&
          typeof s1.isIndependentIADL === 'boolean'
        console.log('📎 STEP1 validation:', { patientId: s1.patientId, age: s1.age, mmseScore: s1.mmseScore, mocaScore: s1.mocaScore, hasFamilyHistory: s1.hasFamilyHistory, hasSubjectiveComplaints: s1.hasSubjectiveComplaints, hasBehaviorChanges: s1.hasBehaviorChanges, isIndependentADL: s1.isIndependentADL, isIndependentIADL: s1.isIndependentIADL, valid: s1Valid })
        if (!s1Valid) {
          alert('Step 1 incomplete or invalid. Please fill all required fields.')
          setIsAnalyzing(false)
          return
        }
        response = await sendStep1Data(formData.step1)
        
        if (response.success && response.sessionId) {
          setSessionId(response.sessionId)
          console.log('✅ Session created:', response.sessionId)
          
          // Update form data dengan response
          updateFormData("step1", {
            ...formData.step1,
            responseMessage: response.message
          })
        }
        
      } else if (stepNumber === 2) {
        // Step 2: Brain Imaging & Biomarkers
        if (!sessionId) {
          throw new Error("No session ID found. Please complete Step 1 first.")
        }
        
        // Combine with patient ID from step 1
        const step2Payload = {
          ...formData.step2,
          patientId: formData.step1.patientId,
          // Include MMSE and MoCA from step1 if not in step2 (MMSE is required)
          mmseScore: formData.step2.mmseScore ?? formData.step1.mmseScore,
          mocaScore: formData.step2.mocaScore ?? formData.step1.mocaScore,
          // Backend requires rule-out diseases boolean
          hasRuleOutDiseases: formData.step2.hasRuleOutDiseases ?? true,
        }
        console.log('📎 STEP2 validation:', {
          patientId: step2Payload.patientId,
          mmseScore: step2Payload.mmseScore,
          brainImagingType: step2Payload.brainImagingType,
          hasRuleOutDiseases: step2Payload.hasRuleOutDiseases,
        })
        
        console.log('🔵 STEP 2: Preparing request...')
        console.log('Step2 payload with sessionId:', step2Payload)
        response = await sendStep2Data(step2Payload, sessionId)
        
        if (response.success) {
          updateFormData("step2", {
            ...formData.step2,
            responseMessage: response.message
          })
        }
        
      } else if (stepNumber === 3) {
        // Step 3: ATN Diagnosis
        if (!sessionId) {
          throw new Error("No session ID found. Please complete Steps 1-2 first.")
        }
        
        // Build Step3 payload using Step2 biomarker data
        // Also include required recommendation flags to satisfy backend validation
        const amyloidPos = typeof formData.step2.abeta4240Ratio === 'number' && formData.step2.abeta4240Ratio <= 0.01
        const tauPos = typeof formData.step2.pTauAbeta42Ratio === 'number' && formData.step2.pTauAbeta42Ratio >= 0.10
        const neuroPos = typeof formData.step2.hippocampalVolume === 'number' && formData.step2.hippocampalVolume < 2000

        const step3Payload = {
          patientId: formData.step1.patientId,
          abeta4240Ratio: formData.step2.abeta4240Ratio,
          pTauAbeta42Ratio: formData.step2.pTauAbeta42Ratio,
          hippocampalVolume: formData.step2.hippocampalVolume,
          mtaScore: formData.step2.mtaScore,
          mriFindings: formData.step2.mriFindings || "",
          // Optional but helpful for staging
          mmseScore: formData.step1.mmseScore,
          // Required flags (backend @NotNull) — provide sensible defaults
          needsBiomarkersTest: !(amyloidPos && tauPos),
          needsStructuralImaging: formData.step2.mtaScore !== undefined ? formData.step2.mtaScore >= 1 : !neuroPos,
          needsFollowUp6Months: true,
          // Pass any clinician notes from Step 3 UI if present
          clinicalNotes: formData.step3?.clinicalNotes || "",
        }
        console.log('📎 STEP3 flags:', {
          amyloidPos,
          tauPos,
          neuroPos,
          needsBiomarkersTest: step3Payload.needsBiomarkersTest,
          needsStructuralImaging: step3Payload.needsStructuralImaging,
          needsFollowUp6Months: step3Payload.needsFollowUp6Months,
        })
        
        console.log('🔵 STEP 3: Preparing request...')
        console.log('Step3 payload with sessionId:', step3Payload)
        console.log('Full Step2 data available:', formData.step2)
        response = await sendStep3Data(step3Payload, sessionId)
        console.log('🔵 STEP 3: Response received - success:', response.success)
        
        if (response.success) {
          // Update step3 dengan diagnosis result
          console.log('✅ Step3 Response received:', response)
          console.log('✅ Diagnosis:', response.diagnosis)
          console.log('✅ ATN Profile:', response.atnProfile)
          console.log('✅ Statuses:', {
            amyloidStatus: response.amyloidStatus,
            tauStatus: response.tauStatus,
            neurodegenerationStatus: response.neurodegenerationStatus
          })
          updateFormData("step3", {
            diagnosis: response.diagnosis || response.data?.diagnosis,
            atnProfile: response.atnProfile || response.data?.atnProfile,
            message: response.message,
            inferredClasses: response.data?.inferredClasses,
            amyloidStatus: response.amyloidStatus || response.data?.amyloidStatus,
            tauStatus: response.tauStatus || response.data?.tauStatus,
            neurodegenerationStatus: response.neurodegenerationStatus || response.data?.neurodegenerationStatus,
            abeta4240Ratio: formData.step2.abeta4240Ratio,
            pTauAbeta42Ratio: formData.step2.pTauAbeta42Ratio,
            hippocampalVolume: formData.step2.hippocampalVolume
          })
          
          // Populate Step 4 dengan diagnosis
          updateFormData("step4", {
            diagnosisResult: response.diagnosis || response.data?.diagnosis,
            severity: response.data?.severity
          })
          console.log('🔵 STEP 3: Form data updated, proceeding to next step...')
        }
      }

      // Check if we can proceed
      if (response && response.success) {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1)
        } else {
          setShowSummary(true)
        }
      } else {
        alert(response?.message || "Assessment stopped. Please check your inputs.")
      }
      
    } catch (error) {
      console.error("Analysis failed:", error)
      alert(error.message || "Failed to analyze results. Please check backend connection and try again.")
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
      console.log("Final assessment submission:", {
        sessionId,
        ...formData
      })
      
      alert("Assessment completed successfully! Session ID: " + sessionId)
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
    const currentData = formData[`step${currentStep + 1}`]
    
    switch(currentStep) {
      case 0: // Step 1: Clinical Assessment
        return !!currentData.patientId &&
               typeof currentData.age === 'number' && !isNaN(currentData.age) &&
               typeof currentData.hasFamilyHistory === 'boolean' &&
               typeof currentData.hasSubjectiveComplaints === 'boolean' &&
               typeof currentData.hasBehaviorChanges === 'boolean' &&
               typeof currentData.mmseScore === 'number' && !isNaN(currentData.mmseScore) &&
               typeof currentData.mocaScore === 'number' && !isNaN(currentData.mocaScore) &&
               typeof currentData.isIndependentADL === 'boolean' &&
               typeof currentData.isIndependentIADL === 'boolean'
               
      case 1: // Step 2: Imaging & Biomarkers
         return !!currentData.brainImagingType &&
           typeof currentData.hasRuleOutDiseases === 'boolean'
               
      case 2: // Step 3: ATN Diagnosis
        return true // Auto-populated from Step 2 + backend response
        
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

        {sessionId && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-mono">
              <span className="font-semibold">Session ID:</span> {sessionId}
            </p>
          </div>
        )}

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
              <div><span className="font-medium">Patient ID:</span> {formData.step1.patientId || "-"}</div>
              <div><span className="font-medium">Age:</span> {formData.step1.age || "-"} years</div>
              <div><span className="font-medium">Family History:</span> {formData.step1.hasFamilyHistory ? "Yes" : "No"}</div>
              <div><span className="font-medium">MMSE:</span> {formData.step1.mmseScore || "-"}/30</div>
              <div><span className="font-medium">MoCA:</span> {formData.step1.mocaScore || "-"}/30</div>
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
              <div><span className="font-medium">Imaging Type:</span> {formData.step2.brainImagingType || "-"}</div>
              <div><span className="font-medium">Aβ42/40 Ratio:</span> {formData.step2.abeta4240Ratio || "-"}</div>
              <div><span className="font-medium">P-Tau/Aβ42 Ratio:</span> {formData.step2.pTauAbeta42Ratio || "-"}</div>
              <div><span className="font-medium">Adjusted Hippo Volume:</span> {formData.step2.hippocampalVolume || "-"}</div>
            </div>
          </details>

          {/* Step 3 Summary - ATN Diagnosis */}
          <details open className="border-2 border-blue-300 rounded-lg overflow-hidden bg-blue-50">
            <summary className="px-3 sm:px-4 py-3 cursor-pointer hover:bg-blue-100 flex justify-between items-center">
              <h3 className="font-semibold text-blue-900 text-sm sm:text-base">
                3. ATN Diagnosis
              </h3>
              <button 
                onClick={(e) => { e.preventDefault(); handleEdit(2); }} 
                className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm"
              >
                Edit
              </button>
            </summary>
            <div className="px-3 sm:px-4 py-3 bg-white border-t space-y-2">
              <div className="text-lg font-bold text-blue-700">
                {formData.step3.diagnosis || "Pending diagnosis"}
              </div>
              {formData.step3.atnProfile && (
                <div className="font-mono text-sm text-gray-700">
                  ATN Profile: {formData.step3.atnProfile}
                </div>
              )}
              {formData.step3.message && (
                <div className="text-sm text-gray-600 mt-2">
                  {formData.step3.message}
                </div>
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

      {sessionId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <span className="font-semibold">Session:</span> 
          <span className="font-mono ml-2">{sessionId}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
        {currentStep === 0 && <Step1Detect data={formData.step1} onChange={(data) => updateFormData("step1", data)} />}
        {currentStep === 1 && <Step2Assess data={formData.step2} onChange={(data) => updateFormData("step2", data)} />}
        {currentStep === 2 && <Step3Diagnose data={formData.step3} onChange={(data) => updateFormData("step3", data)} step2Data={formData.step2} />}
        {currentStep === 3 && <Step4Treat data={formData.step4} onChange={(data) => updateFormData("step4", data)} />}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 font-medium text-sm sm:text-base order-2 sm:order-1"
          >
            ← Previous
          </button>
          
          {currentStep === 0 || currentStep === 1 ? (
            <button
              onClick={handleAnalyze}
              disabled={!isStepComplete() || isAnalyzing}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-sm sm:text-base order-1 sm:order-2"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze & Continue →"}
            </button>
          ) : currentStep === 2 ? (
            <button
              onClick={handleAnalyze}
              disabled={!isStepComplete() || isAnalyzing}
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
