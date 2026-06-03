const express = require('express');
const router = express.Router();
const { getEvents, getUpcomingEvents, getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middlewares/auth');
const { uploadSingle } = require('../middlewares/upload');
const { eventValidator } = require('../validators/eventValidator');
const validate = require('../middlewares/validate');

// Public routes
router.get('/', getEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/:id', getEvent);

// Admin routes
router.post('/', protect, uploadSingle, eventValidator, validate, createEvent);
router.put('/:id', protect, uploadSingle, updateEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;
