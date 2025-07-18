import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Lightbulb } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function DreamInput() {
  const [user, setUser] = useState(null)
  const [dreamText, setDreamText] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/')
      } else {
        setUser(user)
      }
    })
  }, [router])

  const handleContinue = async () => {
    if (!dreamText.trim()) {
      toast.error('Please enter your dream first')
      return
    }

    if (dreamText.trim().length < 10) {
      toast.error('Please describe your dream in a bit more detail')
      return
    }

    setLoading(true)
    
    // Store dream text in session storage for the next step
    sessionStorage.setItem('dreamText', dreamText)
    
    // Navigate to questions page
    router.push('/questions')
  }

  const exampleDreams = [
    "Save £1,000 in 3 months",
    "Become better at drawing",
    "Start a podcast",
    "Make extra income online",
    "Learn to code",
    "Get fit and healthy",
    "Write a book",
    "Start an Etsy shop"
  ]

  const handleExampleClick = (example) => {
    setDreamText(example)
  }

  if (!user) {
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
      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <Lightbulb className="h-8 w-8 text-primary-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            What's a dream or goal you have right now?
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Type anything: "Start an Etsy shop," "Learn coding," "Make money," "Travel more"
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="mb-6">
            <textarea
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              placeholder="Describe your dream or goal here..."
              className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-lg"
              maxLength={500}
            />
            <div className="text-right text-sm text-gray-500 mt-2">
              {dreamText.length}/500
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={loading || !dreamText.trim()}
            className="w-full bg-primary-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Processing...' : 'Continue'}</span>
            {!loading && <ArrowRight className="h-5 w-5" />}
          </button>
        </motion.div>

        {/* Example Dreams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Need inspiration? Try one of these:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exampleDreams.map((dream, index) => (
              <motion.button
                key={index}
                onClick={() => handleExampleClick(dream)}
                className="p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-gray-700">{dream}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-500">Step 1 of 3</p>
        </div>
      </div>
    </div>
  )
}