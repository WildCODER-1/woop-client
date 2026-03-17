// Replace the card input with this
const [clientSecret, setClientSecret] = useState(null)

// When user reaches step 3, fetch the payment intent
useEffect(() => {
  if (step === 3 && sel) {
    api.createPaymentIntent(sel.price)
      .then(data => setClientSecret(data.clientSecret))
  }
}, [step])

// In your JSX for step 3, replace the fake card input with:
{clientSecret && (
  <Elements stripe={stripePromise} options={{ clientSecret }}>
    <CheckoutForm
      amount={sel.price}
      onSuccess={() => setDone(true)}
    />
  </Elements>
)}