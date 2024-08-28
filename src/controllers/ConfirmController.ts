import { FastifyReply, FastifyRequest } from "fastify";
import { IConfirmBody } from "../interfaces/IConfirmBody";
import { confirmSchema } from "../validations/ConfirmValidation";


export async function ConfirmController(request: FastifyRequest<{ Body: IConfirmBody }>, reply: FastifyReply) {

    const validationResult = confirmSchema.safeParse(request.body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message).join(", ");
      return reply.code(400).send({ error: errors });
    }
}