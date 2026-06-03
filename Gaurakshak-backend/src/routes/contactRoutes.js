const express = require('express');
const router = express.Router();
const { createContact, getContacts, getContact, updateContact, deleteContact } = require('../controllers/contactController');
const { protect } = require('../middlewares/auth');
const { contactValidator } = require('../validators/contactValidator');
const validate = require('../middlewares/validate');

// Public route
router.post('/', contactValidator, validate, createContact);

// Admin routes
router.get('/', protect, getContacts);
router.get('/:id', protect, getContact);
router.put('/:id', protect, updateContact);
router.delete('/:id', protect, deleteContact);

module.exports = router;
