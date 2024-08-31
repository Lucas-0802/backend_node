import { IRead } from "../services/UploadService";

export interface IReadingRepository {
  hasReading(
    customer_code: string,
    measure_type: string,
    year: number,
    month: number
  ): Promise<boolean>;

  readImage(image: string): Promise<{ value: number; url: string }>;
  insert(read: IRead): Promise<string>;
  findByUuid(uuid: string): Promise<Boolean>;
  hasRegisteredReading(uuid: string): Promise<Boolean>;
  confirmReading(uuid: string, confirmed_value: number): Promise<Boolean>;
  fetch(customer_code: string, measure_type: string | null): Promise<Record<string, unknown>[]>;
}
