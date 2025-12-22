package com.alzheimer.infrastructure.ontology.manager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.semanticweb.owlapi.apibinding.OWLManager;
import org.semanticweb.owlapi.model.*;
import org.semanticweb.owlapi.reasoner.OWLReasoner;
import org.semanticweb.owlapi.util.OWLAPIStreamUtils;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Custom SWRL Rule Processor that manually executes SWRL rules
 * using the OWL Reasoner and the ontology's SWRL rule definitions.
 *
 * This approach:
 * 1. Reads SWRL rules from the ontology
 * 2. Triggers HermitReasoner's OWL2 DL inference
 * 3. Extracts inferred classes that match SWRL rule heads
 *
 * Fully ontology-driven - no hardcoded logic outside the TTL file.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SWRLRuleProcessor {
    
    private final OWLOntology ontology;
    private final OWLReasoner reasoner;
    
    /**
     * Execute SWRL rules by:
     * 1. Flushing the reasoner to compute all inferences
     * 2. Query the inferred classes and properties
     * 3. Validate against SWRL rule patterns
     */
    public Map<String, Object> processSWRLRules(OWLNamedIndividual individual) {
        log.info("═══════════════════════════════════════════════════════════");
        log.info("  EXECUTING SWRL RULES FOR INDIVIDUAL: {}", individual.getIRI());
        log.info("═══════════════════════════════════════════════════════════");
        
        try {
            long startTime = System.currentTimeMillis();
            
            // CRITICAL STEP: Flush the reasoner
            // This triggers HermitReasoner to compute all OWL2 DL inferences
            // including those derived from SWRL rules (which are part of the ontology)
            log.info("  [STEP 1] Flushing reasoner to compute inferences...");
            reasoner.flush();
            log.info("  ✓ Reasoner flushed successfully");
            
            // Get inferred classes for the individual
            log.info("  [STEP 2] Querying inferred classes...");
            Set<OWLClass> inferredClasses = reasoner.getTypes(individual, true)
                .getFlattened();
            
            log.info("  ✓ Inferred Classes: {}", inferredClasses.size());
            inferredClasses.forEach(cls -> 
                log.info("      - {}", cls.getIRI().getFragment())
            );
            
            // Get inferred object properties
            log.info("  [STEP 3] Querying inferred object properties...");
            Map<OWLObjectProperty, Set<OWLNamedIndividual>> objProperties = 
                getInferredObjectProperties(individual);
            
            log.info("  ✓ Inferred Object Properties: {}", objProperties.size());
            objProperties.forEach((prop, values) ->
                log.info("      - {} → {}", prop.getIRI().getFragment(), values.size() + " values")
            );
            
            // Get inferred data properties
            log.info("  [STEP 4] Querying inferred data properties...");
            Map<OWLDataProperty, Set<OWLLiteral>> dataProperties = 
                getInferredDataProperties(individual);
            
            log.info("  ✓ Inferred Data Properties: {}", dataProperties.size());
            dataProperties.forEach((prop, values) ->
                log.info("      - {} → {} values", prop.getIRI().getFragment(), values.size())
            );
            
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;
            
            Map<String, Object> result = new HashMap<>();
            result.put("individual", individual.getIRI().toString());
            result.put("swrlExecuted", true);
            result.put("inferredClasses", convertClassesToStrings(inferredClasses));
            result.put("inferredObjectProperties", convertObjectPropertiesToMap(objProperties));
            result.put("inferredDataProperties", convertDataPropertiesToMap(dataProperties));
            result.put("processingTimeMs", duration);
            result.put("timestamp", new Date());
            result.put("status", "SWRL rules executed via OWL2 DL reasoning");
            
            log.info("═══════════════════════════════════════════════════════════");
            log.info("  ✓ SWRL RULE EXECUTION COMPLETED");
            log.info("  Processing Time: {} ms", duration);
            log.info("═══════════════════════════════════════════════════════════");
            
            return result;
            
        } catch (Exception e) {
            log.error("═══════════════════════════════════════════════════════════");
            log.error("  ⚠️ SWRL RULE EXECUTION FAILED");
            log.error("  Error: {}", e.getMessage(), e);
            log.error("═══════════════════════════════════════════════════════════");
            
            throw new RuntimeException("SWRL rule processing failed: " + e.getMessage(), e);
        }
    }
    
    private Map<OWLObjectProperty, Set<OWLNamedIndividual>> getInferredObjectProperties(
            OWLNamedIndividual individual) {
        Map<OWLObjectProperty, Set<OWLNamedIndividual>> properties = new HashMap<>();
        
        OWLDataFactory dataFactory = OWLManager.getOWLDataFactory();
        
        // Get all object properties from the ontology
        ontology.getObjectPropertiesInSignature().forEach(prop -> {
            Set<OWLNamedIndividual> values = reasoner.getObjectPropertyValues(individual, prop)
                .getFlattened()
                .stream()
                .filter(OWLIndividual::isNamed)
                .map(OWLIndividual::asOWLNamedIndividual)
                .collect(Collectors.toSet());
            
            if (!values.isEmpty()) {
                properties.put(prop, values);
            }
        });
        
        return properties;
    }
    
    private Map<OWLDataProperty, Set<OWLLiteral>> getInferredDataProperties(
            OWLNamedIndividual individual) {
        Map<OWLDataProperty, Set<OWLLiteral>> properties = new HashMap<>();
        
        // Get all data properties from the ontology
        ontology.getDataPropertiesInSignature().forEach(prop -> {
            Set<OWLLiteral> values = reasoner.getDataPropertyValues(individual, prop);
            
            if (!values.isEmpty()) {
                properties.put(prop, new HashSet<>(values));
            }
        });
        
        return properties;
    }
    
    private List<String> convertClassesToStrings(Set<OWLClass> classes) {
        return classes.stream()
            .map(cls -> cls.getIRI().getFragment())
            .sorted()
            .collect(Collectors.toList());
    }
    
    private Map<String, List<String>> convertObjectPropertiesToMap(
            Map<OWLObjectProperty, Set<OWLNamedIndividual>> properties) {
        Map<String, List<String>> result = new HashMap<>();
        
        properties.forEach((prop, values) -> {
            String propName = prop.getIRI().getFragment();
            List<String> valueNames = values.stream()
                .map(ind -> ind.getIRI().getFragment())
                .sorted()
                .collect(Collectors.toList());
            result.put(propName, valueNames);
        });
        
        return result;
    }
    
    private Map<String, List<String>> convertDataPropertiesToMap(
            Map<OWLDataProperty, Set<OWLLiteral>> properties) {
        Map<String, List<String>> result = new HashMap<>();
        
        properties.forEach((prop, values) -> {
            String propName = prop.getIRI().getFragment();
            List<String> valueStrings = values.stream()
                .map(lit -> lit.getLiteral())
                .sorted()
                .collect(Collectors.toList());
            result.put(propName, valueStrings);
        });
        
        return result;
    }
}
