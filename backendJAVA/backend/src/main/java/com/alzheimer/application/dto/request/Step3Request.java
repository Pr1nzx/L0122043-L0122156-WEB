package com.alzheimer.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "Step 3: Final Diagnosis and Recommendations Request")
public class Step3Request {
    
    @NotBlank(message = "Patient ID is required")
    @Schema(description = "Unique patient identifier", example = "PT001")
    private String patientId;
    
    @NotBlank(message = "Amyloid status is required")
    @Schema(description = "Amyloid biomarker status", 
            allowableValues = {"Positive", "Negative", "Unknown"},
            example = "Positive")
    private String amyloidStatus;
    
    @NotBlank(message = "Tau status is required")
    @Schema(description = "Tau biomarker status", 
            allowableValues = {"Positive", "Negative", "Unknown"},
            example = "Positive")
    private String tauStatus;
    
    @NotBlank(message = "Neurodegeneration status is required")
    @Schema(description = "Neurodegeneration biomarker status", 
            allowableValues = {"Positive", "Negative", "Unknown"},
            example = "Positive")
    private String neurodegenerationStatus;
    
    @NotBlank(message = "Disease stage is required")
    @Schema(description = "Alzheimer's disease stage", 
            allowableValues = {"Mild", "Moderate", "Severe"},
            example = "Moderate")
    private String diseaseStage;
    
    @NotNull(message = "Biomarkers test recommendation is required")
    @Schema(description = "Whether biomarkers test is needed", example = "false")
    private Boolean needsBiomarkersTest;
    
    @NotNull(message = "Structural imaging recommendation is required")
    @Schema(description = "Whether structural imaging is needed", example = "false")
    private Boolean needsStructuralImaging;
    
    @NotNull(message = "Follow-up recommendation is required")
    @Schema(description = "Whether follow-up in 6 months is needed", example = "true")
    private Boolean needsFollowUp6Months;
    
    @Schema(description = "List of recommended activities")
    private List<String> recommendedActivities;
    
    @Size(max = 2000, message = "Clinical notes cannot exceed 2000 characters")
    @Schema(description = "Clinical notes and observations", example = "Patient shows typical AD profile with positive biomarkers.")
    private String clinicalNotes;
}
