const Contact = require('../models/Contact');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { getPagination, buildPaginationResponse } = require('../utils/helpers');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);
    ApiResponse.created(res, 'Message sent successfully! We will get back to you soon.', contact);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (Admin)
const getContacts = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
    const { isRead } = req.query;

    const filter = {};
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const pagination = buildPaginationResponse(total, page, limit);
    ApiResponse.paginated(res, 'Contact messages fetched successfully', contacts, pagination);
  } catch (error) {
    next(error);
  }
};

const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return next(ApiError.notFound('Message not found'));
    }
    ApiResponse.success(res, 'Message fetched successfully', contact);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark contact as read/unread
// @route   PUT /api/contact/:id
// @access  Private (Admin)
const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!contact) {
      return next(ApiError.notFound('Message not found'));
    }
    ApiResponse.success(res, 'Message updated successfully', contact);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return next(ApiError.notFound('Message not found'));
    }
    ApiResponse.success(res, 'Message deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { createContact, getContacts, getContact, updateContact, deleteContact };
