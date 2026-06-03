const express = require('express');
const router = express.Router();
const { createMember, getMembers, getMember, updateMember, deleteMember } = require('../controllers/memberController');
const { protect } = require('../middlewares/auth');

// Public route
router.post('/', createMember);

// Admin routes
router.get('/', protect, getMembers);
router.get('/:id', protect, getMember);
router.put('/:id', protect, updateMember);
router.delete('/:id', protect, deleteMember);

module.exports = router;
