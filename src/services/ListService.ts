import { AppError } from "./AppError";
import { IReadingRepository } from "../interfaces/IReadingRepository";

class ListService {
  constructor(private readingRepository: IReadingRepository, private baseUrlImage: string) {}

  async handle(customer_code: string, measure_type: string | null) {
    const readings = await this.readingRepository.fetch(
      customer_code,
      measure_type
    );

    if (!readings.length) {
      throw new AppError(
        "MEASURES_NOT_FOUND",
        "Nenhuma leitura encontrada",
        404
      );
    }

    return {
      customer_code: customer_code,
      measures: readings.map(value => {
        return {
          measure_uuid: value.measure_uuid,
          measure_datetime: value.measure_datetime,
          measure_type: value.measure_type,
          
          has_confirmed: value.has_confirmed,
          measure_value: value.measure_value,
          image_url: `${this.baseUrlImage}${value.image_url}`,
        };
      }),
    };
  }
}

export { ListService };