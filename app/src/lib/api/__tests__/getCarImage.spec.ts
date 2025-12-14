import { describe, it, expect } from 'vitest';
import { getCarImage } from '../cars';

// Simple utility to determine if a string is a data URI
function isDataUri(str: string) {
  return /^data:image\/(jpeg|png|gif|webp);base64,/.test(str);
}

describe('getCarImage', () => {
  it('returns empty string when input is falsy', () => {
    expect(getCarImage(undefined)).toBe('');
    expect(getCarImage('')).toBe('');
  });

  it('leaves http/https URLs unchanged', () => {
    const url = 'https://example.com/image.jpg';
    expect(getCarImage(url)).toBe(url);
  });

  it('leaves existing data URIs unchanged', () => {
    const data = 'data:image/jpeg;base64,ABCDEF';
    expect(getCarImage(data)).toBe(data);
  });

  it('prefixes raw base64 (jpeg) data when missing', () => {
    const raw = 'ABCDEF123456+==';
    const result = getCarImage(raw);
    expect(isDataUri(result)).toBe(true);
    expect(result.endsWith(raw)).toBe(true);
  });

  it('does not double-prefix already prefixed base64', () => {
    const prefixed = 'data:image/jpeg;base64,AAA111';
    expect(getCarImage(prefixed)).toBe(prefixed);
  });

  it('handles png base64 already prefixed without change', () => {
    const pngPrefixed = 'data:image/png;base64,BBBB';
    expect(getCarImage(pngPrefixed)).toBe(pngPrefixed);
  });
});
