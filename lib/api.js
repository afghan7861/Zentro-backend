import { supabase } from './supabase'

export const makeAuthenticatedRequest = async (url, options = {}) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error('No active session')
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
    ...options.headers
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || error.error || 'Request failed')
  }

  return response.json()
}

export const generateDreamPlan = async (dreamText, userDetails, planTone = 'balanced') => {
  return makeAuthenticatedRequest('/api/generate-plan', {
    method: 'POST',
    body: JSON.stringify({
      dreamText,
      userDetails,
      planTone
    })
  })
}

export const generateVoice = async (planContent, voiceId) => {
  return makeAuthenticatedRequest('/api/generate-voice', {
    method: 'POST',
    body: JSON.stringify({
      planContent,
      voiceId
    })
  })
}