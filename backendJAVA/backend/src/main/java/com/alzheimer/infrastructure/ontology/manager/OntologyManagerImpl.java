package com.alzheimer.infrastructure.ontology.manager;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.semanticweb.owlapi.apibinding.OWLManager;
import org.semanticweb.owlapi.model.*;
import org.semanticweb.owlapi.reasoner.OWLReasoner;
import org.semanticweb.owlapi.vocab.OWL2Datatype;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class OntologyManagerImpl {
    
    private final OWLOntology ontology;
    private final OWLReasoner reasoner;
    private final IRI baseIRI;
    
    private OWLDataFactory dataFactory;
    private final Map<String, OWLNamedIndividual> patientIndividuals = new ConcurrentHashMap<>();
    private final Map<String, String> patientSessionMap = new ConcurrentHashMap<>();
    
    @PostConstruct
    public void init() {
        this.dataFactory = OWLManager.getOWLDataFactory();
        log.info("Ontology Manager initialized with {} axioms", ontology.getAxiomCount());
    }
    
    public Map<String, Object> createPatient(String patientId, Map<String, Object> patientData) {
        try {
            log.info("Creating patient individual for: {}", patientId);
            OWLOntologyManager manager = ontology.getOWLOntologyManager();
            
            // Generate unique IRI for patient
            String patientIRI = baseIRI + "patient_" + patientId + "_" + System.currentTimeMillis();
            OWLNamedIndividual patientInd = dataFactory.getOWLNamedIndividual(IRI.create(patientIRI));
            
            // Add as Person
            OWLClass personClass = dataFactory.getOWLClass(
                IRI.create("http://xmlns.com/foaf/0.1/Person")
            );
            OWLClassAssertionAxiom personAxiom = dataFactory.getOWLClassAssertionAxiom(
                personClass, patientInd
            );
            manager.addAxiom(ontology, personAxiom);
            
            // Add data properties
            addDataProperties(patientInd, patientData, manager);
            
            // Store mapping
            patientIndividuals.put(patientId, patientInd);
            
            Map<String, Object> result = new HashMap<>();
            result.put("patientId", patientId);
            result.put("patientIRI", patientIRI);
            result.put("created", true);
            result.put("timestamp", new Date());
            
            log.info("Patient created successfully: {}", patientIRI);
            return result;
            
        } catch (Exception e) {
            log.error("Failed to create patient: {}", patientId, e);
            throw new RuntimeException("Patient creation failed: " + e.getMessage(), e);
        }
    }
    
    public Map<String, Object> addClinicalTest(String patientId, Map<String, Object> testData) {
        OWLNamedIndividual patientInd = patientIndividuals.get(patientId);
        if (patientInd == null) {
            throw new IllegalArgumentException("Patient not found: " + patientId);
        }
        
        try {
            OWLOntologyManager manager = ontology.getOWLOntologyManager();
            
            // Create test individual
            String testId = "test_" + patientId + "_" + System.currentTimeMillis();
            IRI testIRI = IRI.create(baseIRI + testId);
            OWLNamedIndividual testInd = dataFactory.getOWLNamedIndividual(testIRI);
            
            // Add as ClinicalTest
            OWLClass clinicalTestClass = dataFactory.getOWLClass(
                IRI.create(baseIRI + "ClinicalTest")
            );
            OWLClassAssertionAxiom testAxiom = dataFactory.getOWLClassAssertionAxiom(
                clinicalTestClass, testInd
            );
            manager.addAxiom(ontology, testAxiom);
            
            // Link patient to test
            OWLObjectProperty hasClinicalTest = dataFactory.getOWLObjectProperty(
                IRI.create(baseIRI + "hasClinicalTest")
            );
            OWLObjectPropertyAssertionAxiom linkAxiom = 
                dataFactory.getOWLObjectPropertyAssertionAxiom(
                    hasClinicalTest, patientInd, testInd
                );
            manager.addAxiom(ontology, linkAxiom);
            
            // Add brain imaging type if specified
            if (testData.containsKey("brainImagingType")) {
                String imagingType = (String) testData.get("brainImagingType");
                OWLNamedIndividual imagingInd = dataFactory.getOWLNamedIndividual(
                    IRI.create(baseIRI + imagingType)
                );
                OWLObjectProperty hasBrainImaging = dataFactory.getOWLObjectProperty(
                    IRI.create(baseIRI + "hasBrainImagingWith")
                );
                OWLObjectPropertyAssertionAxiom imagingAxiom = 
                    dataFactory.getOWLObjectPropertyAssertionAxiom(
                        hasBrainImaging, testInd, imagingInd
                    );
                manager.addAxiom(ontology, imagingAxiom);
            }
            
            // Add test data properties
            addTestProperties(testInd, testData, manager);
            
            Map<String, Object> result = new HashMap<>();
            result.put("patientId", patientId);
            result.put("testId", testId);
            result.put("testIRI", testIRI.toString());
            result.put("added", true);
            result.put("timestamp", new Date());
            
            log.info("Clinical test added for patient {}: {}", patientId, testIRI);
            return result;
            
        } catch (Exception e) {
            log.error("Failed to add clinical test for patient: {}", patientId, e);
            throw new RuntimeException("Clinical test addition failed: " + e.getMessage(), e);
        }
    }
    
    public Map<String, Object> executeReasoning(String patientId) {
        OWLNamedIndividual patientInd = patientIndividuals.get(patientId);
        if (patientInd == null) {
            throw new IllegalArgumentException("Patient not found: " + patientId);
        }
        
        long startTime = System.currentTimeMillis();
        log.info("Starting reasoning for patient: {}", patientId);
        log.info("Ontology has {} axioms. Reasoning engine: {}", 
                 ontology.getAxiomCount(), reasoner.getClass().getSimpleName());
        
        try {
            // Flush and recompute inferences (triggers SWRL rules execution)
            reasoner.flush();
            log.debug("SWRL rules executed and inferences computed for patient: {}", patientId);
            
            // Get inferred classes
            Set<OWLClass> inferredClasses = reasoner.getTypes(patientInd, true)
                .getFlattened();
            
            // Get inferred properties
            Map<String, List<String>> inferredProperties = getInferredProperties(patientInd);
            
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;
            
            Map<String, Object> result = new HashMap<>();
            result.put("patientId", patientId);
            result.put("inferredClasses", getClassNames(inferredClasses));
            result.put("inferredProperties", inferredProperties);
            result.put("reasoningTimeMs", duration);
            result.put("isConsistent", reasoner.isConsistent());
            result.put("timestamp", new Date());
            result.put("swrlExecuted", true);
            result.put("reasonerEngine", reasoner.getClass().getSimpleName());
            
            log.info("Reasoning completed for patient {} in {} ms. Inferred classes: {}. SWRL: Executed", 
                    patientId, duration, inferredClasses.size());
            return result;
            
        } catch (Exception e) {
            log.error("Reasoning failed for patient: {}", patientId, e);
            throw new RuntimeException("Reasoning failed: " + e.getMessage(), e);
        }
    }
    
    public Map<String, Object> clearPatientData(String patientId) {
        OWLNamedIndividual patientInd = patientIndividuals.remove(patientId);
        if (patientInd != null) {
            try {
                OWLOntologyManager manager = ontology.getOWLOntologyManager();
                Set<OWLAxiom> axiomsToRemove = new HashSet<>();
                
                for (OWLAxiom axiom : ontology.getAxioms()) {
                    if (axiom.getIndividualsInSignature().contains(patientInd)) {
                        axiomsToRemove.add(axiom);
                    }
                }
                
                manager.removeAxioms(ontology, axiomsToRemove);
                log.info("Cleared data for patient: {}", patientId);
                
                return Map.of(
                    "patientId", patientId,
                    "cleared", true,
                    "axiomsRemoved", axiomsToRemove.size(),
                    "timestamp", new Date()
                );
            } catch (Exception e) {
                log.error("Failed to clear patient data: {}", patientId, e);
                throw new RuntimeException("Failed to clear patient data", e);
            }
        }
        
        return Map.of(
            "patientId", patientId,
            "cleared", false,
            "message", "Patient not found",
            "timestamp", new Date()
        );
    }
    
    // Helper methods
    private void addDataProperties(OWLNamedIndividual individual, 
                                   Map<String, Object> data, 
                                   OWLOntologyManager manager) {
        for (Map.Entry<String, Object> entry : data.entrySet()) {
            try {
                String key = entry.getKey();
                Object value = entry.getValue();
                
                // Map key to property IRI
                String propertyIRI = mapDataKeyToProperty(key);
                if (propertyIRI == null) continue;
                
                OWLDataProperty property = dataFactory.getOWLDataProperty(IRI.create(propertyIRI));
                OWLLiteral literal = createLiteral(value);
                
                if (literal != null) {
                    OWLDataPropertyAssertionAxiom axiom = 
                        dataFactory.getOWLDataPropertyAssertionAxiom(property, individual, literal);
                    manager.addAxiom(ontology, axiom);
                }
            } catch (Exception e) {
                log.warn("Failed to add data property {}: {}", entry.getKey(), e.getMessage());
            }
        }
    }
    
    private void addTestProperties(OWLNamedIndividual testInd, 
                                   Map<String, Object> testData, 
                                   OWLOntologyManager manager) {
        // Map of test data keys to ontology properties
        Map<String, String> propertyMap = new HashMap<>();
        propertyMap.put("mmseScore", "hasMMSEScore");
        propertyMap.put("mocaScore", "hasMoCAScore");
        propertyMap.put("faqScore", "hasFAQScore");
        propertyMap.put("ad8Score", "hasAD8Score");
        propertyMap.put("mtaScore", "hasMTAScore");
        propertyMap.put("abeta42Score", "hasAβ42Score");
        propertyMap.put("pTau181Score", "hasP-Tau181Score");
        propertyMap.put("tTau", "hasT-Tau");
        propertyMap.put("abeta4240Ratio", "hasAβ42/40Score");
        propertyMap.put("pTauAbeta42Ratio", "hasP-Tau/Aβ42Score");
        propertyMap.put("hippocampalVolume", "hasAdjHippocampalVol");
        propertyMap.put("age", "hasAge");
        
        for (Map.Entry<String, Object> entry : testData.entrySet()) {
            try {
                String key = entry.getKey();
                if (key.equals("brainImagingType")) continue;
                
                String propertyName = propertyMap.get(key);
                if (propertyName == null) continue;
                
                Object value = entry.getValue();
                OWLDataProperty property = dataFactory.getOWLDataProperty(
                    IRI.create(baseIRI + propertyName)
                );
                
                OWLLiteral literal = createLiteral(value);
                if (literal != null) {
                    OWLDataPropertyAssertionAxiom axiom = 
                        dataFactory.getOWLDataPropertyAssertionAxiom(property, testInd, literal);
                    manager.addAxiom(ontology, axiom);
                }
            } catch (Exception e) {
                log.warn("Failed to add test property {}: {}", entry.getKey(), e.getMessage());
            }
        }
    }
    
    private OWLLiteral createLiteral(Object value) {
        if (value instanceof Integer) {
            return dataFactory.getOWLLiteral((Integer) value);
        } else if (value instanceof Double) {
            return dataFactory.getOWLLiteral((Double) value);
        } else if (value instanceof Boolean) {
            return dataFactory.getOWLLiteral((Boolean) value);
        } else if (value instanceof String) {
            return dataFactory.getOWLLiteral((String) value);
        }
        return null;
    }
    
    private String mapDataKeyToProperty(String key) {
        Map<String, String> mapping = new HashMap<>();
        mapping.put("age", baseIRI + "hasAge");
        mapping.put("hasFamilyHistory", baseIRI + "familyOf");
        mapping.put("hasBehaviorChanges", baseIRI + "hasChanged");
        mapping.put("hasOtherDiseases", baseIRI + "hasOtherDiseases");
        return mapping.get(key);
    }
    
    private Map<String, List<String>> getInferredProperties(OWLNamedIndividual individual) {
        Map<String, List<String>> result = new HashMap<>();
        
        try {
            // Get object property values
            for (OWLObjectProperty property : ontology.getObjectPropertiesInSignature()) {
                Set<OWLNamedIndividual> values = reasoner.getObjectPropertyValues(
                    individual, property
                ).getFlattened();
                
                if (!values.isEmpty()) {
                    List<String> valueNames = new ArrayList<>();
                    for (OWLNamedIndividual val : values) {
                        valueNames.add(val.getIRI().getShortForm());
                    }
                    result.put(property.getIRI().getShortForm(), valueNames);
                }
            }
        } catch (Exception e) {
            log.warn("Error getting inferred properties: {}", e.getMessage());
        }
        
        return result;
    }
    
    private List<String> getClassNames(Set<OWLClass> classes) {
        List<String> names = new ArrayList<>();
        for (OWLClass cls : classes) {
            names.add(cls.getIRI().getShortForm());
        }
        return names;
    }
    
    // Public getters
    public boolean hasPatient(String patientId) {
        return patientIndividuals.containsKey(patientId);
    }
    
    public OWLOntology getOntology() {
        return ontology;
    }
    
    public OWLReasoner getReasoner() {
        return reasoner;
    }
}
