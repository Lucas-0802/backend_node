import { IUploadBody } from "../interfaces/IUploadBody";
import { AppError } from "./AppError";

export interface IRead {
  customer_code: string;
  measure_datetime: string;
  measure_type: string;
  measure_value: number;
  image_url: string;
}

export interface IReadingRepository {
  hasReading(
    customer_code: string,
    measure_type: string,
    year: number,
    month: number
  ): Promise<boolean>;

  readImage(image: string): Promise<{value: number, url: string}>;
  insert(read: IRead): Promise<string>;
}

class UploadService {
  constructor(private readingRepository: IReadingRepository) {}

  async handle({
    image,
    customer_code,
    measure_datetime,
    measure_type,
  }: IUploadBody) {
    const [year, month] = measure_datetime.split("-").map(Number);

    const hasReading = await this.readingRepository.hasReading(
      customer_code,
      measure_type,
      year,
      month
    );

    if (hasReading) {
      throw new AppError(
        "DOUBLE REPORT",
        "Já existe uma leitura para este tipo no mês atual",
        409
      );
    }

    const {value, url} = await this.readingRepository.readImage(image);

    const uuid = await this.readingRepository.insert({
      customer_code,
      measure_datetime,
      measure_type,
      measure_value: value,
      image_url : url,
    });

    return {
      image_url : url,
      measure_value: value,
      measure_uuid: uuid,
    };
  }
}

export { UploadService };
