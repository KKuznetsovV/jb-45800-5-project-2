import { useEffect, useState } from 'react';
import {
  getStoredApiKey,
  getStoredProvider,
  getStoredModel,
  saveApiSettings,
  GEMINI_MODELS,
  OPENAI_MODELS,
} from '../../../services/aiService';
import './ApiKeyModal.css';

interface Props {
  onClose: () => void;
}

export default function ApiKeyModal({ onClose }: Props) {
  const [key, setKey] = useState(getStoredApiKey() ?? '');
  const [provider, setProvider] = useState<'gemini' | 'openai'>(
    getStoredProvider()
  );
  const modelList = provider === 'gemini' ? GEMINI_MODELS : OPENAI_MODELS;
  const [model, setModel] = useState<string>(
    getStoredModel() ?? modelList[0].value
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleProviderChange = (next: 'gemini' | 'openai') => {
    setProvider(next);
    const list = next === 'gemini' ? GEMINI_MODELS : OPENAI_MODELS;
    setModel(list[0].value);
  };

  const handleSave = () => {
    if (key.trim()) {
      saveApiSettings(key.trim(), provider, model);
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="api-key-modal">
        <div className="api-key-modal__header">
          <h2 className="api-key-modal__title">🔑 AI API Settings</h2>
          <p className="api-key-modal__subtitle">
            Enter your API key to unlock AI-powered investment recommendations.
            Your key is stored locally and never sent to our servers.
            <br /><br />
            Free Google Gemini API keys available at{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
              aistudio.google.com
            </a>
          </p>
        </div>

        <div className="api-key-modal__form">
          <div className="api-key-modal__field">
            <label htmlFor="ai-provider">Provider</label>
            <select
              id="ai-provider"
              value={provider}
              onChange={(e) => handleProviderChange(e.target.value as 'gemini' | 'openai')}
            >
              <option value="gemini">Google Gemini (Free tier available)</option>
              <option value="openai">OpenAI ChatGPT</option>
            </select>
          </div>

          <div className="api-key-modal__field">
            <label htmlFor="ai-model">Model</label>
            <select
              id="ai-model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              {(provider === 'gemini' ? GEMINI_MODELS : OPENAI_MODELS).map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="api-key-modal__field">
            <label htmlFor="api-key-input">API Key</label>
            <input
              id="api-key-input"
              type="password"
              autoComplete="off"
              placeholder={
                provider === 'gemini'
                  ? 'AIza…'
                  : 'sk-…'
              }
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>

          <div className="api-key-modal__actions">
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!key.trim()}
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
