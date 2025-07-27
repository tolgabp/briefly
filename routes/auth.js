const express = require('express');
const router = express.Router();
const { signup, login, confirmEmail, getMe } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware'); // ✅ Add this

router.post('/signup', signup);
router.post('/login', login);
router.get('/confirm', confirmEmail);
router.get('/me', authenticate, getMe); // ✅ Protected route

module.exports = router;
