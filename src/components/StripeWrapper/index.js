import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const STRIPE_KEY = process.env.REACT_APP_STRIPE_KEY

const StripeWrapper = ({ children }) => {
  const [stripeInit, setStripeInit] = useState(null)

  useEffect(() => {
    const initStripe = async () => {
      const stripe = await loadStripe(STRIPE_KEY)
      setStripeInit(stripe)
    }

    if (!stripeInit) {
      initStripe()
    }
  }, [stripeInit])

  if (!stripeInit) return null

  return (
    <Elements
      stripe={stripeInit}
      options={{
        mode: 'setup',
        currency: 'aud',
        appearance: {
          theme: 'stripe'
        },
        paymentMethodTypes: ['card']
      }}
    >
      {children}
    </Elements>
  )
}

export default StripeWrapper;
