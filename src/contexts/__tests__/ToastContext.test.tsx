import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../ToastContext';

// Test component to interact with the toast context
const TestComponent: React.FC = () => {
  const { toasts, showToast, removeToast } = useToast();

  return (
    <div>
      <div data-testid="toast-count">{toasts.length}</div>
      {toasts.map(toast => (
        <div key={toast.id} data-testid={`toast-${toast.type}`}>
          <span data-testid="toast-message">{toast.message}</span>
          <button 
            onClick={() => removeToast(toast.id)}
            data-testid="remove-toast"
          >
            Remove
          </button>
        </div>
      ))}
      <button 
        onClick={() => showToast('success', 'Success message')}
        data-testid="show-success"
      >
        Show Success
      </button>
      <button 
        onClick={() => showToast('error', 'Error message')}
        data-testid="show-error"
      >
        Show Error
      </button>
      <button 
        onClick={() => showToast('info', 'Info message')}
        data-testid="show-info"
      >
        Show Info
      </button>
      <button 
        onClick={() => showToast('success', 'Custom duration', 1000)}
        data-testid="show-custom-duration"
      >
        Show Custom Duration
      </button>
    </div>
  );
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>
    {children}
  </ToastProvider>
);

describe('ToastContext', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('provides toast context to children', () => {
    render(<TestComponent />, { wrapper: TestWrapper });
    
    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
    expect(screen.getByTestId('show-success')).toBeInTheDocument();
  });

  test('throws error when useToast is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a ToastProvider');

    console.error = originalError;
  });

  test('shows success toast', () => {
    render(<TestComponent />, { wrapper: TestWrapper });
    
    act(() => {
      screen.getByTestId('show-success').click();
    });

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByTestId('toast-success')).toBeInTheDocument();
    expect(screen.getByTestId('toast-message')).toHaveTextContent('Success message');
  });

  test('shows error toast', () => {
    render(<TestComponent />, { wrapper: TestWrapper });
    
    act(() => {
      screen.getByTestId('show-error').click();
    });

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByTestId('toast-error')).toBeInTheDocument();
    expect(screen.getByTestId('toast-message')).toHaveTextContent('Error message');
  });

  test('shows info toast', () => {
    render(<TestComponent />, { wrapper: TestWrapper });
    
    act(() => {
      screen.getByTestId('show-info').click();
    });

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByTestId('toast-info')).toBeInTheDocument();
    expect(screen.getByTestId('toast-message')).toHaveTextContent('Info message');
  });

  test('shows multiple toasts', () => {
    render(<TestComponent />, { wrapper: TestWrapper });
    
    act(() => {
      screen.getByTestId('show-success').click();
      screen.getByTestId('show-error').click();
      screen.getByTestId('show-info').click();
    });

    expect(screen.getByTestId('toast-count')).toHaveTextContent('3');
    expect(screen.getByTestId('toast-success')).toBeInTheDocument();
    expect(screen.getByTestId('toast-error')).toBeInTheDocument();
    expect(screen.getByTestId('toast-info')).toBeInTheDocument();
  });

  test('manually removes toast', () => {
    render(<TestComponent />, { wrapper: TestWrapper });
    
    act(() => {
      screen.getByTestId('show-success').click();
    });

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

    act(() => {
      screen.getByTestId('remove-toast').click();
    });

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  test('auto-removes toast after default duration', async () => {
    render(<TestComponent />, { wrapper: TestWrapper });
    
    act(() => {
      screen.getByTestId('show-success').click();
    });

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

    // Fast-forward time by 5000ms (default duration)
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  test('auto-removes toast after custom duration', async () => {
    render(<TestComponent />, { wrapper: TestWrapper });
    
    act(() => {
      screen.getByTestId('show-custom-duration').click();
    });

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

    // Fast-forward time by 1000ms (custom duration)
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  test('generates unique IDs for toasts', () => {
    render(<TestComponent />, { wrapper: TestWrapper });
    
    act(() => {
      screen.getByTestId('show-success').click();
      screen.getByTestId('show-error').click();
    });

    const toasts = screen.getAllByTestId(/^toast-(success|error|info)$/);
    expect(toasts).toHaveLength(2);
    
    // Each toast should have a unique key/id
    const successToast = screen.getByTestId('toast-success');
    const errorToast = screen.getByTestId('toast-error');
    expect(successToast).not.toBe(errorToast);
  });

  test('handles rapid toast creation and removal', () => {
    render(<TestComponent />, { wrapper: TestWrapper });
    
    // Create multiple toasts rapidly
    act(() => {
      for (let i = 0; i < 5; i++) {
        screen.getByTestId('show-success').click();
      }
    });

    expect(screen.getByTestId('toast-count')).toHaveTextContent('5');

    // Remove all toasts by advancing time
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  test('maintains toast order', () => {
    render(<TestComponent />, { wrapper: TestWrapper });
    
    act(() => {
      screen.getByTestId('show-success').click();
      screen.getByTestId('show-error').click();
      screen.getByTestId('show-info').click();
    });

    const toasts = screen.getAllByTestId(/^toast-(success|error|info)$/);
    expect(toasts[0]).toHaveAttribute('data-testid', 'toast-success');
    expect(toasts[1]).toHaveAttribute('data-testid', 'toast-error');
    expect(toasts[2]).toHaveAttribute('data-testid', 'toast-info');
  });
});