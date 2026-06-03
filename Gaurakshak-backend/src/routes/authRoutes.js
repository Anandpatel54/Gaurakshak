const express = require('express');
const router = express.Router();
const { login, register, getMe, logout } = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/auth');

router.post('/login', login);
router.post('/register', protect, authorize('superadmin'), register);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
