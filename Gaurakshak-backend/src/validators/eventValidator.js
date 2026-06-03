const { body } = require('express-validator');

const eventValidator = [
  body('title').trim().notEmpty().withMessage('Event title is required'),
  body('kathaType')
    .notEmpty()
    .withMessage('Katha type is required')
    .isIn(['bhagavad-katha', 'ramji-janmotsav', 'shiv-mahapuran', 'sundarkand-path', 'bhajan-sandhya', 'other'])
    .withMessage('Invalid katha type'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('date').notEmpty().withMessage('Event date is required').isISO8601().withMessage('Invalid date format'),
  body('location').trim().notEmpty().withMessage('Location is required'),
];

module.exports = { eventValidator };
