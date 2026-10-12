export function getApiBaseUrl(hostname, configuredBaseUrl = import.meta.env?.VITE_API_BASE_URL) {
  if (configuredBaseUrl) return configuredBaseUrl.replace(/\/$/, '');
  const host = String(hostname || (typeof window !== 'undefined' ? window.location.hostname : 'localhost')).toLowerCase();
  const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.startsWith('192.168.') || host.startsWith('10.') || host.startsWith('172.');

  if (isLocalHost) return 'http://localhost:5000';
  throw new Error('VITE_API_BASE_URL must point to this project\'s backend outside local development.');
}

const API_BASE_URL = getApiBaseUrl();
export const API = `${API_BASE_URL}/api`;
export default API_BASE_URL;
