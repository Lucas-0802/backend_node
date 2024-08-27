import prismaClient from "../prisma";

export interface IcheckReading {
  measure_datetime: string;
  measure_type: string;
}

class UploadService {
  async checkReading({measure_datetime, measure_type} : IcheckReading) {
    const [year, month] = measure_datetime.split("-").map(Number);
  
    const readings = await prismaClient.readings.findMany({
      where: {
        measure_type: measure_type,
        AND: [
          {
            measure_datetime: {
              gte: new Date(year, month - 1, 1) 
            }
          },
          {
            measure_datetime: {
              lt: new Date(year, month, 1) 
            }
          }
        ]
      }
    });
  
    return readings;
  }
  
}

export { UploadService };
