const { body } = require('express-validator');

const bookingValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('kathaType')
    .notEmpty()
    .withMessage('Katha type is required')
    .isIn(['bhagavad-katha', 'ramji-janmotsav', 'shiv-mahapuran', 'sundarkand-path', 'bhajan-sandhya', 'other'])
    .withMessage('Invalid katha type'),
  body('eventDate').notEmpty().withMessage('Event date is required').isISO8601().withMessage('Invalid date format'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
];

const bookingStatusValidator = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'confirmed', 'rejected'])
    .withMessage('Invalid status'),
];

module.exports = { bookingValidator, bookingStatusValidator };
