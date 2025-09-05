import { vi } from 'vitest';

vi.mock('../src/config/database', () => ({
  databaseConfig: {
    url: 'postgresql://invalid:invalid@invalid:0000/invalid'
  }
}));
