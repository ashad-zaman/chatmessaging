import '@testing-library/jest-dom';
import { useEffect } from 'react';

global IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() { return []; }
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: number[] = [];
} as any;

global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost',
    pathname: '/',
    assign: jest.fn(),
  },
  writable: true,
});

window.history.pushState = jest.fn();
window.history.replaceState = jest.fn();