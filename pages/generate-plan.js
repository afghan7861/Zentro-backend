import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Sparkles, Volume2, Download, Star, Crown, Zap, RefreshCw } from 'lucide-react'
import { supabase, getUserSubscription, getDailyPlanCount } from '../lib/supabase'
import { PRICING_PLANS } from '../lib/stripe'
import { generateDreamPlan as apiGenerateDreamPlan, generateVoice as apiGenerateVoice } from '../lib/api'
import toast from 'react-hot-toast'

export default function GeneratePlan() {
  const [user, setUser] = useState(null)
  const [dreamText, setDreamText] = useState('')
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState('')
  const [planTone, setPlanTone] = useState('balanced')
  const [subscription, setSubscription] = useState(null)
  const [dailyCount, setDailyCount] = useState(0)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const [generatingVoice, setGeneratingVoice] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/')
      } else {
        setUser(user)
        loadUserData(user.id)
      }
    })

    // Get data from session storage
    const storedDreamText = sessionStorage.getItem('dreamText')
    const storedUserDetails = sessionStorage.getItem('userDetails')
    
    if (!storedDreamText || !storedUserDetails) {
      router.push('/dream-input')
    } else {
      setDreamText(storedDreamText)
      setUserDetails(JSON.parse(storedUserDetails))
    }
  }, [router])

  const loadUserData = async (userId) => {
    try {
      const [subResult, countResult] = await Promise.all([
        getUserSubscription(userId),
        getDailyPlanCount(userId)
      ])
      
      setSubscription(subResult.data)
      setDailyCount(countResult.count)
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  useEffect(() => {
    if (user && dreamText && userDetails) {
      generatePlan()
    }
  }, [user, dreamText, userDetails])

  const generatePlan = async () => {
    try {
      setLoading(true)
      
      const data = await apiGenerateDreamPlan(dreamText, userDetails, planTone)

      setPlan(data.plan)
      setDailyCount(data.dailyPlansUsed)
      toast.success('Your dream plan is ready!')
      
    } catch (error) {
      console.error('Error generating plan:', error)
      
      if (error.message.includes('Daily limit reached') || error.message.includes('3 free plans')) {
        setShowUpgradePrompt(true)
        toast.error("You've used your 3 free plans today ✨ Upgrade to Pro or Premium to unlock more dream magic!")
      } else {
        toast.error('Failed to generate plan. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleToneChange = (newTone) => {
    if (!subscription && newTone !== 'balanced') {
      toast.error('Tone selection is available for Pro and Premium subscribers')
      return
    }
    setPlanTone(newTone)
    generatePlan()
  }

  const handleGenerateVoice = async () => {
    if (!subscription || subscription.plan_type !== 'premium') {
      toast.error('Voice generation is available for Premium subscribers only')
      return
    }

    try {
      setGeneratingVoice(true)
      
      const data = await apiGenerateVoice(plan)

      // Create audio URL from base64 data
      const audioBlob = new Blob([
        new Uint8Array(atob(data.audioData).split('').map(char => char.charCodeAt(0)))
      ], { type: data.contentType })
      
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
      
      toast.success('Voice version generated!')
      
    } catch (error) {
      console.error('Error generating voice:', error)
      toast.error('Failed to generate voice. Please try again.')
    } finally {
      setGeneratingVoice(false)
    }
  }

  const handleUpgrade = (planType) => {
    router.push(`/pricing?plan=${planType}`)
  }

  if (!user || !dreamText || !userDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-4xl mx-auto">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-primary-600" />
          <span className="text-2xl font-bold text-gray-900">DreamFlow AI</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Welcome, {user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-gray-500 hover:text-gray-700"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-10 w-10 text-primary-600" />
              </motion.div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Dream Loading...
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Our AI is crafting your personalized roadmap
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="bg-gray-200 rounded-full h-2 mb-4">
                <motion.div
                  className="bg-primary-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
              </div>
              <p className="text-sm text-gray-500">
                Analyzing your dream and creating custom steps...
              </p>
            </div>
          </motion.div>
        ) : showUpgradePrompt ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-8">
              <Crown className="h-10 w-10 text-yellow-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              You've used your 3 free plans today ✨
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Upgrade to Pro or Premium to unlock more dream magic!
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
                <p className="text-3xl font-bold text-primary-600 mb-4">{PRICING_PLANS.pro.price}</p>
                <ul className="space-y-2 mb-6">
                  {PRICING_PLANS.pro.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgrade('pro')}
                  className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                >
                  Upgrade to Pro
                </button>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-primary-500 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium</h3>
                <p className="text-3xl font-bold text-primary-600 mb-4">{PRICING_PLANS.premium.price}</p>
                <ul className="space-y-2 mb-6">
                  {PRICING_PLANS.premium.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgrade('premium')}
                  className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                >
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Dream Plan is Ready! 🎉
              </h1>
              <p className="text-lg text-gray-600">
                Here's your personalized roadmap to achieve: "{dreamText}"
              </p>
            </div>

            {/* Plan Controls */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Plan Tone:</span>
                  {['fast', 'balanced', 'chill'].map((tone) => (
                    <button
                      key={tone}
                      onClick={() => handleToneChange(tone)}
                      disabled={!subscription && tone !== 'balanced'}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        planTone === tone
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${!subscription && tone !== 'balanced' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                      {!subscription && tone !== 'balanced' && (
                        <Crown className="h-3 w-3 ml-1 inline" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  {subscription?.plan_type === 'premium' && (
                    <button
                      onClick={handleGenerateVoice}
                      disabled={generatingVoice}
                      className="flex items-center space-x-2 bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors disabled:opacity-50"
                    >
                      <Volume2 className="h-4 w-4" />
                      <span>{generatingVoice ? 'Generating...' : 'Generate Voice'}</span>
                    </button>
                  )}
                  
                  <button
                    onClick={generatePlan}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Regenerate</span>
                  </button>
                </div>
              </div>

              {/* Audio Player */}
              {audioUrl && (
                <div className="mb-6 p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Voice Version:</span>
                    <audio controls className="max-w-xs">
                      <source src={audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              )}

              {/* Plan Content */}
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {plan}
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Daily Plans Used: {dailyCount}/
                    {subscription ? 'unlimited' : '3'}
                  </p>
                  {!subscription && (
                    <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(dailyCount / 3) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
                
                {!subscription && (
                  <button
                    onClick={() => router.push('/pricing')}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Upgrade
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push('/dream-input')}
                className="bg-white text-primary-600 border border-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
              >
                Create Another Plan
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                Back to Home
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-500">Step 3 of 3 - Complete!</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}