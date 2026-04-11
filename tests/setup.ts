import { afterEach, vi } from 'vitest';

const chromeMock = {
  storage: {
    session: {
      set: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue({}),
      remove: vi.fn().mockResolvedValue(undefined),
    },
    local: {
      set: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue({}),
      remove: vi.fn().mockResolvedValue(undefined),
    },
    sync: {
      set: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue({}),
    },
  },
  runtime: {
    onInstalled: { addListener: vi.fn() },
    sendMessage: vi.fn(),
  },
};

vi.stubGlobal('chrome', chromeMock);

afterEach(() => {
  vi.clearAllMocks();
});