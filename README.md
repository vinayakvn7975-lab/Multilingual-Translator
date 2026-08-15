# 🌐 BhashaAI - Multilingual AI Translator (MERN Stack)

A complete, modern, responsive **AI-powered Multilingual Translator Web Application** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with Google Gemini AI integration.

Specialized in **Mixed-Language Translation (Code-Switching)** between **English and Kannada**, as well as transliterated Kanglish in Roman script (e.g., *"nanu college ge hogidde"*, *"ನಾನು today college ಹೋಗಿದ್ದೆ"*).

---

## ✨ Features & Highlights

- 🔀 **Mixed-Language Translation (Code-Switching & Kanglish)**:
  - Intelligently understands sentences containing mixed English and Kannada words.
  - Translates the complete contextual meaning naturally into **English** or **Kannada** without awkward word-by-word replacements.
- 📖 **Single Word Dictionary Mode**:
  - Provides rich dictionary breakdown for single word inputs: word meaning, part of speech, phonetic pronunciation, and sample sentence.
- 📜 **Translation History**:
  - Automatically records all successful translations into **MongoDB** (with in-memory fallback if MongoDB is offline).
  - Search, copy, filter, and delete single history items or clear all history.
- ⭐ **Favorites / Saved Translations**:
  - Save important translations with one click. Dedicated Favorites management page.
- 🎙️ **Voice Input & Text-to-Speech (TTS)**:
  - Speech-to-text microphone button powered by the Web Speech API.
  - Listen button to read translated text aloud in English or Kannada voices.
- 💎 **Premium Modern UI**:
  - Dark mode glassmorphism UI with smooth animations, custom micro-interactions, responsive design for desktop, tablet, and mobile.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), Lucide Icons, Modern CSS Design System (Glassmorphic dark theme)
- **Backend**: Node.js, Express.js, CORS, Dotenv
- **Database**: MongoDB with Mongoose (with zero-crash memory store fallback)
- **AI Integration**: Google Gemini AI (`@google/generative-ai`) + Built-in Smart NLP Engine Fallback
- **APIs**: RESTful API endpoints

---

## 📁 Project Architecture & Folder Structure

```
D:\Translator\
├── server/                    # Node.js + Express Backend
│   ├── config/
│   │   └── db.js              # MongoDB Connection Configuration
│   ├── models/
│   │   └── Translation.js     # Mongoose Translation & History Schema
│   ├── services/
│   │   └── translationService.js # Gemini AI & Smart NLP Mixed Engine
│   ├── controllers/
│   │   ├── translationController.js
│   │   ├── historyController.js
│   │   └── favoriteController.js
│   ├── routes/
│   │   ├── translationRoutes.js
│   │   ├── historyRoutes.js
│   │   └── favoriteRoutes.js
│   ├── middleware/
│   │   └── errorHandler.js    # Centralized User-Friendly Error Handler
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── server.js              # Express App Entry Point
│
├── client/                    # React.js Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx      # Navigation Bar with Tab Indicators
│   │   │   ├── TranslatorCard.jsx # Main Translator Interface
│   │   │   ├── WordDetails.jsx # Single Word Dictionary Insights
│   │   │   ├── HistoryList.jsx # History Page Component
│   │   │   ├── FavoritesList.jsx # Favorites Page Component
│   │   │   └── Toast.jsx       # Floating Notification Toasts
│   │   ├── services/
│   │   │   └── api.js         # Axios API Communication Client
│   │   ├── styles/
│   │   │   └── index.css      # CSS Tokens, Animations & Glassmorphism
│   │   ├── App.jsx            # Main React App Container
│   │   └── main.jsx           # React Entry Point
│   ├── .env.example
│   ├── .env
│   ├── index.html
│   └── package.json
│
├── package.json               # Root package manager
└── README.md                  # Project Documentation
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/translate` | Translate text & save to history |
| **GET** | `/api/history` | Fetch translation history |
| **DELETE** | `/api/history/:id` | Delete a single history item |
| **DELETE** | `/api/history` | Clear all history items |
| **POST** | `/api/favorites` | Toggle / Save favorite translation |
| **GET** | `/api/favorites` | Fetch all saved favorites |
| **DELETE** | `/api/favorites/:id` | Remove from favorites |

---

## 🚀 Quick Start Guide

### 1. Prerequisites

Make sure you have installed:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB** (Optional): Local MongoDB Community Server running on `mongodb://127.0.0.1:27017` (If MongoDB is not running, the app automatically runs in a resilient hybrid/in-memory mode so it never crashes!).

---

### 2. Installation

From the project root directory (`D:\Translator`):

```bash
# Option A: Install all dependencies at root
npm run install:all

# Option B: Manual Installation
cd server
npm install

cd ../client
npm install --legacy-peer-deps
```

---

### 3. Environment Setup

#### Server `.env` (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_translator
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```
*(Note: If `GEMINI_API_KEY` is omitted, the backend automatically operates using its built-in Smart NLP Engine for offline mixed English-Kannada translation).*

#### Client `.env` (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 4. Running the Application

Open **two terminal windows**:

#### Terminal 1: Start Backend Server
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

#### Terminal 2: Start Frontend Client
```bash
cd client
npm run dev
# Frontend starts on http://localhost:5173
```

---

## 🧪 Testing Translation Examples

Try entering these mixed-language inputs into the translator:

| Input Text | Target Language | Expected Output |
| :--- | :--- | :--- |
| `"ನಾನು today college ಹೋಗಿದ್ದೆ"` | **English** | `"I went to college today."` |
| `"ನಾನು today college ಹೋಗಿದ್ದೆ"` | **Kannada** | `"ನಾನು ಇಂದು ಕಾಲೇಜಿಗೆ ಹೋಗಿದ್ದೆ."` |
| `"today ನಾನು market ಗೆ ಹೋಗಿದ್ದೆ"` | **English** | `"I went to the market today."` |
| `"nanu college ge hogidde"` | **English** | `"I went to college."` |
| `"Where are you ಹೋಗುತ್ತಿದ್ದೀಯ?"` | **Kannada** | `"ನೀನು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀಯ?"` |
| `"laptop"` | **Kannada** | `"ಲ್ಯಾಪ್ಟಾಪ್"` *(with single word definition & example)* |

---

## 📄 License

This project is open-source and free for educational and production use.
