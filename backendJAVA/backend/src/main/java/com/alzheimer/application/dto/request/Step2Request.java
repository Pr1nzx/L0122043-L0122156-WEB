package com.alzheimer.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Schema(description = "Step 2: Clinical Tests and Biomarkers Request")
public class Step2Request {
    
    @NotBlank(message = "Patient ID is required")
    @Schema(description = "Unique patient identifier", example = "PT001")
    private String patientId;
    
    @NotNull(message = "MMSE score is required")
    @Min(value = 0, message = "MMSE score must be at least 0")
    @Max(value = 30, message = "MMSE score must be at most 30")
    @Schema(description = "MMSE score", example = "22")
    private Integer mmseScore;
    
    @Min(value = 0, message = "MoCA score must be at least 0")
    @Max(value = 30, message = "MoCA score must be at most 30")
    @Schema(description = "MoCA score", example = "20")
    private Integer mocaScore;
    
    @Min(value = 0, message = "FAQ score must be at least 0")
    @Max(value = 30, message = "FAQ score must be at most 30")
    @Schema(description = "Functional Activities Questionnaire score", example = "12")
    private Integer faqScore;
    
    @Min(value = 0, message = "AD8 score must be at least 0")
    @Max(value = 8, message = "AD8 score must be at most 8")
    @Schema(description = "AD8 Dementia Screening score", example = "4")
    private Integer ad8Score;
    
    @Min(value = 0, message = "MTA score must be at least 0")
    @Max(value = 4, message = "MTA score must be at most 4")
    @Schema(description = "Medial Temporal Atrophy score", example = "2")
    private Integer mtaScore;
    
    @NotBlank(message = "Brain imaging type is required")
    @Schema(description = "Type of brain imaging/biomarker test", 
            allowableValues = {"Elecsys", "Innotest", "Lumipulse", "MRIFreesurfer", "PlasmaSimoa"},
            example = "Elecsys")
    private String brainImagingType;
    
    @Schema(description = "Aβ42 score", example = "500")
    private Double abeta42Score;
    
    @Schema(description = "P-Tau181 score", example = "60")
    private Double pTau181Score;
    
    @Schema(description = "T-Tau score", example = "400")
    private Double tTau;
    
    @Schema(description = "Aβ42/40 ratio", example = "0.05")
    private Double abeta4240Ratio;
    
    @Schema(description = "P-Tau/Aβ42 ratio", example = "0.03")
    private Double pTauAbeta42Ratio;
    
    @Schema(description = "Adjusted hippocampal volume", example = "2500.5")
    private Double hippocampalVolume;
    
    @NotNull(message = "Rule-out diseases information is required")
    @Schema(description = "Whether rule-out diseases have been checked", example = "true")
    private Boolean hasRuleOutDiseases;
    
    @Schema(description = "Vitamin B12 deficiency", example = "false")
    private Boolean hasVitaminB12Deficiency;
    
    @Schema(description = "Hypothyroidism", example = "false")
    private Boolean hasHypothyroidism;
    
    @Schema(description = "Uncontrolled diabetes", example = "false")
    private Boolean hasUncontrolledDiabetes;
}
