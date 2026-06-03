const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const customerAuthRoutes = require('./customerAuthRoutes');
const eventRoutes = require('./eventRoutes');
const bookingRoutes = require('./bookingRoutes');
const galleryRoutes = require('./galleryRoutes');
const memberRoutes = require('./memberRoutes');
const contactRoutes = require('./contactRoutes');
const kathaVachakRoutes = require('./kathaVachakRoutes');
const dashboardRoutes = require('./dashboardRoutes');

router.use('/auth', authRoutes);
router.use('/auth', customerAuthRoutes);
router.use('/events', eventRoutes);
router.use('/bookings', bookingRoutes);
router.use('/gallery', galleryRoutes);
router.use('/members', memberRoutes);
router.use('/contact', contactRoutes);
router.use('/katha-vachak', kathaVachakRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
