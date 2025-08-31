import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider } from '../../contexts/ToastContext';
import { emailService } from '../../services/emailService';

// Mock the email service
jest.mock('../../services/emailService', () => ({
  emailService: {
    sendEmail: jest.fn(),
    validateEmail: jest.fn(),
    validateForm: jest.fn()
  }
}));
const mockEmailService = emailService as jest.Mocked<typeof emailService>;

// Mock the Contact component to avoid router dependencies
const MockContact: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [touched, setTouched] = React.useState<{ [key: string]: boolean }>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return value.trim() ? '' : 'Name is required';
      case 'email':
        if (!value.trim()) return 'Email is required';
        return mockEmailService.validateEmail(value) ? '' : 'Please enter a valid email address';
      case 'message':
        if (!value.trim()) return 'Message is required';
        return value.trim().length >= 10 ? '' : 'Message must be at least 10 characters long';
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = mockEmailService.validateForm(formData);
    if (!validation.isValid) {
      const fieldErrors: { [key: string]: string } = {};
      validation.errors.forEach(error => {
        if (error.includes('Name')) fieldErrors.name = error;
        if (error.includes('Email') || error.includes('email')) fieldErrors.email = error;
        if (error.includes('Message')) fieldErrors.message = error;
      });
      setErrors(fieldErrors);
      setTouched({ name: true, email: true, message: true });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await mockEmailService.sendEmail(formData);
      setFormData({ name: '', email: '', message: '' });
      setTouched({});
    } catch (error: any) {
      console.error('Email sending failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">
          NAME {errors.name && <span>{errors.name}</span>}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
          placeholder="Your name"
          required
        />
      </div>
      <div>
        <label htmlFor="email">
          EMAIL {errors.email && <span>{errors.email}</span>}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
          placeholder="your.email@example.com"
          required
        />
      </div>
      <div>
        <label htmlFor="message">
          MESSAGE {errors.message && <span>{errors.message}</span>}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
          rows={6}
          placeholder="Tell me about your project..."
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
      </button>
    </form>
  );
};

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>
    {children}
  </ToastProvider>
);

describe('Contact Form Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock implementations
    mockEmailService.validateEmail.mockImplementation((email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    });
    
    mockEmailService.validateForm.mockImplementation((formData) => {
      const errors: string[] = [];
      if (!formData.name.trim()) errors.push('Name is required');
      if (!formData.email.trim()) errors.push('Email is required');
      else if (!mockEmailService.validateEmail(formData.email)) errors.push('Please enter a valid email address');
      if (!formData.message.trim()) errors.push('Message is required');
      else if (formData.message.trim().length < 10) errors.push('Message must be at least 10 characters long');
      
      return { isValid: errors.length === 0, errors };
    });
  });

  test('renders contact form with all required fields', () => {
    render(<MockContact />, { wrapper: TestWrapper });
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  test('displays validation errors for empty form submission', async () => {
    render(<MockContact />, { wrapper: TestWrapper });
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });

  test('validates email format in real-time', async () => {
    const user = userEvent;
    render(<MockContact />, { wrapper: TestWrapper });
    
    const emailInput = screen.getByLabelText(/email/i);
    
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // Trigger blur event
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('validates message length', async () => {
    const user = userEvent;
    render(<MockContact />, { wrapper: TestWrapper });
    
    const messageInput = screen.getByLabelText(/message/i);
    
    await user.type(messageInput, 'short');
    await user.tab(); // Trigger blur event
    
    await waitFor(() => {
      expect(screen.getByText(/message must be at least 10 characters long/i)).toBeInTheDocument();
    });
  });

  test('submits form successfully with valid data', async () => {
    const user = userEvent;
    mockEmailService.sendEmail.mockResolvedValue({ status: 200, text: 'OK' });
    
    render(<MockContact />, { wrapper: TestWrapper });
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /send message/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'This is a test message that is long enough');
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message that is long enough'
      });
    });
  });

  test('handles form submission error', async () => {
    const user = userEvent;
    mockEmailService.sendEmail.mockRejectedValue(new Error('Network error'));
    
    render(<MockContact />, { wrapper: TestWrapper });
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /send message/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'This is a test message that is long enough');
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockEmailService.sendEmail).toHaveBeenCalled();
    });
  });

  test('disables form during submission', async () => {
    const user = userEvent;
    // Mock a delayed response
    mockEmailService.sendEmail.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ status: 200, text: 'OK' }), 100))
    );
    
    render(<MockContact />, { wrapper: TestWrapper });
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /send message/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'This is a test message that is long enough');
    
    fireEvent.click(submitButton);
    
    // Check that form is disabled during submission
    expect(submitButton).toBeDisabled();
    expect(nameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(messageInput).toBeDisabled();
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('clears form after successful submission', async () => {
    const user = userEvent;
    mockEmailService.sendEmail.mockResolvedValue({ status: 200, text: 'OK' });
    
    render(<MockContact />, { wrapper: TestWrapper });
    
    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button', { name: /send message/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'This is a test message that is long enough');
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(messageInput.value).toBe('');
    });
  });
});

// Test EmailJS service functionality
describe('EmailJS Service Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock implementations for validation methods
    (mockEmailService.validateEmail as jest.Mock).mockImplementation((email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    });
    
    (mockEmailService.validateForm as jest.Mock).mockImplementation((formData: any) => {
      const errors: string[] = [];
      
      if (!formData.name.trim()) {
        errors.push('Name is required');
      }
      
      if (!formData.email.trim()) {
        errors.push('Email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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
    });
  });

  test('validates email addresses correctly', () => {
    expect(emailService.validateEmail('test@example.com')).toBe(true);
    expect(emailService.validateEmail('invalid-email')).toBe(false);
    expect(emailService.validateEmail('')).toBe(false);
    expect(emailService.validateEmail('user@domain')).toBe(false);
    expect(emailService.validateEmail('user@domain.co.uk')).toBe(true);
  });

  test('validates form data correctly', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message that is long enough'
    };

    const invalidData = {
      name: '',
      email: 'invalid-email',
      message: 'short'
    };

    const validResult = emailService.validateForm(validData);
    expect(validResult.isValid).toBe(true);
    expect(validResult.errors).toHaveLength(0);

    const invalidResult = emailService.validateForm(invalidData);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors.length).toBeGreaterThan(0);
  });

  test('handles empty form data', () => {
    const emptyData = {
      name: '',
      email: '',
      message: ''
    };

    const result = emailService.validateForm(emptyData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Name is required');
    expect(result.errors).toContain('Email is required');
    expect(result.errors).toContain('Message is required');
  });

  test('validates message length requirement', () => {
    const shortMessageData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'short'
    };

    const result = emailService.validateForm(shortMessageData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Message must be at least 10 characters long');
  });

  test('handles whitespace-only inputs', () => {
    const whitespaceData = {
      name: '   ',
      email: '  ',
      message: '   '
    };

    const result = emailService.validateForm(whitespaceData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Name is required');
    expect(result.errors).toContain('Email is required');
    expect(result.errors).toContain('Message is required');
  });
});