const jwt = require('jsonwebtoken');

const generateAccessToken = (id, JWT_SECRET) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '15m',
    });
};

module.exports = { generateAccessToken };