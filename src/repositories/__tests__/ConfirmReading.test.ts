import { ReadingRepository } from '../../repositories/ReadingRepository';
import prismaClient from '../../prisma';

jest.mock('../prisma');

describe('ReadingRepository', () => {
  let repository: ReadingRepository;

  beforeEach(() => {
    repository = new ReadingRepository();
    jest.clearAllMocks();
  });

  describe('confirmReading', () => {
    it('should confirm a reading and return true', async () => {
      prismaClient.readings.update = jest.fn().mockResolvedValue({
        has_confirmed: true,
      });

      const result = await repository.confirmReading('uuid-1234', 42);

      expect(prismaClient.readings.update).toHaveBeenCalledWith({
        where: {
          measure_uuid: 'uuid-1234',
        },
        data: {
          measure_value: 42,
          has_confirmed: true,
        },
      });
      expect(result).toBe(true);
    });
  });
});
