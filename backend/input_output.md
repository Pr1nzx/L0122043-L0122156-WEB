# Dokumentasi API AD-DSS (Alzheimer's Disease Decision Support System)

Dokumentasi ini menjelaskan spesifikasi API Backend untuk sistem pendukung keputusan diagnosa Alzheimer. Sistem ini menggunakan logika hibrida (Hybrid Approach): struktur data berbasis Ontologi (.owl) dan logika keputusan berbasis Python.

## 1. Informasi Endpoint

* **Base URL:** `http://localhost:8000` (Default saat berjalan lokal)
* **Endpoint:** `/diagnose`
* **Method:** `POST`
* **Content-Type:** `application/json`

---

## 2. Spesifikasi Input (Request Body)

Kirimkan data pasien dalam format JSON. Berikut adalah daftar parameter yang didukung.

### A. Data Demografis & Status Pasien
| Parameter | Tipe Data | Wajib? | Deskripsi |
| :--- | :--- | :--- | :--- |
| `age` | Integer | Ya | Usia pasien dalam tahun. |
| `has_other_diseases` | Boolean | Tidak | `true` jika pasien memiliki komorbiditas, default `false`. |
| `is_independent` | Boolean | **Ya** | Status kemandirian pasien. `true` (Mandiri), `false` (Perlu Bantuan). Sangat penting untuk membedakan MCI dan Dementia. |
| `behavior_change` | Boolean | Tidak | `true` jika ada perubahan perilaku/keluhan subjektif. Penting untuk diagnosa SCD (*Subjective Cognitive Decline*). |

### B. Skor Tes Kognitif
| Parameter | Tipe Data | Wajib? | Deskripsi |
| :--- | :--- | :--- | :--- |
| `mmse_score` | Integer | **Ya** | Skor *Mini-Mental State Exam* (0-30). Digunakan untuk menentukan tingkat keparahan (*Severity*) dan diagnosa MCI. |
| `moca_score` | Integer | Tidak | Skor MoCA (Montreal Cognitive Assessment). |
| `faq_score` | Integer | Tidak | Skor FAQ (Functional Activities Questionnaire). |
| `ad8_score` | Integer | Tidak | Skor AD8 (Dementia Screening Interview). |

### C. Metode Imaging & Biomarker
Pilih `imaging_method` yang sesuai, lalu isi nilai biomarker yang relevan dengan metode tersebut.

**Parameter Metode:**
| Parameter | Tipe Data | Valid Values |
| :--- | :--- | :--- |
| `imaging_method` | List[String] | `["Elecsys"]`, `["Innotest"]`, `["Lumipulse"]`, `["MRIFreesurfer"]` |

**Nilai Biomarker (Laboratorium):**
| Parameter | Tipe Data | Metode Terkait | Deskripsi |
| :--- | :--- | :--- | :--- |
| `ab42_40_score` | Float | Elecsys | Rasio Amyloid Beta 42/40. |
| `ptau_ab42_score` | Float | Elecsys | Rasio P-Tau/Amyloid Beta 42. |
| `ab42_score` | Integer | Innotest | Nilai absolut Amyloid Beta 42. |
| `ptau181_score` | Integer | Innotest | Nilai P-Tau 181. |
| `t_tau_score` | Integer | Innotest | Nilai Total Tau (Neurodegeneration). |
| `hippocampal_vol` | Float | MRI | Volume Hippocampus (indikator atrofi otak). |

---

## 3. Spesifikasi Output (Response Body)

API mengembalikan objek JSON dengan hasil analisis.

| Field | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `diagnosis` | List[String] | Kesimpulan diagnosa (contoh: "Alzheimer's Disease Dementia", "MCI", "Non-AD Dementia"). |
| `severity` | List[String] | Tingkat keparahan kondisi (contoh: "Severe Condition", "Mild Condition"). |
| `clinical_status` | List[String] | Status biomarker (contoh: "AmyloidPositive", "TauPositive", "NeurodegenerationPositive"). |
| `recommended_actions` | List[String] | Tindakan medis lanjutan yang disarankan (jika ada). |
| `recommended_activities` | List[String] | Rekomendasi aktivitas terapi non-farmakologis (contoh: "CognitiveTraining", "MusicTherapy"). |

---

## 4. Contoh Penggunaan (Use Cases)

### Kasus 1: Severe Alzheimer's Disease
Pasien lanjut usia, skor MMSE rendah, tidak mandiri, dan biomarker positif.

**Request:**
```json
{
  "age": 75,
  "mmse_score": 5,
  "is_independent": false,
  "imaging_method": ["Elecsys", "Innotest"],
  "ab42_40_score": 0.01,
  "t_tau_score": 400
}
```

**Response:**
```json
{
  "diagnosis": [
    "Alzheimer's Disease Dementia",
    "Alzheimer's Continuum"
  ],
  "severity": [
    "Severe Condition"
  ],
  "clinical_status": [
    "AmyloidPositive",
    "NeurodegenerationPositive"
  ],
  "recommended_actions": [],
  "recommended_activities": [
    "AuditoryStimulation",
    "VisualStimulation",
    "TactileStimulation",
    "OlfactoryStimulation"
  ]
}
```