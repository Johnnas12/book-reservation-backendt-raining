const mongoose = require('mongoose');
const config = require("../config/database");

describe('MongoDB Connection', () => {
  beforeAll(async () => {
    await mongoose.connect(config.database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should connect to MongoDB successfully', () => {
    const state = mongoose.connection.readyState;
    // 1 = connected
    expect(state).toBe(1);
  });
});
