package com.alzheimer.infrastructure.config;

import org.semanticweb.owlapi.apibinding.OWLManager;
import org.semanticweb.owlapi.model.*;
import org.semanticweb.owlapi.reasoner.OWLReasoner;
import org.semanticweb.owlapi.reasoner.structural.StructuralReasonerFactory;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;
import java.lang.reflect.Method;

@Configuration
@Slf4j
public class OntologyConfig {
    
    @Value("${ontology.file-path}")
    private String ontologyPath;
    
    @Value("${ontology.base-iri}")
    private String baseIRI;
    
    @Value("${ontology.swrl-enabled}")
    private boolean swrlEnabled;
    
    @Value("${ontology.reasoner-type:PELLET}")
    private String reasonerType;
    
    private OWLOntology ontology;
    
    @Bean
    public OWLOntology loadOntology() throws OWLOntologyCreationException {
        log.info("Loading ontology from: {}", ontologyPath);
        
        try {
            OWLOntologyManager manager = OWLManager.createOWLOntologyManager();
            
            // Load from classpath
            String resourcePath = ontologyPath.replace("classpath:", "");
            ClassPathResource resource = new ClassPathResource(resourcePath);
            InputStream inputStream = resource.getInputStream();
            
            ontology = manager.loadOntologyFromOntologyDocument(inputStream);
            
            log.info("Ontology loaded successfully. Axioms: {}", ontology.getAxiomCount());
            log.info("Ontology IRI: {}", ontology.getOntologyID().getOntologyIRI().orElse(IRI.create("unknown")));
            
            // Validate OWL 2 DL profile
            validateOWLProfile();
            
            return ontology;
            
        } catch (Exception e) {
            log.error("Failed to load ontology from: {}", ontologyPath, e);
            throw new OWLOntologyCreationException("Ontology loading failed: " + e.getMessage(), e);
        }
    }
    
    @Bean
    public OWLReasoner createReasoner(OWLOntology ontology) {
        log.info("Initializing {} Reasoner for SROIQ(D) support...", reasonerType);
        
        try {
            OWLReasoner reasoner = null;
            
            if ("PELLET".equalsIgnoreCase(reasonerType)) {
                reasoner = createPelletReasoner(ontology);
            } else {
                log.warn("Falling back to Structural Reasoner");
                StructuralReasonerFactory reasonerFactory = new StructuralReasonerFactory();
                reasoner = reasonerFactory.createReasoner(ontology);
            }
            
            boolean consistent = reasoner.isConsistent();
            log.info("{} Reasoner initialized. Ontology Consistent: {}", reasonerType, consistent);
            
            if (!consistent) {
                log.warn("⚠️ Ontology is INCONSISTENT! Please review axioms.");
            }
            
            return reasoner;
            
        } catch (Exception e) {
            log.error("Failed to initialize {} Reasoner. Using Structural as fallback.", reasonerType, e);
            StructuralReasonerFactory fallback = new StructuralReasonerFactory();
            return fallback.createReasoner(ontology);
        }
    }
    
    private OWLReasoner createPelletReasoner(OWLOntology ontology) {
        try {
            Class<?> pelletFactory = Class.forName("com.clarkparsia.pellet.owlapiv3.PelletReasonerFactory");
            Method getInstance = pelletFactory.getMethod("getInstance");
            Object factory = getInstance.invoke(null);
            Method createReasoner = factory.getClass().getMethod("createReasoner", OWLOntology.class);
            return (OWLReasoner) createReasoner.invoke(factory, ontology);
        } catch (Exception e) {
            log.warn("Pellet not available ({}). Using Structural Reasoner.", e.getMessage());
            StructuralReasonerFactory fallback = new StructuralReasonerFactory();
            return fallback.createReasoner(ontology);
        }
    }
    
    @Bean(name = "swrlRuleEngine")
    public Object createSWRLEngine(OWLOntology ontology) {
        if (!swrlEnabled) {
            log.info("SWRL engine is disabled by configuration");
            return null;
        }
        
        log.warn("SWRL engine requested but not available in this build. Using mock implementation.");
        return new MockSWRLEngine();
    }
    
    private static class MockSWRLEngine {
        // Mock SWRL engine for when swrlapi is not available
    }
    
    @Bean
    public IRI baseIRI() {
        return IRI.create(baseIRI);
    }
    
    private void validateOWLProfile() {
        try {
            org.semanticweb.owlapi.profiles.OWL2DLProfile profile = 
                new org.semanticweb.owlapi.profiles.OWL2DLProfile();
            org.semanticweb.owlapi.profiles.OWLProfileReport report = profile.checkOntology(ontology);
            
            if (report.isInProfile()) {
                log.info("Ontology is in OWL 2 DL profile (SROIQ(D))");
            } else {
                log.warn("Ontology has OWL 2 DL profile violations:");
                report.getViolations().forEach(v -> 
                    log.warn("  - {}", v));
            }
        } catch (Exception e) {
            log.warn("Could not validate OWL profile: {}", e.getMessage());
        }
    }
    
    @PostConstruct
    public void logConfig() {
        log.info("========== Ontology Configuration ==========");
        log.info("  File path: {}", ontologyPath);
        log.info("  Base IRI: {}", baseIRI);
        log.info("  Reasoner Type: {}", reasonerType);
        log.info("  SWRL enabled: {}", swrlEnabled);
        log.info("  Profile: OWL 2 DL (SROIQ(D))");
        log.info("==========================================");
    }
}
