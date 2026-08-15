const Translation = require('../models/Translation');
const { getIsConnected } = require('../config/db');
const { memoryStore } = require('./translationController');

/**
 * @route   POST /api/favorites
 * @desc    Toggle favorite status or add translation to favorites
 * @access  Public
 */
const toggleFavorite = async (req, res, next) => {
  try {
    const { id, originalText, detectedLanguage, targetLanguage, translatedText, isSingleWord, wordDetails } = req.body;

    if (id) {
      if (getIsConnected()) {
        const item = await Translation.findById(id);
        if (item) {
          item.isFavorite = !item.isFavorite;
          await item.save();
          return res.status(200).json({
            success: true,
            message: item.isFavorite ? 'Saved to favorites!' : 'Removed from favorites!',
            data: item,
          });
        }
      }

      // Check memory store
      const memItem = memoryStore.find((m) => m._id === id);
      if (memItem) {
        memItem.isFavorite = !memItem.isFavorite;
        return res.status(200).json({
          success: true,
          message: memItem.isFavorite ? 'Saved to favorites!' : 'Removed from favorites!',
          data: memItem,
        });
      }
    }

    // If direct object submitted without existing ID
    if (!originalText || !translatedText) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data to save favorite.',
      });
    }

    const favoriteData = {
      originalText,
      detectedLanguage: detectedLanguage || 'Auto Detect',
      targetLanguage: targetLanguage || 'English',
      translatedText,
      isSingleWord: isSingleWord || false,
      wordDetails: wordDetails || {},
      isFavorite: true,
    };

    let resultItem;
    if (getIsConnected()) {
      const newFav = new Translation(favoriteData);
      resultItem = await newFav.save();
    } else {
      resultItem = { _id: Date.now().toString(), ...favoriteData, createdAt: new Date() };
      memoryStore.unshift(resultItem);
    }

    return res.status(200).json({
      success: true,
      message: 'Saved to favorites!',
      data: resultItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/favorites
 * @desc    Get all favorite translations
 * @access  Public
 */
const getFavorites = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const favorites = await Translation.find({ isFavorite: true }).sort({ updatedAt: -1 });
      return res.status(200).json({
        success: true,
        count: favorites.length,
        data: favorites,
      });
    }

    const favorites = memoryStore.filter((item) => item.isFavorite);
    return res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/favorites/:id
 * @desc    Remove an item from favorites by ID
 * @access  Public
 */
const removeFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const updated = await Translation.findByIdAndUpdate(id, { isFavorite: false }, { new: true });
      if (updated) {
        return res.status(200).json({
          success: true,
          message: 'Removed from favorites!',
          data: updated,
        });
      }
    }

    const memItem = memoryStore.find((item) => item._id === id);
    if (memItem) {
      memItem.isFavorite = false;
      return res.status(200).json({
        success: true,
        message: 'Removed from favorites!',
        data: memItem,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Favorite item removed.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  toggleFavorite,
  getFavorites,
  removeFavorite,
};
