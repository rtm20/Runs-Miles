import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

const EventCard = ({ event }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Coming Soon';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const slotsLeft = event.totalSlots - event.registeredCount;
  const slotsPercentage = (event.registeredCount / event.totalSlots) * 100;

  return (
    <div className="card overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Distance badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {event.distance.map((d) => (
            <span
              key={d}
              className="bg-white/90 backdrop-blur-sm text-dark text-xs font-semibold px-3 py-1 rounded-full"
            >
              {d} {event.categoryNames?.[d] || ''}
            </span>
          ))}
        </div>

        {/* City badge */}
        <div className="absolute bottom-4 left-4 flex items-center text-white">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="font-medium">{event.city}, {event.state}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display font-bold text-xl text-dark mb-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        <div className="flex items-center text-gray-600 mb-4">
          <Calendar className="w-4 h-4 mr-2 text-primary" />
          <span className="text-sm">{event.date ? `${formatDate(event.date)} • ${event.time}` : '🗓️ Coming Soon'}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Slots Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {event.registeredCount.toLocaleString()} registered
            </span>
            <span className="text-primary font-semibold">{slotsLeft.toLocaleString()} slots left</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: `${slotsPercentage}%` }}
            />
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <span className="text-sm text-gray-500">Starting from</span>
            <p className="font-bold text-xl text-dark">
              ₹{Math.min(...Object.values(event.registrationFee)).toLocaleString()}
            </p>
          </div>
          <Link
            to={`/events/${event.id}`}
            className="flex items-center text-primary font-semibold hover:gap-3 gap-2 transition-all"
          >
            View Details
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
