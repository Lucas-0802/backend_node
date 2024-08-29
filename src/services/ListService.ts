import { AppError } from "./AppError";
import { IReadingRepository } from "./UploadService";

class ListService {
  constructor(private readingRepository: IReadingRepository) {}

  async handle(customer_code: string, measure_type: string | null) {
    const reading = await this.readingRepository.findById(
      customer_code,
      measure_type
    );

    if ((Array.isArray(reading) && reading.length === 0) || reading === null) {
      throw new AppError(
        "MEASURES_NOT_FOUND",
        "Nenhuma leitura encontrada",
        404
      );
    }

    return {
      customer_code: customer_code,
      measures: Object.entries(reading).map(([key, value]) => {
        return {
          measure_uuid: value.measure_uuid,
          measure_datetime: value.measure_datetime,
          measure_type: value.measure_type,
          
          has_confirmed: value.has_confirmed,
          measure_value: value.measure_value,
          image_url: value.image_url,
        };
      }),
    };
  }
}

export { ListService };
