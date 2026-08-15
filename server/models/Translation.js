const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema(
  {
    originalText: {
      type: String,
      required: true,
      trim: true,
    },
    detectedLanguage: {
      type: String,
      required: true,
      default: 'Auto Detect',
    },
    targetLanguage: {
      type: String,
      required: true,
      enum: ['English', 'Kannada'],
      default: 'English',
    },
    translatedText: {
      type: String,
      required: true,
      trim: true,
    },
    isSingleWord: {
      type: Boolean,
      default: false,
    },
    wordDetails: {
      meaning: { type: String, default: '' },
      partOfSpeech: { type: String, default: '' },
      pronunciation: { type: String, default: '' },
      example: { type: String, default: '' },
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick queries
translationSchema.index({ createdAt: -1 });
translationSchema.index({ isFavorite: 1, createdAt: -1 });

module.exports = mongoose.model('Translation', translationSchema);
