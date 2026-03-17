import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'

function CheckoutForm({ amount, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePay = async () => {
    if (!stripe || !elements) return
    setLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required'
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      onSuccess()
    }
  }

  return (
    <div>
      <PaymentElement />
      {error && <div style={{ color: 'red', marginTop: 8, fontSize: 13 }}>{error}</div>}
      <button
        className="btn btn-zap"
        style={{ marginTop: 16 }}
        onClick={handlePay}
        disabled={loading}
      >
        {loading ? 'Processing...' : `Pay $${amount} 💳`}
      </button>
    </div>
  )
}

export default CheckoutForm