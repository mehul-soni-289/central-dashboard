/**
 * Returns an error message if the URL is invalid, or '' if valid.
 * Handles: single URL only (no multiple URLs pasted), valid format, IPv4 octets 0–255,
 * IPv6, localhost (e.g. http://localhost:3000), and leading/trailing spaces (normalized by trim).
 * Empty string is considered valid (callers should check required separately).
 */
export function getUrlValidationError(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\/.+/.test(trimmed)) return 'Please enter a valid URL (include http:// or https://)';
  if (trimmed.includes(' ')) return 'Please enter a valid URL (URL must not contain spaces)';
  const protocolMatches = trimmed.match(/https?:\/\//gi);
  if (protocolMatches && protocolMatches.length > 1) return 'Please enter only one URL (do not paste multiple URLs in one field)';
  try {
    const url = new URL(trimmed);
    const hostname = url.hostname;
    const ipv4OctetRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipv4Match = hostname.match(ipv4OctetRegex);
    if (ipv4Match) {
      const octets = ipv4Match.slice(1, 5).map(Number);
      if (octets.some((o) => o < 0 || o > 255)) return 'Please enter a valid URL (invalid IPv4 address: each number must be 0–255)';
    }
    return '';
  } catch {
    return 'Please enter a valid URL (invalid format)';
  }
}

/** Returns the URL normalized for storage/display (trimmed). Use when saving or comparing. */
export function normalizeUrl(value: string): string {
  return value.trim();
}

export function validateUrl(value: string): boolean {
  return getUrlValidationError(value) === '';
}
