import test from 'node:test';
import assert from 'node:assert/strict';
import { getApiBaseUrl } from './api.js';

test('uses the local backend for local hostnames', () => {
  assert.equal(getApiBaseUrl('localhost'), 'http://localhost:5000');
  assert.equal(getApiBaseUrl('127.0.0.1'), 'http://localhost:5000');
  assert.equal(getApiBaseUrl('::1'), 'http://localhost:5000');
});

test('uses the configured backend for remote hostnames', () => {
  assert.equal(getApiBaseUrl('example.com', 'https://api.example.com/'), 'https://api.example.com');
});

test('does not fall back to a different deployment for remote hostnames', () => {
  assert.throws(() => getApiBaseUrl('example.com'), /VITE_API_BASE_URL/);
});
