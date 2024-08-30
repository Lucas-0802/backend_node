import { FastifyReply, FastifyRequest } from 'fastify';
import { UploadController } from '../../controllers/UploadController';
import { UploadService } from '../../services/UploadService';
import { IUploadBody } from '../../interfaces/IUploadBody';
import { ReadingRepository } from '../../repositories/ReadingRepository';

// Mocks
jest.mock('../../services/UploadService');
jest.mock('../../repositories/ReadingRepository');

describe('UploadController', () => {
  let request: Partial<FastifyRequest<{ Body: IUploadBody }>>;
  let reply: Partial<FastifyReply>;

  beforeEach(() => {
    request = {
      body: {
        image: 'base64encodedimage',
        customer_code: 'some-customer-code',
        measure_datetime: new Date().toISOString(),
        measure_type: 'some-type',
      } as IUploadBody,
    };

    reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if validation fails', async () => {
    // Invalid request body
    request.body = { image: '', customer_code: '', measure_datetime: '', measure_type: '' } as IUploadBody;

    await UploadController(request as FastifyRequest<{ Body: IUploadBody }>, reply as FastifyReply);

    expect(reply.code).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.any(String),
    }));
  });

  it('should call UploadService and return result on success', async () => {
    const mockResult = {
      image_url: "http://example.com/image.png",
      measure_value: 42,
      measure_uuid: "some-uuid",
    };
    const uploadServiceMock = UploadService as jest.MockedClass<typeof UploadService>;
    uploadServiceMock.prototype.handle.mockResolvedValue(mockResult);

    await UploadController(request as FastifyRequest<{ Body: IUploadBody }>, reply as FastifyReply);

    expect(UploadService).toHaveBeenCalledWith(expect.any(ReadingRepository));
    expect(reply.send).toHaveBeenCalledWith(mockResult);
  });

  it('should return 500 if UploadService throws an error', async () => {
    const uploadServiceMock = UploadService as jest.MockedClass<typeof UploadService>;
    uploadServiceMock.prototype.handle.mockRejectedValue(new Error('Internal Server Error'));

    await UploadController(request as FastifyRequest<{ Body: IUploadBody }>, reply as FastifyReply);

    expect(reply.code).toHaveBeenCalledWith(500);
    expect(reply.send).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
