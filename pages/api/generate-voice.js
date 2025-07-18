import { generateVoice, audioBufferToBase64 } from '../../lib/elevenlabs'
import { generateVoiceScript } from '../../lib/openai'
import { getUserSubscription, supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { planContent, voiceId } = req.body

    if (!planContent) {
      return res.status(400).json({ error: 'Missing plan content' })
    }

    // Get user from authorization header
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Check if user has Premium subscription
    const { data: subscription } = await getUserSubscription(user.id)
    if (!subscription || subscription.plan_type !== 'premium') {
      return res.status(403).json({ 
        error: 'Premium subscription required',
        message: 'Voice generation is available for Premium subscribers only'
      })
    }

    // Convert plan to voice-friendly script
    const scriptResult = await generateVoiceScript(planContent)
    if (!scriptResult.success) {
      return res.status(500).json({ error: 'Failed to generate voice script' })
    }

    // Generate voice audio
    const voiceResult = await generateVoice(scriptResult.script, voiceId)
    if (!voiceResult.success) {
      return res.status(500).json({ error: 'Failed to generate voice audio' })
    }

    // Convert audio buffer to base64 for client
    const audioBase64 = audioBufferToBase64(voiceResult.audioBuffer)

    res.status(200).json({
      success: true,
      audioData: audioBase64,
      contentType: voiceResult.contentType,
      script: scriptResult.script
    })

  } catch (error) {
    console.error('Generate voice error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}