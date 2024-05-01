const request = require('supertest');
const express = require('express');
const router  = require('../../routes/events')
const axios = require('axios');
const { default: mongoose } = require('mongoose');


const app = express();
app.use(router)

describe('Payment Routes', () => {


  beforeAll(() => {
    mongoose.connect('mongodb://127.0.0.1:27017/pi');
});

afterAll(() => {
    mongoose.disconnect();
});

    // Test route for POST /:clubId/:userId/payment
    it('should respond with status 200 for POST /:clubId/:userId/payment', async () => {
  
      // Use supertest to make a request to the route
      const response = await request(app).get('/Loginn');
  
      // Check if the response status is 200 and contains the expected data
      expect(response.status).toBe(200);})});
