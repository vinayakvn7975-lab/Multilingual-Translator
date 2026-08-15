import React from 'react';
import { Languages, History, Star, Sparkles } from 'lucide-react';

const Header = ({ activeTab, setActiveTab, historyCount = 0, favoritesCount = 0 }) => {
  return (
    <header className="navbar">
      <div className="nav-content">
        <a href="#translator" className="brand-logo" onClick={() => setActiveTab('translator')}>
          <div className="logo-icon-wrapper">
            <Languages size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Bhasha<span style={{ color: '#818cf8' }}>AI</span>
            </span>
          </div>
          <span className="brand-badge">
            <Sparkles size={10} style={{ marginRight: '3px' }} /> Mixed AI 2.0
          </span>
        </a>

        <nav className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'translator' ? 'active' : ''}`}
            onClick={() => setActiveTab('translator')}
          >
            <Languages size={18} />
            <span>Translator</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={18} />
            <span>History</span>
            {historyCount > 0 && <span className="tab-badge">{historyCount}</span>}
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Star size={18} />
            <span>Favorites</span>
            {favoritesCount > 0 && <span className="tab-badge">{favoritesCount}</span>}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
