import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { calculateAge } from '../utils/bloodCompatibility.js';

const sanitizeUser = (user) => ({
  _id: user._id,
  user_type: user.user_type,
  full_name: user.full_name,
  email: user.email,
  nic: user.nic,
  phone: user.phone,
  date_of_birth: user.date_of_birth,
  gender: user.gender,
  blood_type: user.blood_type,
  location: user.location
});

const setAuthCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

// Registers a new patient or donor account.
export const register = async (req, res) => {
  try {
    const {
      userType,
      fullName,
      nic,
      email,
      phone,
      dateOfBirth,
      gender,
      password,
      bloodType,
      location
    } = req.body;

    if (!userType || !fullName || !nic || !email || !phone || !dateOfBirth || !gender || !password || !bloodType || !location) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields to continue.',
        errorType: 'MISSING_FIELDS'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { nic }]
    }).lean();

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'email' : 'NIC';
      return res.status(409).json({ 
        success: false, 
        message: `This ${field} is already registered. Please use a different ${field} or try logging in.`,
        errorType: 'DUPLICATE_USER',
        field: field
      });
    }

    if (userType === 'donor') {
      const donorAge = calculateAge(dateOfBirth);
      if (donorAge < 18 || donorAge > 60) {
        return res.status(400).json({ 
          success: false, 
          message: `You must be between 18-60 years old to register as a donor. You are ${donorAge} years old.`,
          errorType: 'INVALID_DONOR_AGE',
          age: donorAge
        });
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const createdUser = await User.create({
      user_type: userType,
      full_name: fullName,
      nic,
      email: email.toLowerCase(),
      phone,
      date_of_birth: new Date(dateOfBirth),
      gender,
      password_hash: passwordHash,
      blood_type: bloodType,
      location
    });

    setAuthCookie(res, createdUser._id.toString());

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { user: sanitizeUser(createdUser) }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again or contact support if the problem persists.',
      errorType: 'SERVER_ERROR',
      error: error.message 
    });
  }
};

// Logs in existing user by email or NIC.
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Email/NIC and password are required' });
    }

    const normalized = identifier.toLowerCase();
    const user = await User.findOne({
      $or: [{ email: normalized }, { nic: identifier }]
    });

    // User not found - provide helpful error that distinguishes between wrong email/NIC
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email or NIC not found. Please check your email/NIC or register a new account.',
        errorType: 'USER_NOT_FOUND'
      });
    }

    // User account inactive
    if (!user.is_active) {
      return res.status(401).json({ 
        success: false, 
        message: 'Your account has been deactivated. Please contact support.',
        errorType: 'ACCOUNT_INACTIVE'
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    // Wrong password - provide helpful error
    if (!passwordMatches) {
      return res.status(401).json({ 
        success: false, 
        message: 'Password is incorrect. Please try again or use "Forgot Password".',
        errorType: 'WRONG_PASSWORD'
      });
    }

    setAuthCookie(res, user._id.toString());

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user: sanitizeUser(user) }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

// Clears auth cookie and ends session.
export const logout = (_req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};
