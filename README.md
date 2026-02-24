# 🩸 KidneyConnect Sri Lanka

A comprehensive MERN stack web application that connects kidney transplant patients with compatible donors. This platform streamlines the donor matching process using intelligent blood type compatibility algorithms and location-based search, with multilingual support for English, Sinhala, and Tamil.

## ✨ Features

### User Authentication & Management
- **User Registration**: Separate sign-up flows for patients and donors
- **Secure Login**: JWT-based authentication with HTTP-only cookies
- **Password Security**: bcrypt hashing with 12 salt rounds
- **Account Types**: Patient or Donor registration with role-based features

### Donor Matching
- **Blood Type Compatibility**: Intelligent matching based on blood type compatibility rules
- **Location-Based Search**: Filter donors by Sri Lankan provinces
- **Age Range Filtering**: Search donors within specific age ranges (18-30, 31-40, 41-50, 51-60)
- **Match Scoring**: Percentage-based compatibility scoring system

### Multilingual Support
- **3 Languages**: English, Sinhala (සිංහල), Tamil (தமிழ்)
- **Full UI Localization**: 500+ translation keys across all pages
- **Language Switcher**: Easy language toggle in header

### Professional UI/UX
- **Responsive Design**: Mobile-friendly layout with hamburger menu
- **Error Handling**: Context-specific error messages with helpful hints
- **Success Notifications**: Auto-dismissing success messages
- **Loading States**: Spinner animations during API calls
- **Modern Styling**: Clean, professional interface with smooth transitions

### Pages & Navigation
- **Home**: Welcome page with app overview
- **About**: Information about kidney disease and transplants
- **Find Donor**: Advanced donor search and matching interface
- **Register**: User registration (Patient/Donor)
- **Login**: Secure user authentication
- **FAQ**: Frequently asked questions
- **Contact**: Contact form with office details and business hours

## 🏗️ Project Structure

```
kedney/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── pages/           # Page components (Login, Register, FindDonor, etc.)
│   │   ├── components/      # Reusable components (Layout, etc.)
│   │   ├── App.jsx          # Main app component with routing
│   │   ├── constants.js     # i18n translations & config
│   │   └── style.css        # Global styling
│   ├── package.json
│   └── .env                 # Frontend environment variables
│
├── backend/                  # Express + Node.js backend
│   ├── src/
│   │   ├── controllers/     # Business logic (auth, users, donors)
│   │   ├── models/          # Mongoose schemas (User model)
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth middleware
│   │   ├── config/          # Database configuration
│   │   ├── utils/           # Helper functions (blood compatibility)
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── package.json
│   └── .env                 # Backend environment variables
│
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ and npm
- MongoDB Atlas account (with connection URI)

### Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with the following:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://[username]:[password]@[cluster].mongodb.net/kedney?ssl=true&authSource=admin&replicaSet=[replica-set]&retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:5173
   ```

4. Start backend server:
   ```bash
   npm run dev    # Development with nodemon
   ```
   Backend runs on: `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. Start frontend dev server:
   ```bash
   npm start
   ```
   Frontend runs on: `http://localhost:5173`

### Running Both Together

1. **Terminal 1** - Start Backend:
   ```bash
   cd backend && npm run dev
   ```

2. **Terminal 2** - Start Frontend:
   ```bash
   cd frontend && npm start
   ```

3. Open browser: `http://localhost:5173/`

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new patient/donor account
- `POST /login` - Login with email/NIC and password
- `POST /logout` - Clear authentication cookie

### Users (`/api/users`)
- `GET /profile` - Get current logged-in user profile

### Donors (`/api/donors`)
- `POST /search` - Search compatible donors with filters

## 🔐 Security Features

- **Password Hashing**: bcryptjs with 12 salt rounds
- **JWT Tokens**: HTTP-only cookies (7-day expiration)
- **CORS Protection**: Configured for frontend URL
- **Input Validation**: Server-side validation on all endpoints
- **Error Messages**: Generic errors in production, specific in development

## 🗄️ Database Schema

### User Model
```javascript
{
  user_type: String (enum: ['patient', 'donor']),
  full_name: String,
  nic: String (unique),
  email: String (unique, lowercase),
  phone: String,
  date_of_birth: Date,
  gender: String (enum: ['Male', 'Female', 'Other']),
  password_hash: String,
  blood_type: String (enum: blood types),
  location: String (province),
  is_active: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing the Application

### Registration Flow
1. Go to `/register`
2. Select user type (Patient or Donor)
3. Fill in all required fields
4. For donors: Must be 18-60 years old
5. Click "Create Account"

### Login Flow
1. Go to `/login`
2. Enter email or NIC
3. Enter password
4. Click "Login"

### Search Donors (Patient)
1. Login as a patient
2. Go to "Find Donor" page
3. Select blood type
4. Optionally select location and age range
5. Click "Search Donors"

## 🌐 Multilingual Content

All UI text is translated into:
- **English** (en)
- **Sinhala** (si)
- **Tamil** (ta)

Change language using the language selector (EN / සිං / தமிழ்) in the header.

## 📦 Dependencies

### Frontend
- React 18.3.1
- React Router 6.28.0
- Vite 5.4.21
- FontAwesome icons

### Backend
- Express 4.21.2
- Mongoose 8.9.3
- bcryptjs 2.4.3
- jsonwebtoken 9.0.2
- Morgan (logging)
- Cookie-parser

## 🐛 Error Handling

The application provides context-specific error messages:

- **Registration Errors**: Email/NIC already registered, age validation, missing fields
- **Login Errors**: User not found, incorrect password, account inactive
- **Network Errors**: Connection failures with helpful troubleshooting tips
- **Server Errors**: Generic messages with retry suggestions

## 📝 Environment Variables Reference

### Backend `.env`
| Variable | Example | Description |
|----------|---------|-------------|
| PORT | 5000 | Server port |
| NODE_ENV | development | Environment |
| MONGO_URI | mongodb://... | MongoDB connection string |
| JWT_SECRET | secret_key_here | JWT signing secret |
| JWT_EXPIRES_IN | 7d | Token expiration time |
| FRONTEND_URL | http://localhost:5173 | Frontend URL for CORS |

### Frontend `.env`
| Variable | Example | Description |
|----------|---------|-------------|
| VITE_API_BASE_URL | http://localhost:5000 | Backend API URL |

## 🤝 Contributing

Guidelines for contributors:
1. Maintain code style and comments
2. Test new features thoroughly
3. Update translations for new content
4. Follow component structure patterns

## ⚠️ Security Notes

- **Never commit `.env` files** to version control
- **Rotate MongoDB credentials** after initial setup
- **Use strong JWT secrets** in production
- **Enable HTTPS** in production environment
- **Update dependencies** regularly for security patches

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Built with ❤️ for kidney transplant patients and donors in Sri Lanka.

## 📞 Support

For issues, feature requests, or questions:
- Check the FAQ page in the application
- Review the Contact page for support details
- Submit issues through GitHub

---

**Last Updated**: February 24, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
