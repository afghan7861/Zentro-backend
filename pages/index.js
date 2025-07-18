import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Sparkles, Target, Zap, ArrowRight, Star, Users, Heart } from 'lucide-react'
import { supabase } from '../lib/supabase'
import AuthModal from '../components/AuthModal'

export default function Home() {
  const [user, setUser] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleStartDream = () => {
    if (user) {
      router.push('/dream-input')
    } else {
      setShowAuthModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-primary-600" />
          <span className="text-2xl font-bold text-gray-900">DreamFlow AI</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome back!</span>
              <button
                onClick={() => router.push('/dream-input')}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Plan
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Tell Us Your Dream.
            <br />
            <span className="text-primary-600">We'll Show You a Way</span>
            <br />
            to Make It Happen.
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Big or small, personal or creative — DreamFlow AI gives you a clear, simple, 
            custom roadmap for your goals. Just describe your dream, answer a few questions, 
            and get a step-by-step plan powered by AI.
          </p>

          <motion.button
            onClick={handleStartDream}
            className="bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Start Your Dream Plan</span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>

          <p className="text-sm text-gray-500 mt-4">
            Free to start • No credit card required
          </p>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to turn your dreams into actionable plans
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="h-8 w-8" />,
                title: "Tell us your dream",
                description: "Share any goal you have in mind. From saving money to learning new skills, we're here to help.",
                color: "primary"
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Answer a few questions",
                description: "Help us understand your situation with quick questions about your time, skills, and timeline.",
                color: "secondary"
              },
              {
                icon: <Sparkles className="h-8 w-8" />,
                title: "Get your personalized plan",
                description: "Receive a custom step-by-step roadmap created just for you, with daily and weekly actions.",
                color: "primary"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${step.color}-100 text-${step.color}-600 mb-4`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Dreams Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            What Dreams Can We Help With?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {[
              "Save £1,000 in 3 months",
              "Become better at drawing",
              "Start a podcast",
              "Make extra income online",
              "Learn to code",
              "Get fit and healthy",
              "Write a book",
              "Start an Etsy shop"
            ].map((dream, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:border-primary-200 transition-colors"
              >
                <span className="text-gray-700 font-medium">{dream}</span>
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={handleStartDream}
            className="bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Start Your Dream Plan</span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">1,000+</span>
              <span className="text-gray-600">Dreams Planned</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-900">4.9/5</span>
              <span className="text-gray-600">User Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-red-500" />
              <span className="text-2xl font-bold text-gray-900">95%</span>
              <span className="text-gray-600">Success Rate</span>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 italic">
            "DreamFlow AI helped me turn my vague idea of starting a side business into a clear, 
            actionable plan. I'm already seeing results!" - Sarah M.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary-400" />
            <span className="text-xl font-bold">DreamFlow AI</span>
          </div>
          <p className="text-gray-400">
            Turning dreams into reality, one step at a time.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false)
            router.push('/dream-input')
          }}
        />
      )}
    </div>
  )
}