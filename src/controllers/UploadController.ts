import { FastifyRequest, FastifyReply } from 'fastify';
import { UploadService } from '../services/UploadService';
import { uploadSchema } from '../validations/UploadValidation'; 
import { IUploadBody } from '../interfaces/IUploadBody';
import { ReadingRepository } from '../repositories/ReadingRepository';

export async function UploadController(request: FastifyRequest<{ Body: IUploadBody }>, reply: FastifyReply) { 

  const validationResult = uploadSchema.safeParse(request.body);
 
  if (!validationResult.success) { 
    const errors = validationResult.error.errors.map(e => ({
      error_code:"INVALID_DATA",
      error_description: e.message,
    }));
  
    return reply.code(400).send({ errors }); 
  }
 
  const { image, customer_code, measure_datetime, measure_type } = validationResult.data;

  const baseURLImages = process.env.BASE_URL_IMAGES ?? 'http://localhost:3000/'
  const uploadService = new UploadService(new ReadingRepository(), baseURLImages);

  const result = await uploadService.handle({image, customer_code, measure_datetime, measure_type})

  return reply.send(result);
}
