import { describe, expect, it } from 'vitest';

import { resolveBasePath, resolveEndpoints } from './runtime-config';

describe('resolveBasePath', () => {
  it('returns the ingress prefix when already a directory', () => {
    expect(resolveBasePath({ pathname: '/api/hassio_ingress/tok/' })).toBe('/api/hassio_ingress/tok/');
  });

  it('strips a deep session path segment', () => {
    expect(resolveBasePath({ pathname: '/api/hassio_ingress/tok/3f2a-uuid' })).toBe('/api/hassio_ingress/tok/');
  });

  it('strips a trailing file segment', () => {
    expect(resolveBasePath({ pathname: '/api/hassio_ingress/tok/index.html' })).toBe('/api/hassio_ingress/tok/');
  });

  it('returns root for the dev server root', () => {
    expect(resolveBasePath({ pathname: '/' })).toBe('/');
  });

  it('falls back to root for non-ingress paths', () => {
    expect(resolveBasePath({ pathname: '/some/dev/path' })).toBe('/');
  });
});

describe('resolveEndpoints', () => {
  it('derives api and status urls under an ingress prefix', () => {
    const ep = resolveEndpoints({
      origin: 'http://homeassistant.local:8123',
      pathname: '/api/hassio_ingress/abc123token/',
    });
    expect(ep.apiUrl).toBe('http://homeassistant.local:8123/api/hassio_ingress/abc123token/api');
    expect(ep.haStatusUrl).toBe('http://homeassistant.local:8123/api/hassio_ingress/abc123token/ha/status');
    expect(ep.changelogUrl).toBe('http://homeassistant.local:8123/api/hassio_ingress/abc123token/ha/changelog');
    expect(ep.assistantId).toBe('agent');
  });

  it('works at the dev server root', () => {
    const ep = resolveEndpoints({
      origin: 'http://localhost:5173',
      pathname: '/',
    });
    expect(ep.apiUrl).toBe('http://localhost:5173/api');
    expect(ep.haStatusUrl).toBe('http://localhost:5173/ha/status');
  });

  it('strips a trailing file segment when present', () => {
    const ep = resolveEndpoints({
      origin: 'http://h',
      pathname: '/api/hassio_ingress/tok/index.html',
    });
    expect(ep.apiUrl).toBe('http://h/api/hassio_ingress/tok/api');
  });

  it('resolves under the base dir on a deep session path', () => {
    const ep = resolveEndpoints({
      origin: 'http://h:8123',
      pathname: '/api/hassio_ingress/tok/3f2a-uuid',
    });
    expect(ep.apiUrl.endsWith('/api/hassio_ingress/tok/api')).toBe(true);
    expect(ep.haStatusUrl.endsWith('/api/hassio_ingress/tok/ha/status')).toBe(true);
  });
});
