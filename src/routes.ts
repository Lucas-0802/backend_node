import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { UploadController } from "./controllers/UploadController";
import { ConfirmController } from "./controllers/ConfirmController";
import { ListController } from "./controllers/ListController";
import { IUploadBody } from "./interfaces/IUploadBody";
import { IConfirmBody } from "./interfaces/IConfirmBody";
import { IListId } from "./interfaces/IListId";
import { AppError } from "./services/AppError";
import { IListQuery } from "./interfaces/IListQuery";

async function handleErrors(reply: FastifyReply, controllerCallback: Function) {
  try {    
    await controllerCallback();
  } catch (error) {    
    const { code = 'Server error', message, statusCode = 500 } = error as AppError;
    return reply.code(statusCode).send({ error_code: code, error_description: message });
  }
}

export async function routes(fastify: FastifyInstance) {
  fastify.post(
    "/upload",
    async (
      request: FastifyRequest<{ Body: IUploadBody }>,
      reply: FastifyReply
    ) => {      
      await handleErrors(reply, () => UploadController(request, reply));
    }
  );

  fastify.patch(
    "/confirm",
    async (
      request: FastifyRequest<{ Body: IConfirmBody }>,
      reply: FastifyReply
    ) => {
      await handleErrors(reply, () => ConfirmController(request, reply));
    }
  );

  fastify.get(
    "/:customer_code/list",
    async (
      request: FastifyRequest<{ Params: IListId; Querystring: IListQuery }>,
      reply: FastifyReply
    ) => {
      await handleErrors(reply, () => ListController(request, reply));
    }
  );
}
