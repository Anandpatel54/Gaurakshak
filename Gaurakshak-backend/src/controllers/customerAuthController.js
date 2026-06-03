const Member = require('../models/Member');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

// @desc    Customer Signup
// @route   POST /api/auth/customer/signup
// @access  Public
const customerSignup = async (req, res, next) => {
  try {
    const { name, email, phone, password, address, city } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return next(ApiError.badRequest('Name, email, phone, and password are required'));
    }

    // Check if member already exists
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return next(ApiError.badRequest('Email already registered'));
    }

    // Create new member
    const member = await Member.create({
      name,
      email,
      phone,
      password,
      address: address || '',
      city: city || '',
      isAuthenticated: true,
      status: 'pending',
    });

    // Generate token
    const token = member.generateToken();

    // Prepare response data (excluding password)
    const memberData = member.toObject();
    delete memberData.password;

    ApiResponse.created(res, 'Signup successful', {
      user: {
        id: memberData._id,
        name: memberData.name,
        email: memberData.email,
        phone: memberData.phone,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Customer Login
// @route   POST /api/auth/customer/login
// @access  Public
const customerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return next(ApiError.badRequest('Email and password are required'));
    }

    // Find member and include password
    const member = await Member.findOne({ email }).select('+password');
    if (!member) {
      return next(ApiError.unauthorized('Invalid credentials'));
    }

    // Check password
    const isMatch = await member.comparePassword(password);
    if (!isMatch) {
      return next(ApiError.unauthorized('Invalid credentials'));
    }

    // Generate token
    const token = member.generateToken();

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    ApiResponse.success(res, 'Login successful', {
      user: {
        id: member._id,
        name: member.name,
        email: member.email,
        phone: member.phone,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current member profile
// @route   GET /api/auth/customer/me
// @access  Private
const getCustomerProfile = async (req, res, next) => {
  try {
    const member = await Member.findById(req.admin?._id || req.user?._id);
    if (!member) {
      return next(ApiError.notFound('Member not found'));
    }

    ApiResponse.success(res, 'Profile retrieved successfully', {
      id: member._id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      address: member.address,
      city: member.city,
      membershipType: member.membershipType,
      status: member.status,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current member membership plan
// @route   PATCH /api/auth/customer/membership
// @access  Private
const updateCustomerMembership = async (req, res, next) => {
  try {
    const allowedPlans = ['basic', 'silver', 'gold', 'platinum'];
    const { membershipType, address, city } = req.body;

    if (!allowedPlans.includes(membershipType)) {
      return next(ApiError.badRequest('Valid membership type is required'));
    }

    const member = await Member.findByIdAndUpdate(
      req.user._id,
      {
        membershipType,
        address: address || req.user.address,
        city: city || req.user.city,
        status: 'pending',
        isAuthenticated: true,
      },
      { new: true, runValidators: true }
    );

    if (!member) {
      return next(ApiError.notFound('Member not found'));
    }

    ApiResponse.success(res, 'Membership request submitted successfully!', {
      id: member._id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      address: member.address,
      city: member.city,
      membershipType: member.membershipType,
      status: member.status,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { customerSignup, customerLogin, getCustomerProfile, updateCustomerMembership };
