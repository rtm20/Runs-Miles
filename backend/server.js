import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret'
});

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// In-memory storage (in production, use a database)
let registrations = [];

// Marathon events data
const events = [
  {
    id: 1,
    title: "Mumbai Marathon 2026",
    city: "Mumbai",
    state: "Maharashtra",
    date: "2026-03-15",
    time: "06:00 AM",
    distance: ["5K", "10K", "21K", "42K"],
    registrationFee: {
      "5K": 20,
      "10K": 50,
      "21K": 70,
      "42K": 70
    },
    description: "Join India's biggest marathon event! Experience the spirit of Mumbai as you run through the iconic Marine Drive, Bandra-Worli Sea Link, and the Gateway of India route.",
    image: "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800",
    venue: "Azad Maidan, Mumbai",
    totalSlots: 5000,
    registeredCount: 2340,
    highlights: ["Medal & Certificate", "Refreshments", "Medical Support", "Timing Chip"],
    route: "Marine Drive → Haji Ali → Bandra-Worli Sea Link → Worli Sea Face → Marine Drive",
    upiId: "9131086067@axl"
  },
  {
    id: 2,
    title: "Delhi Half Marathon",
    city: "Delhi",
    state: "Delhi",
    date: "2026-04-20",
    time: "05:30 AM",
    distance: ["5K", "10K", "21K"],
    registrationFee: {
      "5K": 20,
      "10K": 50,
      "21K": 70
    },
    description: "Run through the heart of India's capital! The Delhi Half Marathon takes you past historical monuments including India Gate, Rashtrapati Bhavan, and Connaught Place.",
    image: "https://images.unsplash.com/photo-1587843017574-7e3d20df4c14?w=800",
    venue: "Jawaharlal Nehru Stadium, Delhi",
    totalSlots: 8000,
    registeredCount: 4520,
    highlights: ["Finisher Medal", "Event T-Shirt", "Breakfast", "Live Entertainment"],
    route: "JLN Stadium → India Gate → Rajpath → Connaught Place → JLN Stadium",
    upiId: "9131086067@axl"
  },
  {
    id: 3,
    title: "Bangalore 10K Challenge",
    city: "Bangalore",
    state: "Karnataka",
    date: "2026-05-10",
    time: "06:00 AM",
    distance: ["5K", "10K"],
    registrationFee: {
      "5K": 20,
      "10K": 50
    },
    description: "Experience the Garden City like never before! Run through Cubbon Park, MG Road, and the beautiful tree-lined avenues of Bangalore in this exciting morning run.",
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800",
    venue: "Cubbon Park, Bangalore",
    totalSlots: 6000,
    registeredCount: 3200,
    highlights: ["Finisher Medal", "Hydration Stations", "Photo Points", "Post-run Yoga"],
    route: "Cubbon Park → MG Road → Brigade Road → Cubbon Park",
    upiId: "9131086067@axl"
  },
  {
    id: 4,
    title: "Chennai Marathon",
    city: "Chennai",
    state: "Tamil Nadu",
    date: "2026-06-08",
    time: "05:00 AM",
    distance: ["5K", "10K", "21K", "42K"],
    registrationFee: {
      "5K": 20,
      "10K": 50,
      "21K": 70,
      "42K": 70
    },
    description: "Run along the beautiful Marina Beach coastline! The Chennai Marathon offers a unique coastal running experience with sea breeze and sunrise views.",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
    venue: "Marina Beach, Chennai",
    totalSlots: 4500,
    registeredCount: 1890,
    highlights: ["Coastal Route", "Sunrise Run", "Local Cuisine", "Cultural Performances"],
    route: "Marina Beach → San Thome → Adyar → Besant Nagar → Marina Beach",
    upiId: "9131086067@axl"
  },
  {
    id: 5,
    title: "Hyderabad Night Run",
    city: "Hyderabad",
    state: "Telangana",
    date: "2026-07-25",
    time: "08:00 PM",
    distance: ["5K", "10K"],
    registrationFee: {
      "5K": 20,
      "10K": 50
    },
    description: "Experience the City of Pearls under the stars! A unique night running event through the illuminated streets of Hyderabad, passing by Charminar and Hussain Sagar.",
    image: "https://images.unsplash.com/photo-1461896836934- voices-of-the-silenced?w=800",
    venue: "Necklace Road, Hyderabad",
    totalSlots: 3500,
    registeredCount: 1200,
    highlights: ["Night Run Experience", "Glow Accessories", "DJ Night", "Food Festival"],
    route: "Necklace Road → Tank Bund → Charminar Area → Necklace Road",
    upiId: "9131086067@axl"
  },
  {
    id: 6,
    title: "Pune Marathon",
    city: "Pune",
    state: "Maharashtra",
    date: "2026-08-15",
    time: "06:00 AM",
    distance: ["5K", "10K", "21K"],
    registrationFee: {
      "5K": 20,
      "10K": 50,
      "21K": 70
    },
    description: "Celebrate Independence Day with a run through the Oxford of the East! Run past historical sites and educational institutions in this cultural marathon.",
    image: "https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800",
    venue: "Shivaji Park, Pune",
    totalSlots: 5500,
    registeredCount: 2800,
    highlights: ["Independence Day Theme", "Heritage Route", "Cultural Program", "Breakfast"],
    route: "Shivaji Park → FC Road → JM Road → Shivaji Park",
    upiId: "9131086067@axl"
  }
];

// Get all events
app.get('/api/events', (req, res) => {
  res.json(events);
});

// Get single event
app.get('/api/events/:id', (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json(event);
});

// Register for an event
app.post('/api/register', async (req, res) => {
  try {
    const { eventId, name, email, phone, age, gender, distance, emergencyContact, medicalConditions } = req.body;
    
    const event = events.find(e => e.id === parseInt(eventId));
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const registrationId = uuidv4();
    const fee = event.registrationFee[distance];
    
    const registration = {
      id: registrationId,
      eventId: parseInt(eventId),
      eventTitle: event.title,
      name,
      email,
      phone,
      age,
      gender,
      distance,
      emergencyContact,
      medicalConditions,
      fee,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    registrations.push(registration);

    res.json({
      success: true,
      registration: {
        id: registrationId,
        fee,
        upiId: event.upiId,
        eventTitle: event.title,
        distance
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Create Razorpay Order
app.post('/api/create-order', async (req, res) => {
  try {
    const { registrationId } = req.body;
    
    const registration = registrations.find(r => r.id === registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    const options = {
      amount: registration.fee * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: registrationId,
      notes: {
        registrationId: registrationId,
        eventTitle: registration.eventTitle,
        participantName: registration.name,
        distance: registration.distance
      }
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      },
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// Verify Razorpay Payment
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationId } = req.body;
    
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Find and update registration
    const registration = registrations.find(r => r.id === registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    const event = events.find(e => e.id === registration.eventId);
    
    // Update payment status
    registration.paymentStatus = 'completed';
    registration.razorpayOrderId = razorpay_order_id;
    registration.razorpayPaymentId = razorpay_payment_id;
    registration.paidAt = new Date().toISOString();

    // Send confirmation email
    await sendConfirmationEmail(registration, event);

    res.json({
      success: true,
      message: 'Payment verified successfully!',
      registration: {
        id: registration.id,
        eventTitle: registration.eventTitle,
        name: registration.name,
        distance: registration.distance,
        fee: registration.fee
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
});

// Confirm payment (legacy - keeping for backward compatibility)
app.post('/api/confirm-payment', async (req, res) => {
  try {
    const { registrationId, transactionId } = req.body;
    
    const registration = registrations.find(r => r.id === registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    const event = events.find(e => e.id === registration.eventId);
    
    // Update payment status
    registration.paymentStatus = 'completed';
    registration.transactionId = transactionId;
    registration.paidAt = new Date().toISOString();

    // Send confirmation email
    await sendConfirmationEmail(registration, event);

    res.json({
      success: true,
      message: 'Payment confirmed and email sent!',
      registration: {
        id: registration.id,
        eventTitle: registration.eventTitle,
        name: registration.name,
        distance: registration.distance,
        fee: registration.fee
      }
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Payment confirmation failed', error: error.message });
  }
});

// Get registration details
app.get('/api/registration/:id', (req, res) => {
  const registration = registrations.find(r => r.id === req.params.id);
  if (!registration) {
    return res.status(404).json({ message: 'Registration not found' });
  }
  
  const event = events.find(e => e.id === registration.eventId);
  res.json({ registration, event });
});

// Email sending function
async function sendConfirmationEmail(registration, event) {
  // Configure your email transporter
  // For production, use actual SMTP credentials
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });

  const mailOptions = {
    from: '"Runs and Miles" <noreply@runsandmiles.com>',
    to: registration.email,
    subject: `Registration Confirmed - ${event.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #f7f7f7; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #FF6B35, #25A18E); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .header p { color: rgba(255,255,255,0.9); margin-top: 8px; }
          .content { padding: 30px; }
          .success-badge { background: #25A18E; color: white; display: inline-block; padding: 8px 20px; border-radius: 20px; font-weight: bold; margin-bottom: 20px; }
          .details { background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .label { color: #666; }
          .value { font-weight: 600; color: #1A1A2E; }
          .event-info { background: linear-gradient(135deg, #004E64, #25A18E); color: white; padding: 20px; border-radius: 12px; margin: 20px 0; }
          .footer { background: #1A1A2E; color: white; padding: 20px; text-align: center; }
          .bib-number { font-size: 48px; font-weight: bold; color: #FF6B35; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏃 Runs and Miles</h1>
            <p>Your Running Journey Begins Here</p>
          </div>
          <div class="content">
            <div class="success-badge">✓ Registration Confirmed</div>
            <h2>Congratulations, ${registration.name}!</h2>
            <p>Your registration for <strong>${event.title}</strong> has been confirmed. Get ready to run!</p>
            
            <div class="bib-number">BIB #${registration.id.slice(0, 6).toUpperCase()}</div>
            
            <div class="details">
              <h3>Registration Details</h3>
              <div class="detail-row">
                <span class="label">Event</span>
                <span class="value">${event.title}</span>
              </div>
              <div class="detail-row">
                <span class="label">Category</span>
                <span class="value">${registration.distance}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date</span>
                <span class="value">${new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="detail-row">
                <span class="label">Time</span>
                <span class="value">${event.time}</span>
              </div>
              <div class="detail-row">
                <span class="label">Venue</span>
                <span class="value">${event.venue}</span>
              </div>
              <div class="detail-row">
                <span class="label">Registration Fee</span>
                <span class="value">₹${registration.fee}</span>
              </div>
              <div class="detail-row">
                <span class="label">Transaction ID</span>
                <span class="value">${registration.transactionId}</span>
              </div>
            </div>
            
            <div class="event-info">
              <h3>📍 Route Information</h3>
              <p>${event.route}</p>
            </div>
            
            <h3>What's Included:</h3>
            <ul>
              ${event.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
            
            <p style="margin-top: 20px;"><strong>Important:</strong> Please arrive at least 1 hour before the event start time for check-in and warm-up.</p>
          </div>
          <div class="footer">
            <p>Keep this email as your registration confirmation.</p>
            <p style="margin-top: 10px; font-size: 12px;">© 2026 Runs and Miles. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to:', registration.email);
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't throw error - registration is still valid even if email fails
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
