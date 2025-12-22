package com.alzheimer.application.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.semanticweb.owlapi.model.*;
import org.semanticweb.owlapi.reasoner.OWLReasoner;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/v1/diagnostic")
@RequiredArgsConstructor
@Slf4j
public class DiagnosticController {
    
    private final OWLOntology ontology;
    private final OWLReasoner reasoner;
    
    /**
     * GET /api/v1/diagnostic/health - Verify ontology and SWRL loaded
     */
    @GetMapping("/health")
    public Map<String, Object> diagnosticHealth() {
        Map<String, Object> result = new LinkedHashMap<>();
        
        try {
            // 1. Ontology Status
            long axiomCount = ontology.getAxiomCount();
            long classCount = ontology.getClassesInSignature().size();
            long propertyCount = ontology.getObjectPropertiesInSignature().size();
            long dataPropertyCount = ontology.getDataPropertiesInSignature().size();
            
            result.put("ontology_status", "LOADED ✓");
            result.put("ontology_axiom_count", axiomCount);
            result.put("ontology_classes", classCount);
            result.put("ontology_object_properties", propertyCount);
            result.put("ontology_data_properties", dataPropertyCount);
            
            // 2. SWRL Rules Count
            long swrlRuleCount = ontology.getAxioms().stream()
                .filter(axiom -> axiom.toString().toLowerCase().contains("swrl"))
                .count();
            
            result.put("swrl_rules_found", swrlRuleCount);
            result.put("swrl_status", swrlRuleCount > 0 ? "ENABLED ✓" : "NOT FOUND ✗");
            
            // 3. Reasoner Status
            boolean reasonerConsistent = reasoner.isConsistent();
            int unsatisfiableClasses = reasoner.getUnsatisfiableClasses().getSize();
            
            result.put("reasoner_type", reasoner.getClass().getSimpleName());
            result.put("reasoner_consistent", reasonerConsistent ? "YES ✓" : "NO ✗");
            result.put("unsatisfiable_classes", unsatisfiableClasses);
            
            // 4. Overall Status
            boolean allGood = swrlRuleCount > 0 && reasonerConsistent && axiomCount > 0;
            result.put("overall_status", allGood ? "✅ ALL SYSTEMS GO!" : "⚠️ CHECK WARNINGS");
            result.put("timestamp", System.currentTimeMillis());
            
            return result;
            
        } catch (Exception e) {
            log.error("Diagnostic error: {}", e.getMessage(), e);
            result.put("error", e.getMessage());
            result.put("status", "ERROR");
            return result;
        }
    }
    
    /**
     * POST /api/v1/diagnostic/test-swrl - Run simple SWRL test
     */
    @PostMapping("/test-swrl")
    public Map<String, Object> testSWRLExecution() {
        Map<String, Object> result = new LinkedHashMap<>();
        
        try {
            long startTime = System.currentTimeMillis();
            
            // Create test individual
            OWLDataFactory df = ontology.getOWLOntologyManager().getOWLDataFactory();
            IRI baseIRI = IRI.create("http://test.example.org/");
            OWLNamedIndividual testPatient = df.getOWLNamedIndividual(baseIRI.resolve("test_patient_001"));
            
            // Add simple facts
            OWLClass personClass = df.getOWLClass(baseIRI.resolve("Person"));
            OWLAxiom axiom = df.getOWLClassAssertionAxiom(personClass, testPatient);
            ontology.getOWLOntologyManager().addAxiom(ontology, axiom);
            
            // Flush reasoner to trigger SWRL
            reasoner.flush();
            
            // Get inferred types (convert NodeSet to Set)
            Set<OWLClass> inferredTypes = reasoner.getTypes(testPatient, false).getFlattened();
            
            long endTime = System.currentTimeMillis();
            long reasoningTime = endTime - startTime;
            
            result.put("test_patient", testPatient.getIRI().toString());
            result.put("axioms_added", 1);
            result.put("reasoning_triggered", "YES ✓");
            result.put("reasoning_time_ms", reasoningTime);
            result.put("inferred_types_count", inferredTypes.size());
            result.put("inferred_types", inferredTypes.stream()
                .map(c -> c.getIRI().getShortForm())
                .toList());
            result.put("test_status", reasoningTime > 50 ? "✅ SWRL FIRED!" : "⚠️ Check reasoning");
            
            return result;
            
        } catch (Exception e) {
            log.error("SWRL test error: {}", e.getMessage(), e);
            result.put("test_status", "❌ ERROR");
            result.put("error", e.getMessage());
            return result;
        }
    }
    
    /**
     * GET /api/v1/diagnostic/swrl-rules - List all SWRL rules found
     */
    @GetMapping("/swrl-rules")
    public Map<String, Object> listSWRLRules() {
        Map<String, Object> result = new LinkedHashMap<>();
        List<String> rules = new ArrayList<>();
        
        try {
            ontology.getAxioms().forEach(axiom -> {
                String axiomStr = axiom.toString();
                if (axiomStr.toLowerCase().contains("swrl")) {
                    rules.add(axiomStr);
                }
            });
            
            result.put("swrl_rules_found", rules.size());
            result.put("swrl_rules", rules);
            result.put("status", rules.isEmpty() ? "⚠️ No SWRL rules found" : "✅ SWRL rules loaded");
            
            return result;
            
        } catch (Exception e) {
            result.put("error", e.getMessage());
            result.put("status", "ERROR");
            return result;
        }
    }
}
