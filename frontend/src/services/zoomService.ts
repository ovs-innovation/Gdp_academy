import { API_BASE_URL } from '../lib/apiConfig';

export interface LiveZoomSession {
  id: string;
  title: string;
  date: string;
  time?: string;
  coach?: string;
  joinUrl?: string;
  mode?: 'manual' | 'demo' | 'live' | 'pending';
  price?: number;
}

export const fetchLiveZoomSessions = async (): Promise<LiveZoomSession[]> => {
  const res = await fetch(`${API_BASE_URL}/zoom/sessions`);
  if (!res.ok) throw new Error('Failed to load live sessions');
  const data = await res.json();
  return data.sessions || [];
};
