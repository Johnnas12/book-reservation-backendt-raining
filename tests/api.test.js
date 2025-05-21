const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const config = require("../config/database");

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(config.database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const hashedPassword = await bcrypt.hash('correctpassword', 10);
    await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: hashedPassword,
      phoneNumber: '1234567890',
      password: 'hashedpassword',
      isApproved: false,

    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it('should respond with 403 when password is incorrect', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });
});
