import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const generateDreamPlan = async (dreamText, userDetails, planTone = 'balanced') => {
  const { age, workStatus, timeCommitment, skills, timeline } = userDetails
  
  const toneInstructions = {
    fast: "Focus on aggressive, quick-win strategies that can show results in days or weeks. Be direct and action-oriented.",
    balanced: "Provide a steady, sustainable approach that balances quick wins with long-term growth. Be encouraging and realistic.",
    chill: "Emphasize a relaxed, low-pressure approach that fits easily into daily life. Be gentle and supportive."
  }

  const systemPrompt = `You are a friendly AI coach helping someone achieve their personal goal. Based on the user's dream, age, time commitment, and current life situation, give a simple, doable step-by-step roadmap they can start today. 

${toneInstructions[planTone] || toneInstructions.balanced}

Focus on realistic, practical, encouraging advice. Split into 3 sections:

1. **Dream Summary** - Summarize their dream in 1-2 sentences
2. **Action Plan** - Provide daily or weekly steps for 1–3 months, broken down into specific, actionable tasks
3. **Motivational Message** - End with an encouraging, personalized message

Be encouraging, not overwhelming. Keep tone human, easy to follow, and personalized to their situation.`

  const userPrompt = `Here's my dream: "${dreamText}"

About me:
- Age: ${age}
- Work/School status: ${workStatus}
- Time I can commit per week: ${timeCommitment}
- Current skills/strengths: ${skills}
- Timeline for achievement: ${timeline}

Please create a personalized plan for me.`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    return {
      success: true,
      plan: completion.choices[0].message.content
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export const generateVoiceScript = async (planContent) => {
  const systemPrompt = `Convert this dream plan into a warm, encouraging voice script that sounds natural when spoken aloud. 
  
  Guidelines:
  - Use conversational language
  - Add natural pauses with commas
  - Make it sound like a friendly coach talking directly to the person
  - Keep the same structure but make it flow better for audio
  - Add encouraging transitions between sections
  - Maximum 2 minutes when spoken (about 300 words)`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Convert this plan to a voice script:\n\n${planContent}` }
      ],
      temperature: 0.6,
      max_tokens: 800,
    })

    return {
      success: true,
      script: completion.choices[0].message.content
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}