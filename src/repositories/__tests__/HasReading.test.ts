import { ReadingRepository } from '../../repositories/ReadingRepository';
import prismaClient from '../../prisma';

jest.mock('../prisma');

describe('ReadingRepository', () => {
  let repository: ReadingRepository;

  beforeEach(() => {
    repository = new ReadingRepository();
    jest.clearAllMocks();
  });

  describe('hasReading', () => {
    it('should return true if there are readings for the given month and year', async () => {
      prismaClient.readings.findMany = jest.fn().mockResolvedValue([{}]);

      const result = await repository.hasReading('123', 'type', 2024, 8);

      expect(prismaClient.readings.findMany).toHaveBeenCalledWith({
        where: {
          measure_type: 'type',
          customer_code: '123',
          AND: [
            { measure_datetime: { gte: new Date(2024, 7, 1) } },
            { measure_datetime: { lt: new Date(2024, 8, 1) } },
          ],
        },
      });

      expect(result).toBe(true);
    });

    it('should return false if there are no readings for the given month and year', async () => {
      prismaClient.readings.findMany = jest.fn().mockResolvedValue([]);

      const result = await repository.hasReading('123', 'type', 2024, 8);

      expect(result).toBe(false);
    });
  });
});
