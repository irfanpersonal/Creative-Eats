const {UnauthorizedError} = require('../errors');
const jwt = require('jsonwebtoken');
// const User = require('../models/User.js');

const authentication = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Missing/Invalid Bearer Token');
        }
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const {userID, name, email} = decoded;
        const isTestUser = userID === '6543afa4441b3b834c4fa19b';
        const isAdminUser = userID === '6543b1131c93e4a4d315ab39';
        req.user = {userID, name, email, isTestUser, isAdminUser};
        next();
    }
    catch(error) {
        throw new UnauthorizedError('Not authorized to access this route!');
    }
}

module.exports = authentication;