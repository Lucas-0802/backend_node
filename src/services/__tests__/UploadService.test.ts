import { UploadService } from '.././UploadService';
import { IReadingRepository } from '.././UploadService';
import { AppError } from '.././AppError';
import { IUploadBody } from '../../interfaces/IUploadBody';

// Mocks
const mockReadingRepository: jest.Mocked<IReadingRepository> = {
  hasReading: jest.fn(),
  readImage: jest.fn(),
  insert: jest.fn(),
  findByUuid: jest.fn(),
  hasRegisteredReading: jest.fn(),
  confirmReading: jest.fn(),
  findById: jest.fn(),
} as any;

describe('UploadService', () => {
  let uploadService: UploadService;

  beforeEach(() => {
    uploadService = new UploadService(mockReadingRepository);
    jest.clearAllMocks();
  });

  it('should throw an error if a reading already exists for the month and type', async () => {
    mockReadingRepository.hasReading.mockResolvedValue(true);

    const uploadData: IUploadBody = {
      image: 'base64image',
      customer_code: 'customer-123',
      measure_datetime: '2024-08',
      measure_type: 'type1',
    };

    await expect(uploadService.handle(uploadData)).rejects.toThrow(
      new AppError(
        'DOUBLE REPORT',
        'Já existe uma leitura para este tipo no mês atual',
        409
      )
    );

    expect(mockReadingRepository.hasReading).toHaveBeenCalledWith(
      'customer-123',
      'type1',
      2024,
      8
    );
    expect(mockReadingRepository.readImage).not.toHaveBeenCalled();
    expect(mockReadingRepository.insert).not.toHaveBeenCalled();
  });

  it('should insert a new reading and return the correct response', async () => {
    mockReadingRepository.hasReading.mockResolvedValue(false);
    mockReadingRepository.readImage.mockResolvedValue({
      value: 42,
      url: 'http://example.com/image.jpg',
    });
    mockReadingRepository.insert.mockResolvedValue('uuid-123');

    const uploadData: IUploadBody = {
      image: 'base64image',
      customer_code: 'customer-123',
      measure_datetime: '2024-08',
      measure_type: 'type1',
    };

    const result = await uploadService.handle(uploadData);

    expect(mockReadingRepository.hasReading).toHaveBeenCalledWith(
      'customer-123',
      'type1',
      2024,
      8
    );
    expect(mockReadingRepository.readImage).toHaveBeenCalledWith('base64image');
    expect(mockReadingRepository.insert).toHaveBeenCalledWith({
      customer_code: 'customer-123',
      measure_datetime: '2024-08',
      measure_type: 'type1',
      measure_value: 42,
      image_url: 'http://example.com/image.jpg',
    });
    expect(result).toEqual({
      image_url: 'http://example.com/image.jpg',
      measure_value: 42,
      measure_uuid: 'uuid-123',
    });
  });

  it('should handle any unexpected errors and throw an appropriate error', async () => {
    mockReadingRepository.hasReading.mockRejectedValue(
      new Error('Unexpected Error')
    );

    const uploadData: IUploadBody = {
      image: 'base64image',
      customer_code: 'customer-123',
      measure_datetime: '2024-08',
      measure_type: 'type1',
    };

    await expect(uploadService.handle(uploadData)).rejects.toThrow(
      'Unexpected Error'
    );

    expect(mockReadingRepository.hasReading).toHaveBeenCalledWith(
      'customer-123',
      'type1',
      2024,
      8
    );
    expect(mockReadingRepository.readImage).not.toHaveBeenCalled();
    expect(mockReadingRepository.insert).not.toHaveBeenCalled();
  });
});
