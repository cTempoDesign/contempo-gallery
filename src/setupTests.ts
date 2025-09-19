import '@testing-library/jest-dom';

// Mock CSS imports since they're injected at runtime
jest.mock('./contempo-gallery.css', () => ({}));
jest.mock('./contempo-lightbox.css', () => ({}));

// Mock ResizeObserver if needed
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver if needed
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));