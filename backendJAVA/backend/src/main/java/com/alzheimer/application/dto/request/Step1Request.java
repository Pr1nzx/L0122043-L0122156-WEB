package com.alzheimer.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Schema(description = "Step 1: Initial Assessment Request")
public class Step1Request {
    
    @NotBlank(message = "Patient ID is required")
    @Schema(description = "Unique patient identifier", example = "PT001")
    private String patientId;
    
    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age must be at least 0")
    @Max(value = 120, message = "Age must be at most 120")
    @Schema(description = "Patient age in years", example = "72")
    private Integer age;
    
    @NotNull(message = "Family history information is required")
    @Schema(description = "Whether patient has family history of dementia", example = "true")
    private Boolean hasFamilyHistory;
    
    @Schema(description = "Type of family member diagnosis", 
            allowableValues = {"AD", "Non-AD Dementia", "Unknown"}, 
            example = "AD")
    private String familyMemberDiagnosis;
    
    @NotNull(message = "Subjective complaints information is required")
    @Schema(description = "Whether patient has subjective complaints", example = "true")
    private Boolean hasSubjectiveComplaints;
    
    @NotNull(message = "Behavior changes information is required")
    @Schema(description = "Whether patient has behavior changes", example = "true")
    private Boolean hasBehaviorChanges;
    
    @NotNull(message = "MMSE score is required")
    @Min(value = 0, message = "MMSE score must be at least 0")
    @Max(value = 30, message = "MMSE score must be at most 30")
    @Schema(description = "Mini-Mental State Examination score (0-30)", example = "22")
    private Integer mmseScore;
    
    @NotNull(message = "MoCA score is required")
    @Min(value = 0, message = "MoCA score must be at least 0")
    @Max(value = 30, message = "MoCA score must be at most 30")
    @Schema(description = "Montreal Cognitive Assessment score (0-30)", example = "20")
    private Integer mocaScore;
    
    @NotNull(message = "ADL independence information is required")
    @Schema(description = "Whether patient is independent in Activities of Daily Living", example = "true")
    private Boolean isIndependentADL;
    
    @NotNull(message = "IADL independence information is required")
    @Schema(description = "Whether patient is independent in Instrumental Activities of Daily Living", example = "false")
    private Boolean isIndependentIADL;
    
    @Schema(description = "Additional clinical notes", example = "Patient reports memory issues for 2 years")
    private String clinicalNotes;
}
