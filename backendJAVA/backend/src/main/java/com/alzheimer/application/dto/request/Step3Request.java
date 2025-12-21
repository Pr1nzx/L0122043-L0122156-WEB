package com.alzheimer.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "Step 3: Final Diagnosis and Recommendations Request")
public class Step3Request {
    
    @NotBlank(message = "Patient ID is required")
    @Schema(description = "Unique patient identifier", example = "PT001")
    private String patientId;
    
    @Schema(description = "Session ID from Step 1", example = "sess_09d894d5")
    private String sessionId;
    
    // ============ ATN BIOMARKER INPUTS (from Step 2 data) ============
    
    @NotNull(message = "Aβ42/40 ratio is required")
    @DecimalMin(value = "0.0", message = "Ratio must be >= 0")
    @JsonProperty("abeta4240Ratio")
    @Schema(description = "Amyloid-beta 42/40 ratio (lower = abnormal)", example = "0.008")
    private Double abeta4240Ratio;
    
    @NotNull(message = "P-Tau/Aβ42 ratio is required")
    @DecimalMin(value = "0.0", message = "Ratio must be >= 0")
    @JsonProperty("pTauAbeta42Ratio")
    @Schema(description = "Phosphorylated Tau / Aβ42 ratio (higher = abnormal)", example = "0.12")
    private Double pTauAbeta42Ratio;
    
    @NotNull(message = "Hippocampal volume is required")
    @DecimalMin(value = "0.0", message = "Volume must be >= 0")
    @JsonProperty("hippocampalVolume")
    @Schema(description = "Adjusted hippocampal volume (lower = atrophy/abnormal)", example = "2400.5")
    private Double hippocampalVolume;
    
    // ============ CLINICAL FINDINGS ============
    
    @Min(value = 0, message = "MTA score must be >= 0")
    @Max(value = 4, message = "MTA score must be <= 4")
    @Schema(description = "Medial Temporal Atrophy score (0-4)", example = "2")
    private Integer mtaScore;
    
    @Schema(description = "MRI findings description", example = "Hippocampal atrophy, ventricular enlargement")
    private String mriFindings;
    
    // ============ GENETIC FACTORS ============
    
    @Schema(description = "APOE genotype", 
            allowableValues = {"e2e2", "e2e3", "e2e4", "e3e3", "e3e4", "e4e4", "Unknown"},
            example = "e4e4")
    private String apoeGenotype;
    
    // ============ COGNITIVE SCORES (for reference/confirmation) ============
    
    @Min(value = 0, message = "MMSE score must be >= 0")
    @Max(value = 30, message = "MMSE score must be <= 30")
    @Schema(description = "MMSE score for disease stage confirmation", example = "18")
    private Integer mmseScore;
    
    // ============ RECOMMENDATIONS (auto-computed) ============
    
    @NotNull(message = "Biomarkers test recommendation required")
    @Schema(description = "Whether biomarkers test is needed", example = "false")
    private Boolean needsBiomarkersTest;
    
    @NotNull(message = "Structural imaging recommendation required")
    @Schema(description = "Whether structural imaging is needed", example = "false")
    private Boolean needsStructuralImaging;
    
    @NotNull(message = "Follow-up recommendation required")
    @Schema(description = "Whether follow-up in 6 months is needed", example = "true")
    private Boolean needsFollowUp6Months;
    
    @Schema(description = "List of recommended activities/interventions")
    private List<String> recommendedActivities;
    
    @Size(max = 2000, message = "Clinical notes cannot exceed 2000 characters")
    @Schema(description = "Clinical notes and observations", example = "Patient presents with A+T+N profile consistent with AD")
    private String clinicalNotes;
}
