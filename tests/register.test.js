const {register} = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/database');
const {notifyAdmins} = require('../utils/notificationUtils');

jest.mock('../models/User')
jest.mock('../utils/notificationUtils')
jest.mock('jsonwebtoken');

describe('register controller', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();


    req = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        password: 'password123'
      }
    };

  
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
  });

  it('should return 400 if user already exists', async () => {
    User.findOne.mockResolvedValue({ email: 'test@example.com' });

    await register(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });

  it('should create new user and return token when registration is successful', async () => {
    User.findOne.mockResolvedValue(null);
    const mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      phoneNumber: '1234567890',
      password: 'hashedpassword',
      isApproved: false,
      save: jest.fn().mockResolvedValue(true)
    };
    User.mockImplementation(() => mockUser);
    notifyAdmins.mockResolvedValue(true);
    jwt.sign.mockImplementation((payload, secret, options, callback) => {
      callback(null, 'mocktoken');
    });

    await register(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockUser.save).toHaveBeenCalled();
    expect(notifyAdmins).toHaveBeenCalledWith(
      'New user registered: Test User',
      'new_user'
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      { user: { id: '123' } },
      config.secret,
      { expiresIn: '1h' },
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({ 
      token: 'mocktoken', 
      userId: '123' 
    });
  });

  it('should return 500 if there is a server error', async () => {
    User.findOne.mockRejectedValue(new Error('Database error'));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Server error');
  });

  it('should handle JWT signing error', async () => {
    User.findOne.mockResolvedValue(null);
    const mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      phoneNumber: '1234567890',
      password: 'hashedpassword',
      isApproved: false,
      save: jest.fn().mockResolvedValue(true)
    };
    User.mockImplementation(() => mockUser);
    notifyAdmins.mockResolvedValue(true);
    jwt.sign.mockImplementation((payload, secret, options, callback) => {
      callback(new Error('JWT error'));
    });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Server error');
  });
});