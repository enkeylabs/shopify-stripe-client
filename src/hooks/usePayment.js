import axios from "axios"

const URL = 'http://localhost:4040/api/v1'

const usePayment = () => {
  const createOrder = async () => {
    try {
      const response = await axios.post(`${URL}/shopify/create-order`, null)
      console.log("🚀 ~ file: usePayment.js:14 ~ processPayment ~ response:", response)
      const { order } = response.data
      return order
    } catch (err) {
      console.log("🚀 ~ file: usePayment.js:16 ~ processPayment ~ err:", err)
    }
  }

  const createPaymentIntent = async (orderId) => {
    try {
      console.log("🚀 ~ file: usePayment.js:8 ~ usePayment ~ orderId:", orderId)
      const response = await axios.post(`${URL}/shopify/create-payment-intent`, {
        orderId,
        amount: 1
      })
      console.log("🚀 ~ file: usePayment.js:25 ~ createPaymentIntent ~ response:", response)
      const { clientSecret } = response.data
      return clientSecret
    } catch(err) {
      console.log("🚀 ~ file: usePayment.js:30 ~ createPaymentIntent ~ err:", err)
    }
  }

  const paymentConfirmation = async (orderId, paymentIntentId) => {
    try {
      const response = await axios.post(`${URL}/shopify/payment-confirmation`, {
        orderId,
        paymentIntentId
      })
      console.log("🚀 ~ file: usePayment.js:8 ~ usePayment ~ orderId:", orderId, paymentIntentId)
      console.log("🚀 ~ file: usePayment.js:42 ~ paymentConfirmation ~ response:", response)
      const { message } = response.data

      return message
    } catch(err) {
      console.log("🚀 ~ file: usePayment.js:41 ~ paymentConfirmation ~ err:", err)
    }
  }

  return {
    createOrder,
    createPaymentIntent,
    paymentConfirmation
  }
}

export default usePayment
