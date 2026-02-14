# Runs and Miles - Marathon Events Website

A modern marathon event management website for organizing and registering for marathon events across India.

## Features

- **Browse Events**: View all upcoming marathon events across India
- **Event Details**: Detailed information about each event including route, highlights, and categories
- **User Registration**: Complete registration form to capture participant details
- **UPI Payment**: QR code based UPI payment integration (GPay, PhonePe, Paytm, etc.)
- **Email Notifications**: Automatic confirmation emails with event details and BIB number
- **Modern UI**: Responsive design with React and Tailwind CSS

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- React Router DOM
- Lucide React (Icons)
- QRCode.react (UPI QR Code generation)
- Canvas Confetti (Celebration animation)

### Backend
- Node.js
- Express.js
- Nodemailer (Email service)
- UUID (Unique ID generation)

## Project Structure

```
Marathon-Payment/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── EventCard.jsx
│   │   ├── pages/      # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── EventDetails.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Payment.jsx
│   │   │   └── Success.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── ...
├── backend/            # Node.js backend
│   ├── server.js
│   ├── .env
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd Marathon-Payment
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

### Configuration

1. **Email Configuration (Backend)**
   
   Edit `backend/.env` file:
   ```env
   PORT=5000
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-password
   UPI_ID=your-upi-id@upi
   ```

   > **Note**: For Gmail, you need to:
   > 1. Enable 2-Factor Authentication
   > 2. Generate an App Password at: Google Account → Security → 2-Step Verification → App passwords

2. **UPI Configuration**
   
   Update the UPI ID in `backend/server.js` in the events data to your actual UPI ID.

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The server will run on http://localhost:5000

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The app will run on http://localhost:5173

## Usage

### For Users

1. Browse marathon events on the homepage or events page
2. Click on an event to view details
3. Select a category (5K, 10K, 21K, 42K) and click "Register Now"
4. Fill in your personal details
5. Complete payment via UPI (scan QR code or use UPI ID)
6. Enter the UPI Transaction ID to confirm payment
7. Receive confirmation email with BIB number

### For Administrators

- Events are defined in `backend/server.js`
- To add new events, add entries to the `events` array
- Registrations are stored in memory (for production, use a database)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get single event |
| POST | `/api/register` | Register for an event |
| POST | `/api/confirm-payment` | Confirm payment |
| GET | `/api/registration/:id` | Get registration details |

## Payment Flow

1. User submits registration form
2. System generates UPI QR code with payment details
3. User scans QR code and pays via any UPI app
4. User enters Transaction ID from their payment app
5. System confirms payment and sends confirmation email

## Customization

### Changing Colors

Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: '#FF6B35',    // Orange
  secondary: '#004E64',  // Dark Blue
  accent: '#25A18E',     // Teal
  dark: '#1A1A2E',      // Dark
  light: '#F7F7F7',      // Light Gray
}
```

### Adding Events

Add new events in `backend/server.js`:
```javascript
{
  id: 7,
  title: "Your Event Name",
  city: "City Name",
  state: "State Name",
  date: "2026-XX-XX",
  time: "06:00 AM",
  distance: ["5K", "10K", "21K"],
  registrationFee: {
    "5K": 500,
    "10K": 800,
    "21K": 1200
  },
  // ... other details
}
```

## Free Resources Used

- **Frontend Hosting**: Can be deployed to Vercel, Netlify (free tier)
- **Backend Hosting**: Can be deployed to Render, Railway (free tier)
- **Email Service**: Gmail SMTP (free for limited emails)
- **Payment**: UPI QR codes (no transaction fees for merchants)
- **Images**: Unsplash (free stock photos)
- **Icons**: Lucide React (free MIT licensed icons)

## Production Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to hosting service
3. Set environment variables

## License

This project is open source and available for personal and educational use.

## Support

For questions or support, contact: support@runsandmiles.com

---

Made with ❤️ for runners across India
