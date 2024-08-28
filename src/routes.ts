import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { UploadController } from "./controllers/UploadController";
import { ConfirmController } from "./controllers/ConfirmController";
import { ListController } from "./controllers/ListController";
import { IUploadBody } from "./interfaces/IUploadBody";
import { IConfirmBody } from "./interfaces/IConfirmBody";
import { IListId } from "./interfaces/IListId";
import { AppError } from "./services/AppError";

async function handleErrors(reply: FastifyReply, controllerCallback: Function) {
  try {    
    await controllerCallback();
  } catch (error) {
    const { code = 'Server error', message, statusCode = 500 } = error as AppError;
    return reply.code(statusCode).send({ error_code: code, error_message: message });
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
      await ConfirmController(request, reply);
    }
  );

  fastify.get(
    "/{id}/list",
    async (
      request: FastifyRequest<{ Params: IListId }>,
      reply: FastifyReply
    ) => {
      await ListController(request, reply);
    }
  );
}
