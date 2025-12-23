// API Integration untuk backend Alzheimer Decision Support System
import axios from 'axios'

const API_BASE_URL = "http://localhost:8080/api/v1/diagnosis"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

// Step 1: Initial Clinical Assessment
export async function sendStep1Data(data) {
  try {
    console.log('📤 STEP1 REQUEST - Sending data to backend:', data)
    const response = await api.post('/step1', data)
    console.log('✅ STEP1 RESPONSE - Received from backend:', response.data)
    return {
      success: true,
      sessionId: response.data.sessionId,
      decision: response.data.decision,
      message: response.data.message,
      data: response.data
    }
  } catch (error) {
    console.error('❌ STEP1 API Error:', error.response?.data || error.message)
    throw {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to process Step 1'
    }
  }
}

// Step 2: Brain Imaging & Biomarkers
export async function sendStep2Data(data, sessionId) {
  try {
    const payload = {
      ...data,
      sessionId
    }
    console.log('📤 STEP2 REQUEST - Sending data to backend:', payload)
    const response = await api.post('/step2', payload)
    console.log('✅ STEP2 RESPONSE - Received from backend:', response.data)
    return {
      success: true,
      decision: response.data.decision,
      message: response.data.message,
      data: response.data
    }
  } catch (error) {
    console.error('❌ STEP2 API Error:', error.response?.data || error.message)
    throw {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to process Step 2'
    }
  }
}

// Step 3: ATN Framework Diagnosis
export async function sendStep3Data(data, sessionId) {
  try {
    const payload = {
      ...data,
      sessionId
    }
    console.log('📤 STEP3 REQUEST - Sending data to backend:', payload)
    const response = await api.post('/step3', payload)
    console.log('✅ STEP3 RESPONSE - Full backend response:', response.data)
    console.log('📊 STEP3 Response fields:')
    console.log('  - diagnosis:', response.data.diagnosis)
    console.log('  - atnProfile:', response.data.atnProfile)
    console.log('  - amyloidStatus:', response.data.amyloidStatus)
    console.log('  - tauStatus:', response.data.tauStatus)
    console.log('  - neurodegenerationStatus:', response.data.neurodegenerationStatus)
    console.log('  - inferredClasses:', response.data.inferredClasses)
    return {
      success: true,
      decision: response.data.decision,
      message: response.data.message,
      diagnosis: response.data.diagnosis,
      atnProfile: response.data.atnProfile,
      amyloidStatus: response.data.amyloidStatus,
      tauStatus: response.data.tauStatus,
      neurodegenerationStatus: response.data.neurodegenerationStatus,
      data: response.data
    }
  } catch (error) {
    console.error('❌ STEP3 API Error:', error.response?.data || error.message)
    throw {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to process Step 3'
    }
  }
}

// Health check endpoint
export async function checkBackendHealth() {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/health')
    return response.data
  } catch (error) {
    console.error('Health check failed:', error)
    return { status: 'DOWN' }
  }
}
