import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  BANNER_TAGLINE,
  BANNER_TEXT,
  getBanner,
  printBanner,
} from '../src/lib/banner.js';

describe('spellbookx (banner)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders an ASCII-art wordmark, tagline, wizard emoji, and version', () => {
    const banner = getBanner('0.11.1');

    expect(banner).toContain('🧙');
    expect(banner).toContain(BANNER_TAGLINE);
    expect(banner).toContain('v0.11.1');
    // figlet renders the wordmark as multi-line ASCII art.
    expect(banner).not.toContain(BANNER_TEXT);
    expect(banner.split('\n').length).toBeGreaterThan(5);
  });

  it('defaults to the package.json version when no version is passed', () => {
    const banner = getBanner();

    expect(banner).toMatch(/v\d+\.\d+\.\d+/);
  });

  it('prints the formatted banner to console.log', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    printBanner('1.2.3');

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy.mock.calls[0]?.[0]).toContain('v1.2.3');
  });
});
