import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Registration from './models/Registration.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_SKSI5NYKoZ4ztt',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'M5g0OjzKFiGvk2CEO5hvaEaF'
});

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Registrations stored in MongoDB via Registration model

// Marathon events data
const events = [
  {
    id: 1,
    title: "Runs & Miles Half Marathon First Edition, Pune",
    city: "Pune",
    state: "Maharashtra",
    date: "2026-05-10",
    time: "4:30 AM IST Onwards",
    distance: ["3K", "5K", "10K", "21.1K"],
    categoryNames: {
      "3K": "Fun Run",
      "5K": "Challenge Run",
      "10K": "Timed Run",
      "21.1K": "Half Marathon Timed Run"
    },
    registrationFee: {
      "3K": 499,
      "5K": 799,
      "10K": 1200,
      "21.1K": 1599
    },
    categoryPerks: {
      "3K": ["T-shirt", "Bib", "Medal", "Refreshment", "Hydration"],
      "5K": ["T-shirt", "Medal", "Bib", "Refreshment", "E-Certificate", "Hydration"],
      "10K": ["T-shirt", "Medal", "Timed Bib", "Refreshment", "Hydration", "E-Certificate", "Timing Chip"],
      "21.1K": ["T-shirt", "Medal", "Timed Bib", "Refreshment", "Hydration", "E-Certificate", "Timing Chip"]
    },
    description: "The inaugural edition of the Runs & Miles Half Marathon — a community-driven race experience designed to promote fitness, health awareness, and the joy of running. Join us at Wadia College of Engineering, Pune for a professionally managed race with T-shirts, medals, hydration support, and medical assistance. Report 20 minutes prior to the start.",
    image: "https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800",
    venue: "Wadia College of Engineering, Pune",
    totalSlots: 5500,
    registeredCount: 0,
    highlights: ["T-shirt", "Finisher Medal", "Bib", "Hydration Support", "Medical Support", "Refreshments"],
    route: "Route will be announced shortly",
    upiId: "7447288206@axl"
  }
];

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Runs and Miles <onboarding@resend.dev>',
      to: 'runsandmiles1@gmail.com',
      replyTo: email,
      subject: `Contact Form: ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

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
    
    const registration = new Registration({
      registrationId,
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
      paymentStatus: 'pending'
    });

    await registration.save();

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
    
    const registration = await Registration.findOne({ registrationId });
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
    const registration = await Registration.findOne({ registrationId });
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    const event = events.find(e => e.id === registration.eventId);
    
    // Update payment status
    registration.paymentStatus = 'completed';
    registration.razorpayOrderId = razorpay_order_id;
    registration.razorpayPaymentId = razorpay_payment_id;
    registration.paidAt = new Date();
    await registration.save();

    // Send confirmation email (don't block payment verification if email fails)
    try {
      await sendConfirmationEmail(registration, event);
    } catch (emailErr) {
      console.error('Email sending failed (non-blocking):', emailErr.message);
    }

    res.json({
      success: true,
      message: 'Payment verified successfully!',
      registration: {
        id: registration.registrationId,
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
    
    const registration = await Registration.findOne({ registrationId });
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    const event = events.find(e => e.id === registration.eventId);
    
    // Update payment status
    registration.paymentStatus = 'completed';
    registration.transactionId = transactionId;
    registration.paidAt = new Date();
    await registration.save();

    // Send confirmation email
    await sendConfirmationEmail(registration, event);

    res.json({
      success: true,
      message: 'Payment confirmed and email sent!',
      registration: {
        id: registration.registrationId,
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
app.get('/api/registration/:id', async (req, res) => {
  const registration = await Registration.findOne({ registrationId: req.params.id });
  if (!registration) {
    return res.status(404).json({ message: 'Registration not found' });
  }
  
  const event = events.find(e => e.id === registration.eventId);
  res.json({ registration, event });
});

// Email sending function
async function sendConfirmationEmail(registration, event) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const mailOptions = {
    from: 'Runs and Miles <onboarding@resend.dev>',
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
            
            <div class="bib-number">BIB #${registration.registrationId.slice(0, 6).toUpperCase()}</div>
            
            <div class="details">
              <h3>Registration Details</h3>
              <div class="detail-row">
                <span class="label">Event</span>
                <span class="value">${event.title}</span>
              </div>
              <div class="detail-row">
                <span class="label">Category</span>
                <span class="value">${registration.distance} ${event.categoryNames?.[registration.distance] || ''}</span>
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
              <h3>📍 Venue & Reporting</h3>
              <p><strong>Venue:</strong> ${event.venue}</p>
              <p><strong>Reporting Time:</strong> 20 minutes prior to race start</p>
              <p><strong>Race Start:</strong> ${event.time}</p>
            </div>
            
            <h3>What's Included in Your Category:</h3>
            <ul>
              ${(event.categoryPerks?.[registration.distance] || event.highlights).map(h => `<li>${h}</li>`).join('')}
            </ul>
            
            <p style="margin-top: 20px;"><strong>Important:</strong> Please report at least 20 minutes before the race start time for check-in and warm-up.</p>
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
    await resend.emails.send(mailOptions);
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
