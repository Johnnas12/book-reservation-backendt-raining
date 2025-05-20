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
                phoneNumber: '0901946736',
                password: 'testpassword',
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
    });
})