const Member = require('../models/Member');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { getPagination, buildPaginationResponse } = require('../utils/helpers');

// @desc    Submit membership inquiry
// @route   POST /api/members
// @access  Public
const createMember = async (req, res, next) => {
  try {
    const member = await Member.create(req.body);
    ApiResponse.created(res, 'Membership request submitted successfully!', member);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all members
// @route   GET /api/members
// @access  Private (Admin)
const getMembers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
    const { status, membershipType } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (membershipType) filter.membershipType = membershipType;

    const total = await Member.countDocuments(filter);
    const members = await Member.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const pagination = buildPaginationResponse(total, page, limit);
    ApiResponse.paginated(res, 'Members fetched successfully', members, pagination);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Private (Admin)
const getMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return next(ApiError.notFound('Member not found'));
    }
    ApiResponse.success(res, 'Member fetched successfully', member);
  } catch (error) {
    next(error);
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private (Admin)
const updateMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) {
      return next(ApiError.notFound('Member not found'));
    }
    ApiResponse.success(res, 'Member updated successfully', member);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private (Admin)
const deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return next(ApiError.notFound('Member not found'));
    }
    ApiResponse.success(res, 'Member deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { createMember, getMembers, getMember, updateMember, deleteMember };
