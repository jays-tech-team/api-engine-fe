/**
 * Converts a string to a URL-friendly slug
 * @param text - The text to convert to a slug
 * @param options - Optional configuration for slug generation
 * @returns A URL-friendly slug
 */
export function slugify(
  text: string,
  options: {
    lower?: boolean;
    strict?: boolean;
    trim?: boolean;
  } = {},
): string {
  const { lower = true, strict = false, trim = true } = options;

  // Handle empty or null input
  if (!text) {
    return '';
  }

  // Convert to string if not already
  const str = String(text);

  // Trim if needed
  const trimmed = trim ? str.trim() : str;

  // Convert to lowercase if needed
  const lowercased = lower ? trimmed.toLowerCase() : trimmed;

  // Replace spaces and special characters with hyphens
  let slug = lowercased
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Replace special characters with empty string
    .replace(/[^\w-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/--+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  // Handle strict mode (only allow alphanumeric and hyphens)
  if (strict) {
    slug = slug.replace(/[^a-z0-9-]/g, '');
  }

  return slug;
}

/**
 * Check if a string is a valid url
 * @param text - The string to check
 * @returns True if the string is a valid url, false otherwise
 */
export function isUrl(text: string): boolean {
  return /^https?:\/\/[^\s]+$/.test(text);
}
