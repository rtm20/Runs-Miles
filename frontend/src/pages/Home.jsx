import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, Trophy, Users, MapPin, Calendar, ArrowRight,
  Heart, Dumbbell, Coffee, Target, Handshake, Sun, Network, Mail, Phone, CheckCircle, Loader2
} from 'lucide-react';
import EventCard from '../components/EventCard';
import { API_URL } from '../config';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState(''); // '', 'sending', 'sent', 'error'
  const [contactError, setContactError] = useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactStatus('sending');
    setContactError('');
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      const data = await res.json();
      if (data.success) {
        setContactStatus('sent');
        setContactForm({ name: '', email: '', message: '' });
        setTimeout(() => setContactStatus(''), 5000);
      } else {
        throw new Error(data.message || 'Failed to send');
      }
    } catch (err) {
      setContactStatus('error');
      setContactError(err.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/events`);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);


  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-dark via-secondary to-dark overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="animate-pulse w-2 h-2 bg-green-400 rounded-full mr-2" />
                <span className="text-sm">Registrations Open for 2026 Events</span>
              </div>
              
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
                Run where<br />
                <span className="gradient-text">stories live.</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-4 leading-relaxed">
                Trade your treadmill views for sunrises over coastlines, finish lines near historic landmarks, and the thrill of thousands chasing the same goal as you.
              </p>
              <p className="text-lg text-primary font-semibold mb-8">
                Your next starting line is waiting…are you in?
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/events" className="btn-primary flex items-center">
                  Explore Events
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
                <a href="#about" className="btn-outline border-white text-white hover:bg-white hover:text-dark">
                  Learn More
                </a>
              </div>


            </div>

            <div className="relative hidden lg:block">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800"
                  alt="Marathon Runner"
                  className="rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <Trophy className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-dark">Next Event</p>
                      <p className="text-sm text-gray-600">Half Marathon • 10 May 2026</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">
              Upcoming <span className="gradient-text">Events</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out the upcoming events of the club and weekend runs. Stay updated with what's happening next!
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/events" className="btn-primary inline-flex items-center">
              View All Events
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-title mb-6">
                About<br />
                <span className="gradient-text">Runs and Miles</span>
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Welcome to Pune's newest running community where miles meet movement.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We're more than just a running club. From structured marathon training programs and race preparation to weekend group runs, recovery sessions, mobility workshops, and community fitness activities, we bring runners together both on and off the track.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Whether you're gearing up for your first 5K or preparing for your next full marathon, Runs and Miles is your space to train smarter, stay consistent, and enjoy the journey with like-minded runners across the city.
              </p>
              <p className="text-primary font-bold text-lg mb-4">
                Run. Recover. Connect. Repeat.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Join us as we train for finish lines and build a stronger running culture in Pune.
              </p>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800"
                alt="Running Community"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-gradient-to-r from-primary to-accent p-6 rounded-2xl text-white shadow-xl">
                <p className="font-display text-2xl font-bold">1st Edition</p>
                <p className="text-sm opacity-90">10 May 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">
              What We <span className="gradient-text">Offer</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              More than just running — we build experiences that keep you moving.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Handshake, title: 'Social Running Circles', desc: 'Meet like-minded runners through curated group runs, pace-based pods, and post-run hangouts designed to help you build real connections — not just mileage.' },
              { icon: Sun, title: 'Happening Weekends', desc: 'From themed fun runs and coffee meetups to sunset jogs, trail adventures, and fitness socials — our weekends are built to keep your routine exciting and consistent.' },
              { icon: Dumbbell, title: 'Smart Fitness Experiences', desc: 'Join mobility workshops, recovery sessions, strength clinics, and guided marathon prep programs designed to improve performance beyond just running.' },
              { icon: Users, title: 'Community Connections', desc: 'Network with fitness enthusiasts, professionals, and local runners who share your goals — making every run an opportunity to grow your circle.' },
              { icon: Heart, title: 'Active Lifestyle Events', desc: 'Be part of bootcamps, yoga-for-runners, breathing sessions, and wellness activities that complement your training journey.' },
              { icon: Target, title: 'Goal-Focused Training Pods', desc: "Train with runners who share your race goals — whether it's your first 5K or a full marathon — through structured and supportive training groups." },
              { icon: Coffee, title: 'Run & Connect Meetups', desc: 'Cool down after your runs with community brunches, coffee catch-ups, and fitness discussions that make staying active a social experience.' },
              { icon: Network, title: 'Runner Networking', desc: "Connect with Pune's growing fitness community through collaborative events, partner activities, and club socials." }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="bg-primary/10 p-3 rounded-xl w-fit mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-display font-semibold text-dark text-lg mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Running Journey?
          </h2>
          <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
            Be part of the inaugural Runs & Miles Half Marathon on 10 May 2026 at Wadia College of Engineering, Pune.
            Your next milestone awaits!
          </p>
          <Link
            to="/events"
            className="inline-flex items-center bg-white text-primary font-semibold py-4 px-10 rounded-full hover:bg-dark hover:text-white transition-all duration-300 shadow-lg"
          >
            Browse Events
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="section-title mb-6">
                Get in <span className="gradient-text">Touch</span>
              </h2>
              <p className="text-gray-600 mb-8">
                Have questions about our events? We're here to help. Reach out to us 
                and we'll get back to you as soon as possible.
              </p>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-xl mr-4">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark">Email</p>
                    <p className="text-gray-600">runsandmiles1@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-xl mr-4">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark">Phone</p>
                    <p className="text-gray-600">+91 74472 88206</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-xl mr-4">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark">Location</p>
                    <p className="text-gray-600">Pune, Maharashtra, India</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-xl mr-4">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark">Working Hours</p>
                    <p className="text-gray-600">Mon - Sat: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-light rounded-2xl p-8">
              {contactStatus === 'sent' ? (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="font-display text-xl font-bold text-dark mb-2">Message Sent!</h3>
                  <p className="text-gray-600 text-center">Thanks for reaching out. We'll get back to you soon.</p>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleContactSubmit}>
                  {contactStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                      {contactError || 'Failed to send message. Please try again.'}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">Name</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">Email</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">Message</label>
                    <textarea
                      rows="4"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
                      placeholder="Your message..."
                      required
                    />
                  </div>
                  <button type="submit" disabled={contactStatus === 'sending'} className="btn-primary w-full flex items-center justify-center disabled:opacity-50">
                    {contactStatus === 'sending' ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
