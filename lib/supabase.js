import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for authentication
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Database helper functions
export const saveDreamPlan = async (userId, dreamText, plan, planType = 'free') => {
  const { data, error } = await supabase
    .from('dream_plans')
    .insert([
      {
        user_id: userId,
        dream_text: dreamText,
        plan_content: plan,
        plan_type: planType,
        created_at: new Date().toISOString()
      }
    ])
  return { data, error }
}

export const getUserDreamPlans = async (userId) => {
  const { data, error } = await supabase
    .from('dream_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const getDailyPlanCount = async (userId) => {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('dream_plans')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`)
  
  return { count: data?.length || 0, error }
}

export const getUserSubscription = async (userId) => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}