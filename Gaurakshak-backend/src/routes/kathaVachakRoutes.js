const express = require('express');
const router = express.Router();
const { getKathaVachaks, getKathaVachak, createKathaVachak, updateKathaVachak, deleteKathaVachak } = require('../controllers/kathaVachakController');
const { protect } = require('../middlewares/auth');
const { uploadSingle } = require('../middlewares/upload');

// Public routes
router.get('/', getKathaVachaks);
router.get('/:id', getKathaVachak);

// Admin routes
router.post('/', protect, uploadSingle, createKathaVachak);
router.put('/:id', protect, uploadSingle, updateKathaVachak);
router.delete('/:id', protect, deleteKathaVachak);

module.exports = router;
