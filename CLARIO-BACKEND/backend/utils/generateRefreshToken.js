const jwt = require('jsonwebtoken');

const generateRefreshToken = (id, REFRESH_SECRET) => {
    return jwt.sign({ id }, REFRESH_SECRET, {
        expiresIn: '7d',
    });
};

module.exports = { generateRefreshToken };