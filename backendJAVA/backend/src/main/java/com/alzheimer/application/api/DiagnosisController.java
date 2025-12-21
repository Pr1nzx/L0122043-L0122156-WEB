package com.alzheimer.application.api;

import com.alzheimer.application.dto.request.*;
import com.alzheimer.application.dto.response.DiagnosisResponse;
import com.alzheimer.application.dto.response.StepResponse;
import com.alzheimer.application.service.DiagnosisOrchestratorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.Data;

import java.util.Map;

@RestController
@RequestMapping("/v1/diagnosis")
@Tag(name = "Diagnosis API", description = "3-Step Alzheimer Diagnosis Endpoints")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RequiredArgsConstructor
@Slf4j
public class DiagnosisController {
    
    private final DiagnosisOrchestratorService diagnosisService;
    
    @PostMapping("/step1")
    @Operation(summary = "Step 1 - Initial Assessment", 
               description = "Process initial patient assessment including demographics, family history, and basic cognitive tests")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Step 1 processed successfully",
                    content = @Content(schema = @Schema(implementation = StepResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<StepResponse> processStep1(
            @Parameter(description = "Step 1 assessment data", required = true)
            @Valid @RequestBody Step1Request request) {
        
        log.info("Processing Step 1 for patient: {}", request.getPatientId());
        StepResponse response = diagnosisService.processStep1(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/step2")
    @Operation(summary = "Step 2 - Clinical Tests Evaluation", 
               description = "Process clinical test results including biomarkers and imaging data")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Step 2 processed successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "404", description = "Patient session not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<StepResponse> processStep2(
            @Parameter(description = "Step 2 clinical test data", required = true)
            @Valid @RequestBody Step2Request request) {
        
        log.info("Processing Step 2 for patient: {}", request.getPatientId());
        StepResponse response = diagnosisService.processStep2(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/step3")
    @Operation(summary = "Step 3 - Final Diagnosis", 
               description = "Generate final diagnosis and recommendations based on all collected data")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Step 3 processed successfully",
                    content = @Content(schema = @Schema(implementation = DiagnosisResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "404", description = "Patient session not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<DiagnosisResponse> processStep3(
            @Parameter(description = "Step 3 diagnosis data", required = true)
            @Valid @RequestBody Step3Request request) {
        
        log.info("Processing Step 3 for patient: {}", request.getPatientId());
        DiagnosisResponse response = diagnosisService.processStep3(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/complete")
    @Operation(summary = "Complete 3-Step Diagnosis", 
               description = "Process all 3 steps in a single request")
    public ResponseEntity<DiagnosisResponse> completeDiagnosis(
            @Valid @RequestBody CompleteDiagnosisRequest request) {
        
        log.info("Processing complete diagnosis for patient: {}", request.getStep1().getPatientId());
        DiagnosisResponse response = diagnosisService.completeDiagnosis(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/session/{sessionId}")
    @Operation(summary = "Get Diagnosis Session Results", 
               description = "Retrieve diagnosis results for a specific session")
    public ResponseEntity<DiagnosisResponse> getSessionResults(
            @Parameter(description = "Session ID", required = true)
            @PathVariable String sessionId) {
        
        log.info("Retrieving results for session: {}", sessionId);
        DiagnosisResponse response = diagnosisService.getSessionResults(sessionId);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/session/{sessionId}")
    @Operation(summary = "Clear Diagnosis Session", 
               description = "Remove all data for a specific session")
    public ResponseEntity<Map<String, Object>> clearSession(
            @PathVariable String sessionId) {
        
        log.info("Clearing session: {}", sessionId);
        Map<String, Object> result = diagnosisService.clearSession(sessionId);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/health")
    @Operation(summary = "Diagnosis Service Health Check")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "service", "alzheimer-diagnosis",
            "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }
}
