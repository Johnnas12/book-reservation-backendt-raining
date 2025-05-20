const {register} = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/database');
const {notifyAdmins} = require('../utils/notificationUtils');

jest.mock('../models/User')
