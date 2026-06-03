const Gallery = require('../models/Gallery');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { getPagination, buildPaginationResponse } = require('../utils/helpers');

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
    const { type, category, highlight } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (highlight === 'true') filter.isHighlight = true;

    const total = await Gallery.countDocuments(filter);
    const items = await Gallery.find(filter)
      .populate('event', 'title kathaType date')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const pagination = buildPaginationResponse(total, page, limit);
    ApiResponse.paginated(res, 'Gallery items fetched successfully', items, pagination);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload gallery item
// @route   POST /api/gallery
// @access  Private (Admin)
const createGalleryItem = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.url = `/uploads/${req.file.filename}`;
    }

    if (!req.body.url) {
      return next(ApiError.badRequest('File is required'));
    }

    const item = await Gallery.create(req.body);
    ApiResponse.created(res, 'Gallery item uploaded successfully', item);
  } catch (error) {
    next(error);
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private (Admin)
const updateGalleryItem = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.url = `/uploads/${req.file.filename}`;
    }

    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return next(ApiError.notFound('Gallery item not found'));
    }

    ApiResponse.success(res, 'Gallery item updated successfully', item);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private (Admin)
const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) {
      return next(ApiError.notFound('Gallery item not found'));
    }
    ApiResponse.success(res, 'Gallery item deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem };
