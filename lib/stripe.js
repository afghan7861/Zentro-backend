import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export const getStripe = () => {
  return stripePromise
}

export const createCheckoutSession = async (priceId, userId) => {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId,
      userId,
    }),
  })

  const session = await response.json()
  return session
}

export const redirectToCheckout = async (sessionId) => {
  const stripe = await getStripe()
  const { error } = await stripe.redirectToCheckout({
    sessionId,
  })

  if (error) {
    console.error('Stripe checkout error:', error)
  }
}

// Price IDs from your specification
export const PRICING_PLANS = {
  pro: {
    name: 'Pro',
    price: '£4.99/mo',
    priceId: 'price_1RkQyJP5xBmXAZIzIL3tr2Mf',
    features: [
      'Unlimited plans',
      'Choose tone',
      'Save favorites',
      'Priority support'
    ]
  },
  premium: {
    name: 'Premium',
    price: '£9.99/mo',
    priceId: 'price_1RmEfeP5xBmXAZIzSZf6cDbE',
    features: [
      'All Pro features',
      'Downloadable voice versions',
      'Faster AI processing',
      'Early access to new tools'
    ]
  }
}