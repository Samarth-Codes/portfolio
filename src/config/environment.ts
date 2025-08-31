/**
 * Environment configuration for the portfolio application
 */

export interface EnvironmentConfig {
  emailjs: {
    serviceId: string;
    templateId: string;
    publicKey: string;
  };
  app: {
    environment: 'development' | 'production' | 'test';
    version: string;
  };
  analytics?: {
    trackingId: string;
  };
  sentry?: {
    dsn: string;
  };
}

/**
 * Validates that all required environment variables are present
 */
function validateEnvironment(): void {
  const requiredVars = [
    'REACT_APP_EMAILJS_SERVICE_ID',
    'REACT_APP_EMAILJS_TEMPLATE_ID',
    'REACT_APP_EMAILJS_PUBLIC_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
}

/**
 * Gets the current environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {


  // Validate environment variables in production
  if (process.env.NODE_ENV === 'production') {
    validateEnvironment();
  }

  const config: EnvironmentConfig = {
    emailjs: {
      serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID || '',
      templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || '',
      publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || ''
    },
    app: {
      environment: (process.env.REACT_APP_ENVIRONMENT as any) || process.env.NODE_ENV || 'development',
      version: process.env.REACT_APP_VERSION || '1.0.0'
    }
  };

  // Optional analytics configuration
  if (process.env.REACT_APP_GA_TRACKING_ID) {
    config.analytics = {
      trackingId: process.env.REACT_APP_GA_TRACKING_ID
    };
  }

  // Optional Sentry configuration
  if (process.env.REACT_APP_SENTRY_DSN) {
    config.sentry = {
      dsn: process.env.REACT_APP_SENTRY_DSN
    };
  }

  return config;
}

/**
 * Checks if the application is running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Checks if the application is running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Gets the application version
 */
export function getAppVersion(): string {
  return process.env.REACT_APP_VERSION || '1.0.0';
}