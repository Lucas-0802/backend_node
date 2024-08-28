import { FastifyReply, FastifyRequest } from "fastify";
import { listSchema } from "../validations/ListValidation";
import { IListId } from "../interfaces/IListId";
import { ReadingRepository } from "../repositories/ReadingRepository";
import { ListService } from "../services/ListService";

export async function ListController(
  request: FastifyRequest<{ Params: IListId; Querystring: IListQuery }>,
  reply: FastifyReply
) {
    
  const customer_code = request.params.customer_code;
  const measure_type = request.query.measure_type ?? null;      

  const validationResult = listSchema.safeParse({ customer_code, measure_type });

  if (!validationResult.success) {
    const errors = validationResult.error.errors
      .map((e) => e.message)
      .join(", ");
    return reply.code(400).send({ error: errors });
  }

  const listService = new ListService(new ReadingRepository()); 

  const result = await listService.handle( customer_code, measure_type );

  return reply.send(result);
}
