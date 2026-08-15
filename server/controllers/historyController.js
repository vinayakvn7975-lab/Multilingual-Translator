const Translation = require('../models/Translation');
const { getIsConnected } = require('../config/db');
const { memoryStore } = require('./translationController');

/**
 * @route   GET /api/history
 * @desc    Get all translation history
 * @access  Public
 */
const getHistory = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const history = await Translation.find().sort({ createdAt: -1 }).limit(100);
      return res.status(200).json({
        success: true,
        count: history.length,
        data: history,
      });
    }

    return res.status(200).json({
      success: true,
      count: memoryStore.length,
      data: memoryStore,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/history/:id
 * @desc    Delete a single translation history item by ID
 * @access  Public
 */
const deleteHistoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const deleted = await Translation.findByIdAndDelete(id);
      if (!deleted) {
        // Also check memory store
        const index = memoryStore.findIndex((item) => item._id === id);
        if (index !== -1) memoryStore.splice(index, 1);
      }
    } else {
      const index = memoryStore.findIndex((item) => item._id === id);
      if (index !== -1) {
        memoryStore.splice(index, 1);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'History item deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/history
 * @desc    Clear all translation history
 * @access  Public
 */
const clearAllHistory = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      // Clear non-favorites or clear all history
      await Translation.deleteMany({});
    }
    memoryStore.length = 0;

    return res.status(200).json({
      success: true,
      message: 'All translation history cleared successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHistory,
  deleteHistoryItem,
  clearAllHistory,
};
