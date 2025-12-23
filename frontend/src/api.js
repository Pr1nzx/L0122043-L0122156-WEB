// API Integration untuk backend Alzheimer Decision Support System
import axios from 'axios'

const API_BASE_URL = "http://localhost:8000"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

// Single diagnosis endpoint that processes all patient data
export async function sendDiagnoseData(data) {
  try {
    // Map frontend field names to new backend PatientData schema
    const payload = {
      age: data.age || null,
      family_history: data.family_history || false,
      mmse_score: data.mmse_score || null,
      moca_score: data.moca_score || null,
      faq_score: data.faq_score || null,
      is_independent: data.is_independent !== undefined ? data.is_independent : null,
      
      // Biomarkers
      abeta42_score: data.abeta42_score || null,
      abeta42_40_ratio: data.abeta42_40_ratio || null,
      ptau181_score: data.ptau181_score || null,
      ptau_abeta_ratio: data.ptau_abeta_ratio || null,
      ttau_score: data.ttau_score || null,
      adj_hippocampal_vol: data.adj_hippocampal_vol || null,
      
      // Imaging and behavior
      imaging_method: data.imaging_method || [],
      has_behavior_change: data.has_behavior_change || false
    }

    console.log('📤 DIAGNOSE REQUEST - Sending data to backend:', payload)
    const response = await api.post('/diagnose', payload)
    console.log('✅ DIAGNOSE RESPONSE - Received from backend:', response.data)
    
    return {
      success: true,
      diagnosis: response.data.diagnosis || [],
      risk: response.data.risk || [],
      recommendations: response.data.recommendations || [],
      biomarkers: response.data.biomarkers || [],
      data: response.data
    }
  } catch (error) {
    console.error('❌ DIAGNOSE API Error:', error.response?.data || error.message)
    throw {
      success: false,
      message: error.response?.data?.detail || error.message || 'Failed to process diagnosis'
    }
  }
}

// Health check endpoint
export async function checkBackendHealth() {
  try {
    const response = await axios.get('http://localhost:8000/docs')
    return { status: 'UP' }
  } catch (error) {
    console.error('Health check failed:', error)
    return { status: 'DOWN' }
  }
}
