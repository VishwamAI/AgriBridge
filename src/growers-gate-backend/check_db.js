const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function checkDatabaseState() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('growers_gate');
    const usersCollection = db.collection('users');

    const users = await usersCollection.find().toArray();
    console.log('Users in the database:');
    console.log(JSON.stringify(users, null, 2));

    const userCount = await usersCollection.countDocuments();
    console.log(`Total number of users: ${userCount}`);

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

checkDatabaseState();
