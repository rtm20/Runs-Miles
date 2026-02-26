import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Calendar, AlertCircle, 
  ChevronRight, ArrowLeft, Heart, Shield
} from 'lucide-react';
import { API_URL } from '../config';

const Register = () => {
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState(searchParams.get('distance') || '');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    emergencyContact: '',
    medicalConditions: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/events/${eventId}`);
        const data = await response.json();
        setEvent(data);
        if (!selectedDistance && data.distance?.length > 0) {
          setSelectedDistance(data.distance[0]);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId, selectedDistance]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Enter valid 10-digit phone number';
    }
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (formData.age < 16 || formData.age > 80) {
      newErrors.age = 'Age must be between 16 and 80';
    }
    if (!formData.gender) newErrors.gender = 'Please select gender';
    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = 'Emergency contact is required';
    } else if (!/^\d{10}$/.test(formData.emergencyContact)) {
      newErrors.emergencyContact = 'Enter valid 10-digit phone number';
    }
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    if (!selectedDistance) newErrors.distance = 'Please select a category';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: eventId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          age: parseInt(formData.age),
          gender: formData.gender,
          distance: selectedDistance,
          emergencyContact: formData.emergencyContact,
          medicalConditions: formData.medicalConditions
        })
      });

      const data = await response.json();

      if (data.success) {
        navigate(`/payment/${data.registration.id}`);
      } else {
        setErrors({ submit: data.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">Event Not Found</h2>
        </div>
      </div>
    );
  }

  const fee = selectedDistance ? event.registrationFee[selectedDistance] : 0;

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Event
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-dark mb-2">
            Register for <span className="gradient-text">{event.title}</span>
          </h1>
          <p className="text-gray-600">Fill in your details to complete registration</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card p-8">
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700">{errors.submit}</span>
                </div>
              )}

              {/* Category Selection */}
              <div className="mb-8">
                <h3 className="font-semibold text-dark mb-4">Select Category</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {event.distance.map((distance) => (
                    <button
                      key={distance}
                      type="button"
                      onClick={() => {
                        setSelectedDistance(distance);
                        if (errors.distance) setErrors(prev => ({ ...prev, distance: '' }));
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedDistance === distance
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <p className="font-bold text-lg text-dark">{distance}</p>
                      <p className="text-xs text-gray-500 mb-1">{event.categoryNames?.[distance] || ''}</p>
                      <p className="text-sm text-primary font-medium">
                        ₹{event.registrationFee[distance].toLocaleString()}
                      </p>
                    </button>
                  ))}
                </div>
                {errors.distance && (
                  <p className="text-red-500 text-sm mt-2">{errors.distance}</p>
                )}
              </div>

              {/* Personal Details */}
              <h3 className="font-semibold text-dark mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                Personal Details
              </h3>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    } focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      } focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        errors.phone ? 'border-red-500' : 'border-gray-200'
                      } focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition`}
                      placeholder="10-digit phone number"
                      maxLength="10"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Age *</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        errors.age ? 'border-red-500' : 'border-gray-200'
                      } focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition`}
                      placeholder="Your age"
                      min="16"
                      max="80"
                    />
                  </div>
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.gender ? 'border-red-500' : 'border-gray-200'
                    } focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition bg-white`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Emergency Contact *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        errors.emergencyContact ? 'border-red-500' : 'border-gray-200'
                      } focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition`}
                      placeholder="Emergency contact number"
                      maxLength="10"
                    />
                  </div>
                  {errors.emergencyContact && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>}
                </div>
              </div>

              {/* Medical Information */}
              <h3 className="font-semibold text-dark mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-primary" />
                Health Information
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-dark mb-2">
                  Medical Conditions / Allergies (Optional)
                </label>
                <textarea
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
                  placeholder="Please mention any medical conditions, allergies, or medications you're taking..."
                />
              </div>

              {/* Terms */}
              <div className="mb-6">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-3 text-sm text-gray-600">
                    I agree to the <a href="#" className="text-primary hover:underline">Terms & Conditions</a> and 
                    <a href="#" className="text-primary hover:underline"> Privacy Policy</a>. 
                    I confirm that I am physically fit to participate in this event.
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeTerms}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Payment
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-28">
              <h3 className="font-semibold text-dark mb-4">Order Summary</h3>
              
              <div className="flex items-center mb-4">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-20 h-20 object-cover rounded-xl mr-4"
                />
                <div>
                  <p className="font-semibold text-dark">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.city}</p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-dark">{selectedDistance ? `${selectedDistance} ${event.categoryNames?.[selectedDistance] || ''}` : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration Fee</span>
                  <span className="font-semibold text-dark">₹{fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-dark">Total Amount</span>
                  <span className="font-bold text-2xl text-primary">₹{fee.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 bg-green-50 rounded-xl p-4 flex items-start">
                <Shield className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                  Your registration and payment details are secure and encrypted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
