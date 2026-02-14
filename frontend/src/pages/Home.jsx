import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Trophy, Users, MapPin, Calendar, Star, ArrowRight } from 'lucide-react';
import EventCard from '../components/EventCard';
import { API_URL } from '../config';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const stats = [
    { icon: Trophy, value: '50+', label: 'Events Organized' },
    { icon: Users, value: '100K+', label: 'Happy Runners' },
    { icon: MapPin, value: '25+', label: 'Cities Covered' },
    { icon: Calendar, value: '5+', label: 'Years Experience' },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      text: 'Amazing experience! The organization was flawless and the route was beautiful. Can\'t wait for the next one!',
      rating: 5
    },
    {
      name: 'Rahul Verma',
      location: 'Delhi',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      text: 'Best marathon event I\'ve participated in. Great hydration stations and medical support throughout.',
      rating: 5
    },
    {
      name: 'Anita Desai',
      location: 'Bangalore',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      text: 'The medal quality and the post-event arrangements were excellent. Highly recommend Runs and Miles!',
      rating: 5
    }
  ];

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
                Run Through<br />
                <span className="gradient-text">India's Heart</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Join thousands of passionate runners in India's most exciting marathon events. 
                From coastal roads to historical monuments, experience running like never before.
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

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-white/20">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-display text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                ))}
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
                      <p className="text-sm text-gray-600">Mumbai Marathon • Mar 15</p>
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
              Register for our upcoming marathon events across India. Early bird discounts available!
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
                Why Choose<br />
                <span className="gradient-text">Runs and Miles?</span>
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We're not just organizing races; we're creating experiences that inspire 
                and transform. Every event is meticulously planned to ensure runners of 
                all levels have an unforgettable experience.
              </p>

              <div className="space-y-6">
                {[
                  { title: 'Expert Organization', desc: 'Professional event management with 5+ years experience' },
                  { title: 'Scenic Routes', desc: 'Carefully selected routes through India\'s most beautiful locations' },
                  { title: 'Safety First', desc: 'Comprehensive medical support and safety measures throughout' },
                  { title: 'Community Spirit', desc: 'Join a thriving community of passionate runners' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-lg mr-4 mt-1">
                      <ChevronRight className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-dark">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800"
                alt="Marathon Event"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-gradient-to-r from-primary to-accent p-6 rounded-2xl text-white shadow-xl">
                <p className="font-display text-4xl font-bold">100K+</p>
                <p className="text-sm opacity-90">Runners Trust Us</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">
              What Runners <span className="gradient-text">Say</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Hear from runners who've experienced our events.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-dark">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
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
            Join thousands of runners and be part of India's biggest marathon events. 
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
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark">Address</p>
                    <p className="text-gray-600">123 Runner's Lane, Mumbai 400001</p>
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
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Message</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
                    placeholder="Your message..."
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
