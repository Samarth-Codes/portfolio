// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock EmailJS
jest.mock('@emailjs/browser', () => ({
  init: jest.fn(),
  send: jest.fn(() => Promise.resolve({ status: 200, text: 'OK' })),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => require('react').createElement('div', props),
    section: (props: any) => require('react').createElement('section', props),
    h1: (props: any) => require('react').createElement('h1', props),
    h2: (props: any) => require('react').createElement('h2', props),
    p: (props: any) => require('react').createElement('p', props),
    form: (props: any) => require('react').createElement('form', props),
    button: (props: any) => require('react').createElement('button', props),
  },
  AnimatePresence: ({ children }: any) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
  }),
  useInView: () => [jest.fn(), true],
}));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];
  
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
  takeRecords() {
    return [];
  }
} as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.open
Object.defineProperty(window, 'open', {
  writable: true,
  value: jest.fn(),
});