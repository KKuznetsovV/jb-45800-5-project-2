import type { CoinForAI } from '../models/CoinDetail';

export interface AIRecommendation {
  shouldBuy: boolean;
  reasoning: string;
}

export const GEMINI_MODELS: { value: string; label: string }[] = [
  { value: 'gemini-2.5-flash-preview-05-20', label: 'Gemini 2.5 Flash Preview (Latest)' },
  { value: 'gemini-2.5-pro-preview-05-06',  label: 'Gemini 2.5 Pro Preview' },
  { value: 'gemini-2.0-flash',              label: 'Gemini 2.0 Flash' },
  { value: 'gemini-2.0-flash-lite',         label: 'Gemini 2.0 Flash Lite (Fast)' },
  { value: 'gemini-1.5-flash',              label: 'Gemini 1.5 Flash' },
];

export const OPENAI_MODELS: { value: string; label: string }[] = [
  { value: 'gpt-4.1',       label: 'GPT-4.1 (Latest)' },
  { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini (Fast & Affordable)' },
  { value: 'gpt-4o',       label: 'GPT-4o' },
  { value: 'gpt-4o-mini',  label: 'GPT-4o Mini' },
  { value: 'gpt-4-turbo',  label: 'GPT-4 Turbo' },
];

const GEMINI_CANDIDATE_MODELS = [
  'gemini-2.5-flash-preview-05-20',
  'gemini-2.5-pro-preview-05-06',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
];

let _resolvedGeminiModel: string | null = null;

async function resolveGeminiModel(apiKey: string): Promise<string> {
  if (_resolvedGeminiModel) return _resolvedGeminiModel;

  for (const apiVersion of ['v1', 'v1beta']) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/${apiVersion}/models?key=${apiKey}`
    );
    if (!res.ok) continue;
    const data = (await res.json()) as {
      models: Array<{ name: string; supportedGenerationMethods?: string[] }>;
    };
    const available = new Set(
      (data.models ?? [])
        .filter((m) => (m.supportedGenerationMethods ?? []).includes('generateContent'))
        .map((m) => m.name.replace('models/', ''))
    );
    for (const candidate of GEMINI_CANDIDATE_MODELS) {
      if (available.has(candidate)) {
        _resolvedGeminiModel = `${apiVersion}::${candidate}`;
        return _resolvedGeminiModel;
      }
    }
  }
  throw new Error(
    'No supported Gemini model found for your API key. Check your key at aistudio.google.com.'
  );
}

const OPENAI_BASE_URL = 'https://api.openai.com/v1';

export const getStoredApiKey = (): string | null =>
  localStorage.getItem('ai_api_key');

export const getStoredProvider = (): 'gemini' | 'openai' => {
  const stored = localStorage.getItem('ai_provider');
  return stored === 'gemini' ? 'gemini' : 'openai';
};

export const getStoredModel = (): string | null =>
  localStorage.getItem('ai_model');

export const saveApiSettings = (key: string, provider: 'gemini' | 'openai', model?: string) => {
  localStorage.setItem('ai_api_key', key);
  localStorage.setItem('ai_provider', provider);
  if (model) {
    localStorage.setItem('ai_model', model);
  } else {
    localStorage.removeItem('ai_model');
  }
  _resolvedGeminiModel = null;
};

const buildPrompt = (coin: CoinForAI): string => `
You are a concise cryptocurrency investment analyst. Evaluate the following ${coin.name} (${coin.symbol.toUpperCase()}) market data and provide a short investment recommendation.

Data:
- Current Price: $${coin.current_price_usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
- Market Cap: $${(coin.market_cap_usd / 1e9).toFixed(2)}B
- 24h Volume: $${(coin.volume_24h_usd / 1e6).toFixed(2)}M
- 30-day Change: ${coin.price_change_percentage_30d.toFixed(2)}%
- 60-day Change: ${coin.price_change_percentage_60d.toFixed(2)}%
- 200-day Change: ${coin.price_change_percentage_200d.toFixed(2)}%

Respond in exactly this format (2-3 sentences):
VERDICT: [BUY / HOLD / SELL]
REASONING: [Your brief analysis]
`.trim();

export const getAIRecommendation = async (
  coin: CoinForAI
): Promise<AIRecommendation> => {
  const apiKey = getStoredApiKey();
  if (!apiKey) throw new Error('No API key set. Please configure it in Settings.');

  const provider = getStoredProvider();

  let content: string;

  if (provider === 'gemini') {
    const storedModel = getStoredModel();
    const resolved = storedModel
      ? `v1beta::${storedModel}`
      : await resolveGeminiModel(apiKey);
    const [apiVersion, modelName] = resolved.split('::');
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(coin) }] }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.6 },
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errorText}`);
    }
    const data = (await response.json()) as {
      candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
    };
    content = data.candidates[0].content.parts[0].text.trim();
  } else {
    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: getStoredModel() ?? OPENAI_MODELS[0].value,
        messages: [{ role: 'user', content: buildPrompt(coin) }],
        max_tokens: 300,
        temperature: 0.6,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
    }
    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    content = data.choices[0].message.content.trim();
  }

  const shouldBuy = /VERDICT:\s*BUY/i.test(content);
  return { shouldBuy, reasoning: content };
};

export const getAllAIRecommendations = async (
  coins: CoinForAI[]
): Promise<Map<string, AIRecommendation | Error>> => {
  const results = await Promise.all(
    coins.map(async (coin) => {
      try {
        const rec = await getAIRecommendation(coin);
        return { symbol: coin.symbol, result: rec };
      } catch (err) {
        return { symbol: coin.symbol, result: err as Error };
      }
    })
  );
  const map = new Map<string, AIRecommendation | Error>();
  results.forEach(({ symbol, result }) => map.set(symbol, result));
  return map;
};
