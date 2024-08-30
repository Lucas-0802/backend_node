import { FastifyReply, FastifyRequest } from "fastify";
import { ListController } from "../../controllers/ListController";
import { IListId } from "../../interfaces/IListId";
import { IListQuery } from "../../interfaces/IListQuery";
import { ListService } from "../../services/ListService";
import { ReadingRepository } from "../../repositories/ReadingRepository";

// Mocks
jest.mock("../../services/ListService");
jest.mock("../../repositories/ReadingRepository");

describe("ListController", () => {
  let request: Partial<FastifyRequest<{ Params: IListId; Querystring: IListQuery }>>;
  let reply: Partial<FastifyReply>;

  beforeEach(() => {
    request = {
      params: {
        customer_code: "some-customer-code",
      },
      query: {
        measure_type: "some-measure-type",
      },
    };

    reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if validation fails", async () => {
    request.params = { customer_code: "" }; // Invalid customer_code
    request.query = { measure_type: "invalid-measure-type" }; // Assuming this is invalid

    await ListController(request as FastifyRequest<{ Params: IListId; Querystring: IListQuery }>, reply as FastifyReply);

    expect(reply.code).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.any(String),
    }));
  });

  it("should call ListService and return result on success", async () => {
    const mockResult = {
        customer_code: "some-customer-code",
        measures: [
            {
                measure_uuid: "some-uuid",
                measure_datetime: new Date().toISOString(),
                measure_type: "some-type",
                has_confirmed: true,
                measure_value: 42,
                image_url: "http://example.com/image.png",
            },
        ],
    };
    
    const listServiceMock = ListService as jest.MockedClass<typeof ListService>;
    listServiceMock.prototype.handle.mockResolvedValue(mockResult);

    await ListController(request as FastifyRequest<{ Params: IListId; Querystring: IListQuery }>, reply as FastifyReply);

    expect(ListService).toHaveBeenCalledWith(expect.any(ReadingRepository));
    expect(reply.send).toHaveBeenCalledWith(mockResult);
  });

  it("should return 500 if ListService throws an error", async () => {
    const listServiceMock = ListService as jest.MockedClass<typeof ListService>;
    listServiceMock.prototype.handle.mockRejectedValue(new Error("Internal Server Error"));

    await ListController(request as FastifyRequest<{ Params: IListId; Querystring: IListQuery }>, reply as FastifyReply);

    expect(reply.code).toHaveBeenCalledWith(500);
    expect(reply.send).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});
