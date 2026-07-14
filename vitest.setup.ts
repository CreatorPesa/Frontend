import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement ResizeObserver, which recharts' ResponsiveContainer
// requires to mount at all.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub;
