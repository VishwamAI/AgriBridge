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
 * @returns {Object} 201 - User registered successfully with JWT token and 2FA setup info
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

    // Validate userType
    const validUserTypes = ['farmer', 'customer', 'community'];
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
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

    // Log user ID information
    console.log('User registered with ID:', result.insertedId);
    console.log('User ID type:', typeof result.insertedId);
    console.log('User ID toString:', result.insertedId.toString());

    // Generate QR code for 2FA setup
    const otpauthUrl = speakeasy.otpauthURL({
      secret: twoFactorSecret.ascii,
      label: email,
      issuer: 'Growers Gate'
    });
    const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.insertedId.toString(), email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertedId.toString(),
      token,
      userType,
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
 * @returns {Object} 200 - Login successful, returns JWT token and dashboard route
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
      let dashboardRoute;
      switch (user.userType) {
        case 'farmer':
          dashboardRoute = '/farmer-dashboard';
          break;
        case 'customer':
          dashboardRoute = '/user-dashboard';
          break;
        case 'admin':
          dashboardRoute = '/admin-dashboard';
          break;
        case 'community':
          dashboardRoute = '/community-dashboard';
          break;
        default:
          dashboardRoute = '/dashboard';
      }
      res.json({ token, message: 'Login successful', userType: user.userType, dashboardRoute });
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

module.exports = app;
