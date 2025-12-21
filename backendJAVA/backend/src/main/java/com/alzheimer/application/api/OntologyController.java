package com.alzheimer.application.api;

import com.alzheimer.infrastructure.ontology.manager.SWRLRuleExecutor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/ontology")
@Tag(name = "Ontology API", description = "Ontology Management and Reasoning Operations")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RequiredArgsConstructor
@Slf4j
public class OntologyController {
    
    private final SWRLRuleExecutor swrlExecutor;
    
    @GetMapping("/status")
    @Operation(summary = "Get Ontology Status", 
               description = "Check ontology loading status and reasoner information")
    public ResponseEntity<Map<String, Object>> getOntologyStatus() {
        log.info("Checking ontology status");
        
        Map<String, Object> status = Map.of(
            "status", "loaded",
            "timestamp", new Date(),
            "reasoner", "Pellet 2.4.0",
            "profile", "OWL 2 DL (SROIQ(D))",
            "swrlEnabled", true,
            "loadedAt", new Date()
        );
        
        return ResponseEntity.ok(status);
    }
    
    @PostMapping("/rules/execute")
    @Operation(summary = "Execute SWRL Rules", 
               description = "Execute all SWRL rules in the ontology")
    public ResponseEntity<Map<String, Object>> executeSWRLRules() {
        log.info("Executing SWRL rules");
        Map<String, Object> results = swrlExecutor.executeAllRules();
        return ResponseEntity.ok(results);
    }
    
    @GetMapping("/rules")
    @Operation(summary = "Get All SWRL Rules", 
               description = "Retrieve list of all SWRL rules in the ontology")
    public ResponseEntity<List<Map<String, Object>>> getSWRLRules() {
        log.info("Retrieving SWRL rules");
        List<Map<String, Object>> rules = swrlExecutor.getSWRLRules();
        return ResponseEntity.ok(rules);
    }
    
    @PostMapping("/rules/{ruleName}/execute")
    @Operation(summary = "Execute Specific SWRL Rule", 
               description = "Execute a specific SWRL rule by name")
    public ResponseEntity<Map<String, Object>> executeRule(
            @PathVariable String ruleName) {
        
        log.info("Executing rule: {}", ruleName);
        Map<String, Object> result = swrlExecutor.executeRule(ruleName);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/health")
    @Operation(summary = "Ontology Service Health Check")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "service", "ontology-reasoner",
            "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }
}
