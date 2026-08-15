import React, { useState } from 'react';
import { Star, Trash2, Copy, Volume2, Search, ArrowRight, Check } from 'lucide-react';

const FavoritesList = ({ favorites, onRemoveFavorite, showToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const filteredFavorites = favorites.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.originalText?.toLowerCase().includes(term) ||
      item.translatedText?.toLowerCase().includes(term) ||
      item.detectedLanguage?.toLowerCase().includes(term)
    );
  });

  const handleCopy = (item) => {
    navigator.clipboard.writeText(item.translatedText);
    setCopiedId(item._id);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleListen = (item) => {
    if (!('speechSynthesis' in window)) {
      showToast('Text-to-speech is not supported in this browser.', 'error');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(item.translatedText);
    utterance.lang = item.targetLanguage === 'Kannada' ? 'kn-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
    showToast(`Speaking in ${item.targetLanguage}...`, 'success');
  };

  return (
    <div className="view-card">
      <div className="view-header">
        <div className="view-title">
          <Star size={24} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
          <span>Saved Favorites</span>
        </div>
      </div>

      {favorites.length > 0 && (
        <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-subtle)',
            }}
          />
          <input
            type="text"
            placeholder="Search saved favorites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.4rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(13, 18, 30, 0.7)',
              border: '1px solid var(--bg-card-border)',
              color: 'var(--text-main)',
              outline: 'none',
              fontSize: '0.9rem',
            }}
          />
        </div>
      )}

      {filteredFavorites.length === 0 ? (
        <div className="empty-state-box">
          <Star className="empty-icon" style={{ color: '#f59e0b' }} />
          <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>No favorites saved yet</p>
          <p style={{ fontSize: '0.9rem' }}>
            {favorites.length === 0
              ? 'Click the star icon on any translation to save it to your favorites.'
              : 'No favorites match your search query.'}
          </p>
        </div>
      ) : (
        <div className="history-grid">
          {filteredFavorites.map((item) => (
            <div key={item._id} className="history-item-card" style={{ borderColor: 'rgba(245, 158, 11, 0.25)' }}>
              <div className="history-item-top">
                <div className="history-meta">
                  <span className="history-lang-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                    {item.detectedLanguage || 'Auto Detect'} → {item.targetLanguage}
                  </span>
                </div>

                <div className="box-action-group">
                  <button
                    className="icon-btn"
                    onClick={() => handleCopy(item)}
                    title="Copy Translation"
                  >
                    {copiedId === item._id ? (
                      <Check size={16} style={{ color: '#10b981' }} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>

                  <button
                    className="icon-btn"
                    onClick={() => handleListen(item)}
                    title="Listen Aloud"
                  >
                    <Volume2 size={16} />
                  </button>

                  <button
                    className="icon-btn active-favorite"
                    onClick={() => onRemoveFavorite(item._id)}
                    title="Remove from favorites"
                  >
                    <Trash2 size={16} style={{ color: '#f43f5e' }} />
                  </button>
                </div>
              </div>

              <div className="history-text-flow">
                <div className="history-original">{item.originalText}</div>
                <ArrowRight size={16} className="history-arrow" />
                <div className="history-translated">{item.translatedText}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
