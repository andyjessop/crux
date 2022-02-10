export function createMockEventEmitter() {
  return {
    emit: jest.fn(),
    off: jest.fn(),
    offAll: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    onAll: jest.fn()
  };
}