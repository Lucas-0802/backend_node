import { FastifyReply, FastifyRequest } from "fastify";
import { listSchema } from "../validations/ListValidation";
import { IListId } from "../interfaces/IListId";


export async function ListController(request: FastifyRequest<{ Params: IListId }>, reply: FastifyReply) {

    const validationResult = listSchema.safeParse(request.params.id);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message).join(", ");
      return reply.code(400).send({ error: errors });
    }

}