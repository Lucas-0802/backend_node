import { ConfirmService } from '../../services/ConfirmService';
import { IReadingRepository } from '../../services/UploadService';
import { AppError } from '../../services/AppError';
import { IConfirmBody } from '../../interfaces/IConfirmBody';

// Mocks
const mockReadingRepository: jest.Mocked<IReadingRepository> = {
  findByUuid: jest.fn(),
  hasRegisteredReading: jest.fn(),
  confirmReading: jest.fn(),
} as any;

describe('ConfirmService', () => {
  let confirmService: ConfirmService;

  beforeEach(() => {
    confirmService = new ConfirmService(mockReadingRepository);
    jest.clearAllMocks();
  });

  it('should throw an error if the measure is not found', async () => {
    mockReadingRepository.findByUuid.mockResolvedValue(false);

    const confirmData: IConfirmBody = {
      measure_uuid: 'some-uuid',
      confirmed_value: 42,
    };

    await expect(confirmService.handle(confirmData)).rejects.toThrow(
      new AppError('MEASURE NOT FOUND', 'Leitura não encontrada', 404)
    );

    expect(mockReadingRepository.findByUuid).toHaveBeenCalledWith('some-uuid');
    expect(mockReadingRepository.hasRegisteredReading).not.toHaveBeenCalled();
    expect(mockReadingRepository.confirmReading).not.toHaveBeenCalled();
  });

  it('should throw an error if the measure has already been confirmed', async () => {
    mockReadingRepository.findByUuid.mockResolvedValue(true);
    mockReadingRepository.hasRegisteredReading.mockResolvedValue(true);

    const confirmData: IConfirmBody = {
      measure_uuid: 'some-uuid',
      confirmed_value: 42,
    };

    await expect(confirmService.handle(confirmData)).rejects.toThrow(
      new AppError('CONFIRMATION DUPLICATE', 'Leitura do mês já realizada', 409)
    );

    expect(mockReadingRepository.findByUuid).toHaveBeenCalledWith('some-uuid');
    expect(mockReadingRepository.hasRegisteredReading).toHaveBeenCalledWith('some-uuid');
    expect(mockReadingRepository.confirmReading).not.toHaveBeenCalled();
  });

  it('should return success if the measure is confirmed successfully', async () => {
    mockReadingRepository.findByUuid.mockResolvedValue(true);
    mockReadingRepository.hasRegisteredReading.mockResolvedValue(false);
    mockReadingRepository.confirmReading.mockResolvedValue(true);

    const confirmData: IConfirmBody = {
      measure_uuid: 'some-uuid',
      confirmed_value: 42,
    };

    const result = await confirmService.handle(confirmData);

    expect(mockReadingRepository.findByUuid).toHaveBeenCalledWith('some-uuid');
    expect(mockReadingRepository.hasRegisteredReading).toHaveBeenCalledWith('some-uuid');
    expect(mockReadingRepository.confirmReading).toHaveBeenCalledWith('some-uuid', 42);
    expect(result).toEqual({ success: true });
  });

  it('should return failure if the measure confirmation fails', async () => {
    mockReadingRepository.findByUuid.mockResolvedValue(true);
    mockReadingRepository.hasRegisteredReading.mockResolvedValue(false);
    mockReadingRepository.confirmReading.mockResolvedValue(false);

    const confirmData: IConfirmBody = {
      measure_uuid: 'some-uuid',
      confirmed_value: 42,
    };

    const result = await confirmService.handle(confirmData);

    expect(mockReadingRepository.findByUuid).toHaveBeenCalledWith('some-uuid');
    expect(mockReadingRepository.hasRegisteredReading).toHaveBeenCalledWith('some-uuid');
    expect(mockReadingRepository.confirmReading).toHaveBeenCalledWith('some-uuid', 42);
    expect(result).toEqual({ success: false });
  });
});
