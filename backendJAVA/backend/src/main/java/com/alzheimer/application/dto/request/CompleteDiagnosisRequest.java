package com.alzheimer.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Complete diagnosis request with all 3 steps")
public class CompleteDiagnosisRequest {
    
    @NotNull(message = "Step 1 data is required")
    @Valid
    @Schema(description = "Step 1 initial assessment data")
    private Step1Request step1;
    
    @NotNull(message = "Step 2 data is required")
    @Valid
    @Schema(description = "Step 2 clinical tests evaluation data")
    private Step2Request step2;
    
    @NotNull(message = "Step 3 data is required")
    @Valid
    @Schema(description = "Step 3 final diagnosis data")
    private Step3Request step3;
}
