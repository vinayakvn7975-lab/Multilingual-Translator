import React, { useState } from 'react';
import { History as HistoryIcon, Trash2, Copy, Star, Search, ArrowRight, Check } from 'lucide-react';

const HistoryList = ({ history, onDeleteItem, onClearAll, onToggleFavorite, showToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const filteredHistory = history.filter((item) => {
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

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="view-card">
      <div className="view-header">
        <div className="view-title">
          <HistoryIcon size={24} style={{ color: '#818cf8' }} />
          <span>Translation History</span>
        </div>

        {history.length > 0 && (
          <button className="clear-all-btn" onClick={onClearAll}>
            <Trash2 size={16} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {history.length > 0 && (
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
            placeholder="Search translation history..."
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

      {filteredHistory.length === 0 ? (
        <div className="empty-state-box">
          <HistoryIcon className="empty-icon" />
          <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>No history items found</p>
          <p style={{ fontSize: '0.9rem' }}>
            {history.length === 0
              ? 'Translations you perform will automatically appear here.'
              : 'No items match your search query.'}
          </p>
        </div>
      ) : (
        <div className="history-grid">
          {filteredHistory.map((item) => (
            <div key={item._id} className="history-item-card">
              <div className="history-item-top">
                <div className="history-meta">
                  <span className="history-lang-badge">
                    {item.detectedLanguage || 'Auto Detect'} → {item.targetLanguage}
                  </span>
                  <span className="history-date">{formatDate(item.createdAt)}</span>
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
                    className={`icon-btn ${item.isFavorite ? 'active-favorite' : ''}`}
                    onClick={() => onToggleFavorite(item)}
                    title={item.isFavorite ? 'Remove Favorite' : 'Save Favorite'}
                  >
                    <Star
                      size={16}
                      fill={item.isFavorite ? '#f59e0b' : 'none'}
                    />
                  </button>

                  <button
                    className="icon-btn"
                    onClick={() => onDeleteItem(item._id)}
                    title="Delete item"
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

export default HistoryList;
