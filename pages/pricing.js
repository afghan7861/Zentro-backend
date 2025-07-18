import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Check, Sparkles, Crown, Star, Zap, Volume2, Heart } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { PRICING_PLANS, createCheckoutSession, redirectToCheckout } from '../lib/stripe'
import toast from 'react-hot-toast'

export default function Pricing() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState({})
  const router = useRouter()
  const { plan: selectedPlan } = router.query

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const handleUpgrade = async (planType) => {
    if (!user) {
      toast.error('Please sign in to upgrade')
      return
    }

    setLoading(prev => ({ ...prev, [planType]: true }))

    try {
      const plan = PRICING_PLANS[planType]
      const session = await createCheckoutSession(plan.priceId, user.id)
      
      if (session.error) {
        throw new Error(session.error)
      }

      await redirectToCheckout(session.sessionId)
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to start checkout. Please try again.')
    } finally {
      setLoading(prev => ({ ...prev, [planType]: false }))
    }
  }

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '£0',
      period: '/month',
      description: 'Perfect for trying out DreamFlow AI',
      features: [
        '3 plans per day',
        'Core AI features',
        'Basic plan generation',
        'Email support'
      ],
      cta: 'Get Started',
      popular: false,
      color: 'gray'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '£4.99',
      period: '/month',
      description: 'For serious dream achievers',
      features: [
        'Unlimited plans',
        'Choose tone (Fast, Balanced, Chill)',
        'Save favorite plans',
        'Priority support',
        'Advanced AI features'
      ],
      cta: 'Upgrade to Pro',
      popular: true,
      color: 'primary'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '£9.99',
      period: '/month',
      description: 'The ultimate dream planning experience',
      features: [
        'All Pro features',
        'Downloadable voice versions',
        'Faster AI processing',
        'Early access to new tools',
        'Premium support',
        'Custom voice options'
      ],
      cta: 'Upgrade to Premium',
      popular: false,
      color: 'secondary'
    }
  ]

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
              <span className="text-gray-600">Welcome, {user.email}</span>
              <button
                onClick={() => router.push('/dream-input')}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Plan
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push('/')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Back to Home
            </button>
          )}
        </div>
      </nav>

      {/* Header */}
      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your
            <br />
            <span className="text-primary-600">Dream Plan</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Unlock the full potential of AI-powered dream planning. 
            Start free, upgrade when you're ready for more.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                  plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
                } ${selectedPlan === plan.id ? 'ring-2 ring-primary-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>Most Popular</span>
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    plan.color === 'primary' ? 'bg-primary-100' :
                    plan.color === 'secondary' ? 'bg-secondary-100' :
                    'bg-gray-100'
                  }`}>
                    {plan.id === 'free' && <Heart className={`h-8 w-8 text-gray-600`} />}
                    {plan.id === 'pro' && <Zap className={`h-8 w-8 text-primary-600`} />}
                    {plan.id === 'premium' && <Crown className={`h-8 w-8 text-secondary-600`} />}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {plan.description}
                  </p>
                  
                  <div className="flex items-baseline justify-center mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-1">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => plan.id === 'free' ? router.push('/') : handleUpgrade(plan.id)}
                  disabled={loading[plan.id]}
                  className={`w-full py-4 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    plan.popular 
                      ? 'bg-primary-600 text-white hover:bg-primary-700' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {loading[plan.id] ? 'Processing...' : plan.cta}
                </button>

                {plan.id === 'premium' && (
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Volume2 className="h-4 w-4" />
                      <span>Voice features included</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compare Plans
            </h2>
            <p className="text-lg text-gray-600">
              See what's included in each plan
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-6 font-semibold text-gray-900">Features</th>
                  <th className="text-center p-6 font-semibold text-gray-900">Free</th>
                  <th className="text-center p-6 font-semibold text-primary-600">Pro</th>
                  <th className="text-center p-6 font-semibold text-secondary-600">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Daily Plans', free: '3', pro: 'Unlimited', premium: 'Unlimited' },
                  { feature: 'Plan Tones', free: 'Balanced only', pro: 'All tones', premium: 'All tones' },
                  { feature: 'Voice Generation', free: '✗', pro: '✗', premium: '✓' },
                  { feature: 'Save Favorites', free: '✗', pro: '✓', premium: '✓' },
                  { feature: 'Priority Support', free: '✗', pro: '✓', premium: '✓' },
                  { feature: 'Early Access', free: '✗', pro: '✗', premium: '✓' },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 last:border-b-0">
                    <td className="p-6 font-medium text-gray-900">{row.feature}</td>
                    <td className="p-6 text-center text-gray-600">{row.free}</td>
                    <td className="p-6 text-center text-primary-600">{row.pro}</td>
                    <td className="p-6 text-center text-secondary-600">{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes! You can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period."
              },
              {
                q: "What happens if I reach my daily limit on the free plan?",
                a: "You'll see an upgrade prompt and won't be able to generate more plans until the next day, or you can upgrade to Pro/Premium for unlimited plans."
              },
              {
                q: "How does the voice generation work?",
                a: "Premium users can convert their dream plans into downloadable audio files using advanced AI voice synthesis, perfect for listening on-the-go."
              },
              {
                q: "Is there a refund policy?",
                a: "We offer a 30-day money-back guarantee. If you're not satisfied with your subscription, contact us for a full refund."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Turn Your Dreams Into Reality?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of dreamers who are already making their goals happen.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Your Journey
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}