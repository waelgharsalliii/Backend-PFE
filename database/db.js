/*const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read the MongoDB URI from mongodb.json
const configPath = path.join(__dirname, 'mongodb.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Extract the URI
const MONGO_URI = config.mongo.uri;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected to ${MONGO_URI}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;*/
