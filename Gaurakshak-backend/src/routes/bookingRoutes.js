const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBookings, getBooking, updateBooking, deleteBooking } = require('../controllers/bookingController');
const { protect } = require('../middlewares/auth');
const { bookingValidator, bookingStatusValidator } = require('../validators/bookingValidator');
const validate = require('../middlewares/validate');

// Customer route
router.post('/', protect, bookingValidator, validate, createBooking);
router.get('/my-bookings', protect, getMyBookings);

// Admin routes
router.get('/', protect, getBookings);
router.get('/:id', protect, getBooking);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

module.exports = router;
