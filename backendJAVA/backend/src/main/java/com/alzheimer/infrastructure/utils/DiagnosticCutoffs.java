package com.alzheimer.infrastructure.utils;

import lombok.extern.slf4j.Slf4j;

/**
 * Diagnostic Cutoff Values untuk Alzheimer Decision Support System
 * Berdasarkan TTL ontology dan clinical guidelines
 */
@Slf4j
public class DiagnosticCutoffs {
    
    // ============ MMSE SCORE CUTOFFS ============
    /**
     * MMSE Score Ranges:
     * - Mild: 21-24
     * - Moderate: 10-20
     * - Severe: ≤ 9
     */
    public static final int MMSE_MILD_MIN = 21;
    public static final int MMSE_MILD_MAX = 24;
    public static final int MMSE_MODERATE_MIN = 10;
    public static final int MMSE_MODERATE_MAX = 20;
    public static final int MMSE_SEVERE_MAX = 9;
    
    // ============ ATN BIOMARKER CUTOFFS ============
    /**
     * ATN Framework Cutoffs (dari TTL):
     * A (Amyloid): Aβ42/40 ratio
     * T (Tau): P-Tau/Aβ42 ratio
     * N (Neurodegeneration): Hippocampal volume
     */
    
    // Amyloid Cutoff
    public static final double ABETA_RATIO_CUTOFF = 0.01;  // < 0.01 = Positive (Abnormal)
    
    // Tau Cutoff
    public static final double PTAU_RATIO_CUTOFF = 0.09;   // > 0.09 = Positive (Abnormal)
    
    // Neurodegeneration (Hippocampal volume, normalized)
    public static final double HIPPO_VOLUME_THRESHOLD = 2500.0;  // < 2500 = Atrophy (Positive)
    
    // ============ OTHER BIOMARKERS ============
    public static final double MTA_SCORE_MODERATE = 2.0;   // MTA ≥ 2 suggests atrophy
    public static final int MMSE_CUTOFF_FOR_DEMENTIA = 23;  // ≤ 23 suggests cognitive impairment
    public static final int MOCA_CUTOFF_FOR_DEMENTIA = 25;  // ≤ 25 suggests cognitive impairment
    
    // ============ ATN CLASSIFICATION ============
    
    /**
     * Classify Amyloid status based on Aβ42/40 ratio
     */
    public static String classifyAmyloidStatus(Double abeta4240Ratio) {
        if (abeta4240Ratio == null) {
            return "Unknown";
        }
        return abeta4240Ratio < ABETA_RATIO_CUTOFF ? "Positive" : "Negative";
    }
    
    /**
     * Classify Tau status based on P-Tau/Aβ42 ratio
     */
    public static String classifyTauStatus(Double pTauAbeta42Ratio) {
        if (pTauAbeta42Ratio == null) {
            return "Unknown";
        }
        return pTauAbeta42Ratio > PTAU_RATIO_CUTOFF ? "Positive" : "Negative";
    }
    
    /**
     * Classify Neurodegeneration status based on hippocampal volume
     */
    public static String classifyNeurodegenStatus(Double hippocampalVolume) {
        if (hippocampalVolume == null) {
            return "Unknown";
        }
        return hippocampalVolume < HIPPO_VOLUME_THRESHOLD ? "Positive" : "Negative";
    }
    
    // ============ DISEASE STAGE INFERENCE ============
    
    /**
     * Infer disease stage (Mild/Moderate/Severe) dari MMSE score
     * Based on TTL ontology definitions
     */
    public static String inferDiseaseStageFromMMSE(Integer mmseScore) {
        if (mmseScore == null) {
            return "Unknown";
        }
        
        if (mmseScore >= MMSE_MILD_MIN && mmseScore <= MMSE_MILD_MAX) {
            return "Mild";
        } else if (mmseScore >= MMSE_MODERATE_MIN && mmseScore <= MMSE_MODERATE_MAX) {
            return "Moderate";
        } else if (mmseScore <= MMSE_SEVERE_MAX) {
            return "Severe";
        }
        
        log.warn("MMSE score {} out of expected range", mmseScore);
        return "Unknown";
    }
    
    /**
     * Comprehensive disease stage inference combining multiple factors
     * ATN profile + MMSE + Clinical findings
     */
    public static String inferComprehensiveStage(
            Integer mmseScore,
            String amyloidStatus,
            String tauStatus,
            String neurodegenStatus,
            Integer mtaScore) {
        
        // Stage determination logic:
        // 1. Start with MMSE-based classification
        String mmseStage = inferDiseaseStageFromMMSE(mmseScore);
        
        // 2. Refine with ATN profile
        int positiveBiomarkers = countPositiveBiomarkers(amyloidStatus, tauStatus, neurodegenStatus);
        
        // If all ATN positive (A+T+N) = Strong evidence for AD
        if (positiveBiomarkers == 3) {
            // Confirm or escalate stage if needed
            if ("Severe".equals(mmseStage)) {
                return "Severe";  // Confirmed
            } else if ("Mild".equals(mmseStage) && mtaScore != null && mtaScore >= MTA_SCORE_MODERATE) {
                return "Moderate";  // Upgrade based on MTA
            }
        }
        
        return mmseStage;
    }
    
    /**
     * Count how many biomarkers are positive (A/T/N)
     */
    private static int countPositiveBiomarkers(String amyloidStatus, String tauStatus, String neurodegenStatus) {
        int count = 0;
        if ("Positive".equals(amyloidStatus)) count++;
        if ("Positive".equals(tauStatus)) count++;
        if ("Positive".equals(neurodegenStatus)) count++;
        return count;
    }
    
    /**
     * Determine if patient meets AD criteria (A+T+N profile)
     */
    public static boolean meetADCriteria(String amyloidStatus, String tauStatus, String neurodegenStatus) {
        return "Positive".equals(amyloidStatus) && 
               "Positive".equals(tauStatus) && 
               "Positive".equals(neurodegenStatus);
    }
    
    /**
     * Get ATN profile as string (e.g., "A+T+N", "A+T-N", etc.)
     */
    public static String getATNProfile(String amyloidStatus, String tauStatus, String neurodegenStatus) {
        String a = "Positive".equals(amyloidStatus) ? "A+" : "A-";
        String t = "Positive".equals(tauStatus) ? "T+" : "T-";
        String n = "Positive".equals(neurodegenStatus) ? "N+" : "N-";
        return a + t + n;
    }
    
    // ============ COGNITIVE IMPAIRMENT CHECK ============
    
    /**
     * Check if patient has cognitive impairment based on MMSE
     */
    public static boolean hasCognitiveImpairment(Integer mmseScore) {
        return mmseScore != null && mmseScore <= MMSE_CUTOFF_FOR_DEMENTIA;
    }
    
    /**
     * Check if patient has cognitive impairment based on MoCA
     */
    public static boolean hasCognitiveImpairmentMoCA(Integer mocaScore) {
        return mocaScore != null && mocaScore <= MOCA_CUTOFF_FOR_DEMENTIA;
    }
}
