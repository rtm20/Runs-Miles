import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Shield, AlertCircle, ArrowLeft, ExternalLink, CreditCard, Wallet
} from 'lucide-react';
import { API_URL } from '../config';

const Payment = () => {
  const { registrationId } = useParams();
  const navigate = useNavigate();
  
  const [registration, setRegistration] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const response = await fetch(`${API_URL}/registration/${registrationId}`);
        const data = await response.json();
        
        if (data.registration) {
          setRegistration(data.registration);
          setEvent(data.event);
        } else {
          setError('Registration not found');
        }
      } catch (error) {
        console.error('Error fetching registration:', error);
        setError('Failed to load registration details');
      } finally {
        setLoading(false);
      }
    };
    fetchRegistration();
  }, [registrationId]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      // Step 1: Create order on backend
      const orderResponse = await fetch(`${API_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId })
      });
      
      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Runs and Miles',
        description: `${registration.eventTitle} - ${registration.distance}`,
        order_id: orderData.order.id,
        handler: async function (response) {
          // Step 3: Verify payment on backend
          try {
            const verifyResponse = await fetch(`${API_URL}/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                registrationId
              })
            });
            
            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              navigate(`/success/${registrationId}`);
            } else {
              setError('Payment verification failed. Please contact support.');
              setProcessing(false);
            }
          } catch (err) {
            console.error('Verify payment error:', err);
            setError('Payment verification failed. Please contact support.');
            setProcessing(false);
          }
        },
        prefill: {
          name: registration.name,
          email: registration.email,
          contact: registration.phone
        },
        notes: {
          registrationId: registrationId
        },
        theme: {
          color: '#FF6B35'
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setProcessing(false);
      });
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Something went wrong. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  if (error && !registration) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">{error}</h2>
        </div>
      </div>
    );
  }

  const amount = registration?.fee || 0;

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Payment Card */}
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-dark mb-2">
              Complete Payment
            </h1>
            <p className="text-gray-600">
              Secure payment powered by Razorpay
            </p>
          </div>

          {/* Registration Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-dark mb-4">Registration Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-medium text-dark">{registration?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Event</span>
                <span className="font-medium text-dark">{registration?.eventTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-medium text-dark">{registration?.distance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-dark">{registration?.email}</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-dark text-lg">Total Amount</span>
                <span className="font-bold text-3xl text-primary">₹{amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={processing}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white mr-3"></div>
                Processing...
              </>
            ) : (
              <>
                <Wallet className="w-6 h-6 mr-2" />
                Pay ₹{amount.toLocaleString()}
              </>
            )}
          </button>

          {/* Payment Methods */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-center text-sm text-gray-500 mb-4">Accepted Payment Methods</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {['UPI', 'Cards', 'Net Banking', 'Wallets'].map((method) => (
                <div key={method} className="bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{method}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center text-gray-500 text-sm">
            <Shield className="w-4 h-4 text-green-600 mr-2" />
            <span>Secured by Razorpay | 256-bit SSL Encryption</span>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 card p-6 bg-blue-50 border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
          <p className="text-blue-800 text-sm mb-3">
            If you face any issues with payment, please contact our support team.
          </p>
          <a
            href="mailto:support@runsandmiles.com"
            className="inline-flex items-center text-blue-700 hover:text-blue-900 text-sm font-medium"
          >
            support@runsandmiles.com
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>

        {/* How it works */}
        <div className="mt-6 card p-6">
          <h3 className="font-semibold text-dark mb-4">How Payment Works</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: 1, title: 'Click Pay', desc: 'Click the Pay button above' },
              { step: 2, title: 'Choose Method', desc: 'Select UPI, Card, or other methods' },
              { step: 3, title: 'Done!', desc: 'Complete payment & get confirmation' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-primary">{item.step}</span>
                </div>
                <h4 className="font-semibold text-dark text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
