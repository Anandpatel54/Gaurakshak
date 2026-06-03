const express = require('express');
const router = express.Router();
const { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { protect } = require('../middlewares/auth');
const { uploadGallery } = require('../middlewares/upload');

// Public route
router.get('/', getGalleryItems);

// Admin routes
router.post('/', protect, uploadGallery, createGalleryItem);
router.put('/:id', protect, uploadGallery, updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

module.exports = router;
