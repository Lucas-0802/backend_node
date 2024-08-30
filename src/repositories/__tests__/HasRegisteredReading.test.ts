import { ReadingRepository } from '../../repositories/ReadingRepository';
import prismaClient from '../../prisma';

jest.mock('../prisma');

describe('ReadingRepository', () => {
  let repository: ReadingRepository;

  beforeEach(() => {
    repository = new ReadingRepository();
    jest.clearAllMocks();
  });

  describe('hasRegisteredReading', () => {
    it('should return true if reading with given uuid is confirmed', async () => {
      prismaClient.readings.findUnique = jest.fn().mockResolvedValue({
        has_confirmed: true,
        measure_value: 42,
      });

      const result = await repository.hasRegisteredReading('uuid-1234');

      expect(prismaClient.readings.findUnique).toHaveBeenCalledWith({
        where: {
          measure_uuid: 'uuid-1234',
          has_confirmed: true,
          measure_value: {
            not: undefined,
          },
        },
      });
      expect(result).toBe(true);
    });

    it('should return false if reading with given uuid is not confirmed', async () => {
      prismaClient.readings.findUnique = jest.fn().mockResolvedValue(null);

      const result = await repository.hasRegisteredReading('uuid-1234');

      expect(result).toBe(false);
    });
  });
});
