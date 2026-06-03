const Admin = require('../models/Admin');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(ApiError.badRequest('Please provide email and password'));
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return next(ApiError.unauthorized('Invalid credentials'));
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return next(ApiError.unauthorized('Invalid credentials'));
    }

    const token = admin.generateToken();

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    ApiResponse.success(res, 'Login successful', {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register admin (only superadmin can create)
// @route   POST /api/auth/register
// @access  Private (superadmin)
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return next(ApiError.badRequest('Admin with this email already exists'));
    }

    const admin = await Admin.create({ name, email, password, role: role || 'admin' });

    ApiResponse.created(res, 'Admin created successfully', {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current admin
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    ApiResponse.success(res, 'Admin profile', admin);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout admin
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    ApiResponse.success(res, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register, getMe, logout };
