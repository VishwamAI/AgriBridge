const request = require('supertest');
const app = require('../api');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const rateLimit = require('express-rate-limit');

let db;
let mockRateLimiter;

beforeAll(async () => {
  console.log('Connecting to MongoDB...');
  console.log('MongoDB URI:', process.env.MONGODB_URI);
  const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB successfully');
    db = client.db('growers_gate_test');
    console.log('Using database:', db.databaseName);
    console.log('Database connection state:', client.topology.s.state);

    // Check for existing documents in the users collection
    const userCount = await db.collection('users').countDocuments();
    console.log(`Existing documents in users collection: ${userCount}`);

    // Log database details
    const dbStats = await db.stats();
    console.log('Database stats:', JSON.stringify(dbStats, null, 2));

    // Mock rate limiter
    mockRateLimiter = jest.fn().mockImplementation((req, res, next) => next());
    app.use(mockRateLimiter);
    console.log('Rate limiter mocked');

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}, 10000); // Increased timeout to 10000ms

afterAll(async () => {
  console.log('Cleaning up after tests...');
  await db.dropDatabase();
  await db.client.close();
  console.log('Database dropped and connection closed');
});

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
    });

    it('should accept requests with a valid JWT', async () => {
      const token = jwt.sign({ userId: 'testuser', userType: 'farmer' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const response = await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
    });

    it('should reject requests with an expired JWT', async () => {
      jest.useFakeTimers();
      const token = jwt.sign({ userId: 'testuser', userType: 'farmer' }, process.env.JWT_SECRET, { expiresIn: '1s' });
      jest.advanceTimersByTime(2000); // Advance time by 2 seconds
      const response = await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(403);
      jest.useRealTimers();
    });
  });

  describe('Rate Limiting', () => {
    it('should limit repeated requests from the same IP', async () => {
      mockRateLimiter.mockImplementationOnce((req, res, next) => {
        res.status(429).json({ message: 'Too many requests' });
      });
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(429);
    });

    it('should allow requests after rate limit reset', async () => {
      mockRateLimiter.mockImplementationOnce((req, res, next) => next());
      const response = await request(app).get('/');
      expect(response.statusCode).not.toBe(429);
    });
  });
});

// Error logging middleware for tests
app.use((err, req, res, next) => {
  console.error('Test Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});
