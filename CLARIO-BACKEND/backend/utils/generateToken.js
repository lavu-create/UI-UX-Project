const jwt = require('jsonwebtoken');

// Generate Token for the customer/staff id;
const generateToken = (id, JWT_SECRET) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '30d',
    });
}

module.exports = { generateToken }