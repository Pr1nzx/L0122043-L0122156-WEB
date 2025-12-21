package com.alzheimer.application.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Step Processing Response")
public class StepResponse {
    
    @Schema(description = "Diagnosis session ID", example = "sess_123456789")
    private String sessionId;
    
    @Schema(description = "Patient identifier", example = "PT001")
    private String patientId;
    
    @Schema(description = "Processing step number", example = "1")
    private String step;
    
    @Schema(description = "Processing success status", example = "true")
    private Boolean success;
    
    @Schema(description = "Processing message", example = "Initial assessment completed successfully")
    private String message;
    
    @Schema(description = "Intermediate processing results")
    private Map<String, Object> intermediateResults;
    
    @Schema(description = "Next step API endpoint", example = "/api/v1/diagnosis/step2")
    private String nextStepEndpoint;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "Processing timestamp")
    private LocalDateTime timestamp;
    
    @Schema(description = "Ontology consistency check result", example = "true")
    private Boolean ontologyConsistent;
}
