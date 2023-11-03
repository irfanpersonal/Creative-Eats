const {StatusCodes} = require('http-status-codes');

const notFound = (req, res) => {
    return res.status(StatusCodes.NOT_FOUND).send('<h1>PAGE NOT FOUND</h1>');
}

module.exports = notFound;