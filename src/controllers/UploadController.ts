import { FastifyRequest, FastifyReply } from 'fastify';
import { UploadService } from '../services/UploadService';
import { uploadSchema } from '../validations/UploadValidation'; 
import { IUploadBody } from '../interfaces/IUploadBody';

export async function UploadController(request: FastifyRequest<{ Body: IUploadBody }>, reply: FastifyReply) {

  const validationResult = uploadSchema.safeParse(request.body);

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map(e => e.message).join(", ");
    return reply.code(400).send({ error: errors });
  }

  const { image, measure_datetime, measure_type } = validationResult.data;

  const result = await UploadService.checkReading(measure_datetime, measure_type)

  if (result.length > 0) {
    return reply.code(409).send({ error: "Já existe uma leitura para este tipo no mês atual" });
  }

  const resolve = ''

  reply.send(resolve);
}
