const Translation = require('../models/Translation');
const { translateText } = require('../services/translationService');
const { getIsConnected } = require('../config/db');

// In-memory fallback store when MongoDB is offline
const memoryStore = [];

/**
 * @route   POST /api/translate
 * @desc    Translate text and save to history
 * @access  Public
 */
const handleTranslate = async (req, res, next) => {
  try {
    const { text, targetLanguage = 'English' } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter some text to translate.',
      });
    }

    if (!['English', 'Kannada'].includes(targetLanguage)) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported target language. Supported languages are English and Kannada.',
      });
    }

    // Call Translation Service
    const translationResult = await translateText(text.trim(), targetLanguage);

    const recordData = {
      originalText: text.trim(),
      detectedLanguage: translationResult.detectedLanguage,
      targetLanguage,
      translatedText: translationResult.translatedText,
      isSingleWord: translationResult.isSingleWord || false,
      wordDetails: translationResult.wordDetails || { meaning: '', partOfSpeech: '', pronunciation: '', example: '' },
      isFavorite: false,
    };

    let savedItem;

    if (getIsConnected()) {
      try {
        const newTranslation = new Translation(recordData);
        savedItem = await newTranslation.save();
      } catch (dbError) {
        console.warn(`[DB Save Error] ${dbError.message}. Storing in memory fallback.`);
        savedItem = { _id: Date.now().toString(), ...recordData, createdAt: new Date() };
        memoryStore.unshift(savedItem);
      }
    } else {
      savedItem = { _id: Date.now().toString(), ...recordData, createdAt: new Date() };
      memoryStore.unshift(savedItem);
    }

    return res.status(200).json({
      success: true,
      data: savedItem,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleTranslate,
  memoryStore,
};
