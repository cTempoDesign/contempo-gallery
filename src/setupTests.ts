import '@testing-library/jest-dom';

// Mock CSS imports since they're injected at runtime
jest.mock('./ContempoGallery.css', () => ({}));
jest.mock('./ContempoLightbox.css', () => ({}));

// Mock ResizeObserver if needed
globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver if needed
globalThis.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));