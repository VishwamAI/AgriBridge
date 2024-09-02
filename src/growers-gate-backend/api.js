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
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());

// Implement rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

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
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token has expired
    if (Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ message: 'Token has expired' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(403).json({ message: 'Invalid token' });
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
 * @returns {Object} 201 - User registered successfully with JWT token and 2FA setup info
 * @returns {Object} 400 - Bad request (e.g., missing fields, invalid input)
 * @returns {Object} 500 - Server error
 */
app.post('/register', [
  body('firstName').trim().notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s-]+$/).withMessage('First name can only contain letters, spaces, and hyphens'),
  body('lastName').trim().notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s-]+$/).withMessage('Last name can only contain letters, spaces, and hyphens'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
    .custom(value => {
      const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com']; // Added 'example.com' for testing
      const domain = value.split('@')[1];
      if (!allowedDomains.includes(domain)) {
        throw new Error('Email domain not allowed');
      }
      return true;
    }),
  body('password')
    .isLength({ min: 12, max: 128 }).withMessage('Password must be between 12 and 128 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/)
    .withMessage('Password must include at least one lowercase letter, one uppercase letter, one number, and one special character')
    .custom((value, { req }) => {
      if (value.toLowerCase().includes(req.body.firstName.toLowerCase()) ||
          value.toLowerCase().includes(req.body.lastName.toLowerCase())) {
        throw new Error('Password must not contain your name');
      }
      return true;
    }),
  body('userType').isIn(['farmer', 'customer', 'community']).withMessage('Invalid user type')
], async (req, res) => {
  console.log('Registration endpoint called');
  try {
    console.log('Registration attempt:', JSON.stringify(req.body, null, 2));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', JSON.stringify(errors.array(), null, 2));
      return res.status(400).json({ errors: errors.array() });
    }
    console.log('Input validation passed');

    const { firstName, lastName, email, password, userType } = req.body;
    console.log('Parsed registration data:', { firstName, lastName, email, userType });

    // Check if user already exists
    console.log('Checking if user already exists');
    console.log('Executing query:', JSON.stringify({ email }));
    const existingUser = await db.collection('users').findOne({ email });
    console.log('Query result:', existingUser ? 'User found' : 'User not found');

    if (existingUser) {
      console.log('User already exists:', email);
      console.log('Existing user details:', JSON.stringify(existingUser, null, 2));
      return res.status(400).json({ message: 'Email address is already in use' });
    }
    console.log('User does not exist, proceeding with registration');

    // Check for common passwords
    const commonPasswords = ['password', '123456', 'qwerty', 'letmein', 'admin', 'welcome'];
    if (commonPasswords.includes(password.toLowerCase())) {
      console.log('Common password detected:', password);
      return res.status(400).json({ message: 'Password is too common. Please choose a stronger password.' });
    }
    console.log('Password passed common password check');

    // Check password against leaked password database (example using haveibeenpwned API)
    console.log('Checking password against leaked password database');
    const sha1Password = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = sha1Password.slice(0, 5);
    const suffix = sha1Password.slice(5);
    try {
      console.log('Sending request to haveibeenpwned API');
      const pwnedResponse = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
      console.log('Received response from haveibeenpwned API');
      const leakedPasswords = pwnedResponse.data.split('\n');
      const leakedPassword = leakedPasswords.find(p => p.split(':')[0] === suffix);
      if (leakedPassword) {
        console.log('Leaked password detected');
        return res.status(400).json({ message: 'This password has been found in a data breach. Please choose a different password.' });
      }
      console.log('Password not found in leaked password database');
    } catch (pwnedError) {
      console.error('Error checking leaked password database:', pwnedError);
      console.log('Continuing with registration despite API check failure');
    }

    console.log('Hashing password');
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Password hashed successfully');

    console.log('Generating two-factor secret');
    const twoFactorSecret = speakeasy.generateSecret({ length: 32 });
    console.log('Two-factor secret generated:', twoFactorSecret.base32);

    const user = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
      twoFactorSecret: twoFactorSecret.base32,
      twoFactorEnabled: false,
      createdAt: new Date(),
      lastLogin: null,
      failedLoginAttempts: 0,
      accountLocked: false,
      lastPasswordChange: new Date()
    };

    console.log('Attempting to insert user into database:', JSON.stringify(user, null, 2));
    let result;
    const insertStartTime = Date.now();
    try {
      result = await db.collection('users').insertOne(user);
      const insertDuration = Date.now() - insertStartTime;
      console.log(`User insertion completed in ${insertDuration}ms. Result:`, JSON.stringify(result, null, 2));
      if (result.acknowledged && result.insertedId) {
        console.log('User inserted successfully. InsertedId:', result.insertedId.toString());
        console.log('Verifying user insertion...');
        const insertedUser = await db.collection('users').findOne({ _id: result.insertedId });
        if (insertedUser) {
          console.log('User verified in database:', JSON.stringify(insertedUser, null, 2));
        } else {
          console.warn('User not found in database immediately after insertion. This may indicate a replication lag.');
        }
      } else {
        console.warn('User insertion may have failed. Result:', JSON.stringify(result, null, 2));
      }
    } catch (dbError) {
      console.error('Database insertion error:', dbError);
      console.error('Error details:', JSON.stringify(dbError, null, 2));
      console.error('Stack trace:', dbError.stack);
      throw dbError;
    }

    // Generate QR code for 2FA setup
    console.log('Generating OTP Auth URL');
    const otpauthUrl = speakeasy.otpauthURL({
      secret: twoFactorSecret.ascii,
      label: encodeURIComponent(`Growers Gate:${email}`),
      issuer: 'Growers Gate',
      algorithm: 'sha512'
    });
    console.log('OTP Auth URL generated:', otpauthUrl);

    console.log('Generating QR Code URL');
    let qrCodeUrl;
    try {
      qrCodeUrl = await qrcode.toDataURL(otpauthUrl);
      console.log('QR Code URL generated. Length:', qrCodeUrl.length);
    } catch (qrError) {
      console.error('QR Code generation error:', qrError);
      console.error('Error details:', JSON.stringify(qrError, null, 2));
      throw qrError;
    }

    // Generate JWT token
    console.log('Starting JWT token generation');
    const startTime = Date.now();
    let token;
    try {
      token = jwt.sign(
        {
          userId: result.insertedId.toString(),
          email: user.email,
          userType: user.userType
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '15m',
          algorithm: 'HS256'
        }
      );
      const endTime = Date.now();
      console.log(`JWT token generated successfully. Length: ${token.length}. Time taken: ${endTime - startTime}ms`);
      console.log('JWT payload:', JSON.stringify({ userId: result.insertedId.toString(), email: user.email, userType: user.userType }, null, 2));
    } catch (jwtError) {
      console.error('JWT generation error:', jwtError);
      console.error('Error details:', JSON.stringify(jwtError, null, 2));
      console.error('Stack trace:', jwtError.stack);
      throw jwtError;
    }

    const registrationResponse = {
      message: 'User registered successfully',
      userId: result.insertedId.toString(),
      token,
      userType,
      twoFactorSetup: {
        qrCodeUrl,
        secret: twoFactorSecret.base32
      }
    };
    console.log('Registration successful. Response details:', {
      userId: registrationResponse.userId,
      userType: registrationResponse.userType,
      tokenLength: registrationResponse.token.length,
      qrCodeUrlLength: registrationResponse.twoFactorSetup.qrCodeUrl.length,
      secretLength: registrationResponse.twoFactorSetup.secret.length
    });

    // Log the registration event
    try {
      console.log('Creating audit log entry');
      await db.collection('audit_logs').insertOne({
        event: 'user_registration',
        userId: result.insertedId,
        timestamp: new Date(),
        details: { email, userType },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
      console.log('Audit log entry created for user registration');
    } catch (auditLogError) {
      console.error('Error creating audit log entry:', auditLogError);
      console.error('Error details:', JSON.stringify(auditLogError, null, 2));
      // Don't throw here, as we still want to return the successful registration response
    }

    console.log('Sending successful registration response');
    res.status(201).json(registrationResponse);
  } catch (error) {
    console.error('Error registering user:', error);
    console.error('Error stack:', error.stack);
    if (error.name === 'MongoError' && error.code === 11000) {
      console.log('Duplicate key error (email already in use)');
      return res.status(400).json({ message: 'Email address is already in use' });
    }
    // Log the error
    try {
      console.log('Creating error log entry');
      await db.collection('error_logs').insertOne({
        error: error.message,
        stack: error.stack,
        timestamp: new Date(),
        endpoint: '/register',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
      console.log('Error log entry created');
    } catch (logError) {
      console.error('Error creating error log entry:', logError);
      console.error('Error details:', JSON.stringify(logError, null, 2));
    }
    console.log('Sending 500 error response');
    res.status(500).json({ message: 'An unexpected error occurred during registration. Please try again later.' });
  }
});

/**
 * User Login API
 * @route POST /login
 * @param {string} email.body.required - User's email
 * @param {string} password.body.required - User's password
 * @param {string} twoFactorToken.body - User's 2FA token (if 2FA is enabled)
 * @returns {Object} 200 - Login successful, returns JWT token and dashboard route
 * @returns {Object} 202 - Login successful, 2FA required
 * @returns {Object} 401 - Invalid credentials
 * @returns {Object} 429 - Too many login attempts
 * @returns {Object} 500 - Server error
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.'
});

app.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password, twoFactorToken } = req.body;
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      await logLoginAttempt(email, false, 'User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.accountLocked) {
      return res.status(401).json({ message: 'Account is locked. Please contact support.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await handleFailedLogin(user);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.twoFactorEnabled) {
      if (twoFactorToken) {
        const verified = speakeasy.totp.verify({
          secret: user.twoFactorSecret,
          encoding: 'base32',
          token: twoFactorToken,
          window: 1 // Allow 30 seconds of time drift
        });
        if (!verified) {
          await logLoginAttempt(email, false, 'Invalid 2FA token');
          return res.status(401).json({ message: 'Invalid 2FA token' });
        }
      } else {
        return res.status(202).json({ message: '2FA required', twoFactorRequired: true });
      }
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '15m', algorithm: 'HS256' }
    );

    const dashboardRoute = getDashboardRoute(user.userType);

    await resetLoginAttempts(user);
    await logLoginAttempt(email, true, 'Login successful');

    res.json({ token, message: 'Login successful', userType: user.userType, dashboardRoute });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'An error occurred during login. Please try again later.' });
  }
});

async function handleFailedLogin(user) {
  user.failedLoginAttempts += 1;
  if (user.failedLoginAttempts >= 5) {
    user.accountLocked = true;
  }
  await db.collection('users').updateOne(
    { _id: user._id },
    { $set: { failedLoginAttempts: user.failedLoginAttempts, accountLocked: user.accountLocked } }
  );
  await logLoginAttempt(user.email, false, 'Invalid password');
}

async function resetLoginAttempts(user) {
  await db.collection('users').updateOne(
    { _id: user._id },
    { $set: { failedLoginAttempts: 0, lastLogin: new Date() } }
  );
}

async function logLoginAttempt(email, success, reason) {
  await db.collection('login_logs').insertOne({
    email,
    success,
    reason,
    timestamp: new Date(),
    ipAddress: req.ip
  });
}

function getDashboardRoute(userType) {
  const routes = {
    farmer: '/farmer-dashboard',
    customer: '/user-dashboard',
    admin: '/admin-dashboard',
    community: '/community-dashboard'
  };
  return routes[userType] || '/dashboard';
}

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
    console.log('Verifying 2FA for userId:', userId, 'Type:', typeof userId);
    const { token } = req.body;

    let userObjectId;
    try {
      userObjectId = new ObjectId(userId);
    } catch (error) {
      console.error('Error converting userId to ObjectId:', error);
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    console.log('Converted userObjectId:', userObjectId);
    const user = await db.collection('users').findOne({ _id: userObjectId });

    if (!user) {
      console.log('User not found for userId:', userObjectId);
      console.log('Database query:', { _id: userObjectId });
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user._id);

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 1 // Allow 30 seconds of time drift
    });

    if (verified) {
      // Generate a new JWT token with 2FA verification flag
      const newToken = jwt.sign(
        { userId: user._id.toString(), email: user.email, userType: user.userType, twoFAVerified: true },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      console.log('2FA verified successfully for userId:', userObjectId);
      res.json({ message: '2FA verified successfully', token: newToken });
    } else {
      console.log('Invalid 2FA token for userId:', userObjectId);
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
    console.log('Password reset attempt initiated');
    const { token, newPassword } = req.body;
    console.log('Attempting to verify token');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified successfully');
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError.message);
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    console.log('Looking up user with ID:', decoded.userId);
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      console.error('User not found for ID:', decoded.userId);
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    console.log('User found:', user._id);

    console.log('Hashing new password');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('Updating user password in database');
    await db.collection('users').updateOne({ _id: user._id }, { $set: { password: hashedPassword } });
    console.log('Password updated successfully for user:', user._id);
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
 * Generate OTP for Rider Authentication
 * @route POST /generate-rider-otp
 * @security JWT
 * @param {string} orderId.body.required - Order ID for which OTP is generated
 * @returns {Object} 200 - OTP generated successfully
 * @returns {Object} 400 - Bad request
 * @returns {Object} 401 - Unauthorized
 */
app.post('/generate-rider-otp', authenticateJWT, async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const otp = speakeasy.totp({
      secret: process.env.OTP_SECRET,
      encoding: 'base32'
    });

    // Store OTP in the database associated with the order
    await db.collection('orders').updateOne(
      { _id: orderId },
      { $set: { riderOtp: otp, otpCreatedAt: new Date() } }
    );

    res.json({ message: 'OTP generated successfully', otp });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ message: 'Error generating OTP' });
  }
});

/**
 * Create Product API
 * @route POST /products
 * @security JWT
 * @param {string} name.body.required - Product name
 * @param {string} description.body.required - Product description
 * @param {number} price.body.required - Product price
 * @param {number} quantity.body.required - Product quantity
 * @param {string} category.body.required - Product category
 * @param {string} imageUrl.body - Product image URL
 * @returns {Object} 201 - Product created successfully
 * @returns {Object} 400 - Bad request
 * @returns {Object} 401 - Unauthorized
 * @returns {Object} 500 - Server error
 */
app.post('/products', authenticateJWT, async (req, res) => {
  console.log('POST /products - Create Product API called');
  console.log('Request body:', req.body);
  console.log('User ID:', req.user.userId);

  try {
    const { name, description, price, quantity, category, imageUrl } = req.body;
    const { userId } = req.user;

    // Input validation
    if (!name || !description || !price || !quantity || !category) {
      console.log('Bad request: Missing required fields');
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = {
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category,
      imageUrl,
      farmerId: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Inserting product into database:', product);
    const result = await db.collection('products').insertOne(product);
    console.log('Product created successfully. Product ID:', result.insertedId);
    res.status(201).json({ message: 'Product created successfully', productId: result.insertedId });
  } catch (error) {
    console.error('Error creating product:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error creating product' });
  }
});

/**
 * Get Products API
 * @route GET /products
 * @security JWT
 * @returns {Object} 200 - List of products
 * @returns {Object} 500 - Server error
 */
app.get('/products', authenticateJWT, async (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /products - Request received`);
  try {
    const products = await db.collection('products').find().toArray();
    console.log(`[${new Date().toISOString()}] GET /products - Retrieved ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] GET /products - Error fetching products:`, error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

/**
 * Update Product API
 * @route PUT /products/:id
 * @security JWT
 * @param {string} id.path.required - Product ID
 * @param {Object} product.body.required - Updated product data
 * @returns {Object} 200 - Product updated successfully
 * @returns {Object} 400 - Bad request
 * @returns {Object} 404 - Product not found
 * @returns {Object} 500 - Server error
 */
app.put('/products/:id', authenticateJWT, async (req, res) => {
  console.log(`[${new Date().toISOString()}] PUT /products/:id - Update Product request received`);
  console.log('Request params:', req.params);
  console.log('Request body:', req.body);
  console.log('User ID:', req.user.userId);

  try {
    const { id } = req.params;
    const { name, description, price, quantity, category, imageUrl } = req.body;
    const { userId } = req.user;

    if (!name || !description || !price || !quantity || !category) {
      console.log(`[${new Date().toISOString()}] PUT /products/:id - Bad request: Missing required fields`);
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
    if (!product) {
      console.log(`[${new Date().toISOString()}] PUT /products/:id - Product not found: ${id}`);
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.farmerId !== userId) {
      console.log(`[${new Date().toISOString()}] PUT /products/:id - Unauthorized update attempt for product: ${id}`);
      return res.status(403).json({ message: 'Unauthorized to update this product' });
    }

    const updatedProduct = {
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category,
      imageUrl,
      updatedAt: new Date()
    };

    console.log(`[${new Date().toISOString()}] PUT /products/:id - Updating product: ${id}`);
    console.log('Updated product data:', updatedProduct);

    await db.collection('products').updateOne({ _id: new ObjectId(id) }, { $set: updatedProduct });
    console.log(`[${new Date().toISOString()}] PUT /products/:id - Product updated successfully: ${id}`);
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] PUT /products/:id - Error updating product:`, error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

/**
 * Delete Product API
 * @route DELETE /products/:id
 * @security JWT
 * @param {string} id.path.required - Product ID
 * @returns {Object} 200 - Product deleted successfully
 * @returns {Object} 404 - Product not found
 * @returns {Object} 500 - Server error
 */
app.delete('/products/:id', authenticateJWT, async (req, res) => {
  console.log(`DELETE /products/${req.params.id} request received`);
  try {
    const { id } = req.params;
    const { userId } = req.user;

    console.log(`Attempting to delete product with ID: ${id} by user: ${userId}`);

    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
    if (!product) {
      console.log(`Product with ID: ${id} not found`);
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.farmerId !== userId) {
      console.log(`Unauthorized deletion attempt for product ${id} by user ${userId}`);
      return res.status(403).json({ message: 'Unauthorized to delete this product' });
    }

    const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
    console.log(`Product ${id} deleted successfully. Deleted count: ${result.deletedCount}`);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error deleting product' });
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

// Farmer Analytics API endpoints
app.get('/api/farmer/analytics/sales', authenticateJWT, (req, res) => {
  const dummySalesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [1000, 1500, 1200, 1800, 2000, 2200]
  };
  res.json(dummySalesData);
});

app.get('/api/farmer/analytics/products', authenticateJWT, (req, res) => {
  const dummyProductData = {
    labels: ['Tomatoes', 'Carrots', 'Lettuce', 'Cucumbers', 'Peppers'],
    data: [500, 300, 400, 200, 350]
  };
  res.json(dummyProductData);
});

app.get('/api/farmer/analytics/customers', authenticateJWT, (req, res) => {
  const dummyCustomerData = {
    labels: ['New', 'Returning', 'Frequent'],
    data: [30, 50, 20]
  };
  res.json(dummyCustomerData);
});

app.get('/rider/payments', authenticateJWT, (req, res) => {
  const dummyPaymentData = [
    { date: new Date('2023-05-01'), amount: 150.00, status: 'Completed' },
    { date: new Date('2023-05-15'), amount: 200.50, status: 'Pending' },
    { date: new Date('2023-05-30'), amount: 175.25, status: 'Completed' }
  ];
  res.json(dummyPaymentData);
});

app.get('/knowledge-base', authenticateJWT, (req, res) => {
  const dummyKnowledgeBaseArticles = [
    { id: '1', title: 'How to Use the Rider App', content: 'Step-by-step guide on using the Rider application...' },
    { id: '2', title: 'Best Practices for Deliveries', content: 'Tips and tricks for efficient and safe deliveries...' },
    { id: '3', title: 'Understanding Your Payments', content: 'Detailed explanation of the payment structure and cycles...' }
  ];
  res.json(dummyKnowledgeBaseArticles);
});

module.exports = app;

/**
 * Get Orders API
 * @route GET /orders
 * @security JWT
 * @returns {Object} 200 - List of orders
 * @returns {Object} 401 - Unauthorized
 * @returns {Object} 500 - Server error
 */
app.get('/orders', authenticateJWT, async (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /orders - Request received`);
  try {
    const { userId, userType } = req.user;
    let query = {};

    // Filter orders based on user type
    if (userType === 'farmer') {
      query.farmerId = userId;
    } else if (userType === 'customer') {
      query.customerId = userId;
    } else if (userType === 'rider') {
      query.riderId = userId;
    }

    const orders = await db.collection('orders').find(query).toArray();
    console.log(`[${new Date().toISOString()}] GET /orders - Retrieved ${orders.length} orders`);
    res.json(orders);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] GET /orders - Error fetching orders:`, error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = app;

/**
 * Refresh Token API
 * @route POST /refresh-token
 * @security JWT
 * @returns {Object} 200 - New JWT token
 * @returns {Object} 401 - Unauthorized
 * @returns {Object} 500 - Server error
 */
app.post('/refresh-token', authenticateJWT, async (req, res) => {
  try {
    const { userId, email, userType } = req.user;

    // Generate a new token
    const newToken = jwt.sign(
      { userId, email, userType },
      process.env.JWT_SECRET,
      { expiresIn: '15m', algorithm: 'HS256' }
    );

    res.json({ token: newToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ message: 'Error refreshing token' });
  }
});
