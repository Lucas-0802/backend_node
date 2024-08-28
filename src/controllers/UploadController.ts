import { FastifyRequest, FastifyReply } from 'fastify';
import { UploadService } from '../services/UploadService';
import { uploadSchema } from '../validations/UploadValidation'; 
import { IUploadBody } from '../interfaces/IUploadBody';
import { ReadingRepository } from '../repositories/ReadingRepository';

export async function UploadController(request: FastifyRequest<{ Body: IUploadBody }>, reply: FastifyReply) {

  const validationResult = uploadSchema.safeParse(request.body);

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map(e => e.message).join(", ");
    return reply.code(400).send({ error: errors });
  }
 
  const { image, customer_code, measure_datetime, measure_type } = validationResult.data;

  const uploadService = new UploadService(new ReadingRepository());

  const result = await uploadService.handle({image, customer_code, measure_datetime, measure_type})

  return reply.send(result);
}
