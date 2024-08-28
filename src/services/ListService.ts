import { AppError } from "./AppError";
import { IReadingRepository } from "./UploadService";


class ListService {

    constructor(private readingRepository: IReadingRepository) {}

    async handle(customer_code : string, measure_type : string | null) {
        const reading = await this.readingRepository.findById(customer_code, measure_type);

        if (!reading) {
            throw new AppError("READING NOT FOUND", "Leitura não encontrada", 404);
        }        

        if (Array.isArray(reading) && reading.length === 0) {
            throw new AppError("MEASURES_NOT_FOUND", "Nenhuma leitura encontrada", 404);
          }  

    return reading;
      
    }

}

export { ListService };