import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TranslatorCard from './components/TranslatorCard';
import HistoryList from './components/HistoryList';
import FavoritesList from './components/FavoritesList';
import Toast from './components/Toast';
import {
  translateTextApi,
  getHistoryApi,
  deleteHistoryItemApi,
  clearHistoryApi,
  toggleFavoriteApi,
  getFavoritesApi,
  removeFavoriteApi,
} from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('translator');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState(null);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch initial history & favorites from API
  useEffect(() => {
    fetchHistory();
    fetchFavorites();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getHistoryApi();
      if (res.success) {
        setHistory(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await getFavoritesApi();
      if (res.success) {
        setFavorites(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  };

  // Main Translate handler
  const handleTranslate = async (text, targetLanguage) => {
    setIsLoading(true);
    try {
      const res = await translateTextApi(text, targetLanguage);
      if (res.success && res.data) {
        setCurrentTranslation(res.data);
        fetchHistory(); // Refresh history list
      }
    } catch (err) {
      showToast(err.message || 'Translation failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = async (item) => {
    if (!item) return;
    try {
      const res = await toggleFavoriteApi({
        id: item._id,
        originalText: item.originalText,
        detectedLanguage: item.detectedLanguage,
        targetLanguage: item.targetLanguage,
        translatedText: item.translatedText,
        isSingleWord: item.isSingleWord,
        wordDetails: item.wordDetails,
      });

      if (res.success) {
        const isFavNow = res.data.isFavorite;
        setCurrentTranslation((prev) =>
          prev && prev._id === item._id ? { ...prev, isFavorite: isFavNow } : prev
        );
        showToast(res.message || (isFavNow ? 'Saved to favorites!' : 'Removed from favorites!'));
        fetchFavorites();
        fetchHistory();
      }
    } catch (err) {
      showToast('Could not update favorite status.', 'error');
    }
  };

  // Delete Single History Item
  const handleDeleteHistoryItem = async (id) => {
    try {
      await deleteHistoryItemApi(id);
      showToast('Item deleted from history.');
      fetchHistory();
    } catch (err) {
      showToast('Failed to delete history item.', 'error');
    }
  };

  // Clear All History
  const handleClearAllHistory = async () => {
    try {
      await clearHistoryApi();
      showToast('All translation history cleared.');
      fetchHistory();
    } catch (err) {
      showToast('Failed to clear history.', 'error');
    }
  };

  // Remove Favorite
  const handleRemoveFavorite = async (id) => {
    try {
      await removeFavoriteApi(id);
      showToast('Removed from favorites.');
      fetchFavorites();
      fetchHistory();
      if (currentTranslation?._id === id) {
        setCurrentTranslation((prev) => (prev ? { ...prev, isFavorite: false } : prev));
      }
    } catch (err) {
      showToast('Failed to remove favorite.', 'error');
    }
  };

  return (
    <div className="app-wrapper">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
        favoritesCount={favorites.length}
      />

      <main className="main-container">
        {activeTab === 'translator' && (
          <>
            <section className="hero-section">
              <h1 className="hero-title">Multilingual Translator Major Project</h1>
              <p className="hero-subtitle">
                Seamlessly translate mixed English, Kannada, and code-switched Kanglish text naturally.
              </p>
            </section>

            <TranslatorCard
              onTranslate={handleTranslate}
              isLoading={isLoading}
              currentTranslation={currentTranslation}
              onToggleFavorite={handleToggleFavorite}
              showToast={showToast}
            />
          </>
        )}

        {activeTab === 'history' && (
          <HistoryList
            history={history}
            onDeleteItem={handleDeleteHistoryItem}
            onClearAll={handleClearAllHistory}
            onToggleFavorite={handleToggleFavorite}
            showToast={showToast}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesList
            favorites={favorites}
            onRemoveFavorite={handleRemoveFavorite}
            showToast={showToast}
          />
        )}
      </main>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
