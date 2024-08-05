// Import necessary modules
const express = require('express');
const supertest = require('supertest');
const router = require('../../routes/clubs'); // Import your club router
const { default: mongoose } = require('mongoose');
const Club = require("../../model/club")
// Create a test app instance
const app = require('../../app');
const { Dayjs } = require('dayjs');
const dayjs = require('dayjs');
const club = require('../../model/club');

describe('Club Routes', () => {

  beforeAll(() => {
    mongoose.connect('mongodb://mongodb://admin:wael01234@localhost:27017/catch-db?authSource=admin');
});

afterAll(() => {
    mongoose.disconnect();
});

  // Test route for GET /clubs
  it('should respond with status 200 for GET /clubs', async () => {
    const response = await supertest(app).get('/clubs');
    expect(response.status).toBe(200);
  });

  // Test route for POST /clubs/add
  it('should respond with status 201 for POST /clubs/add', async () => {
   
    const date = dayjs()
    const timestamp = date.toISOString();
    const response = await supertest(app)

      .post('/clubs/add')
      .send({
        name:timestamp,
        description:"zerzerezr" ,
        address:"azeaze",
        domain:timestamp,
      }); // Assuming you have a test image
    expect(response.status).toBe(201);
  });

  // Test route for GET /clubs/:id
  it('should respond with status 200 for GET /clubs/:id', async () => {
    const response = await supertest(app).get('/clubs/65d213b0873e59efd0b0d9ea'); 
    expect(response.status).toBe(200);
  });

  // Test route for PUT /clubs/update/:id
  it('should respond with status 200 for PUT /clubs/update/:id', async () => {
    const response = await supertest(app)
      .put('/clubs/update/65d213b0873e59efd0b0d9ea') // 
      .field('name', 'Updated Club Name')
      .field('description', 'Updated description')
      .field('address', 'Updated address')
      .field('domain', 'Updated domain')
   
    expect(response.status).toBe(200);
  });

  // Test route for DELETE /clubs/delete/:id
  it('should respond with status 200 for DELETE /clubs/delete/:id', async () => {


  

const myDate = dayjs();

const newDate = myDate.add(2,'second')


const myTimestamp = newDate.toISOString()

    const responseOne = await supertest(app)

    .post('/clubs/add')
    .send({
      name:"f "+myTimestamp ,
      description:"zerzerezr",
      address:"f "+"azeaze",
      domain:"f "+myTimestamp,
    }); // Assuming you have a test

   const club =  new Club(responseOne.body) ;

 

    const response = await supertest(app).delete('/clubs/delete/'+responseOne.body.club._id); // Replace 123 with a valid club ID
    expect(response.status).toBe(200);
  });
  // Add more tests for other routes as needed
});
        module.exports = router;
