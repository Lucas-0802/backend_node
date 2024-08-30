import { ListService } from '.././ListService';
import { IReadingRepository } from '.././UploadService';
import { AppError } from '.././AppError';

// Mocks
const mockReadingRepository: jest.Mocked<IReadingRepository> = {
  findById: jest.fn(),
} as any;

describe('ListService', () => {
  let listService: ListService;

  beforeEach(() => {
    listService = new ListService(mockReadingRepository);
    jest.clearAllMocks();
  });

  it('should throw an error if no readings are found', async () => {
    mockReadingRepository.findById.mockResolvedValue([]);

    await expect(listService.handle('customer_code', 'measure_type')).rejects.toThrow(
      new AppError('MEASURES_NOT_FOUND', 'Nenhuma leitura encontrada', 404)
    );

    expect(mockReadingRepository.findById).toHaveBeenCalledWith('customer_code', 'measure_type');
  });

  it('should return the readings if found', async () => {
    const mockReadings = [
      {
        measure_uuid: 'uuid-123',
        measure_datetime: '2024-08-01T00:00:00.000Z',
        measure_type: 'type1',
        has_confirmed: true,
        measure_value: 42,
        image_url: 'http://example.com/image.jpg',
      },
      {
        measure_uuid: 'uuid-456',
        measure_datetime: '2024-08-02T00:00:00.000Z',
        measure_type: 'type2',
        has_confirmed: false,
        measure_value: 36,
        image_url: 'http://example.com/image2.jpg',
      },
    ];

    mockReadingRepository.findById.mockResolvedValue(mockReadings);

    const result = await listService.handle('customer_code', 'measure_type');

    expect(mockReadingRepository.findById).toHaveBeenCalledWith('customer_code', 'measure_type');
    expect(result).toEqual({
      customer_code: 'customer_code',
      measures: [
        {
          measure_uuid: 'uuid-123',
          measure_datetime: '2024-08-01T00:00:00.000Z',
          measure_type: 'type1',
          has_confirmed: true,
          measure_value: 42,
          image_url: 'http://example.com/image.jpg',
        },
        {
          measure_uuid: 'uuid-456',
          measure_datetime: '2024-08-02T00:00:00.000Z',
          measure_type: 'type2',
          has_confirmed: false,
          measure_value: 36,
          image_url: 'http://example.com/image2.jpg',
        },
      ],
    });
  });

  it('should throw an error if reading is null', async () => {
    mockReadingRepository.findById.mockResolvedValue(null);

    await expect(listService.handle('customer_code', 'measure_type')).rejects.toThrow(
      new AppError('MEASURES_NOT_FOUND', 'Nenhuma leitura encontrada', 404)
    );

    expect(mockReadingRepository.findById).toHaveBeenCalledWith('customer_code', 'measure_type');
  });
});
