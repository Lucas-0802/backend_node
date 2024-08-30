import { ReadingRepository } from '../../repositories/ReadingRepository';
import prismaClient from '../../prisma';

jest.mock('../prisma');

describe('ReadingRepository', () => {
  let repository: ReadingRepository;

  beforeEach(() => {
    repository = new ReadingRepository();
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return readings filtered by customer_code and measure_type', async () => {
      const mockReadings = [
        { measure_uuid: 'uuid-1', measure_value: 42 },
        { measure_uuid: 'uuid-2', measure_value: 43 },
      ];
      prismaClient.readings.findMany = jest.fn().mockResolvedValue(mockReadings);

      const result = await repository.findById('customer-123', 'type1');

      expect(prismaClient.readings.findMany).toHaveBeenCalledWith({
        where: {
          customer_code: 'customer-123',
          measure_type: 'TYPE1',
        },
      });
      expect(result).toEqual(mockReadings);
    });

    it('should return readings filtered only by customer_code if measure_type is null', async () => {
      const mockReadings = [
        { measure_uuid: 'uuid-1', measure_value: 42 },
        { measure_uuid: 'uuid-2', measure_value: 43 },
      ];
      prismaClient.readings.findMany = jest.fn().mockResolvedValue(mockReadings);

      const result = await repository.findById('customer-123', null);

      expect(prismaClient.readings.findMany).toHaveBeenCalledWith({
        where: {
          customer_code: 'customer-123',
        },
      });
      expect(result).toEqual(mockReadings);
    });
  });
});
