/**
 * @file banner.ts
 * ASCII-art brand banner rendered with figlet and colored with chalk.
 */

import chalk from 'chalk';
import figlet, { type FontName } from 'figlet';
import standardFont from 'figlet/importable-fonts/Standard.js';

import { COLORS, WIZARD_EMOJI } from '../constants/theme.js';
import { packageJson } from './package-json.js';

/**
 * figlet font used to render the Spellbookx wordmark.
 */
export const BANNER_FONT: FontName = 'Standard';

/**
 * Text rendered as ASCII art in the banner.
 */
export const BANNER_TEXT = 'Spellbookx';

/**
 * Tagline displayed beneath the ASCII-art wordmark.
 */
export const BANNER_TAGLINE = 'Arcane developer toolchain automation & presets';

// Register the font from its bundled definition so the banner renders without
// touching the filesystem, even when the CLI is bundled.
figlet.parseFont(BANNER_FONT, standardFont);

/**
 * Parses a `#rrggbb` hex color into its RGB channel triplet.
 *
 * @param hex - The hex color string.
 * @returns The red, green, and blue channel values.
 */
function parseHex(hex: string): [number, number, number] {
  return [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ];
}

/**
 * Formats a numeric color channel as a two-digit hex string.
 *
 * @param value - The channel value (0-255).
 * @returns The zero-padded hex representation.
 */
function toHexChannel(value: number): string {
  return value.toString(16).padStart(2, '0');
}

/**
 * Interpolates between two hex colors.
 *
 * @param from - Starting hex color (e.g. '#a855f7').
 * @param to - Ending hex color.
 * @param t - Interpolation factor between 0 and 1.
 * @returns The interpolated hex color.
 */
function mixHex(from: string, to: string, t: number): string {
  const [r1, g1, b1] = parseHex(from);
  const [r2, g2, b2] = parseHex(to);
  const mix = (a: number, b: number): number => Math.round(a + (b - a) * t);

  return `#${toHexChannel(mix(r1, r2))}${toHexChannel(mix(g1, g2))}${toHexChannel(mix(b1, b2))}`;
}

/**
 * Renders the ASCII-art wordmark with a vertical purple gradient.
 *
 * @param text - The text to render as ASCII art.
 * @param font - The figlet font to use.
 * @returns The gradient-colored ASCII-art string.
 */
function renderWordmark(text: string, font: FontName): string {
  let art: string;
  try {
    art = figlet.textSync(text, {
      font,
      horizontalLayout: 'default',
      verticalLayout: 'default',
    });
  } catch {
    // Fall back to a plain wordmark if the font is unavailable.
    art = text;
  }

  const lines = art.split('\n');
  const lastIndex = Math.max(lines.length - 1, 1);

  return lines
    .map((line, index) =>
      chalk.hex(mixHex(COLORS.primary, COLORS.secondary, index / lastIndex))(
        line
      )
    )
    .join('\n');
}

/**
 * Returns the stylized ASCII-art banner for the Spellbookx CLI.
 *
 * @param version - Package version string (defaults to packageJson.version).
 * @returns Formatted ANSI banner string.
 */
export function getBanner(version: string = packageJson.version): string {
  const wordmark = renderWordmark(BANNER_TEXT, BANNER_FONT);
  const separator = chalk.hex(COLORS.dark)('─'.repeat(54));
  const versionTag = chalk.hex(COLORS.muted)(`v${version}`);
  const tagline = chalk
    .hex(COLORS.secondary)
    .italic(`${WIZARD_EMOJI}  ${BANNER_TAGLINE}`);

  return [wordmark, '', `${tagline}  ${versionTag}`, separator].join('\n');
}

/**
 * Prints the Spellbookx CLI banner to console.
 *
 * @param version - Package version string.
 */
export function printBanner(version?: string): void {
  console.log(`\n${getBanner(version)}\n`);
}
