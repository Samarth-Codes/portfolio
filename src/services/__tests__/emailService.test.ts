import EmailService, { emailService, ContactFormData, EmailConfig } from '../emailService';
import emailjs from '@emailjs/browser';

// Mock EmailJS
jest.mock('@emailjs/browser');
const mockEmailjs = emailjs as jest.Mocked<typeof emailjs>;

// Mock environment config
jest.mock('../../config/environment', () => ({
  getEnvironmentConfig: () => ({
    emailjs: {
      serviceId: 'test_service_id',
      templateId: 'test_template_id',
      publicKey: 'test_public_key'
    }
  })
}));

describe('EmailService', () => {
  let service: EmailService;
  const mockConfig: EmailConfig = {
    serviceId: 'test_service',
    templateId: 'test_template',
    publicKey: 'test_key'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new EmailService(mockConfig);
  });

  describe('constructor', () => {
    test('initializes EmailJS with public key', () => {
      expect(mockEmailjs.init).toHaveBeenCalledWith(mockConfig.publicKey);
    });
  });

  describe('validateEmail', () => {
    test('validates correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com'
      ];

      validEmails.forEach(email => {
        expect(service.validateEmail(email)).toBe(true);
      });
    });

    test('rejects invalid email formats', () => {
      const invalidEmails = [
        '',
        'invalid-email',
        '@domain.com',
        'user@',
        'user@domain',
        'user.domain.com',
        'user @domain.com',
        'user@domain .com'
      ];

      invalidEmails.forEach(email => {
        expect(service.validateEmail(email)).toBe(false);
      });
    });
  });

  describe('validateForm', () => {
    test('validates complete valid form data', () => {
      const validData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a valid message that is long enough'
      };

      const result = service.validateForm(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('detects missing name', () => {
      const invalidData: ContactFormData = {
        name: '',
        email: 'john@example.com',
        message: 'This is a valid message'
      };

      const result = service.validateForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name is required');
    });

    test('detects missing email', () => {
      const invalidData: ContactFormData = {
        name: 'John Doe',
        email: '',
        message: 'This is a valid message'
      };

      const result = service.validateForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email is required');
    });

    test('detects invalid email format', () => {
      const invalidData: ContactFormData = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'This is a valid message'
      };

      const result = service.validateForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Please enter a valid email address');
    });

    test('detects missing message', () => {
      const invalidData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: ''
      };

      const result = service.validateForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Message is required');
    });

    test('detects message too short', () => {
      const invalidData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'short'
      };

      const result = service.validateForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Message must be at least 10 characters long');
    });

    test('handles whitespace-only inputs', () => {
      const invalidData: ContactFormData = {
        name: '   ',
        email: '  ',
        message: '     '
      };

      const result = service.validateForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name is required');
      expect(result.errors).toContain('Email is required');
      expect(result.errors).toContain('Message is required');
    });

    test('accumulates multiple validation errors', () => {
      const invalidData: ContactFormData = {
        name: '',
        email: 'invalid-email',
        message: 'short'
      };

      const result = service.validateForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors).toContain('Name is required');
      expect(result.errors).toContain('Please enter a valid email address');
      expect(result.errors).toContain('Message must be at least 10 characters long');
    });
  });

  describe('sendEmail', () => {
    const validFormData: ContactFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message'
    };

    test('sends email successfully', async () => {
      const mockResponse = { status: 200, text: 'OK' };
      mockEmailjs.send.mockResolvedValue(mockResponse);

      const result = await service.sendEmail(validFormData);

      expect(mockEmailjs.send).toHaveBeenCalledWith(
        mockConfig.serviceId,
        mockConfig.templateId,
        {
          from_name: validFormData.name,
          from_email: validFormData.email,
          message: validFormData.message,
          to_name: 'Samarth'
        }
      );

      expect(result).toEqual(mockResponse);
    });

    test('handles EmailJS error with message', async () => {
      const errorMessage = 'Network error';
      mockEmailjs.send.mockRejectedValue(new Error(errorMessage));

      await expect(service.sendEmail(validFormData)).rejects.toThrow(errorMessage);
    });

    test('handles EmailJS error with text property', async () => {
      const errorText = 'Service unavailable';
      mockEmailjs.send.mockRejectedValue({ text: errorText });

      await expect(service.sendEmail(validFormData)).rejects.toThrow(errorText);
    });

    test('handles unknown error format', async () => {
      mockEmailjs.send.mockRejectedValue('Unknown error');

      await expect(service.sendEmail(validFormData)).rejects.toThrow('Failed to send email');
    });

    test('formats template parameters correctly', async () => {
      const mockResponse = { status: 200, text: 'OK' };
      mockEmailjs.send.mockResolvedValue(mockResponse);

      await service.sendEmail(validFormData);

      const expectedParams = {
        from_name: 'John Doe',
        from_email: 'john@example.com',
        message: 'This is a test message',
        to_name: 'Samarth'
      };

      expect(mockEmailjs.send).toHaveBeenCalledWith(
        mockConfig.serviceId,
        mockConfig.templateId,
        expectedParams
      );
    });
  });
});

describe('Default EmailService Instance', () => {
  test('exports a configured emailService instance', () => {
    expect(emailService).toBeInstanceOf(EmailService);
  });

  test('emailService has all required methods', () => {
    expect(typeof emailService.sendEmail).toBe('function');
    expect(typeof emailService.validateEmail).toBe('function');
    expect(typeof emailService.validateForm).toBe('function');
  });
});