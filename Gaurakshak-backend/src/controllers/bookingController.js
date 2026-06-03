const Booking = require('../models/Booking');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { getPagination, buildPaginationResponse } = require('../utils/helpers');

// @desc    Create booking inquiry
// @route   POST /api/bookings
// @access  Private (Customer)
const createBooking = async (req, res, next) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      name: req.body.name || req.user.name,
      phone: req.body.phone || req.user.phone,
      email: req.body.email || req.user.email,
      member: req.user._id,
    });
    ApiResponse.created(res, 'Booking inquiry submitted successfully! We will contact you soon.', booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current customer's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Customer)
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ member: req.user._id }).sort({ createdAt: -1 });
    ApiResponse.success(res, 'Your bookings fetched successfully', bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin)
const getBookings = async (req, res, next) => {
  try {
    if (!req.isAdmin) {
      return next(ApiError.forbidden('Only admins can view all bookings'));
    }

    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
    const { status, kathaType } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (kathaType) filter.kathaType = kathaType;

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const pagination = buildPaginationResponse(total, page, limit);
    ApiResponse.paginated(res, 'Bookings fetched successfully', bookings, pagination);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private (Admin)
const getBooking = async (req, res, next) => {
  try {
    if (!req.isAdmin) {
      return next(ApiError.forbidden('Only admins can view booking details'));
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(ApiError.notFound('Booking not found'));
    }
    ApiResponse.success(res, 'Booking fetched successfully', booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private (Admin)
const updateBooking = async (req, res, next) => {
  try {
    if (!req.isAdmin) {
      return next(ApiError.forbidden('Only admins can update bookings'));
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      return next(ApiError.notFound('Booking not found'));
    }

    ApiResponse.success(res, 'Booking updated successfully', booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
const deleteBooking = async (req, res, next) => {
  try {
    if (!req.isAdmin) {
      return next(ApiError.forbidden('Only admins can delete bookings'));
    }

    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return next(ApiError.notFound('Booking not found'));
    }
    ApiResponse.success(res, 'Booking deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getMyBookings, getBookings, getBooking, updateBooking, deleteBooking };
