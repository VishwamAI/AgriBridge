/**
 * Growers Gate Backend API
 * This module sets up the Express server, connects to MongoDB,
 * and defines the API endpoints for user authentication and dashboard access.
 */

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection setup
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

/**
 * Connects to the MongoDB database
 */
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db('growers_gate');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

connectToDatabase();

/**
 * Middleware for JWT authentication
 * Verifies the JWT token in the Authorization header
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

/**
 * User Registration API
 * @route POST /register
 * @param {string} firstName.body.required - User's first name
 * @param {string} lastName.body.required - User's last name
 * @param {string} email.body.required - User's email
 * @param {string} password.body.required - User's password
 * @param {string} userType.body.required - User type (farmer, customer, or community)
 * @returns {Object} 201 - User registered successfully with 2FA setup info
 * @returns {Object} 400 - Bad request (e.g., missing fields)
 * @returns {Object} 500 - Server error
 */
app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, userType } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const twoFactorSecret = speakeasy.generateSecret();
    const user = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
      twoFactorSecret: twoFactorSecret.base32,
      twoFactorEnabled: false
    };

    const result = await db.collection('users').insertOne(user);

    // Generate QR code for 2FA setup
    const otpauthUrl = speakeasy.otpauthURL({
      secret: twoFactorSecret.ascii,
      label: email,
      issuer: 'Growers Gate'
    });
    const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);

    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertedId,
      twoFactorSetup: {
        qrCodeUrl,
        secret: twoFactorSecret.base32
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

/**
 * User Login API
 * @route POST /login
 * @param {string} email.body.required - User's email
 * @param {string} password.body.required - User's password
 * @param {string} twoFactorToken.body - User's 2FA token (if 2FA is enabled)
 * @returns {Object} 200 - Login successful, returns JWT token
 * @returns {Object} 202 - Login successful, 2FA required
 * @returns {Object} 401 - Invalid credentials
 * @returns {Object} 500 - Server error
 */
app.post('/login', async (req, res) => {
  try {
    const { email, password, twoFactorToken } = req.body;
    const user = await db.collection('users').findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      if (user.twoFactorEnabled) {
        if (twoFactorToken) {
          const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: twoFactorToken
          });
          if (!verified) {
            return res.status(401).json({ message: 'Invalid 2FA token' });
          }
        } else {
          return res.status(202).json({ message: '2FA required', twoFactorRequired: true });
        }
      }
      const token = jwt.sign({ userId: user._id, email: user.email, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

/**
 * Two-Factor Authentication Verification API
 * @route POST /verify-2fa
 * @param {string} token.body.required - 2FA token
 * @returns {Object} 200 - 2FA verified successfully, returns new JWT token
 * @returns {Object} 401 - Invalid 2FA token
 * @returns {Object} 500 - Server error
 */
app.post('/verify-2fa', authenticateJWT, async (req, res) => {
  try {
    const { userId } = req.user;
    const { token } = req.body;
    const user = await db.collection('users').findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 1 // Allow 30 seconds of time drift
    });

    if (verified) {
      // Generate a new JWT token with 2FA verification flag
      const newToken = jwt.sign(
        { userId: user._id, email: user.email, userType: user.userType, twoFAVerified: true },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ message: '2FA verified successfully', token: newToken });
    } else {
      res.status(401).json({ message: 'Invalid 2FA token' });
    }
  } catch (error) {
    console.error('Error verifying 2FA:', error);
    res.status(500).json({ message: 'Error verifying 2FA' });
  }
});

/**
 * User Logout API
 * @route POST /logout
 * @security JWT
 * @returns {Object} 200 - Logout successful
 * @returns {Object} 401 - Unauthorized
 */
app.post('/logout', authenticateJWT, (req, res) => {
  // In a real-world scenario, you might want to invalidate the token on the server-side
  // For this simple implementation, we'll just send a success response
  res.json({ message: 'Logout successful' });
});

/**
 * Initiate Password Reset API
 * @route POST /forgot-password
 * @param {string} email.body.required - User's email
 * @returns {Object} 200 - Password reset email sent
 * @returns {Object} 404 - User not found
 * @returns {Object} 500 - Server error
 */
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // In a real-world scenario, send an email with the reset link
    // For this implementation, we'll just return the token
    res.json({ message: 'Password reset email sent', resetToken });
  } catch (error) {
    console.error('Error initiating password reset:', error);
    res.status(500).json({ message: 'Error initiating password reset' });
  }
});

/**
 * Complete Password Reset API
 * @route POST /reset-password
 * @param {string} token.body.required - Password reset token
 * @param {string} newPassword.body.required - New password
 * @returns {Object} 200 - Password reset successful
 * @returns {Object} 400 - Invalid or expired token
 * @returns {Object} 500 - Server error
 */
app.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.collection('users').findOne({ _id: decoded.userId });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.collection('users').updateOne({ _id: user._id }, { $set: { password: hashedPassword } });
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

/**
 * Dashboard API - Protected Route
 * @route GET /dashboard
 * @security JWT
 * @returns {Object} 200 - Dashboard data based on user type
 * @returns {Object} 403 - Access denied for invalid user type
 */
app.get('/dashboard', authenticateJWT, (req, res) => {
  const { userType } = req.user;
  switch(userType) {
    case 'farmer':
      res.json({ message: 'Farmer dashboard' });
      break;
    case 'customer':
      res.json({ message: 'Customer dashboard' });
      break;
    case 'community':
      res.json({ message: 'Community dashboard' });
      break;
    default:
      res.status(403).json({ message: 'Access denied' });
  }
});

/**
 * Error handling middleware
 * Catches any unhandled errors and sends a generic error response
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/**
 * Graceful shutdown handler
 * Closes the MongoDB connection when the server is terminated
 */
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

module.exports = app;
