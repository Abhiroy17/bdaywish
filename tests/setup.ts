import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', { writable: true, value: vi.fn(() => ({
  matches: false, addListener: vi.fn(), removeListener: vi.fn(),
  addEventListener: vi.fn(), removeEventListener: vi.fn(),
})) });
class Observer {
  observe() {} unobserve() {} disconnect() {}
}
vi.stubGlobal('IntersectionObserver', Observer);