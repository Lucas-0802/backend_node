import { IConfirmBody } from "../interfaces/IConfirmBody";
import { AppError } from "./AppError";
import { IReadingRepository } from "./UploadService";

class ConfirmService {
  constructor(private readingRepository: IReadingRepository) {}

  async handle({ measure_uuid, confirmed_value }: IConfirmBody) {
    const reading = await this.readingRepository.findByUuid(measure_uuid);

    if (!reading) {
      throw new AppError("MEASURE NOT FOUND", "Leitura não encontrada", 404);
    }

    const duplicate =
      await this.readingRepository.hasRegisteredReading(measure_uuid);

    if (duplicate) {
      throw new AppError(
        "CONFIRMATION DUPLICATE",
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
