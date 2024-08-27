import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { UploadController } from './controllers/UploadController';
import { IUploadBody } from './interfaces/IUploadBody';  

export async function routes(fastify: FastifyInstance) {
  
  fastify.post('/upload', async (request: FastifyRequest<{ Body: IUploadBody }>, reply: FastifyReply) => {
    await UploadController(request, reply); 
  });
}
