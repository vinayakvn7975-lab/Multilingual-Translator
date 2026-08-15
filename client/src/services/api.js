import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/**
 * Translate text via backend API
 */
export const translateTextApi = async (text, targetLanguage) => {
  try {
    const response = await api.post('/translate', {
      text,
      targetLanguage,
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      'Translation service is temporarily unavailable. Please check your connection.';
    throw new Error(message);
  }
};

/**
 * Get translation history
 */
export const getHistoryApi = async () => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    return { success: false, data: [] };
  }
};

/**
 * Delete a single history item
 */
export const deleteHistoryItemApi = async (id) => {
  try {
    const response = await api.delete(`/history/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting history item:', error);
    throw error;
  }
};

/**
 * Clear all translation history
 */
export const clearHistoryApi = async () => {
  try {
    const response = await api.delete('/history');
    return response.data;
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
};

/**
 * Save / Toggle Favorite translation
 */
export const toggleFavoriteApi = async (favoriteData) => {
  try {
    const response = await api.post('/favorites', favoriteData);
    return response.data;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

/**
 * Get all favorite translations
 */
export const getFavoritesApi = async () => {
  try {
    const response = await api.get('/favorites');
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return { success: false, data: [] };
  }
};

/**
 * Remove item from favorites
 */
export const removeFavoriteApi = async (id) => {
  try {
    const response = await api.delete(`/favorites/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};
