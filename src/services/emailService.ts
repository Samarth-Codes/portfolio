import emailjs from '@emailjs/browser';
import { getEnvironmentConfig } from '../config/environment';

export interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface EmailResponse {
  status: number;
  text: string;
}

class EmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    // Initialize EmailJS with public key
    emailjs.init(this.config.publicKey);
  }

  async sendEmail(formData: ContactFormData): Promise<EmailResponse> {
    try {


      // Check if EmailJS is properly configured
      if (!this.config.serviceId || !this.config.templateId || !this.config.publicKey || 
          this.config.serviceId === 'your_service_id_here' ||
          this.config.templateId === 'your_template_id_here' ||
          this.config.publicKey === 'your_public_key_here') {
        throw new Error('Email service is not configured. Please check your environment variables.');
      }

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_name: 'Samarth', // Portfolio owner name
      };

      const response = await emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        templateParams
      );

      return {
        status: response.status,
        text: response.text
      };
    } catch (error: unknown) {
      console.error('EmailJS Error:', error);
      
      let errorMessage = 'Failed to send email';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        const errorObj = error as any;
        errorMessage = errorObj.text || errorObj.message || errorMessage;
      }
      
      // Provide more helpful error messages
      if (errorMessage.includes('not configured')) {
        errorMessage = 'Email service is not configured. Please contact me directly at samarh260805@gmail.com';
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (errorMessage.includes('insufficient authentication scopes') || errorMessage.includes('Gmail_API')) {
        errorMessage = 'Email service needs reconfiguration. Please contact me directly at samarh260805@gmail.com';
      } else if (errorMessage.includes('412') || errorMessage.includes('EmailJSResponseStatus')) {
        errorMessage = 'Email service temporarily unavailable. Please contact me directly at samarh260805@gmail.com';
      }
      
      throw new Error(errorMessage);
    }
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateForm(formData: ContactFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push('Name is required');
    }

    if (!formData.email.trim()) {
      errors.push('Email is required');
    } else if (!this.validateEmail(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!formData.message.trim()) {
      errors.push('Message is required');
    } else if (formData.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Get configuration from environment
const envConfig = getEnvironmentConfig();
const defaultConfig: EmailConfig = {
  serviceId: envConfig.emailjs.serviceId,
  templateId: envConfig.emailjs.templateId,
  publicKey: envConfig.emailjs.publicKey
};

export const emailService = new EmailService(defaultConfig);
export default EmailService;