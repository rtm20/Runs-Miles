import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  registrationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  eventId: {
    type: Number,
    required: true
  },
  eventTitle: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  gender: {
    type: String
  },
  distance: {
    type: String,
    required: true
  },
  emergencyContact: {
    type: String
  },
  medicalConditions: {
    type: String
  },
  fee: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  transactionId: {
    type: String
  },
  razorpayOrderId: {
    type: String
  },
  razorpayPaymentId: {
    type: String
  },
  paidAt: {
    type: Date
  }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
