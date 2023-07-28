import './App.css';
import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  CardElement
} from '@stripe/react-stripe-js';

import usePayment from './hooks/usePayment';

function App() {
  const stripe = useStripe()
  const elements = useElements()
  const [message, setMessage] = useState('')
  const [orderId, setOrderId] = useState('')
  const [paymentIntentId, setPaymentIntentId] = useState('')

  const options = {
    style: {
      base: {
        fontSmoothing: "antialiased",
        fontSize: "16px"
      },
      invalid: {
        color: 'red',
        iconColor: 'red'
      }
    },
    hidePostalCode: true
  }

  const {
    createOrder,
    createPaymentIntent,
    paymentConfirmation
  } = usePayment()

  const onPayment = async () => {
    try {
      if (!stripe || !elements) return
      const cardElement = elements.getElement(CardElement)
      const order = await createOrder()
      setOrderId(order.id)
      const clientSecret = await createPaymentIntent(order.id)

      if (clientSecret) {
        const stripeRes = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement
          }
        })
        const { paymentIntent, error } = stripeRes
        if (error) throw new Error(error.message)

        if (paymentIntent.status === 'succeeded') {
          setPaymentIntentId(paymentIntent.id)
          const response = await paymentConfirmation(order.id, paymentIntent.id)
          const message = response.data
          setMessage(message)
        }
      }
    } catch(err) {
      console.log("🚀 ~ file: App.js:41 ~ onPayment ~ err:", err)
    }
  }

  return (
    <div className="root">
      <div className="order-wrapper">
        <h2>Your Order</h2>
        <div className="row" style={{ width: '100%', marginTop: 10, justifyContent: 'space-between' }}>
          <div className="row">
            <img style={{ width: 120, height: 120, marginRight: 10 }} src="https://afee14.myshopify.com/cdn/shop/files/e777c881-5b62-4250-92a6-362967f54cca.webp?v=1689325185&width=533" alt=""/>
            <div className="column">
              <h4>Air Force 1</h4>
              <span>Qty: 1</span>
            </div>
          </div>
          <h3>$1.00</h3>
        </div>
      </div>
      <div className="card-wrapper">
        <CardElement options={options}/>
      </div>
      <div className="row" style={{ marginTop: 20 }}>
        <button onClick={onPayment}>
          Payment
        </button>
      </div>
      <div className="result-wrapper">
        <h2 style={{ marginBottom: 10 }}>Result</h2>
        <span>{message}</span>
        <span>Shopify Order ID: {orderId}</span>
        <span>Payment Intent ID: {paymentIntentId}</span>
      </div>
    </div>
  );
}

export default App;
