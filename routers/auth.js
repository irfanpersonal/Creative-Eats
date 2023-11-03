const express = require('express');
const router = express.Router();

const {register, login, updateUser, adminData} = require('../controllers/auth.js');
const authenticationMiddleware = require('../middleware/authentication.js');
const testUserMiddleware = require('../middleware/testUser.js');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/updateUser').patch(authenticationMiddleware, testUserMiddleware, updateUser);

module.exports = router;