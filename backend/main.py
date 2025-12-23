import os
import rdflib
from typing import Optional, List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from owlready2 import *
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AD Decision Support System Ontology API")

# ==========================================
# CORS Configuration
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 1. KONFIGURASI DAN LOADING ONTOLOGY
# ==========================================

ontology_filename = "ad-decision-support-system.ttl"
ttl_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ontology_filename)
xml_filename = "ad-decision-support-system-converted.owl"
xml_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), xml_filename)

# --- DEFINISI IRI ---
BASE_IRI = "http://www.semanticweb.org/cahyaw06/ontologies/2025/10/ad-decision-support-system/"
FOAF_IRI = "http://xmlns.com/foaf/0.1/"

try:
    print(f"Converting TTL to RDF/XML...")
    g = rdflib.Graph()
    g.parse(ttl_path, format="turtle")
    g.serialize(destination=xml_path, format="xml")
    
    print(f"Loading ontology...")
    onto_path.append(os.path.dirname(os.path.abspath(__file__)))
    onto = get_ontology(xml_filename).load()
    print("Ontology loaded successfully.")

except Exception as e:
    print(f"CRITICAL ERROR LOADING ONTOLOGY: {e}")
    onto = None

# ==========================================
# 2. DATA MODELS
# ==========================================

class PatientData(BaseModel):
    age: int
    family_history: bool = False
    mmse_score: int
    moca_score: Optional[int] = None
    faq_score: Optional[int] = None
    
    # [BARU] Input Manual Status Kemandirian (True = Mandiri, False = Tidak Mandiri)
    # Jika diisi, ini akan mengalahkan logika FAQ Score.
    is_independent: Optional[bool] = None 
    
    # Biomarker Scores
    abeta42_score: Optional[float] = None
    abeta42_40_ratio: Optional[float] = None
    ptau181_score: Optional[float] = None
    ptau_abeta_ratio: Optional[float] = None
    ttau_score: Optional[float] = None
    adj_hippocampal_vol: Optional[float] = None
    
    imaging_method: List[str] = []
    has_behavior_change: bool = False

# ==========================================
# 3. LOGIC & REASONING ENDPOINT
# ==========================================

@app.post("/diagnose")
def diagnose_patient(data: PatientData):
    if onto is None:
        raise HTTPException(status_code=500, detail="Ontology failed to load.")

    with onto:
        # 1. CLEANUP (Hapus Sisa Request Sebelumnya)
        try:
            old_p = onto.search_one(iri="*TempPatient")
            if old_p: destroy_entity(old_p)
            old_t = onto.search_one(iri="*TempTest")
            if old_t: destroy_entity(old_t)
            
            # Hapus juga relative instance jika ingin bersih total (opsional)
            old_fam = onto.search_one(iri="*FamilyMember_Instance")
            if old_fam: destroy_entity(old_fam)
        except: pass

        # 2. LOAD CLASS PENTING
        PersonClass = onto.search_one(iri=FOAF_IRI + "Person")
        ClinicalTestClass = onto.search_one(iri=BASE_IRI + "ClinicalTest")

        if not PersonClass or not ClinicalTestClass:
            # Fallback search
            PersonClass = onto.search_one(iri="*Person")
            ClinicalTestClass = onto.search_one(iri="*ClinicalTest")
            if not PersonClass: raise HTTPException(500, "Class Person not found")

        # 3. INSTANSIASI PASIEN & TES
        patient = PersonClass("TempPatient")
        clinical_test = ClinicalTestClass("TempTest")

        has_clinical_test_prop = onto.search_one(iri="*hasClinicalTest")
        if has_clinical_test_prop:
            getattr(patient, has_clinical_test_prop.name).append(clinical_test)

        # 4. ISI DATA PROPERTIES
        def set_val(obj, prop_name_fragment, val):
            prop = onto.search_one(iri=f"*{prop_name_fragment}")
            if prop and val is not None:
                # Casting ke integer jika properti meminta integer tapi dapat float
                if prop.range and int in prop.range and isinstance(val, float):
                    val = int(val) 
                setattr(obj, prop.name, [val])
        
        set_val(patient, "hasAge", data.age)
        set_val(patient, "hasMMSEScore", data.mmse_score)
        set_val(patient, "hasMoCAScore", data.moca_score)
        set_val(patient, "hasFAQScore", data.faq_score)

        set_val(clinical_test, "hasAβ42Score", data.abeta42_score)
        set_val(clinical_test, "hasAβ42/40Score", data.abeta42_40_ratio)
        set_val(clinical_test, "hasP-Tau181Score", data.ptau181_score)
        set_val(clinical_test, "hasP-Tau/Aβ42Score", data.ptau_abeta_ratio)
        set_val(clinical_test, "hasT-Tau", data.ttau_score)
        set_val(clinical_test, "hasAdjHippocampalVol", data.adj_hippocampal_vol)

        # 5. IMAGING METHODS
        imaging_prop = onto.search_one(iri="*hasBrainImagingWith")
        for method_name in data.imaging_method:
            # Cari individual method (misal: Elecsys_Instance)
            method_ind = onto.search_one(iri=f"*{method_name}_Instance")
            if not method_ind:
                # Fallback: Cari class dan buat instance on-the-fly
                MethodClass = onto.search_one(iri=f"*{method_name}")
                if MethodClass and isinstance(MethodClass, ThingClass):
                    method_ind = MethodClass(f"{method_name}_Instance")
            
            if method_ind and imaging_prop:
                getattr(clinical_test, imaging_prop.name).append(method_ind)

        # 6. BEHAVIOR & FUNCTIONAL (INDEPENDENCE LOGIC) -- UPDATED --
        
        # Cari objek aktivitas sehari-hari
        daily_acts = onto.search_one(iri="*DailyActivities")
        if not daily_acts:
             IADLClass = onto.search_one(iri="*InstrumentalActivitiesOfDailyLiving")
             if IADLClass: daily_acts = IADLClass("DailyActivities")

        if daily_acts:
            # Logic Penentuan Status Mandiri
            is_independent = None
            
            # Prioritas 1: Input Manual dari JSON
            if data.is_independent is not None:
                is_independent = data.is_independent
            # Prioritas 2: Hitung otomatis dari FAQ Score
            elif data.faq_score is not None:
                is_independent = (data.faq_score < 9)
            
            # Terapkan Property ke Ontology
            if is_independent is not None:
                if is_independent:
                    indep_prop = onto.search_one(iri="*independent")
                    if indep_prop: getattr(patient, indep_prop.name).append(daily_acts)
                else:
                    not_indep_prop = onto.search_one(iri="*notIndependent")
                    if not_indep_prop: getattr(patient, not_indep_prop.name).append(daily_acts)

        # Handle Behavior Change
        if data.has_behavior_change:
            beh_ind = onto.search_one(iri="*Behaviour_Instance")
            if not beh_ind:
                BehClass = onto.search_one(iri="*Behaviour")
                if BehClass: beh_ind = BehClass("Behaviour_Instance")
            
            change_prop = onto.search_one(iri="*hasChanged")
            if beh_ind and change_prop:
                getattr(clinical_test, change_prop.name).append(beh_ind)

        # 7. FAMILY HISTORY (RISK ASSESSMENT) -- UPDATED (GENERALIZED) --
        if data.family_history:
            # Kita buat individual generik "FamilyMember_Instance"
            # Agar rule HighRisk aktif, dia harus tipe: PersonWithADDementia
            
            fam_instance = onto.search_one(iri="*FamilyMember_Instance")
            
            if not fam_instance:
                # Cari Class wajib untuk trigger rule
                ADDementiaClass = onto.search_one(iri="*PersonWithADDementia")
                
                if ADDementiaClass:
                    fam_instance = ADDementiaClass("FamilyMember_Instance")
                else:
                    # Fallback jika class spesifik tidak ada (daripada error)
                    fam_instance = PersonClass("FamilyMember_Instance")

            # Hubungkan Pasien -> familyOf -> FamilyMember
            family_prop = onto.search_one(iri="*familyOf")
            if fam_instance and family_prop:
                getattr(patient, family_prop.name).append(fam_instance)

        # 8. EXECUTE REASONER
        print("Running Pellet...")
        try:
            sync_reasoner_pellet(infer_property_values=True, infer_data_property_values=True)
        except Exception as e:
            print(f"Reasoner Warning: {e}")

        # 9. EXTRACT RESULTS
        results = {
            "diagnosis": None,
            "severity": None,
            "risk": [],
            "recommendations": [],
            "biomarkers": []
        }

        # DEBUG: Print all patient classes
        print("\n🔍 DEBUG - Patient inferred classes:")
        for cls in patient.is_a:
            if hasattr(cls, "name"):
                print(f"  - {cls.name}")

        # Track severity separately
        severity_found = None
        diagnosis_found = None
        
        for cls in patient.is_a:
            if hasattr(cls, "name"):
                name = cls.name
                if name in ["Person", "Thing", "ClinicalTest", "TempPatient"]: continue
                
                # Check for severity from SIO classes
                if "SIO_001215" in name:
                    severity_found = "severe"
                    print(f"✅ Found severity: severe from {name}")
                elif "SIO_001214" in name:
                    severity_found = "moderate"
                    print(f"✅ Found severity: moderate from {name}")
                elif "SIO_001213" in name:
                    severity_found = "mild"
                    print(f"✅ Found severity: mild from {name}")
                
                # Check for severity from Activities classes (backup)
                elif "SevereActivities" in name:
                    severity_found = "severe"
                    print(f"✅ Found severity: severe from {name}")
                elif "ModerateActivities" in name:
                    severity_found = "moderate"
                    print(f"✅ Found severity: moderate from {name}")
                elif "MildActivities" in name:
                    severity_found = "mild"
                    print(f"✅ Found severity: mild from {name}")
                
                # Check for diagnosis categories
                if any(x in name for x in ["Asymptomatic", "MCI", "Dementia", "Subjective"]):
                    diagnosis_found = name
                    print(f"✅ Found diagnosis: {name}")
                elif "HighRisk" in name:
                    results["risk"].append(name)
                    print(f"✅ Found risk: {name}")
                elif "Need" in name:
                    results["recommendations"].append(name)
                    print(f"✅ Found recommendation: {name}")
        
        # Set diagnosis and severity as separate fields
        results["diagnosis"] = diagnosis_found
        results["severity"] = severity_found
        
        print(f"\n📊 FINAL RESULTS: {results}\n")

        for cls in clinical_test.is_a:
            if hasattr(cls, "name"):
                name = cls.name
                if "Positive" in name or "Negative" in name:
                    results["biomarkers"].append(name)

        rec_prop = onto.search_one(iri="*hasRecommendation")
        if rec_prop:
            recs = getattr(patient, rec_prop.name)
            for r in recs:
                if hasattr(r, "name"):
                    results["recommendations"].append(r.name)

        return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)