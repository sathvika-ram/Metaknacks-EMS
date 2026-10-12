export function getApiBaseUrl(hostname, configuredBaseUrl = import.meta.env?.VITE_API_BASE_URL) {
  if (configuredBaseUrl?.trim()) return configuredBaseUrl.trim().replace(/\/$/, '');
  const host = String(hostname || (typeof window !== 'undefined' ? window.location.hostname : 'localhost')).toLowerCase();
  const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.startsWith('192.168.') || host.startsWith('10.') || host.startsWith('172.');

  if (isLocalHost) return 'http://localhost:5000';
  return '';
}

const API_BASE_URL = getApiBaseUrl();
export const API_CONFIGURED = Boolean(API_BASE_URL);
export const API = API_CONFIGURED ? `${API_BASE_URL}/api` : '';
export default API_BASE_URL;
