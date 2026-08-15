import React, { useState, useEffect } from 'react';
import {
  ArrowRightLeft,
  Copy,
  Volume2,
  Mic,
  MicOff,
  Star,
  X,
  Sparkles,
  RefreshCw,
  Check,
} from 'lucide-react';
import WordDetails from './WordDetails';

const SAMPLE_PHRASES = [
  { text: 'ನಾನು today college ಹೋಗಿದ್ದೆ', target: 'English' },
  { text: 'today ನಾನು market ಗೆ ಹೋಗಿದ್ದೆ', target: 'Kannada' },
  { text: 'nanu college ge hogidde', target: 'English' },
  { text: 'Where are you ಹೋಗುತ್ತಿದ್ದೀಯ?', target: 'Kannada' },
  { text: 'laptop', target: 'Kannada' },
];

const TranslatorCard = ({
  onTranslate,
  isLoading,
  currentTranslation,
  onToggleFavorite,
  showToast,
}) => {
  const [inputText, setInputText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [detectedLang, setDetectedLang] = useState('Auto Detect');
  const [isCopied, setIsCopied] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);

  // Initialize Web Speech API for voice input if supported
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = targetLanguage === 'Kannada' ? 'kn-IN' : 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        showToast('Speech recognition error. Please try again.', 'error');
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setSpeechRecognition(recognition);
    }
  }, [targetLanguage, showToast]);

  // Update detected language tag if available from result
  useEffect(() => {
    if (currentTranslation?.detectedLanguage) {
      setDetectedLang(currentTranslation.detectedLanguage);
    } else {
      setDetectedLang('Auto Detect');
    }
  }, [currentTranslation]);

  // Handle Translate Button Click
  const handleTranslateClick = () => {
    if (!inputText || !inputText.trim()) {
      showToast('Please enter some text to translate.', 'error');
      return;
    }
    onTranslate(inputText.trim(), targetLanguage);
  };

  // Quick Sample Click
  const handleSampleClick = (sample) => {
    setInputText(sample.text);
    setTargetLanguage(sample.target);
    onTranslate(sample.text, sample.target);
  };

  // Language Swap Toggle
  const handleLanguageSwap = () => {
    const newTarget = targetLanguage === 'English' ? 'Kannada' : 'English';
    setTargetLanguage(newTarget);
    if (currentTranslation?.translatedText) {
      setInputText(currentTranslation.translatedText);
    }
  };

  // Copy Translation to Clipboard
  const handleCopy = () => {
    if (!currentTranslation?.translatedText) return;
    navigator.clipboard.writeText(currentTranslation.translatedText);
    setIsCopied(true);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Text-To-Speech (SpeechSynthesis)
  const handleListen = () => {
    if (!currentTranslation?.translatedText) return;

    if (!('speechSynthesis' in window)) {
      showToast('Text-to-speech is not supported in this browser.', 'error');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentTranslation.translatedText);
    utterance.rate = 0.95;

    // Pick appropriate voice language
    const voices = window.speechSynthesis.getVoices();
    const isKannada = targetLanguage === 'Kannada';
    
    const matchedVoice = voices.find((v) =>
      isKannada ? v.lang.includes('kn') || v.lang.includes('hi') : v.lang.includes('en')
    );

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    utterance.lang = isKannada ? 'kn-IN' : 'en-US';

    window.speechSynthesis.speak(utterance);
    showToast(`Speaking in ${targetLanguage}...`, 'success');
  };

  // Speech-to-Text Microphone Toggle
  const toggleSpeechRecognition = () => {
    if (!speechRecognition) {
      showToast('Speech recognition is not supported in your browser.', 'error');
      return;
    }

    if (isRecording) {
      speechRecognition.stop();
      setIsRecording(false);
    } else {
      speechRecognition.start();
      setIsRecording(true);
      showToast('Listening... Speak now into your microphone.', 'success');
    }
  };

  // Clear Input and Output
  const handleClear = () => {
    setInputText('');
  };

  return (
    <div className="translator-card-glass" id="translator">
      {/* Top Header: Source Language & Target Language Selector */}
      <div className="lang-selector-bar">
        <div className="lang-indicator">
          <span>Source:</span>
          <strong>Auto Detect</strong>
          {detectedLang && detectedLang !== 'Auto Detect' && (
            <span className="detected-tag">
              <Sparkles size={12} /> {detectedLang}
            </span>
          )}
        </div>

        <button
          className="swap-btn"
          onClick={handleLanguageSwap}
          title="Swap target language"
        >
          <ArrowRightLeft size={18} />
        </button>

        <div className="target-select-wrapper">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
            Target:
          </span>
          <select
            className="target-select"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
          </select>
        </div>
      </div>

      {/* Main Dual Box Grid */}
      <div className="translator-grid">
        {/* Left / Top: Text Input Box */}
        <div className="input-box-card">
          <textarea
            className="translator-textarea"
            placeholder="Enter text, sentence or paragraph... (e.g. 'ನಾನು today college ಹೋಗಿದ್ದೆ', 'nanu college ge hogidde', or single word like 'laptop')"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            maxLength={2000}
          />

          {/* Input Action Bar */}
          <div className="box-action-bar">
            <div className="box-action-group">
              <button
                className={`icon-btn ${isRecording ? 'recording' : ''}`}
                onClick={toggleSpeechRecognition}
                title={isRecording ? 'Stop Speech Input' : 'Start Speech Input'}
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              {inputText && (
                <button
                  className="icon-btn"
                  onClick={handleClear}
                  title="Clear text"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <span className="char-counter">{inputText.length} / 2000</span>
          </div>

          {/* Quick Test Sample Chips */}
          <div className="sample-chips-bar">
            <span className="sample-chip-title">Try sample:</span>
            {SAMPLE_PHRASES.map((sample, idx) => (
              <button
                key={idx}
                className="sample-chip"
                onClick={() => handleSampleClick(sample)}
              >
                {sample.text}
              </button>
            ))}
          </div>
        </div>

        {/* Right / Bottom: Output Box */}
        <div className="output-box-card">
          {isLoading ? (
            <div className="loading-overlay">
              <div className="shimmer-spinner"></div>
              <span>Understanding context and translating...</span>
            </div>
          ) : currentTranslation?.translatedText ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div className="output-text-area">
                {currentTranslation.translatedText}
              </div>

              {/* Output Actions Toolbar */}
              <div className="box-action-bar">
                <div className="box-action-group">
                  <button
                    className="icon-btn"
                    onClick={handleCopy}
                    title="Copy Translation"
                  >
                    {isCopied ? <Check size={18} style={{ color: '#10b981' }} /> : <Copy size={18} />}
                  </button>

                  <button
                    className="icon-btn"
                    onClick={handleListen}
                    title="Listen aloud (Text-to-speech)"
                  >
                    <Volume2 size={18} />
                  </button>

                  <button
                    className={`icon-btn ${currentTranslation.isFavorite ? 'active-favorite' : ''}`}
                    onClick={() => onToggleFavorite(currentTranslation)}
                    title={currentTranslation.isFavorite ? 'Remove Favorite' : 'Save to Favorites'}
                  >
                    <Star
                      size={18}
                      fill={currentTranslation.isFavorite ? '#f59e0b' : 'none'}
                    />
                  </button>
                </div>

                <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
                  Translated into {targetLanguage}
                </span>
              </div>
            </div>
          ) : (
            <div className="output-text-area output-placeholder">
              Translation will appear here...
            </div>
          )}
        </div>
      </div>

      {/* Main Prominent Button at Bottom of Input/Output area */}
      <div className="main-translate-btn-wrapper">
        <button
          className="main-translate-btn"
          onClick={handleTranslateClick}
          disabled={isLoading || !inputText.trim()}
        >
          {isLoading ? (
            <>
              <RefreshCw size={20} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
              Translating...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Translate
            </>
          )}
        </button>
      </div>

      {/* Render Single Word Insights if available */}
      {currentTranslation?.isSingleWord && (
        <WordDetails wordDetails={currentTranslation.wordDetails} />
      )}
    </div>
  );
};

export default TranslatorCard;
