const express = require('express');
const { registerUser, loginUser, getMeUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMeUser);

module.exports = router;