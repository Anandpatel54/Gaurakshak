const Event = require('../models/Event');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { getPagination, buildPaginationResponse } = require('../utils/helpers');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
    const { status, kathaType, featured } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (kathaType) filter.kathaType = kathaType;
    if (featured === 'true') filter.isFeatured = true;

    const total = await Event.countDocuments(filter);
    const events = await Event.find(filter)
      .populate('vachak', 'name photo specialization')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const pagination = buildPaginationResponse(total, page, limit);
    ApiResponse.paginated(res, 'Events fetched successfully', events, pagination);
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Public
const getUpcomingEvents = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const events = await Event.find({
      status: 'upcoming',
      date: { $gte: new Date() },
    })
      .populate('vachak', 'name photo specialization')
      .sort({ date: 1 })
      .limit(limit);

    ApiResponse.success(res, 'Upcoming events fetched successfully', events);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('vachak', 'name photo specialization bio');

    if (!event) {
      return next(ApiError.notFound('Event not found'));
    }

    ApiResponse.success(res, 'Event fetched successfully', event);
  } catch (error) {
    next(error);
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private (Admin)
const createEvent = async (req, res, next) => {
  try {
    if (!req.isAdmin) {
      return next(ApiError.forbidden('Only admins can create events'));
    }

    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    const event = await Event.create(req.body);
    ApiResponse.created(res, 'Event created successfully', event);
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin)
const updateEvent = async (req, res, next) => {
  try {
    if (!req.isAdmin) {
      return next(ApiError.forbidden('Only admins can update events'));
    }

    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return next(ApiError.notFound('Event not found'));
    }

    ApiResponse.success(res, 'Event updated successfully', event);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin)
const deleteEvent = async (req, res, next) => {
  try {
    if (!req.isAdmin) {
      return next(ApiError.forbidden('Only admins can delete events'));
    }

    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return next(ApiError.notFound('Event not found'));
    }

    ApiResponse.success(res, 'Event deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getEvents, getUpcomingEvents, getEvent, createEvent, updateEvent, deleteEvent };
