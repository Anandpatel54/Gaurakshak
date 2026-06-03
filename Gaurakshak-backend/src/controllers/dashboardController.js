const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Member = require('../models/Member');
const Contact = require('../models/Contact');
const Gallery = require('../models/Gallery');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalEvents,
      upcomingEvents,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalMembers,
      pendingMembers,
      totalMessages,
      unreadMessages,
      totalGallery,
    ] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ status: 'upcoming', date: { $gte: new Date() } }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Member.countDocuments(),
      Member.countDocuments({ status: 'pending' }),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Gallery.countDocuments(),
    ]);

    // Recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Upcoming events
    const nextEvents = await Event.find({
      status: 'upcoming',
      date: { $gte: new Date() },
    })
      .populate('vachak', 'name')
      .sort({ date: 1 })
      .limit(5);

    const stats = {
      events: { total: totalEvents, upcoming: upcomingEvents },
      bookings: { total: totalBookings, pending: pendingBookings, confirmed: confirmedBookings },
      members: { total: totalMembers, pending: pendingMembers },
      messages: { total: totalMessages, unread: unreadMessages },
      gallery: { total: totalGallery },
      recentBookings,
      upcomingEvents: nextEvents,
    };

    ApiResponse.success(res, 'Dashboard stats fetched successfully', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
