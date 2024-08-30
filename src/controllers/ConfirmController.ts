import { FastifyReply, FastifyRequest } from "fastify";
import { IConfirmBody } from "../interfaces/IConfirmBody";
import { confirmSchema } from "../validations/ConfirmValidation";
import { ConfirmService } from "../services/ConfirmService";
import { ReadingRepository } from "../repositories/ReadingRepository";

export async function ConfirmController(request: FastifyRequest<{ Body: IConfirmBody }>, reply: FastifyReply) {

    const validationResult = confirmSchema.safeParse(request.body);  
    if (!validationResult.success) {    
      const errors = validationResult.error.errors.map(e => ({
        error_code: "INVALID_DATA",
        error_description: e.message,
      }));
    
      return reply.code(400).send({ errors }); 
    }

    const { measure_uuid, confirmed_value } = validationResult.data;  

    const confirmService = new ConfirmService(new ReadingRepository());

    const result = await confirmService.handle({measure_uuid, confirmed_value});

    return reply.send(result);
}