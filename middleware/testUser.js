const {UnauthorizedError} = require('../errors');

const testUser = (req, res, next) => {
    if (req.user.isTestUser) {
        throw new UnauthorizedError('Test User is in Read Only Mode!');
    }
    next();
}

module.exports = testUser;