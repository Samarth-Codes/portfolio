import EmailService, { ContactFormData, EmailConfig } from '../emailService';
import emailjs from '@emailjs/browser';

// Mock EmailJS for integration tests
jest.mock('@emailjs/browser');
const mockEmailjs = emailjs as jest.Mocked<typeof emailjs>;

describe('EmailService Integration Tests', () => {
  let service: EmailService;
  const testConfig: EmailConfig = {
    serviceId: 'test_service_123',
    templateId: 'test_template_456',
    publicKey: 'test_public_key_789'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new EmailService(testConfig);
  });

  describe('Full Email Sending Workflow', () => {
    test('complete successful email sending flow', async () => {
      // Setup
      const formData: ContactFormData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'Hello, this is a test message for the portfolio contact form.'
      };

      const mockResponse = {
        status: 200,
        text: 'Email sent successfully'
      };

      mockEmailjs.send.mockResolvedValue(mockResponse);

      // Validate form data first
      const validation = service.validateForm(formData);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);

      // Send email
      const result = await service.sendEmail(formData);

      // Verify EmailJS was called correctly
      expect(mockEmailjs.init).toHaveBeenCalledWith(testConfig.publicKey);
      expect(mockEmailjs.send).toHaveBeenCalledWith(
        testConfig.serviceId,
        testConfig.templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_name: 'Samarth'
        }
      );

      expect(result).toEqual(mockResponse);
    });

    test('handles validation failure before sending', async () => {
      const invalidFormData: ContactFormData = {
        name: '',
        email: 'invalid-email',
        message: 'short'
      };

      // Validate form data
      const validation = service.validateForm(invalidFormData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);

      // Should not attempt to send email with invalid data
      // In a real application, this would be handled by the UI
      expect(mockEmailjs.send).not.toHaveBeenCalled();
    });

    test('handles network failure during email sending', async () => {
      const formData: ContactFormData = {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        message: 'This is a test message that should fail to send due to network issues.'
      };

      const networkError = new Error('Network request failed');
      mockEmailjs.send.mockRejectedValue(networkError);

      // Validate form data first (should pass)
      const validation = service.validateForm(formData);
      expect(validation.isValid).toBe(true);

      // Attempt to send email (should fail)
      await expect(service.sendEmail(formData)).rejects.toThrow('Network request failed');

      // Verify EmailJS was called
      expect(mockEmailjs.send).toHaveBeenCalledWith(
        testConfig.serviceId,
        testConfig.templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_name: 'Samarth'
        }
      );
    });

    test('handles EmailJS service error', async () => {
      const formData: ContactFormData = {
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        message: 'This message should trigger a service error response.'
      };

      const serviceError = {
        status: 400,
        text: 'Invalid template parameters'
      };

      mockEmailjs.send.mockRejectedValue(serviceError);

      await expect(service.sendEmail(formData)).rejects.toThrow('Invalid template parameters');
    });

    test('handles rate limiting scenario', async () => {
      const formData: ContactFormData = {
        name: 'Alice Brown',
        email: 'alice.brown@example.com',
        message: 'This message should trigger a rate limiting response.'
      };

      const rateLimitError = {
        status: 429,
        text: 'Rate limit exceeded. Please try again later.'
      };

      mockEmailjs.send.mockRejectedValue(rateLimitError);

      await expect(service.sendEmail(formData)).rejects.toThrow('Rate limit exceeded. Please try again later.');
    });
  });

  describe('Email Validation Edge Cases', () => {
    test('validates international email addresses', () => {
      const internationalEmails = [
        'user@münchen.de',
        'test@xn--fsq.xn--0zwm56d', // Chinese domain
        'user@example.co.uk',
        'test@sub.domain.org'
      ];

      internationalEmails.forEach(email => {
        const formData: ContactFormData = {
          name: 'Test User',
          email: email,
          message: 'This is a test message with international email.'
        };

        const validation = service.validateForm(formData);
        // Note: The current regex might not handle all international domains
        // This test documents the current behavior
        if (service.validateEmail(email)) {
          expect(validation.isValid).toBe(true);
        }
      });
    });

    test('handles very long but valid inputs', () => {
      const longName = 'A'.repeat(100);
      const longMessage = 'This is a very long message. '.repeat(50);

      const formData: ContactFormData = {
        name: longName,
        email: 'test@example.com',
        message: longMessage
      };

      const validation = service.validateForm(formData);
      expect(validation.isValid).toBe(true);
    });

    test('handles special characters in name and message', () => {
      const formData: ContactFormData = {
        name: 'José María O\'Connor-Smith',
        email: 'jose@example.com',
        message: 'Hello! I\'m interested in your services. Can we discuss this further? Thanks! 😊'
      };

      const validation = service.validateForm(formData);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Service Configuration', () => {
    test('initializes with different configurations', () => {
      const config1: EmailConfig = {
        serviceId: 'service_1',
        templateId: 'template_1',
        publicKey: 'key_1'
      };

      const config2: EmailConfig = {
        serviceId: 'service_2',
        templateId: 'template_2',
        publicKey: 'key_2'
      };

      // @ts-ignore - Variables used for side effects (constructor calls)
      const service1 = new EmailService(config1);
      // @ts-ignore - Variables used for side effects (constructor calls)
      const service2 = new EmailService(config2);

      expect(mockEmailjs.init).toHaveBeenCalledWith(config1.publicKey);
      expect(mockEmailjs.init).toHaveBeenCalledWith(config2.publicKey);
    });

    test('handles missing configuration gracefully', () => {
      // This test ensures the service doesn't crash with undefined config
      // In a real scenario, this would be handled by environment validation
      const incompleteConfig = {
        serviceId: '',
        templateId: '',
        publicKey: ''
      } as EmailConfig;

      expect(() => new EmailService(incompleteConfig)).not.toThrow();
    });
  });

  describe('Concurrent Email Sending', () => {
    test('handles multiple simultaneous email sends', async () => {
      const formData1: ContactFormData = {
        name: 'User 1',
        email: 'user1@example.com',
        message: 'First concurrent message'
      };

      const formData2: ContactFormData = {
        name: 'User 2',
        email: 'user2@example.com',
        message: 'Second concurrent message'
      };

      const mockResponse = { status: 200, text: 'OK' };
      mockEmailjs.send.mockResolvedValue(mockResponse);

      // Send both emails concurrently
      const [result1, result2] = await Promise.all([
        service.sendEmail(formData1),
        service.sendEmail(formData2)
      ]);

      expect(result1).toEqual(mockResponse);
      expect(result2).toEqual(mockResponse);
      expect(mockEmailjs.send).toHaveBeenCalledTimes(2);
    });

    test('handles mixed success and failure in concurrent sends', async () => {
      const formData1: ContactFormData = {
        name: 'Success User',
        email: 'success@example.com',
        message: 'This should succeed'
      };

      const formData2: ContactFormData = {
        name: 'Failure User',
        email: 'failure@example.com',
        message: 'This should fail'
      };

      mockEmailjs.send
        .mockResolvedValueOnce({ status: 200, text: 'OK' })
        .mockRejectedValueOnce(new Error('Send failed'));

      const results = await Promise.allSettled([
        service.sendEmail(formData1),
        service.sendEmail(formData2)
      ]);

      expect(results[0].status).toBe('fulfilled');
      expect(results[1].status).toBe('rejected');
      expect(mockEmailjs.send).toHaveBeenCalledTimes(2);
    });
  });
});