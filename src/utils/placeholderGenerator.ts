interface PlaceholderOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  textColor?: string;
  text?: string;
  fontSize?: number;
}

export class PlaceholderGenerator {
  /**
   * Generate a base64 SVG placeholder
   */
  static generateSVGPlaceholder(options: PlaceholderOptions = {}): string {
    const {
      width = 320,
      height = 240,
      backgroundColor = '#333333',
      textColor = '#999999',
      text = 'Loading...',
      fontSize = 14
    } = options;

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${backgroundColor}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}" 
              fill="${textColor}" text-anchor="middle" dy=".3em">${text}</text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Generate a blurred placeholder from image dimensions
   */
  static generateBlurredPlaceholder(options: PlaceholderOptions = {}): string {
    const {
      width = 320,
      height = 240,
      backgroundColor = '#1a1a1a'
    } = options;

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
            <stop offset="50%" style="stop-color:#2a2a2a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:${backgroundColor};stop-opacity:1" />
          </linearGradient>
          <filter id="blur">
            <feGaussianBlur stdDeviation="3"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" filter="url(#blur)"/>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Generate a cyberpunk-themed placeholder
   */
  static generateCyberpunkPlaceholder(options: PlaceholderOptions = {}): string {
    const {
      width = 320,
      height = 240,
      text = 'Loading...'
    } = options;

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cyberpunk" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#1a1a1a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0a0a0a;stop-opacity:1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#cyberpunk)"/>
        <rect x="10%" y="10%" width="80%" height="80%" fill="none" 
              stroke="#00ffff" stroke-width="1" opacity="0.3"/>
        <text x="50%" y="50%" font-family="monospace" font-size="12" 
              fill="#00ffff" text-anchor="middle" dy=".3em" filter="url(#glow)">${text}</text>
        <circle cx="20%" cy="20%" r="2" fill="#ff00ff" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="80%" cy="80%" r="2" fill="#00ff00" opacity="0.6">
          <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite"/>
        </circle>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Get appropriate placeholder based on image type
   */
  static getPlaceholder(type: 'default' | 'blurred' | 'cyberpunk' = 'cyberpunk', options: PlaceholderOptions = {}): string {
    switch (type) {
      case 'blurred':
        return this.generateBlurredPlaceholder(options);
      case 'cyberpunk':
        return this.generateCyberpunkPlaceholder(options);
      default:
        return this.generateSVGPlaceholder(options);
    }
  }
}

// Predefined placeholders for common use cases
export const PLACEHOLDERS = {
  PROFILE: PlaceholderGenerator.generateCyberpunkPlaceholder({
    width: 320,
    height: 320,
    text: 'Profile'
  }),
  ACHIEVEMENT: PlaceholderGenerator.generateCyberpunkPlaceholder({
    width: 400,
    height: 300,
    text: 'Achievement'
  }),
  PROJECT: PlaceholderGenerator.generateCyberpunkPlaceholder({
    width: 600,
    height: 400,
    text: 'Project'
  }),
  GENERIC: PlaceholderGenerator.generateCyberpunkPlaceholder({
    width: 320,
    height: 240,
    text: 'Loading...'
  })
};