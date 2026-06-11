import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchDoctorPatients } from './firestore';
import { getDocs } from 'firebase/firestore';

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...actual,
    collection: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
  };
});

describe('firestore service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchDoctorPatients', () => {
    it('returns empty array when no links exist', async () => {
      vi.mocked(getDocs).mockResolvedValueOnce({ docs: [] } as unknown as ReturnType<typeof getDocs>);
      const result = await fetchDoctorPatients('doc123');
      expect(result.patients).toEqual([]);
      expect(result.allSessions).toEqual([]);
    });
  });
});
