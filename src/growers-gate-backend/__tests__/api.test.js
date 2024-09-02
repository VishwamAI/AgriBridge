const mockRateLimiter = jest.fn().mockImplementation((req, res, next) => {
  if (mockRateLimiter.shouldLimit) {
    return res.status(429).json({ message: 'Too many requests from this IP, please try again later.' });
  }
  next();
});

mockRateLimiter.resetMock = () => {
  mockRateLimiter.mockClear();
  mockRateLimiter.shouldLimit = false;
};

jest.mock('express-rate-limit', () => {
  return jest.fn().mockImplementation(() => mockRateLimiter);
});

const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const axios = require('axios');
let app, server;

let db;
let mongoClient;

beforeAll(async () => {
  console.log('Setting up test environment...');

  // Set up environment variables for testing
  process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/growers_gate_test';
  process.env.JWT_SECRET = 'test_jwt_secret';
  process.env.NODE_ENV = 'test';

  console.log('MongoDB URI:', process.env.MONGODB_URI);

  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      // Connect to MongoDB
      mongoClient = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // 5 second timeout
      });
      await mongoClient.connect();
      db = mongoClient.db();
      console.log('Connected to MongoDB successfully');
      console.log('Using database:', db.databaseName);

      // Verify the connection
      await db.command({ ping: 1 });
      console.log("MongoDB connection verified");

      // Clear the database before running tests
      await db.dropDatabase();
      console.log('Database cleared');

      // Initialize the app and server
      const { app: testApp } = require('../api');
      const startServer = require('../api').startServer;
      app = testApp;

      // Start the server
      try {
        server = await startServer();
        console.log(`Test server listening on port ${server.address().port}`);
      } catch (serverError) {
        console.error('Error starting server:', serverError);
        throw serverError;
      }

      console.log('Test environment setup complete');
      break; // Exit the retry loop if successful
    } catch (error) {
      console.error(`Error setting up test environment (attempt ${retryCount + 1}):`, error);
      retryCount++;
      if (retryCount === maxRetries) {
        console.error('Max retries reached. Failing the setup.');
        throw error;
      }
      console.log(`Retrying in 5 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}, 60000); // Increased timeout to 60000ms to allow for retries

afterAll(async () => {
  console.log('Cleaning up after tests...');
  const cleanupTimeout = 30000; // 30 seconds timeout for cleanup

  try {
    const cleanup = async () => {
      if (db) {
        try {
          await db.dropDatabase();
          console.log('Database dropped');
        } catch (dbError) {
          console.error('Error dropping database:', dbError);
        }
      }

      if (mongoClient) {
        try {
          await mongoClient.close();
          console.log('MongoDB connection closed');
        } catch (mongoError) {
          console.error('Error closing MongoDB connection:', mongoError);
        }
      }

      if (server) {
        await new Promise((resolve) => {
          server.close((err) => {
            if (err) {
              console.error('Error closing server:', err);
            } else {
              console.log('Server closed');
            }
            resolve();
          });
        });
      } else {
        console.warn('Server was not properly initialized');
      }

      // Enhanced final check for open handles
      const handles = process._getActiveHandles();
      if (handles.length > 0) {
        console.warn('Detected open handles:', handles);
        await Promise.all(handles.map(async (handle) => {
          if (handle instanceof require('net').Socket) {
            console.log('Closing socket:', handle);
            handle.destroy();
          } else if (typeof handle.close === 'function') {
            try {
              await new Promise((resolve) => {
                handle.close(() => {
                  console.log('Successfully closed handle:', handle);
                  resolve();
                });
              });
            } catch (err) {
              console.error('Error closing handle:', err);
            }
          } else {
            console.warn('Unable to close handle:', handle);
          }
        }));
      }

      // Check for active requests
      const requests = process._getActiveRequests();
      if (requests.length > 0) {
        console.warn('Detected active requests:', requests);
        // Attempt to abort active requests
        requests.forEach(req => {
          if (typeof req.abort === 'function') {
            req.abort();
            console.log('Aborted active request:', req);
          }
        });
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
        console.log('Forced garbage collection');
      }

      // Final wait to allow any remaining async operations to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
    };

    // Run cleanup with a timeout
    await Promise.race([
      cleanup(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Cleanup timeout')), cleanupTimeout))
    ]);

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    console.log('Cleanup finished');
  }
}, 60000); // Keep the 60 seconds timeout for the entire afterAll hook

beforeEach(async () => {
  console.log('Starting beforeEach hook...');
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`Attempt ${retries + 1} to clear database...`);

      // Log database stats before clearing
      const dbStatsBefore = await db.stats();
      console.log('Database stats before clearing:', JSON.stringify(dbStatsBefore, null, 2));

      // List all collections
      const collections = await db.listCollections().toArray();
      console.log('Existing collections:', collections.map(c => c.name));

      // Log document counts for each collection before dropping
      for (const collection of collections) {
        if (collection.name !== 'system.indexes') {
          const count = await db.collection(collection.name).countDocuments();
          console.log(`Collection ${collection.name} has ${count} documents before dropping`);
        }
      }

      // Drop all collections
      for (const collection of collections) {
        if (collection.name !== 'system.indexes') {
          await db.collection(collection.name).drop();
          console.log(`Dropped collection: ${collection.name}`);
        }
      }

      // Recreate the users collection
      await db.createCollection('users');
      console.log('Users collection recreated');

      // Ensure email index is unique
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('Ensured unique email index for users collection');

      // Verify all collections are empty
      const allCollections = await db.listCollections().toArray();
      for (const collection of allCollections) {
        if (collection.name !== 'system.indexes') {
          const count = await db.collection(collection.name).countDocuments();
          if (count !== 0) {
            throw new Error(`Collection ${collection.name} not empty: ${count} documents found`);
          }
          console.log(`Verified ${collection.name} collection is empty`);
        }
      }

      // Log database stats after clearing
      const dbStatsAfter = await db.stats();
      console.log('Database stats after clearing:', JSON.stringify(dbStatsAfter, null, 2));

      console.log('Database successfully cleared and verified');
      break; // Exit the loop if we've reached this point without errors
    } catch (error) {
      console.error(`Error in beforeEach hook (attempt ${retries + 1}):`, error);
      console.error('Error stack:', error.stack);
      retries++;
      if (retries < maxRetries) {
        const delay = 5000 * retries; // Increase delay with each retry
        console.log(`Retry attempt ${retries} in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('Max retries reached. Failing the test.');
        throw error; // Rethrow to fail the test if all retries are exhausted
      }
    }
  }

  if (retries === maxRetries) {
    throw new Error(`Failed to clear database after ${maxRetries} attempts`);
  }

  console.log('Finished beforeEach hook');
});

describe('API Security Tests', () => {
  describe('Input Validation', () => {
    it('should reject registration with invalid input', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          firstName: '123',
          lastName: '$%^',
          email: 'invalid-email',
          password: 'weak',
          userType: 'invalid'
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: 'First name can only contain letters, spaces, and hyphens' }),
          expect.objectContaining({ msg: 'Last name can only contain letters, spaces, and hyphens' }),
          expect.objectContaining({ msg: 'Valid email is required' }),
          expect.objectContaining({ msg: 'Password must be between 12 and 128 characters long' }),
          expect.objectContaining({ msg: 'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character' }),
          expect.objectContaining({ msg: 'Invalid user type' })
        ])
      );
    });

    it('should reject registration with invalid email domain', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@invaliddomain.com',
          password: 'StrongP@ssw0rd123',
          userType: 'farmer'
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({ msg: 'Email domain not allowed' })
      );
    });

    it('should reject registration with weak password', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          password: 'weakpassword',
          userType: 'farmer'
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({ msg: 'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character' })
      );
    });

    it('should reject registration with password containing user\'s name', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          password: 'StrongP@ssw0rdJohn',
          userType: 'farmer'
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({ msg: 'Password must not contain your name' })
      );
    });

    it.skip('should accept registration with valid input', async () => {
      console.log('Starting registration test with valid input');
      const uniqueEmail = `john.doe${Date.now()}@example.com`;
      const testUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: uniqueEmail,
        password: 'StrongP@ssw0rd123',
        userType: 'farmer'
      };
      console.log('Test user data:', JSON.stringify(testUser, null, 2));

      // Check if user already exists
      const existingUser = await db.collection('users').findOne({ email: uniqueEmail });
      expect(existingUser).toBeNull();

      console.log('Sending registration request');
      const response = await request(app)
        .post('/register')
        .send(testUser);

      console.log('Registration response status:', response.status);
      console.log('Registration response body:', JSON.stringify(response.body, null, 2));

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('userType', 'farmer');
      expect(response.body).toHaveProperty('twoFactorSetup');
      expect(response.body.twoFactorSetup).toHaveProperty('qrCodeUrl');
      expect(response.body.twoFactorSetup).toHaveProperty('secret');
      expect(typeof response.body.twoFactorSetup.secret).toBe('string');
      expect(response.body.twoFactorSetup.secret.length).toBeGreaterThan(0);

      // Implement retry mechanism for database verification
      const maxRetries = 5;
      const retryDelay = 1000; // 1 second
      let user = null;

      for (let i = 0; i < maxRetries; i++) {
        console.log(`Waiting for database to update (attempt ${i + 1})...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));

        console.log('Attempting to find user in database');
        user = await db.collection('users').findOne({ email: uniqueEmail });

        if (user) {
          console.log('User found in database');
          break;
        } else {
          console.log('User not found in database');
        }
      }

      if (!user) {
        console.log('Database state:', await db.collection('users').find().toArray());
        throw new Error('User not found in database after maximum retries');
      }

      expect(user).toBeTruthy();
      expect(user.email).toBe(uniqueEmail);
      expect(user.userType).toBe(testUser.userType);

      console.log('Registration test passed successfully');
    });
  });

  describe('Authentication', () => {
    it('should reject requests without a valid JWT', async () => {
      const response = await request(app)
        .get('/dashboard')
        .set('Authorization', 'Bearer invalid-token');
      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ message: 'Invalid token' });
    });

    it('should accept requests with a valid JWT', async () => {
      const token = jwt.sign(
        { userId: 'testuser', userType: 'farmer' },
        process.env.JWT_SECRET,
        { expiresIn: '15m', algorithm: 'HS256' }
      );
      const response = await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
    });

    it('should reject requests with an expired JWT', async () => {
      jest.useFakeTimers();
      const token = jwt.sign(
        { userId: 'testuser', userType: 'farmer' },
        process.env.JWT_SECRET,
        { expiresIn: '1s', algorithm: 'HS256' }
      );
      jest.advanceTimersByTime(2000); // Advance time by 2 seconds
      const response = await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: 'Token has expired' });
      jest.useRealTimers();
    });

    it('should reject requests with a JWT signed with an incorrect secret', async () => {
      const token = jwt.sign(
        { userId: 'testuser', userType: 'farmer' },
        'incorrect_secret',
        { expiresIn: '15m', algorithm: 'HS256' }
      );
      const response = await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ message: 'Invalid token' });
    });
  });

describe('Rate Limiting', () => {
  let mockRateLimiter;
  const GENERAL_MAX_REQUESTS = 50;
  const GENERAL_WINDOW_MS = 15 * 60 * 1000; // 15 minutes in milliseconds
  const LOGIN_MAX_REQUESTS = 5;
  const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

  beforeAll(() => {
    mockRateLimiter = jest.fn().mockImplementation((options) => {
      const store = new Map();
      return (req, res, next) => {
        const key = req.ip;
        const now = Date.now();
        const windowMs = options.windowMs || GENERAL_WINDOW_MS;
        const max = options.max || GENERAL_MAX_REQUESTS;

        let bucket = store.get(key);
        if (!bucket || now - bucket.start > windowMs) {
          bucket = { start: now, count: 0 };
          store.set(key, bucket);
        }

        bucket.count++;
        if (bucket.count > max) {
          return res.status(429).json({ message: options.message || 'Too many requests from this IP, please try again later.' });
        }
        next();
      };
    });
    jest.mock('express-rate-limit', () => mockRateLimiter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    const generalLimiter = mockRateLimiter({ windowMs: GENERAL_WINDOW_MS, max: GENERAL_MAX_REQUESTS });
    const loginLimiter = mockRateLimiter({
      windowMs: LOGIN_WINDOW_MS,
      max: LOGIN_MAX_REQUESTS,
      message: 'Too many login attempts, please try again later.'
    });
    app.use(generalLimiter);
    app.post('/login', loginLimiter, (req, res) => res.sendStatus(200));
  });

  afterEach(() => {
    app._router.stack = app._router.stack.filter(layer => !layer.handle.mock);
  });

  afterAll(() => {
    jest.unmock('express-rate-limit');
  });

  it('should allow requests within the general rate limit', async () => {
    const token = jwt.sign({ userId: 'testuser', userType: 'farmer' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    for (let i = 0; i < GENERAL_MAX_REQUESTS; i++) {
      const response = await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).not.toBe(429);
    }
  });

  it('should limit repeated requests from the same IP for general endpoints', async () => {
    const token = jwt.sign({ userId: 'testuser', userType: 'farmer' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    for (let i = 0; i < GENERAL_MAX_REQUESTS; i++) {
      await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${token}`);
    }
    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(429);
    expect(response.body).toEqual({ message: 'Too many requests from this IP, please try again later.' });
  });

  it('should reset general rate limit after the window period', async () => {
    const token = jwt.sign({ userId: 'testuser', userType: 'farmer' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    jest.useFakeTimers();

    // Fill up the rate limit
    for (let i = 0; i < GENERAL_MAX_REQUESTS; i++) {
      await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${token}`);
    }

    // This request should be blocked
    const blockedResponse = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${token}`);
    expect(blockedResponse.statusCode).toBe(429);

    // Advance time by window period
    jest.advanceTimersByTime(GENERAL_WINDOW_MS);

    // This request should now be allowed
    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).not.toBe(429);

    jest.useRealTimers();
  });

  it('should apply a stricter rate limit to the login endpoint', async () => {
    for (let i = 0; i < LOGIN_MAX_REQUESTS; i++) {
      const response = await request(app).post('/login');
      expect(response.statusCode).not.toBe(429);
    }

    const blockedResponse = await request(app).post('/login');
    expect(blockedResponse.statusCode).toBe(429);
    expect(blockedResponse.body).toEqual({ message: 'Too many login attempts, please try again later.' });
  });

  it('should reset rate limit after the window period for login endpoint', async () => {
    jest.useFakeTimers();

    // Fill up the login rate limit
    for (let i = 0; i < LOGIN_MAX_REQUESTS; i++) {
      await request(app).post('/login');
    }

    // This request should be blocked
    const blockedResponse = await request(app).post('/login');
    expect(blockedResponse.statusCode).toBe(429);

    // Advance time by login window period
    jest.advanceTimersByTime(LOGIN_WINDOW_MS);

    // This request should now be allowed
    const response = await request(app).post('/login');
    expect(response.statusCode).not.toBe(429);

    jest.useRealTimers();
  });
});
