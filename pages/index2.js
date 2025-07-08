const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { plan } = req.body;

  let priceId = '';
  if (plan === 'monthly') {
    priceId = 'price_1RiMrVP5xBmXAZIzQjch7WCc';
  } else if (plan === 'yearly') {
    priceId = 'price_1RiMwVP5xBmXAZIznSfRd8aL';
  } else {
    return res.status(400).json({ error: 'Invalid plan selected' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://your-app.vercel.app/success',
      cancel_url: 'https://your-app.vercel.app/cancel',
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
