const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || '127.0.0.1:27017/pi';

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

module.exports = connectDB;
