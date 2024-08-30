import { ReadingRepository } from '../../repositories/ReadingRepository';
import prismaClient from '../../prisma';

jest.mock('../prisma');

describe('ReadingRepository', () => {
  let repository: ReadingRepository;

  beforeEach(() => {
    repository = new ReadingRepository();
    jest.clearAllMocks();
  });

  describe('insert', () => {
    it('should insert a new reading and return the measure_uuid', async () => {
      prismaClient.readings.create = jest.fn().mockResolvedValue({
        measure_uuid: 'uuid-1234',
      });

      const read = {
        customer_code: '123',
        measure_datetime: '2024-08-01T00:00:00.000Z',
        measure_type: 'type',
        measure_value: 42,
        image_url: 'http://example.com/image.jpg',
      };

      const result = await repository.insert(read);

      expect(prismaClient.readings.create).toHaveBeenCalledWith({
        data: {
          customer_code: read.customer_code,
          measure_datetime: new Date(read.measure_datetime),
          measure_type: read.measure_type,
          measure_value: read.measure_value,
          image_url: read.image_url,
          has_confirmed: false,
        },
      });
      expect(result).toBe('uuid-1234');
    });
  });
});
