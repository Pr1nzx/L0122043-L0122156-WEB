package com.alzheimer.application.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Complete Diagnosis Response")
public class DiagnosisResponse {
    
    @Schema(description = "Patient identifier", example = "PT001")
    private String patientId;
    
    @Schema(description = "Diagnosis session ID", example = "sess_123456789")
    private String sessionId;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "Timestamp of diagnosis", example = "2025-12-20 14:30:00")
    private LocalDateTime timestamp;
    
    @Schema(description = "Primary diagnosis", example = "Alzheimer's Disease Dementia")
    private String diagnosis;
    
    @Schema(description = "Confidence level of diagnosis", 
            allowableValues = {"High", "Medium", "Low"},
            example = "High")
    private String confidenceLevel;
    
    @Schema(description = "Disease stage", example = "Moderate")
    private String diseaseStage;
    
    @Schema(description = "ATN biomarker profile", example = "A+T+N+")
    private String atnProfile;
    
    @Schema(description = "List of classes inferred from ontology")
    private List<String> inferredClasses;
    
    @Schema(description = "List of recommended medical actions")
    private List<String> recommendedActions;
    
    @Schema(description = "List of recommended activities")
    private List<String> recommendedActivities;
    
    @Schema(description = "List of required follow-up tests")
    private List<String> requiredTests;
    
    @Schema(description = "List of triggered SWRL rules")
    private List<RuleTrigger> triggeredRules;
    
    @Schema(description = "Evidence and biomarker results")
    private Map<String, Object> evidence;
    
    @Schema(description = "Biomarker test results")
    private Map<String, Object> biomarkerResults;
    
    @Schema(description = "Recommended follow-up schedule", example = "6-month follow-up")
    private String followUpSchedule;
    
    @Schema(description = "Referral recommendation", example = "Neurologist referral")
    private String referralRecommendation;
    
    @Schema(description = "Reasoning execution time in milliseconds", example = "245")
    private Long reasoningTimeMs;
    
    @Schema(description = "Ontology consistency status", example = "true")
    private Boolean isConsistent;
    
    @Schema(description = "Ontology version", example = "1.0")
    private String ontologyVersion;
    
    @Schema(description = "SWRL Rule Trigger Details")
    @Data
    public static class RuleTrigger {
        @Schema(description = "Rule name", example = "AsymptomaticAD")
        private String ruleName;
        
        @Schema(description = "Rule description", example = "Identifies asymptomatic Alzheimer's disease")
        private String description;
        
        @Schema(description = "Rule parameters and bindings")
        private Map<String, Object> parameters;
        
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        @Schema(description = "Time when rule was triggered")
        private LocalDateTime triggeredAt;
    }
}
