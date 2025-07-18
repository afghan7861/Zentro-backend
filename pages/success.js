import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { CheckCircle, Sparkles, ArrowRight, Crown, Zap } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Success() {
  const [user, setUser] = useState(null)
  const router = useRouter()
  const { session_id } = router.query

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const handleContinue = () => {
    router.push('/dream-input')
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
          {user && (
            <span className="text-gray-600">Welcome, {user.email}</span>
          )}
        </div>
      </nav>

      {/* Success Content */}
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-8"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Premium! 🎉
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Your subscription has been activated successfully. You now have access to all premium features!
            </p>

            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What's unlocked for you:
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-primary-600" />
                  <span className="text-gray-700">Unlimited dream plans</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Crown className="h-5 w-5 text-secondary-600" />
                  <span className="text-gray-700">All plan tones</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Save favorite plans</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-5 w-5 text-primary-600" />
                  <span className="text-gray-700">Voice generation</span>
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleContinue}
              className="bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Creating Dream Plans</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>

            <p className="text-sm text-gray-500 mt-6">
              You'll receive a confirmation email shortly with your subscription details.
            </p>
          </motion.div>
        </motion.div>

        {/* Additional Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
              <Zap className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Unlimited Access</h3>
            <p className="text-gray-600 text-sm">
              Generate as many dream plans as you need, whenever inspiration strikes.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary-100 rounded-full mb-4">
              <Crown className="h-6 w-6 text-secondary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Premium Features</h3>
            <p className="text-gray-600 text-sm">
              Access all plan tones, voice generation, and advanced AI capabilities.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Priority Support</h3>
            <p className="text-gray-600 text-sm">
              Get help when you need it with our dedicated premium support team.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}