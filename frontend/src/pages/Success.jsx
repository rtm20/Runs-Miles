import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle, Calendar, MapPin, Clock, 
  Download, Share2, Mail, AlertCircle, Home
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { API_URL } from '../config';

const Success = () => {
  const { registrationId } = useParams();
  const [registration, setRegistration] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const response = await fetch(`${API_URL}/registration/${registrationId}`);
        const data = await response.json();
        
        if (data.registration) {
          setRegistration(data.registration);
          setEvent(data.event);
          
          // Trigger confetti
          setTimeout(() => {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#FF6B35', '#25A18E', '#004E64']
            });
          }, 500);
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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Coming Soon';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Coming Soon';
    return d.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: `I'm running the ${event?.title}!`,
      text: `I just registered for ${event?.title} - ${registration?.distance} category. Join me!`,
      url: window.location.origin + '/events/' + event?.id
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(
        `${shareData.text} Register here: ${shareData.url}`
      );
      alert('Share text copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">{error || 'Registration not found'}</h2>
          <Link to="/" className="text-primary hover:underline">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const bibNumber = registrationId.slice(0, 6).toUpperCase();

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-dark mb-2">
            Registration <span className="gradient-text">Successful!</span>
          </h1>
          <p className="text-gray-600">
            You're all set for {event?.title}. See you at the starting line!
          </p>
        </div>

        {/* BIB Number Card */}
        <div className="card p-8 mb-8 text-center bg-gradient-to-br from-dark via-secondary to-dark text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="relative z-10">
            <p className="text-white/80 text-sm mb-2">Your BIB Number</p>
            <p className="font-display text-6xl md:text-7xl font-bold tracking-wider mb-4">
              #{bibNumber}
            </p>
            <p className="text-white/60 text-sm">
              Show this at the event check-in counter
            </p>
          </div>
        </div>

        {/* Registration Details */}
        <div className="card p-8 mb-8">
          <h2 className="font-display text-xl font-bold text-dark mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-primary" />
            Event Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-xl mr-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold text-dark">{event && formatDate(event.date)}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-xl mr-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Time</p>
                <p className="font-semibold text-dark">{event?.time}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-xl mr-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Venue</p>
                <p className="font-semibold text-dark">{event?.venue}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-primary/10 p-3 rounded-xl mr-4">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-semibold text-dark">{registration?.distance}</p>
              </div>
            </div>
          </div>

          <div className="border-t mt-6 pt-6">
            <h3 className="font-semibold text-dark mb-3">Participant Information</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Name:</span>
                <span className="ml-2 text-dark font-medium">{registration?.name}</span>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>
                <span className="ml-2 text-dark font-medium">{registration?.email}</span>
              </div>
              <div>
                <span className="text-gray-500">Phone:</span>
                <span className="ml-2 text-dark font-medium">{registration?.phone}</span>
              </div>
              <div>
                <span className="text-gray-500">Registration Fee:</span>
                <span className="ml-2 text-dark font-medium">₹{registration?.fee?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="border-t mt-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-mono text-dark">{registration?.transactionId}</p>
              </div>
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                Payment Confirmed
              </div>
            </div>
          </div>
        </div>

        {/* Email Confirmation */}
        <div className="card p-6 mb-8 bg-blue-50 border border-blue-100">
          <div className="flex items-start">
            <Mail className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Confirmation Email Sent!</h3>
              <p className="text-blue-800 text-sm">
                We've sent a confirmation email to <strong>{registration?.email}</strong> with 
                all the event details and your BIB number. Please check your inbox (and spam folder).
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleShare}
            className="flex items-center justify-center btn-outline"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share with Friends
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center btn-secondary"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Receipt
          </button>
        </div>

        {/* What's Next */}
        <div className="card p-8">
          <h2 className="font-display text-xl font-bold text-dark mb-6">What's Next?</h2>
          
          <div className="space-y-4">
            {[
              { title: 'Check your email', desc: 'Keep the confirmation email safe. You\'ll need the BIB number on event day.' },
              { title: 'Prepare for the event', desc: 'Start your training! Follow our social media for tips and updates.' },
              { title: 'Arrive early', desc: 'Reach the venue at least 1 hour before start time for check-in and warm-up.' },
              { title: 'Bring valid ID', desc: 'Carry a government-issued photo ID for verification at check-in.' }
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="font-bold text-primary">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-dark">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center text-primary font-semibold hover:text-orange-600 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
