import { FastifyReply, FastifyRequest } from 'fastify';
import { ConfirmController } from '../../controllers/ConfirmController';
import { IConfirmBody } from '../../interfaces/IConfirmBody';
import { ConfirmService } from '../../services/ConfirmService';
import { ReadingRepository } from '../../repositories/ReadingRepository';

// Mocks
jest.mock('../../services/ConfirmService');
jest.mock('../../repositories/ReadingRepository');

describe('ConfirmController', () => {
  let request: Partial<FastifyRequest<{ Body: IConfirmBody }>>;
  let reply: Partial<FastifyReply>;

  beforeEach(() => {
    request = {
      body: {
        measure_uuid: 'some-uuid',
        confirmed_value: 42,
      } as IConfirmBody,
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
    request.body = { measure_uuid: '', confirmed_value: NaN } as IConfirmBody;

    await ConfirmController(request as FastifyRequest<{ Body: IConfirmBody }>, reply as FastifyReply);

    expect(reply.code).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.any(String),
    }));
  });

  it('should call ConfirmService and return result on success', async () => {
    const mockResult = { success: true };
    const confirmServiceMock = ConfirmService as jest.MockedClass<typeof ConfirmService>;
    confirmServiceMock.prototype.handle.mockResolvedValue(mockResult);

    await ConfirmController(request as FastifyRequest<{ Body: IConfirmBody }>, reply as FastifyReply);

    expect(ConfirmService).toHaveBeenCalledWith(expect.any(ReadingRepository));
    expect(reply.send).toHaveBeenCalledWith(mockResult);
  });

  it('should return 500 if ConfirmService throws an error', async () => {
    const confirmServiceMock = ConfirmService as jest.MockedClass<typeof ConfirmService>;
    confirmServiceMock.prototype.handle.mockRejectedValue(new Error('Internal Server Error'));

    await ConfirmController(request as FastifyRequest<{ Body: IConfirmBody }>, reply as FastifyReply);

    expect(reply.code).toHaveBeenCalledWith(500);
    expect(reply.send).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
