import { ReadingRepository } from '../../repositories/ReadingRepository';
import prismaClient from '../../prisma';

jest.mock('../prisma');

describe('ReadingRepository', () => {
  let repository: ReadingRepository;

  beforeEach(() => {
    repository = new ReadingRepository();
    jest.clearAllMocks();
  });

  describe('findByUuid', () => {
    it('should return true if reading with given uuid exists', async () => {
      prismaClient.readings.findUnique = jest.fn().mockResolvedValue({});

      const result = await repository.findByUuid('uuid-1234');

      expect(prismaClient.readings.findUnique).toHaveBeenCalledWith({
        where: { measure_uuid: 'uuid-1234' },
      });
      expect(result).toBe(true);
    });

    it('should return false if reading with given uuid does not exist', async () => {
      prismaClient.readings.findUnique = jest.fn().mockResolvedValue(null);

      const result = await repository.findByUuid('uuid-1234');

      expect(result).toBe(false);
    });
  });
});
