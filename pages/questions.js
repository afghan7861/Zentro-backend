import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, User, Clock, Calendar, Target, Zap } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Questions() {
  const [user, setUser] = useState(null)
  const [dreamText, setDreamText] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({
    age: '',
    workStatus: '',
    timeCommitment: '',
    skills: '',
    timeline: ''
  })
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

    // Get dream text from session storage
    const storedDreamText = sessionStorage.getItem('dreamText')
    if (!storedDreamText) {
      router.push('/dream-input')
    } else {
      setDreamText(storedDreamText)
    }
  }, [router])

  const questions = [
    {
      id: 'age',
      title: "What's your age?",
      icon: <User className="h-6 w-6" />,
      type: 'select',
      options: [
        '18-24',
        '25-34',
        '35-44',
        '45-54',
        '55-64',
        '65+'
      ]
    },
    {
      id: 'workStatus',
      title: "Do you work or go to school?",
      icon: <Target className="h-6 w-6" />,
      type: 'select',
      options: [
        'Full-time job',
        'Part-time job',
        'Student',
        'Freelancer',
        'Unemployed',
        'Retired',
        'Other'
      ]
    },
    {
      id: 'timeCommitment',
      title: "How much time per week can you commit?",
      icon: <Clock className="h-6 w-6" />,
      type: 'select',
      options: [
        '1-2 hours',
        '3-5 hours',
        '6-10 hours',
        '11-15 hours',
        '16-20 hours',
        '20+ hours'
      ]
    },
    {
      id: 'skills',
      title: "What are your current skills or strengths?",
      icon: <Zap className="h-6 w-6" />,
      type: 'textarea',
      placeholder: 'e.g., Good at writing, creative, organized, tech-savvy, people skills...'
    },
    {
      id: 'timeline',
      title: "When do you want to achieve this dream?",
      icon: <Calendar className="h-6 w-6" />,
      type: 'select',
      options: [
        'Within 1 month',
        'Within 3 months',
        '3-6 months',
        '6-12 months',
        '1-2 years',
        '2+ years'
      ]
    }
  ]

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleNext = () => {
    const currentQ = questions[currentQuestion]
    if (!answers[currentQ.id]) {
      toast.error('Please answer this question before continuing')
      return
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleGeneratePlan()
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleGeneratePlan = async () => {
    setLoading(true)
    
    // Store all data in session storage
    sessionStorage.setItem('userDetails', JSON.stringify(answers))
    
    // Navigate to plan generation page
    router.push('/generate-plan')
  }

  if (!user || !dreamText) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

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

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto px-6 mb-8">
        <div className="bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-primary-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            {currentQ.icon}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {currentQ.title}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Let's ask a few quick questions so we can build the perfect plan for you.
          </p>
        </motion.div>

        <motion.div
          key={`content-${currentQuestion}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          {currentQ.type === 'select' ? (
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerChange(currentQ.id, option)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    answers[currentQ.id] === option
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          ) : (
            <textarea
              value={answers[currentQ.id]}
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              placeholder={currentQ.placeholder}
              className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-lg"
              maxLength={300}
            />
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!answers[currentQ.id] || loading}
              className="bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center space-x-2"
            >
              <span>
                {loading ? 'Generating...' : 
                 currentQuestion === questions.length - 1 ? 'Generate My Plan' : 'Next'}
              </span>
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
            <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-500">Step 2 of 3</p>
        </div>
      </div>

      {/* Dream Preview */}
      <div className="max-w-2xl mx-auto px-6 pb-12">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Your Dream:</h3>
          <p className="text-gray-700 italic">"{dreamText}"</p>
        </div>
      </div>
    </div>
  )
}