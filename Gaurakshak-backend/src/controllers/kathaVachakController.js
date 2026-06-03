const KathaVachak = require('../models/KathaVachak');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

// @desc    Get all Katha Vachaks
// @route   GET /api/katha-vachak
// @access  Public
const getKathaVachaks = async (req, res, next) => {
  try {
    const { active } = req.query;
    const filter = {};
    if (active !== undefined) filter.isActive = active === 'true';

    const vachaks = await KathaVachak.find(filter).sort({ name: 1 });
    ApiResponse.success(res, 'Katha Vachaks fetched successfully', vachaks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single Katha Vachak
// @route   GET /api/katha-vachak/:id
// @access  Public
const getKathaVachak = async (req, res, next) => {
  try {
    const vachak = await KathaVachak.findById(req.params.id);
    if (!vachak) {
      return next(ApiError.notFound('Katha Vachak not found'));
    }
    ApiResponse.success(res, 'Katha Vachak fetched successfully', vachak);
  } catch (error) {
    next(error);
  }
};

// @desc    Create Katha Vachak
// @route   POST /api/katha-vachak
// @access  Private (Admin)
const createKathaVachak = async (req, res, next) => {
  try {
    if (!req.isAdmin) {
      return next(ApiError.forbidden('Only admins can create Katha Vachaks'));
    }

    if (req.file) {
      req.body.photo = `/uploads/${req.file.filename}`;
    }

    const vachak = await KathaVachak.create(req.body);
    ApiResponse.created(res, 'Katha Vachak created successfully', vachak);
  } catch (error) {
    next(error);
  }
};

// @desc    Update Katha Vachak
// @route   PUT /api/katha-vachak/:id
// @access  Private (Admin)
const updateKathaVachak = async (req, res, next) => {
  try {
    if (!req.isAdmin) {
      return next(ApiError.forbidden('Only admins can update Katha Vachaks'));
    }

    if (req.file) {
      req.body.photo = `/uploads/${req.file.filename}`;
    }

    const vachak = await KathaVachak.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!vachak) {
      return next(ApiError.notFound('Katha Vachak not found'));
    }

    ApiResponse.success(res, 'Katha Vachak updated successfully', vachak);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Katha Vachak
// @route   DELETE /api/katha-vachak/:id
// @access  Private (Admin)
const deleteKathaVachak = async (req, res, next) => {
  try {
    if (!req.isAdmin) {
      return next(ApiError.forbidden('Only admins can delete Katha Vachaks'));
    }

    const vachak = await KathaVachak.findByIdAndDelete(req.params.id);
    if (!vachak) {
      return next(ApiError.notFound('Katha Vachak not found'));
    }
    ApiResponse.success(res, 'Katha Vachak deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getKathaVachaks, getKathaVachak, createKathaVachak, updateKathaVachak, deleteKathaVachak };
