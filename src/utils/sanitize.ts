/**
 * Input Sanitization Utilities
 * Prevents XSS, SQL injection, and other security vulnerabilities
 */

import DOMPurify from "dompurify";

/**
 * Sanitize HTML content - removes malicious scripts while preserving safe HTML
 */
export function sanitizeHtml(html: string, options?: DOMPurify.Config): string {
  if (!html) return "";

  const defaultConfig: DOMPurify.Config = {
    ALLOWED_TAGS: [
      "p", "br", "b", "i", "u", "strong", "em", "a", "ul", "ol", "li",
      "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre", "code",
      "span", "div", "img"
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "target", "rel"],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ["target"], // Allow target for links
    FORBID_TAGS: ["script", "style", "iframe", "form", "input", "object", "embed"],
    FORBID_ATTR: ["onerror", "onclick", "onload", "onmouseover", "onfocus", "onblur"],
  };

  // Force all links to open in new tab with security attributes
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
    // Ensure images have alt text
    if (node.tagName === "IMG" && !node.getAttribute("alt")) {
      node.setAttribute("alt", "Image");
    }
  });

  const result = DOMPurify.sanitize(html, { ...defaultConfig, ...options });

  // Remove the hook to prevent affecting other sanitizations
  DOMPurify.removeHook("afterSanitizeAttributes");

  return result;
}

/**
 * Sanitize plain text - removes all HTML tags
 */
export function sanitizeText(text: string): string {
  if (!text) return "";
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
}

/**
 * Sanitize a string for use in URLs
 */
export function sanitizeUrl(url: string): string {
  if (!url) return "";

  const trimmed = url.trim();

  // Check for dangerous protocols
  const dangerousProtocols = [
    "javascript:",
    "data:",
    "vbscript:",
    "file:",
  ];

  const lowerUrl = trimmed.toLowerCase();
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return "";
    }
  }

  // Ensure URL is properly encoded
  try {
    const parsed = new URL(trimmed, window.location.origin);
    return parsed.href;
  } catch {
    // If it's not a valid URL, return empty
    return "";
  }
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (!email) return "";

  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(trimmed)) {
    return "";
  }

  return trimmed;
}

/**
 * Sanitize phone number - keeps only digits and common phone characters
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return "";
  // Keep only digits, spaces, dashes, parentheses, and plus sign
  return phone.replace(/[^\d\s\-()+ ]/g, "").trim();
}

/**
 * Sanitize a slug for URLs
 */
export function sanitizeSlug(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with dashes
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
}

/**
 * Sanitize search query - removes potentially harmful characters
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) return "";

  return query
    .trim()
    .replace(/[<>'"`;\\]/g, "") // Remove potentially dangerous characters
    .substring(0, 200); // Limit length
}

/**
 * Sanitize a number input
 */
export function sanitizeNumber(value: string | number, options?: {
  min?: number;
  max?: number;
  decimals?: number;
}): number | null {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return null;

  let result = num;

  if (options?.min !== undefined) {
    result = Math.max(result, options.min);
  }

  if (options?.max !== undefined) {
    result = Math.min(result, options.max);
  }

  if (options?.decimals !== undefined) {
    result = parseFloat(result.toFixed(options.decimals));
  }

  return result;
}

/**
 * Sanitize file name
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName) return "";

  return fileName
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "") // Remove invalid file name characters
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .substring(0, 255); // Limit length
}

/**
 * Sanitize an object's string values recursively
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  options?: { htmlFields?: string[] }
): T {
  const result = {} as T;

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      result[key as keyof T] = value;
    } else if (typeof value === "string") {
      // Check if this field should allow HTML
      if (options?.htmlFields?.includes(key)) {
        result[key as keyof T] = sanitizeHtml(value) as T[keyof T];
      } else {
        result[key as keyof T] = sanitizeText(value) as T[keyof T];
      }
    } else if (Array.isArray(value)) {
      result[key as keyof T] = value.map((item) =>
        typeof item === "string"
          ? sanitizeText(item)
          : typeof item === "object"
          ? sanitizeObject(item, options)
          : item
      ) as T[keyof T];
    } else if (typeof value === "object") {
      result[key as keyof T] = sanitizeObject(value, options);
    } else {
      result[key as keyof T] = value;
    }
  }

  return result;
}

/**
 * Validate and sanitize business form data
 */
export function sanitizeBusinessForm(data: Record<string, any>): Record<string, any> {
  return {
    ...data,
    name: sanitizeText(data.name || ""),
    description: sanitizeHtml(data.description || ""),
    short_description: sanitizeText(data.short_description || ""),
    address: sanitizeText(data.address || ""),
    phone: sanitizePhone(data.phone || ""),
    email: sanitizeEmail(data.email || ""),
    website: sanitizeUrl(data.website || ""),
    slug: sanitizeSlug(data.slug || data.name || ""),
  };
}

/**
 * Validate and sanitize review form data
 */
export function sanitizeReviewForm(data: Record<string, any>): Record<string, any> {
  return {
    ...data,
    content: sanitizeText(data.content || ""),
    rating: sanitizeNumber(data.rating, { min: 1, max: 5, decimals: 0 }),
  };
}

/**
 * Validate and sanitize event form data
 */
export function sanitizeEventForm(data: Record<string, any>): Record<string, any> {
  return {
    ...data,
    title: sanitizeText(data.title || ""),
    description: sanitizeHtml(data.description || ""),
    location: sanitizeText(data.location || ""),
    organizer_name: sanitizeText(data.organizer_name || ""),
    organizer_email: sanitizeEmail(data.organizer_email || ""),
  };
}
