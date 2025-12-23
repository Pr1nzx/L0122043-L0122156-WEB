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
    // Map frontend field names to backend PatientData schema
    const payload = {
      age: data.age || null,
      has_other_diseases: data.has_other_diseases || false,
      mmse_score: data.mmse_score || null,
      moca_score: data.moca_score || null,
      faq_score: data.faq_score || null,
      ad8_score: data.ad8_score || null,
      ab42_40_score: data.ab42_40_score || null,
      ab42_score: data.ab42_score || null,
      ptau_ab42_score: data.ptau_ab42_score || null,
      ptau181_score: data.ptau181_score || null,
      t_tau_score: data.t_tau_score || null,
      hippocampal_vol: data.hippocampal_vol || null,
      imaging_method: data.imaging_method || [],
      behavior_change: data.behavior_change || false,
      is_independent: data.is_independent !== undefined ? data.is_independent : null
    }

    console.log('📤 DIAGNOSE REQUEST - Sending data to backend:', payload)
    const response = await api.post('/diagnose', payload)
    console.log('✅ DIAGNOSE RESPONSE - Received from backend:', response.data)
    
    return {
      success: true,
      diagnosis: response.data.diagnosis || [],
      severity: response.data.severity || [],
      clinical_status: response.data.clinical_status || [],
      recommended_actions: response.data.recommended_actions || [],
      recommended_activities: response.data.recommended_activities || [],
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
