const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1'

// Default voice ID for a friendly, encouraging voice
const DEFAULT_VOICE_ID = 'pNInz6obpgDQGcFmaJgB' // Adam voice

export const generateVoice = async (text, voiceId = DEFAULT_VOICE_ID) => {
  if (!ELEVENLABS_API_KEY) {
    return {
      success: false,
      error: 'ElevenLabs API key not configured'
    }
  }

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const audioBuffer = await response.arrayBuffer()
    return {
      success: true,
      audioBuffer: audioBuffer,
      contentType: 'audio/mpeg'
    }
  } catch (error) {
    console.error('ElevenLabs API error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export const getAvailableVoices = async () => {
  if (!ELEVENLABS_API_KEY) {
    return {
      success: false,
      error: 'ElevenLabs API key not configured'
    }
  }

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      voices: data.voices
    }
  } catch (error) {
    console.error('ElevenLabs API error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Convert audio buffer to base64 for client-side playback
export const audioBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}