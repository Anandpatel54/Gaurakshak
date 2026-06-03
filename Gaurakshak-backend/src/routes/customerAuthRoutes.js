const express = require('express');
const router = express.Router();
const {
  customerSignup,
  customerLogin,
  getCustomerProfile,
  updateCustomerMembership,
} = require('../controllers/customerAuthController');
const { protect } = require('../middlewares/auth');

router.post('/customer/signup', customerSignup);
router.post('/customer/login', customerLogin);
router.get('/customer/me', protect, getCustomerProfile);
router.patch('/customer/membership', protect, updateCustomerMembership);

module.exports = router;
