import { API_BASE_URL } from '../lib/apiConfig';

export interface IntegrationStatus {
  mode: 'demo' | 'live';
  payment: { razorpay: boolean; phonepe: boolean; live: boolean; demo: boolean };
  zoom: { configured: boolean; demo: boolean };
  recording: { configured: boolean; demo: boolean };
}

export const getIntegrationStatus = async (): Promise<IntegrationStatus> => {
  const res = await fetch(`${API_BASE_URL}/integrations/status`);
  if (!res.ok) throw new Error('Failed to load integration status');
  const data = await res.json();
  return data.integrations;
};
