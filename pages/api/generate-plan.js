import { generateDreamPlan } from '../../lib/openai'
import { getDailyPlanCount, getUserSubscription, saveDreamPlan, supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { dreamText, userDetails, planTone = 'balanced' } = req.body

    if (!dreamText || !userDetails) {
      return res.status(400).json({ error: 'Missing required fields' })
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

    // Check user's subscription and daily limits
    const { data: subscription } = await getUserSubscription(user.id)
    const { count: dailyCount } = await getDailyPlanCount(user.id)

    // Free users limited to 3 plans per day
    if (!subscription && dailyCount >= 3) {
      return res.status(429).json({ 
        error: 'Daily limit reached',
        message: "You've used your 3 free plans today ✨ Upgrade to Pro or Premium to unlock more dream magic!",
        upgradeRequired: true
      })
    }

    // Generate the plan using OpenAI
    const result = await generateDreamPlan(dreamText, userDetails, planTone)

    if (!result.success) {
      return res.status(500).json({ error: 'Failed to generate plan' })
    }

    // Save the plan to database
    const planType = subscription ? subscription.plan_type : 'free'
    await saveDreamPlan(user.id, dreamText, result.plan, planType)

    res.status(200).json({
      success: true,
      plan: result.plan,
      planType: planType,
      dailyPlansUsed: dailyCount + 1,
      dailyLimit: subscription ? 'unlimited' : 3
    })

  } catch (error) {
    console.error('Generate plan error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}