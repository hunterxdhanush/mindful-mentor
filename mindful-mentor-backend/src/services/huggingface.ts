import { env } from '../config/env.js';
import { fetch, RequestInit } from 'undici';

const HF_BASE = 'https://api-inference.huggingface.co/models';

async function hfPost<T = any>(model: string, payload: any, extra?: RequestInit): Promise<T> {
  const res = await fetch(`${HF_BASE}/${encodeURIComponent(model)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    ...extra,
  } as RequestInit);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HF API ${model} ${res.status}: ${text}`);
    }
  return res.json() as Promise<T>;
}

// Returns a single vector (number[]). If the model returns nested arrays, average-pool.
export async function hfEmbed(text: string): Promise<number[]> {
  const out = await hfPost<any>(env.HF_EMBEDDING_MODEL, { inputs: text });
  // sentence-transformers models typically return number[]
  if (Array.isArray(out) && typeof out[0] === 'number') return out as number[];
  // Some models return number[][] (per token) – average-pool them
  if (Array.isArray(out) && Array.isArray(out[0])) {
    const tokens: number[][] = out as number[][];
    const dim = tokens[0].length;
    const sum = new Array(dim).fill(0);
    for (const vec of tokens) {
      for (let i = 0; i < dim; i++) sum[i] += vec[i];
    }
    return sum.map((v) => v / tokens.length);
  }
  throw new Error('Unexpected embeddings output from Hugging Face');
}

export async function hfSentiment(text: string): Promise<{ label: string; confidence?: number }> {
  const out = await hfPost<any>(env.HF_SENTIMENT_MODEL, { inputs: text });
  // Usually returns: [[{label: 'POSITIVE', score: 0.99}, {label:'NEGATIVE', score:0.01}]] or [{...}]
  const arr = Array.isArray(out) ? out : [];
  const first = Array.isArray(arr[0]) ? arr[0][0] : arr[0];
  if (first && typeof first.label === 'string') {
    const label = String(first.label).toLowerCase();
    return { label, confidence: typeof first.score === 'number' ? first.score : undefined };
  }
  return { label: 'neutral' };
}
