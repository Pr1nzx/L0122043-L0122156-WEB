package com.alzheimer.application.service;

import com.alzheimer.application.dto.request.*;
import com.alzheimer.application.dto.response.*;
import com.alzheimer.infrastructure.ontology.manager.OntologyManagerImpl;
import com.alzheimer.infrastructure.utils.DiagnosticCutoffs;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class DiagnosisOrchestratorService {
    
    private final OntologyManagerImpl ontologyManager;
    
    private final Map<String, DiagnosisSession> activeSessions = new ConcurrentHashMap<>();
    private final Map<String, String> patientToSessionMap = new ConcurrentHashMap<>();
    
    public StepResponse processStep1(Step1Request request) {
        try {
            log.info("Processing Step 1 for patient: {}", request.getPatientId());
            
            // Generate session ID
            String sessionId = "sess_" + UUID.randomUUID().toString().substring(0, 8);
            
            // Convert request to ontology data
            Map<String, Object> patientData = new HashMap<>();
            patientData.put("age", request.getAge());
            patientData.put("hasFamilyHistory", request.getHasFamilyHistory());
            patientData.put("hasBehaviorChanges", request.getHasBehaviorChanges());
            patientData.put("hasOtherDiseases", false); // Default
            
            // Create patient in ontology
            Map<String, Object> ontologyResult = ontologyManager.createPatient(
                request.getPatientId(), patientData
            );
            
            // Store session
            DiagnosisSession session = new DiagnosisSession();
            session.setSessionId(sessionId);
            session.setPatientId(request.getPatientId());
            session.setStep1Data(request);
            session.setCreatedAt(LocalDateTime.now());
            session.setPatientIRI((String) ontologyResult.get("patientIRI"));
            
            activeSessions.put(sessionId, session);
            patientToSessionMap.put(request.getPatientId(), sessionId);
            
            // Prepare response
            StepResponse response = new StepResponse();
            response.setSessionId(sessionId);
            response.setPatientId(request.getPatientId());
            response.setStep("STEP1");
            response.setSuccess(true);
            response.setMessage("Initial assessment completed successfully");
            response.setNextStepEndpoint("/api/v1/diagnosis/step2");
            response.setTimestamp(LocalDateTime.now());
            
            // Add intermediate results
            Map<String, Object> intermediate = new HashMap<>();
            intermediate.put("patientCreated", true);
            intermediate.put("patientIRI", ontologyResult.get("patientIRI"));
            intermediate.put("nextStep", "clinical_tests");
            intermediate.put("sessionExpiresIn", "24h");
            response.setIntermediateResults(intermediate);
            
            log.info("Step 1 completed for patient {} - Session: {}", 
                    request.getPatientId(), sessionId);
            return response;
            
        } catch (Exception e) {
            log.error("Step 1 processing failed for patient: {}", request.getPatientId(), e);
            throw new RuntimeException("Step 1 processing failed: " + e.getMessage(), e);
        }
    }
    
    public StepResponse processStep2(Step2Request request) {
        try {
            log.info("Processing Step 2 for patient: {}", request.getPatientId());
            
            // Find session
            String sessionId = patientToSessionMap.get(request.getPatientId());
            if (sessionId == null) {
                throw new IllegalArgumentException(
                    "No active session found for patient: " + request.getPatientId() + 
                    ". Please complete Step 1 first."
                );
            }
            
            DiagnosisSession session = activeSessions.get(sessionId);
            if (session == null) {
                throw new IllegalArgumentException("Session not found: " + sessionId);
            }
            
            // Convert request to test data
            Map<String, Object> testData = new HashMap<>();
            testData.put("mmseScore", request.getMmseScore());
            testData.put("mocaScore", request.getMocaScore());
            testData.put("faqScore", request.getFaqScore());
            testData.put("ad8Score", request.getAd8Score());
            testData.put("mtaScore", request.getMtaScore());
            testData.put("brainImagingType", request.getBrainImagingType());
            
            // Add biomarker data based on imaging type
            switch (request.getBrainImagingType()) {
                case "Elecsys":
                    if (request.getAbeta4240Ratio() != null) 
                        testData.put("abeta4240Ratio", request.getAbeta4240Ratio());
                    if (request.getPTauAbeta42Ratio() != null) 
                        testData.put("pTauAbeta42Ratio", request.getPTauAbeta42Ratio());
                    break;
                case "Innotest":
                    if (request.getAbeta42Score() != null) 
                        testData.put("abeta42Score", request.getAbeta42Score());
                    if (request.getTTau() != null) 
                        testData.put("tTau", request.getTTau());
                    break;
                case "Lumipulse":
                    if (request.getAbeta42Score() != null) 
                        testData.put("abeta42Score", request.getAbeta42Score());
                    if (request.getPTau181Score() != null) 
                        testData.put("pTau181Score", request.getPTau181Score());
                    break;
                case "MRIFreesurfer":
                    if (request.getHippocampalVolume() != null) 
                        testData.put("hippocampalVolume", request.getHippocampalVolume());
                    break;
                case "PlasmaSimoa":
                    if (request.getAbeta4240Ratio() != null) 
                        testData.put("abeta4240Ratio", request.getAbeta4240Ratio());
                    break;
            }
            
            // Add clinical test to ontology
            Map<String, Object> testResult = ontologyManager.addClinicalTest(
                request.getPatientId(), testData
            );
            
            // Update session
            session.setStep2Data(request);
            session.setUpdatedAt(LocalDateTime.now());
            
            // Execute preliminary reasoning
            Map<String, Object> reasoningResults = ontologyManager.executeReasoning(
                request.getPatientId()
            );
            
            // Prepare response
            StepResponse response = new StepResponse();
            response.setSessionId(sessionId);
            response.setPatientId(request.getPatientId());
            response.setStep("STEP2");
            response.setSuccess(true);
            response.setMessage("Clinical tests evaluation completed");
            response.setNextStepEndpoint("/api/v1/diagnosis/step3");
            response.setTimestamp(LocalDateTime.now());
            
            // Add intermediate results
            Map<String, Object> intermediate = new HashMap<>();
            intermediate.put("clinicalTestAdded", true);
            intermediate.put("testId", testResult.get("testId"));
            intermediate.put("reasoningPerformed", true);
            intermediate.put("inferredClasses", reasoningResults.get("inferredClasses"));
            intermediate.put("reasoningTimeMs", reasoningResults.get("reasoningTimeMs"));
            intermediate.put("nextStep", "final_diagnosis");
            response.setIntermediateResults(intermediate);
            
            log.info("Step 2 completed for patient {} - Session: {}", 
                    request.getPatientId(), sessionId);
            return response;
            
        } catch (Exception e) {
            log.error("Step 2 processing failed for patient: {}", request.getPatientId(), e);
            throw new RuntimeException("Step 2 processing failed: " + e.getMessage(), e);
        }
    }
    
    public DiagnosisResponse processStep3(Step3Request request) {
        try {
            log.info("Processing Step 3 for patient: {}", request.getPatientId());
            
            // ============ SESSION HANDLING: Auto-create if not exists ============
            String sessionId = request.getSessionId();
            if (sessionId == null || sessionId.isEmpty()) {
                sessionId = patientToSessionMap.get(request.getPatientId());
            }
            
            DiagnosisSession session;
            if (sessionId == null) {
                // Auto-create session if no prior session found
                log.warn("No prior session found for patient {}. Creating new session...", request.getPatientId());
                sessionId = "sess_" + UUID.randomUUID().toString().substring(0, 8);
                session = new DiagnosisSession();
                session.setSessionId(sessionId);
                session.setPatientId(request.getPatientId());
                session.setCreatedAt(LocalDateTime.now());
                
                // Try to get patient IRI if already exists
                Map<String, Object> patientData = ontologyManager.createPatient(
                    request.getPatientId(), new HashMap<>()
                );
                session.setPatientIRI((String) patientData.get("patientIRI"));
                
                activeSessions.put(sessionId, session);
                patientToSessionMap.put(request.getPatientId(), sessionId);
                log.info("Auto-created session for patient {}: {}", request.getPatientId(), sessionId);
            } else {
                session = activeSessions.get(sessionId);
                if (session == null) {
                    // Session ID provided but not found - create new with that ID
                    log.warn("Session {} not found in active sessions. Recreating...", sessionId);
                    session = new DiagnosisSession();
                    session.setSessionId(sessionId);
                    session.setPatientId(request.getPatientId());
                    session.setCreatedAt(LocalDateTime.now());
                    
                    Map<String, Object> patientData = ontologyManager.createPatient(
                        request.getPatientId(), new HashMap<>()
                    );
                    session.setPatientIRI((String) patientData.get("patientIRI"));
                    
                    activeSessions.put(sessionId, session);
                    patientToSessionMap.put(request.getPatientId(), sessionId);
                }
            }
            
            // Update session
            session.setStep3Data(request);
            session.setUpdatedAt(LocalDateTime.now());
            
            // ============ CALCULATE ATN STATUS USING CUTOFF VALUES ============
            String amyloidStatus = DiagnosticCutoffs.classifyAmyloidStatus(request.getAbeta4240Ratio());
            String tauStatus = DiagnosticCutoffs.classifyTauStatus(request.getPTauAbeta42Ratio());
            String neurodegenStatus = DiagnosticCutoffs.classifyNeurodegenStatus(request.getHippocampalVolume());
            String atnProfile = DiagnosticCutoffs.getATNProfile(amyloidStatus, tauStatus, neurodegenStatus);
            
            log.info("ATN Profile for patient {}: {} (A:{} T:{} N:{})", 
                    request.getPatientId(), atnProfile, amyloidStatus, tauStatus, neurodegenStatus);
            
            // ============ INFER DISEASE STAGE ============
            String diseaseStage = DiagnosticCutoffs.inferComprehensiveStage(
                request.getMmseScore(),
                amyloidStatus,
                tauStatus,
                neurodegenStatus,
                request.getMtaScore()
            );
            
            log.info("Inferred disease stage for patient {}: {}", request.getPatientId(), diseaseStage);
            
            // ============ DETERMINE AD DIAGNOSIS ============
            boolean meetsADCriteria = DiagnosticCutoffs.meetADCriteria(amyloidStatus, tauStatus, neurodegenStatus);
            String diagnosis = meetsADCriteria ? "Alzheimer's Disease Dementia" : "Suspected Cognitive Impairment";
            String confidenceLevel = meetsADCriteria ? "High" : "Medium";
            
            // Execute comprehensive reasoning
            Map<String, Object> finalReasoning = ontologyManager.executeReasoning(
                request.getPatientId()
            );
            
            // Generate diagnosis with computed values
            DiagnosisResponse response = generateDiagnosisResponseWithATN(
                session, finalReasoning, request, 
                amyloidStatus, tauStatus, neurodegenStatus, 
                atnProfile, diseaseStage, diagnosis, confidenceLevel
            );
            
            // Mark session as completed
            session.setCompleted(true);
            session.setDiagnosisResult(response);
            
            log.info("Step 3 completed for patient {} - Diagnosis: {} - Stage: {}", 
                    request.getPatientId(), diagnosis, diseaseStage);
            return response;
            
        } catch (Exception e) {
            log.error("Step 3 processing failed for patient: {}", request.getPatientId(), e);
            throw new RuntimeException("Step 3 processing failed: " + e.getMessage(), e);
        }
    }
    
    public DiagnosisResponse completeDiagnosis(CompleteDiagnosisRequest request) {
        // Process all steps sequentially
        StepResponse step1Response = processStep1(request.getStep1());
        StepResponse step2Response = processStep2(request.getStep2());
        return processStep3(request.getStep3());
    }
    
    public DiagnosisResponse getSessionResults(String sessionId) {
        DiagnosisSession session = activeSessions.get(sessionId);
        if (session == null) {
            throw new IllegalArgumentException("Session not found: " + sessionId);
        }
        
        if (!session.isCompleted()) {
            throw new IllegalStateException("Diagnosis not completed for session: " + sessionId);
        }
        
        return session.getDiagnosisResult();
    }
    
    public Map<String, Object> clearSession(String sessionId) {
        DiagnosisSession session = activeSessions.remove(sessionId);
        if (session != null) {
            patientToSessionMap.remove(session.getPatientId());
            
            // Clear ontology data
            ontologyManager.clearPatientData(session.getPatientId());
            
            return Map.of(
                "sessionId", sessionId,
                "cleared", true,
                "patientId", session.getPatientId(),
                "timestamp", LocalDateTime.now(),
                "message", "Session cleared successfully"
            );
        }
        
        return Map.of(
            "sessionId", sessionId,
            "cleared", false,
            "message", "Session not found",
            "timestamp", LocalDateTime.now()
        );
    }
    
    // Helper methods
    private DiagnosisResponse generateDiagnosisResponse(
            DiagnosisSession session, 
            Map<String, Object> reasoningResults,
            Step3Request request) {
        
        DiagnosisResponse response = new DiagnosisResponse();
        response.setPatientId(session.getPatientId());
        response.setSessionId(session.getSessionId());
        response.setTimestamp(LocalDateTime.now());
        
        // Determine diagnosis from ontology inferences
        @SuppressWarnings("unchecked")
        List<String> inferredClasses = (List<String>) reasoningResults.get("inferredClasses");
        
        String diagnosis = determineDiagnosis(inferredClasses);
        String stage = determineStage(inferredClasses, request);
        String atnProfile = determineATNProfile(request);
        
        response.setDiagnosis(diagnosis);
        response.setDiseaseStage(stage);
        response.setAtnProfile(atnProfile);
        response.setConfidenceLevel(determineConfidence(inferredClasses));
        
        // Set inferred classes
        response.setInferredClasses(inferredClasses);
        
        // Generate recommendations
        response.setRecommendedActions(generateRecommendedActions(diagnosis, stage));
        response.setRecommendedActivities(
            request.getRecommendedActivities() != null ? 
            request.getRecommendedActivities() : 
            generateRecommendedActivities(stage)
        );
        response.setRequiredTests(generateRequiredTests(diagnosis, atnProfile, request));
        
        // Set SWRL rule triggers (simulated for now)
        response.setTriggeredRules(generateRuleTriggers(inferredClasses));
        
        // Set evidence
        Map<String, Object> evidence = new HashMap<>();
        evidence.put("clinicalData", session.getStep1Data());
        evidence.put("testResults", session.getStep2Data());
        evidence.put("biomarkers", request);
        response.setEvidence(evidence);
        
        // Set biomarker results
        response.setBiomarkerResults(generateBiomarkerResults(session, request));
        
        // Set metadata
        response.setReasoningTimeMs((Long) reasoningResults.getOrDefault("reasoningTimeMs", 0L));
        response.setIsConsistent((Boolean) reasoningResults.getOrDefault("isConsistent", true));
        response.setOntologyVersion("1.0");
        
        // Set follow-up
        response.setFollowUpSchedule(generateFollowUpSchedule(diagnosis, stage, request));
        response.setReferralRecommendation("Neurologist consultation recommended");
        
        return response;
    }
    
    /**
     * NEW: Generate diagnosis response with computed ATN values using cutoffs
     */
    private DiagnosisResponse generateDiagnosisResponseWithATN(
            DiagnosisSession session, 
            Map<String, Object> reasoningResults,
            Step3Request request,
            String amyloidStatus,
            String tauStatus,
            String neurodegenStatus,
            String atnProfile,
            String diseaseStage,
            String diagnosis,
            String confidenceLevel) {
        
        DiagnosisResponse response = new DiagnosisResponse();
        response.setPatientId(session.getPatientId());
        response.setSessionId(session.getSessionId());
        response.setTimestamp(LocalDateTime.now());
        
        // Set computed values
        response.setDiagnosis(diagnosis);
        response.setDiseaseStage(diseaseStage);
        response.setAtnProfile(atnProfile);
        response.setConfidenceLevel(confidenceLevel);
        
        // Inferred classes
        @SuppressWarnings("unchecked")
        List<String> inferredClasses = (List<String>) reasoningResults.getOrDefault("inferredClasses", new ArrayList<>());
        response.setInferredClasses(inferredClasses);
        
        // Generate recommendations based on computed values
        response.setRecommendedActions(generateRecommendedActions(diagnosis, diseaseStage));
        response.setRecommendedActivities(
            request.getRecommendedActivities() != null ? 
            request.getRecommendedActivities() : 
            generateRecommendedActivities(diseaseStage)
        );
        response.setRequiredTests(generateRequiredTests(diagnosis, atnProfile, request));
        
        // Set SWRL rule triggers
        response.setTriggeredRules(generateRuleTriggers(inferredClasses));
        
        // Set evidence
        Map<String, Object> evidence = new HashMap<>();
        evidence.put("clinicalData", session.getStep1Data());
        evidence.put("testResults", session.getStep2Data());
        evidence.put("biomarkerValues", Map.of(
            "abeta4240Ratio", request.getAbeta4240Ratio(),
            "pTauAbeta42Ratio", request.getPTauAbeta42Ratio(),
            "hippocampalVolume", request.getHippocampalVolume(),
            "mtaScore", request.getMtaScore()
        ));
        evidence.put("atnClassification", Map.of(
            "amyloidStatus", amyloidStatus,
            "tauStatus", tauStatus,
            "neurodegenStatus", neurodegenStatus,
            "atnProfile", atnProfile
        ));
        addDiagnosticCutoffsSummaryToEvidence(evidence);
        response.setEvidence(evidence);
        
        // Set biomarker results
        response.setBiomarkerResults(generateBiomarkerResults(session, request));
        
        // Set metadata
        response.setReasoningTimeMs((Long) reasoningResults.getOrDefault("reasoningTimeMs", 0L));
        response.setIsConsistent((Boolean) reasoningResults.getOrDefault("isConsistent", true));
        response.setOntologyVersion("1.0");
        
        // Set follow-up
        response.setFollowUpSchedule(generateFollowUpSchedule(diagnosis, diseaseStage, request));
        response.setReferralRecommendation("Neurologist consultation recommended");
        
        log.debug("Generated diagnosis response with ATN profile: {} for patient {}", 
                 atnProfile, session.getPatientId());
        
        return response;
    }
    
    /**
     * Get summary of diagnostic cutoffs used
     */
    private void addDiagnosticCutoffsSummaryToEvidence(Map<String, Object> evidence) {
        evidence.put("diagnosticCutoffs", Map.of(
            "mmseRanges", Map.of(
                "mild", "21-24",
                "moderate", "10-20",
                "severe", "≤9"
            ),
            "biomarkerCutoffs", Map.of(
                "abeta4240Ratio", "< 0.01 = Positive",
                "pTauAbeta42Ratio", "> 0.09 = Positive",
                "hippocampalVolume", "< 2500 = Atrophy"
            ),
            "atnFramework", "A (Amyloid) + T (Tau) + N (Neurodegeneration)"
        ));
    }
    
    private String determineDiagnosis(List<String> inferredClasses) {
        // Logic based on ontology classes
        if (inferredClasses.contains("PersonWithADDementia")) {
            return "Alzheimer's Disease Dementia";
        } else if (inferredClasses.contains("PersonWithMCI")) {
            return "Mild Cognitive Impairment due to Alzheimer's";
        } else if (inferredClasses.contains("AsymptomaticAD")) {
            return "Preclinical Alzheimer's Disease";
        } else if (inferredClasses.contains("PersonWithNonADDementia")) {
            return "Non-AD Dementia";
        } else if (inferredClasses.contains("SubjectiveCognitiveDecline")) {
            return "Subjective Cognitive Decline";
        }
        return "Cognitive Impairment - Further evaluation needed";
    }
    
    private String determineStage(List<String> inferredClasses, Step3Request request) {
        // Use cutoff-based inference from MMSE score
        String stage = DiagnosticCutoffs.inferDiseaseStageFromMMSE(request.getMmseScore());
        
        // If ontology inference contradicts, use ontology (more authoritative)
        if (inferredClasses.contains("SevereStage")) {
            return "Severe";
        } else if (inferredClasses.contains("ModerateStage")) {
            return "Moderate";
        } else if (inferredClasses.contains("MildStage")) {
            return "Mild";
        }
        
        return stage;
    }
    
    private String determineATNProfile(Step3Request request) {
        // Compute ATN status using cutoff values
        String amyloidStatus = DiagnosticCutoffs.classifyAmyloidStatus(request.getAbeta4240Ratio());
        String tauStatus = DiagnosticCutoffs.classifyTauStatus(request.getPTauAbeta42Ratio());
        String neurodegenStatus = DiagnosticCutoffs.classifyNeurodegenStatus(request.getHippocampalVolume());
        
        // Return ATN profile using the utility method
        return DiagnosticCutoffs.getATNProfile(amyloidStatus, tauStatus, neurodegenStatus);
    }
    
    private String determineConfidence(List<String> inferredClasses) {
        int confidenceScore = 0;
        if (inferredClasses.contains("AmyloidPositive")) confidenceScore++;
        if (inferredClasses.contains("TauPositive")) confidenceScore++;
        if (inferredClasses.contains("NeurodegenerationPositive")) confidenceScore++;
        
        if (confidenceScore >= 2) return "High";
        if (confidenceScore == 1) return "Medium";
        return "Low";
    }
    
    private List<String> generateRecommendedActions(String diagnosis, String stage) {
        List<String> actions = new ArrayList<>();
        actions.add("Neurologist referral");
        
        if (diagnosis.contains("Alzheimer")) {
            actions.add("Pharmacological treatment discussion");
            actions.add("Caregiver support and education");
        }
        
        if ("Severe".equals(stage)) {
            actions.add("Advanced care planning");
            actions.add("Safety assessment for home environment");
            actions.add("Palliative care consultation");
        } else if ("Moderate".equals(stage)) {
            actions.add("Cognitive rehabilitation therapy");
            actions.add("Behavioral management strategies");
        }
        
        return actions;
    }
    
    private List<String> generateRecommendedActivities(String stage) {
        switch (stage) {
            case "Mild":
                return Arrays.asList(
                    "Cognitive training exercises",
                    "Regular physical activity",
                    "Social engagement activities",
                    "Music therapy",
                    "Art therapy"
                );
            case "Moderate":
                return Arrays.asList(
                    "Reminiscence therapy",
                    "Simplified daily tasks",
                    "Structured routines",
                    "Sensory stimulation",
                    "Adapted physical activities"
                );
            case "Severe":
                return Arrays.asList(
                    "Basic ADL assistance",
                    "Comfort care activities",
                    "Gentle sensory activities",
                    "Familiar music listening",
                    "Touch therapy"
                );
            default:
                return Arrays.asList(
                    "Regular cognitive assessment",
                    "Healthy lifestyle maintenance",
                    "Social activities"
                );
        }
    }
    
    private List<String> generateRequiredTests(String diagnosis, String atnProfile, Step3Request request) {
        List<String> tests = new ArrayList<>();
        tests.add("Annual cognitive assessment");
        
        if (diagnosis.contains("Alzheimer")) {
            if (!atnProfile.contains("A+") && request.getNeedsBiomarkersTest()) {
                tests.add("Amyloid PET or CSF biomarkers");
            }
            if (!atnProfile.contains("T+") && request.getNeedsBiomarkersTest()) {
                tests.add("Tau PET or CSF p-tau");
            }
        }
        
        tests.add("Basic metabolic panel");
        tests.add("Thyroid function tests");
        tests.add("Vitamin B12 and folate levels");
        
        if (request.getNeedsStructuralImaging()) {
            tests.add("Brain MRI with hippocampal volumetry");
        }
        
        return tests;
    }
    
    private List<DiagnosisResponse.RuleTrigger> generateRuleTriggers(List<String> inferredClasses) {
        List<DiagnosisResponse.RuleTrigger> triggers = new ArrayList<>();
        
        // Simulate rule triggers based on inferred classes
        if (inferredClasses.contains("PersonWithADDementia")) {
            DiagnosisResponse.RuleTrigger trigger = new DiagnosisResponse.RuleTrigger();
            trigger.setRuleName("PersonWithADDementia_Rule");
            trigger.setDescription("Identifies Alzheimer's Disease Dementia based on biomarker profile and cognitive impairment");
            trigger.setParameters(Map.of("amyloid", "positive", "tau", "positive", "neurodegeneration", "positive"));
            trigger.setTriggeredAt(LocalDateTime.now());
            triggers.add(trigger);
        }
        
        if (inferredClasses.contains("AmyloidPositive")) {
            DiagnosisResponse.RuleTrigger trigger = new DiagnosisResponse.RuleTrigger();
            trigger.setRuleName("AmyloidPositive_Rule");
            trigger.setDescription("Detects positive amyloid biomarkers based on test thresholds");
            trigger.setParameters(Map.of("threshold", "0.091", "testType", "Elecsys"));
            trigger.setTriggeredAt(LocalDateTime.now());
            triggers.add(trigger);
        }
        
        return triggers;
    }
    
    private Map<String, Object> generateBiomarkerResults(DiagnosisSession session, Step3Request request) {
        Map<String, Object> results = new HashMap<>();
        
        // Compute ATN classification using new numeric values
        String amyloidStatus = DiagnosticCutoffs.classifyAmyloidStatus(request.getAbeta4240Ratio());
        String tauStatus = DiagnosticCutoffs.classifyTauStatus(request.getPTauAbeta42Ratio());
        String neurodegenStatus = DiagnosticCutoffs.classifyNeurodegenStatus(request.getHippocampalVolume());
        
        results.put("amyloid", Map.of(
            "ratio", request.getAbeta4240Ratio(),
            "status", amyloidStatus
        ));
        results.put("tau", Map.of(
            "ratio", request.getPTauAbeta42Ratio(),
            "status", tauStatus
        ));
        results.put("neurodegeneration", Map.of(
            "volume", request.getHippocampalVolume(),
            "status", neurodegenStatus,
            "mta", request.getMtaScore()
        ));
        results.put("atnClassification", DiagnosticCutoffs.getATNProfile(amyloidStatus, tauStatus, neurodegenStatus));
        results.put("mmseScore", request.getMmseScore());
        results.put("interpretation", getBiomarkerInterpretation(amyloidStatus, tauStatus, neurodegenStatus));
        return results;
    }
    
    private String getBiomarkerInterpretation(String amyloidStatus, String tauStatus, String neurodegenStatus) {
        if ("Positive".equals(amyloidStatus) && 
            "Positive".equals(tauStatus) && 
            "Positive".equals(neurodegenStatus)) {
            return "Typical Alzheimer's Disease biomarker profile";
        } else if ("Positive".equals(amyloidStatus) && 
                   "Negative".equals(tauStatus)) {
            return "Alzheimer's pathologic change";
        } else if ("Negative".equals(amyloidStatus) && 
                   "Positive".equals(neurodegenStatus)) {
            return "Suspected non-AD pathology";
        }
        return "Atypical biomarker profile - further investigation needed";
    }
    
    private String generateFollowUpSchedule(String diagnosis, String stage, Step3Request request) {
        if (request.getNeedsFollowUp6Months()) {
            return "6-month follow-up recommended";
        }
        
        switch (stage) {
            case "Severe": return "3-month follow-up";
            case "Moderate": return "6-month follow-up";
            case "Mild": return "12-month follow-up";
            default: return "Annual follow-up";
        }
    }
    
    // Session data class
    @Data
    private static class DiagnosisSession {
        private String sessionId;
        private String patientId;
        private String patientIRI;
        private Step1Request step1Data;
        private Step2Request step2Data;
        private Step3Request step3Data;
        private DiagnosisResponse diagnosisResult;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private boolean completed = false;
    }
}
