import { IConfirmBody } from "../interfaces/IConfirmBody";
import { AppError } from "./AppError";
import { IReadingRepository } from "../interfaces/IReadingRepository";

class ConfirmService {
  constructor(private readingRepository: IReadingRepository) {}

  async handle({ measure_uuid, confirmed_value }: IConfirmBody) {

    const reading = await this.readingRepository.findByUuid(measure_uuid);

    if (!reading) {
      throw new AppError("MEASURE_NOT_FOUND", "Leitura não encontrada", 404);
    }

    const duplicate = await this.readingRepository.hasRegisteredReading(measure_uuid);

    if (duplicate) {      
      throw new AppError(
        "CONFIRMATION_DUPLICATE",
        "Leitura do mês já realizada",
        409
      );
    }

    const result = await this.readingRepository.confirmReading(
      measure_uuid,
      confirmed_value
    );

    return { success: result };
  }
}

export { ConfirmService };
