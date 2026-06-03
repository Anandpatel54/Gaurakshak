const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Member = require('../models/Member');
const { JWT_SECRET } = require('../config/env');
const ApiError = require('../utils/apiError');

// Protect routes — verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(ApiError.unauthorized('Access denied. No token provided.'));
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if it's an admin or member token
    if (decoded.role === 'member') {
      const member = await Member.findById(decoded.id);
      if (!member) {
        return next(ApiError.unauthorized('Member not found'));
      }
      req.user = member;
      req.isMember = true;
    } else {
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        return next(ApiError.unauthorized('Admin not found'));
      }
      req.admin = admin;
      req.isAdmin = true;
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token expired'));
    }
    next(error);
  }
};

// Authorize roles
const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.admin?.role || req.user?.role || 'guest';
    if (!roles.includes(userRole)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }
    next();
  };
};

module.exports = { protect, authorize };
