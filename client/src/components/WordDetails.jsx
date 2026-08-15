import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

const WordDetails = ({ wordDetails }) => {
  if (!wordDetails || (!wordDetails.meaning && !wordDetails.partOfSpeech)) {
    return null;
  }

  return (
    <div className="word-details-card">
      <div className="word-details-header">
        <BookOpen size={18} />
        <span>Single Word Insights</span>
      </div>

      <div className="word-tags-row">
        {wordDetails.partOfSpeech && (
          <span className="word-tag-pos">{wordDetails.partOfSpeech}</span>
        )}
        {wordDetails.pronunciation && (
          <span className="word-tag-pron">/{wordDetails.pronunciation}/</span>
        )}
      </div>

      {wordDetails.meaning && (
        <div className="word-meaning-text">
          <strong>Meaning: </strong> {wordDetails.meaning}
        </div>
      )}

      {wordDetails.example && (
        <div className="word-example-box">
          <Sparkles size={14} style={{ display: 'inline', marginRight: '6px', color: '#818cf8' }} />
          <strong>Example:</strong> "{wordDetails.example}"
        </div>
      )}
    </div>
  );
};

export default WordDetails;
