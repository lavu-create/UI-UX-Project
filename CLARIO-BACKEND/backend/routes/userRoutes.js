const express = require("express");
const { registerUser, loginUser, getMe, refreshToken, logoutUser } = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);
router.get("/me", auth, getMe);

module.exports = router;