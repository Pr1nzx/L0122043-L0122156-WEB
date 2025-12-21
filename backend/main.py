import os
import traceback
from typing import Optional, List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from owlready2 import *

app = FastAPI(title="AD DSS - Python Logic Backend")

# ==========================================
# 1. Konfigurasi & Loading Ontologi
# ==========================================
TARGET_FILE = "ad_dss.owl"
POSSIBLE_PATHS = [
    os.path.join("backend", TARGET_FILE), 
    TARGET_FILE,
    os.path.join(os.path.dirname(__file__), TARGET_FILE)
]

ONTOLOGY_PATH = None
for path in POSSIBLE_PATHS:
    if os.path.exists(path):
        ONTOLOGY_PATH = os.path.abspath(path)
        break

# ==========================================
# 2. Helper Functions
# ==========================================

def get_entity(onto, iri_fragment):
    """Mencari Entity (Class/Property) berdasarkan potongan nama."""
    entity = onto.search_one(iri=iri_fragment) # Exact match
    if not entity:
        entity = onto.search_one(iri=f"*{iri_fragment}") # Wildcard match
    return entity

def get_simple_name(entity):
    if hasattr(entity, "name") and entity.name:
        return entity.name
    return str(entity).split(".")[-1].split("/")[-1]

def apply_rules_manually(patient, clinical_test, data, onto):
    """
    LOGIKA DIAGNOSA LENGKAP (PYTHON-BASED SWRL)
    """
    print("[INFO] Menjalankan Logika Diagnosa Lengkap...")

    # ==========================================
    # 1. LOAD CLASS DEFINITIONS
    # ==========================================
    # Severity
    Severe = get_entity(onto, "severe") or get_entity(onto, "SIO_001215")
    Moderate = get_entity(onto, "moderate") or get_entity(onto, "SIO_001214")
    Mild = get_entity(onto, "mild") or get_entity(onto, "SIO_001213")
    
    # Biomarker Status Classes
    AmyloidPos = get_entity(onto, "AmyloidPositive")
    AmyloidNeg = get_entity(onto, "AmyloidNegative")
    TauPos = get_entity(onto, "TauPositive")
    TauNeg = get_entity(onto, "TauNegative")
    NeuroPos = get_entity(onto, "NeurodegenerationPositive")
    NeuroNeg = get_entity(onto, "NeurodegenerationNegative")

    # Disease Classes
    AD_Continuum = get_entity(onto, "AlzheimersContinuumPerson")
    AD_Dementia = get_entity(onto, "PersonWithADDementia")
    MCI = get_entity(onto, "PersonWithMCI")
    Non_AD_Dementia = get_entity(onto, "PersonWithNonADDementia")
    Asymptomatic_AD = get_entity(onto, "AsymptomaticAD")
    SCD = get_entity(onto, "SubjectiveCognitiveDecline") 
    HighRisk = get_entity(onto, "PersonWithHighRiskAD")

    # ==========================================
    # 2. LOGIKA SEVERITY (Based on MMSE)
    # ==========================================
    current_severity = None
    if data.mmse_score is not None:
        score = data.mmse_score
        if score <= 9 and Severe:
            patient.is_a.append(Severe)
            current_severity = "Severe"
            print(f"[LOGIC] MMSE {score} -> Severe Condition")
        elif 10 <= score <= 20 and Moderate:
            patient.is_a.append(Moderate)
            current_severity = "Moderate"
            print(f"[LOGIC] MMSE {score} -> Moderate Condition")
        elif 21 <= score <= 24 and Mild:
            patient.is_a.append(Mild)
            current_severity = "Mild"
            print(f"[LOGIC] MMSE {score} -> Mild Condition")

    # ==========================================
    # 3. LOGIKA BIOMARKER (Mesin Spesifik)
    # ==========================================
    is_amyloid_pos = False
    is_tau_pos = False
    is_neuro_pos = False
    
    methods = data.imaging_method

    # --- AMYLOID BETA (A) ---
    if "Elecsys" in methods and data.ab42_40_score is not None:
        if data.ab42_40_score <= 0.091:
            if AmyloidPos: clinical_test.is_a.append(AmyloidPos)
            is_amyloid_pos = True
            print(f"[LOGIC] Elecsys AB42/40 {data.ab42_40_score} -> AmyloidPositive")
    
    elif "Innotest" in methods and data.ab42_score is not None:
        if data.ab42_score < 550: 
            if AmyloidPos: clinical_test.is_a.append(AmyloidPos)
            is_amyloid_pos = True
            print(f"[LOGIC] Innotest AB42 {data.ab42_score} -> AmyloidPositive")
            
    if not is_amyloid_pos and AmyloidNeg:
        clinical_test.is_a.append(AmyloidNeg)

    # --- TAU (T) ---
    if "Elecsys" in methods and data.ptau_ab42_score is not None:
        if data.ptau_ab42_score > 0.02:
            if TauPos: clinical_test.is_a.append(TauPos)
            is_tau_pos = True
            print(f"[LOGIC] Elecsys P-Tau/AB42 {data.ptau_ab42_score} -> TauPositive")
            
    elif "Innotest" in methods and data.ptau181_score is not None:
        if data.ptau181_score > 60: 
            if TauPos: clinical_test.is_a.append(TauPos)
            is_tau_pos = True
            print(f"[LOGIC] Innotest P-Tau {data.ptau181_score} -> TauPositive")

    # --- NEURODEGENERATION (N) ---
    if "Innotest" in methods and data.t_tau_score is not None:
        if data.t_tau_score >= 355:
            if NeuroPos: clinical_test.is_a.append(NeuroPos)
            is_neuro_pos = True
            print(f"[LOGIC] Innotest T-Tau {data.t_tau_score} -> NeurodegenerationPositive")
            
    if data.hippocampal_vol is not None:
        if data.hippocampal_vol < 6.0: 
            if NeuroPos: clinical_test.is_a.append(NeuroPos)
            is_neuro_pos = True
            print(f"[LOGIC] Hippocampal Vol {data.hippocampal_vol} -> NeurodegenerationPositive")

    # ==========================================
    # 4. LOGIKA DIAGNOSA PENYAKIT (ATN Framework)
    # ==========================================
    is_independent = data.is_independent
    is_in_continuum = False
    
    # A. Alzheimer's Continuum
    if is_amyloid_pos and AD_Continuum:
        patient.is_a.append(AD_Continuum)
        is_in_continuum = True
        print("[LOGIC] Amyloid(+) -> Masuk Alzheimer's Continuum")

    # B. AD Dementia
    if is_in_continuum and is_tau_pos and (is_independent is False):
        if AD_Dementia:
            patient.is_a.append(AD_Dementia)
            print("[LOGIC] A(+) & T(+) & NotIndependent -> AD Dementia")

    # C. MCI due to AD
    if is_in_continuum and (is_independent is True):
        if data.mmse_score is not None and 21 <= data.mmse_score <= 26:
            if MCI:
                patient.is_a.append(MCI)
                print("[LOGIC] A(+) & Independent & MMSE(MCI) -> PersonWithMCI")
    
    # D. Non-AD Dementia (LOGIC DARI LOG ANDA SEBELUMNYA MASUK SINI)
    if (not is_amyloid_pos) and (is_tau_pos or is_neuro_pos) and (is_independent is False):
        if Non_AD_Dementia:
            patient.is_a.append(Non_AD_Dementia)
            print("[LOGIC] A(-) & (T+ or N+) & NotIndependent -> Non-AD Dementia")

    # E. Asymptomatic
    if is_in_continuum and (is_independent is True):
        if data.mmse_score is not None and data.mmse_score >= 27:
            if Asymptomatic_AD:
                patient.is_a.append(Asymptomatic_AD)
                print("[LOGIC] A(+) & Normal Cognition -> Asymptomatic/Preclinical AD")

    # F. SCD
    if (not is_amyloid_pos) and (not is_tau_pos) and (not is_neuro_pos):
        if data.behavior_change is True and data.mmse_score >= 25:
            if SCD:
                patient.is_a.append(SCD)
                print("[LOGIC] All Bio(-) & Complaint & Normal MMSE -> SCD")

    # ==========================================
    # 5. LOGIKA REKOMENDASI (FIXED)
    # ==========================================
    recs = []
    
    if current_severity == "Severe":
        recs.extend(["AuditoryStimulation", "OlfactoryStimulation", "TactileStimulation", "VisualStimulation"])
    elif current_severity == "Moderate":
        recs.extend(["ArtTherapy", "MusicTherapy", "FoldingLaundry"])
    elif current_severity == "Mild" or (MCI and MCI in patient.is_a):
        recs.extend(["CognitiveTraining", "PhysicalExercise", "SocialActivity"])

    # Cari Properti
    has_rec_prop = get_entity(onto, "hasRecommendation")
    
    if has_rec_prop and recs:
        for r_name in recs:
            r_entity = get_entity(onto, r_name) # Bisa Class, Bisa Individual
            
            if r_entity:
                # --- PERBAIKAN DI SINI ---
                if isinstance(r_entity, ThingClass):
                    # Jika itu CLASS, buat instance baru
                    try:
                        r_instance = r_entity(f"rec_{r_name.lower()}_{patient.name}")
                        has_rec_prop[patient].append(r_instance)
                        print(f"[LOGIC] Creating new instance for: {r_name}")
                    except: pass
                else:
                    # Jika itu INDIVIDUAL (Thing), tempel langsung
                    # Log Anda "object is not callable" menandakan dia Individual
                    try:
                        has_rec_prop[patient].append(r_entity)
                        print(f"[LOGIC] Attaching existing individual: {r_name}")
                    except: pass
            else:
                print(f"[WARNING] Rekomendasi '{r_name}' tidak ditemukan di Ontologi.")

def extract_results(patient, clinical_test):
    """
    Ekstraksi hasil akhir dari instance yang sudah dimodifikasi oleh Logic.
    """
    diagnoses = set()
    severities = set()
    clinical_status = set()
    actions = set()
    activities = set()

    # Mapping nama class yang ingin ditampilkan 'cantik'
    severity_map = {
        "SIO_001213": "Mild Condition", "mild": "Mild Condition",
        "SIO_001214": "Moderate Condition", "moderate": "Moderate Condition",
        "SIO_001215": "Severe Condition", "severe": "Severe Condition"
    }
    
    disease_map = {
        "PersonWithMCI": "Mild Cognitive Impairment (MCI)",
        "PersonWithADDementia": "Alzheimer's Disease Dementia",
        "PersonWithNonADDementia": "Non-AD Dementia",
        "AlzheimersContinuumPerson": "Alzheimer's Continuum",
        "AsymptomaticAD": "Preclinical / Asymptomatic AD",
        "SubjectiveCognitiveDecline": "Subjective Cognitive Decline"
    }

    # 1. Ekstraksi Patient (Diagnosa & Severity)
    for cls in patient.is_a:
        if isinstance(cls, ThingClass):
            name = get_simple_name(cls)
            
            # Cek Diagnosa Penyakit
            if name in disease_map:
                diagnoses.add(disease_map[name])
            elif "Person" in name or "Dementia" in name: 
                if name not in ["Person", "SickPerson"]: 
                    diagnoses.add(name)

            # Cek Severity
            if name in severity_map:
                severities.add(severity_map[name])
            elif name in ["mild", "moderate", "severe"]:
                 severities.add(name.capitalize() + " Condition")

            # Cek Actions (Need...)
            if name.startswith("Need"):
                actions.add(name)

    # 2. Ekstraksi Clinical Test (Biomarker)
    for cls in clinical_test.is_a:
        if isinstance(cls, ThingClass):
            name = get_simple_name(cls)
            if "Positive" in name or "Negative" in name:
                clinical_status.add(name)

    # 3. Ekstraksi Rekomendasi (FIXED)
    if hasattr(patient, "hasRecommendation"):
        for rec in patient.hasRecommendation:
            # rec adalah Individual (Instance).
            # rec.name akan memberikan "AuditoryStimulation", "VisualStimulation", dll.
            # rec.is_a akan memberikan [RecommendedActivities] -> Ini yang sebelumnya salah ambil.
            
            # Ambil nama individualnya langsung
            rec_name = get_simple_name(rec)
            
            # Filter jika namanya generik (misal 'rec_auditory...') atau class induk
            # Karena di logic kita pakai get_entity(onto, "AuditoryStimulation"),
            # biasanya nama individualnya sama dengan nama yang kita cari.
            activities.add(rec_name)

    return {
        "diagnosis": list(diagnoses),
        "severity": list(severities),
        "clinical_status": list(clinical_status),
        "recommended_actions": list(actions),
        "recommended_activities": list(activities)
    }

# ==========================================
# 3. Schema Input & Endpoint
# ==========================================
class PatientData(BaseModel):
    age: Optional[int] = None
    has_other_diseases: bool = False
    mmse_score: Optional[int] = None
    moca_score: Optional[int] = None
    faq_score: Optional[int] = None
    ad8_score: Optional[int] = None
    ab42_40_score: Optional[float] = None
    ab42_score: Optional[int] = None
    ptau_ab42_score: Optional[float] = None
    ptau181_score: Optional[int] = None
    t_tau_score: Optional[int] = None
    hippocampal_vol: Optional[float] = None
    imaging_method: List[str] = [] 
    behavior_change: bool = False
    is_independent: Optional[bool] = None

@app.post("/diagnose")
def diagnose_patient(data: PatientData):
    print("\n" + "="*50)
    print("STARTING DIAGNOSIS PROCESS (LOGIC V2)")
    
    if not ONTOLOGY_PATH:
        raise HTTPException(status_code=500, detail="Ontology file not found.")

    current_world = World()
    
    try:
        onto = current_world.get_ontology(f"file://{ONTOLOGY_PATH}").load()

        # 1. Cari Class & Buat Instance
        PersonClass = get_entity(onto, "Person")
        ClinicalTestClass = get_entity(onto, "ClinicalTest")
        
        if not PersonClass or not ClinicalTestClass:
            raise HTTPException(status_code=500, detail="Core Classes (Person/ClinicalTest) not found in Ontology.")

        patient = PersonClass("patient_req")
        clinical_test = ClinicalTestClass("test_req")
        patient.hasClinicalTest.append(clinical_test)

        # 2. Input Data ke Instance (Properti OWL)
        # Meskipun logicnya di Python, kita tetap simpan data ke OWL agar properti terisi
        if data.age: patient.hasAge = [data.age]
        if data.mmse_score is not None: patient.hasMMSEScore = [data.mmse_score]
        
        # Mapping nama property yang mungkin aneh
        p_ab42_40 = get_entity(onto, "hasAβ42/40Score")
        if p_ab42_40 and data.ab42_40_score is not None: p_ab42_40[clinical_test] = [data.ab42_40_score]

        p_ptau_ab42 = get_entity(onto, "hasP-Tau/Aβ42Score")
        if p_ptau_ab42 and data.ptau_ab42_score is not None: p_ptau_ab42[clinical_test] = [data.ptau_ab42_score]
        
        p_ttau = get_entity(onto, "hasT-Tau")
        if p_ttau and data.t_tau_score is not None: p_ttau[clinical_test] = [data.t_tau_score]

        # Independent / Not Independent (Simpan ke object property)
        if data.is_independent is not None:
            IADLClass = get_entity(onto, "InstrumentalActivitiesOfDailyLiving")
            if IADLClass:
                temp_act = IADLClass("temp_activity")
                prop_name = "independent" if data.is_independent else "notIndependent"
                prop = get_entity(onto, prop_name)
                if prop: prop[patient].append(temp_act)

        # 3. JALANKAN LOGIKA MANUAL
        # Ini adalah inti perbaikannya. Kita tidak inject rule string yang error.
        # Kita jalankan fungsi Python yang meniru logika tersebut.
        apply_rules_manually(patient, clinical_test, data, onto)

        # 4. EKSTRAKSI HASIL
        results = extract_results(patient, clinical_test)
        
        # Logging hasil untuk debug
        print(f"[DEBUG] Final Result: {results}")
        
        return results

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
        
    finally:
        try:
            current_world.close()
        except: pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)