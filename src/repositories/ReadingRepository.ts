import { GoogleGenerativeAI } from "@google/generative-ai";
import { IReadingRepository } from "../services/UploadService";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs";
import path from "path";

class ReadingRepository implements IReadingRepository {
  async hasReading(
    customer_code: string,
    measure_type: string,
    year: number,
    month: number
  ): Promise<boolean> {
    return false;
    // const readings = await prismaClient.readings.findMany({
    //   where: {
    //     measure_type: measure_type,
    //     customer_code: customer_code,
    //     AND: [
    //       {
    //         measure_datetime: {
    //           gte: new Date(year, month - 1, 1),
    //         },
    //       },
    //       {
    //         measure_datetime: {
    //           lt: new Date(year, month, 1),
    //         },
    //       },
    //     ],
    //   },
    // });

    // return readings.length > 0;
  }

   async saveImage(image: string): Promise<string> {
    const imageName = `image-${Date.now()}.jpg`;
    const filePath = path.join('images', imageName);
    const imageBuffer = Buffer.from(image, "base64");
    fs.writeFileSync(filePath, imageBuffer);
    return filePath;
  }

  async readImage(image: string): Promise<{value: number, url: string}> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const fileManager = new GoogleAIFileManager(
      process.env.GEMINI_API_KEY as string
    );

    const imagePath = await this.saveImage(image.split(",")[1]);

    const mimeType = image.split(";")[0].split(":")[1];

    const uploadResponse = await fileManager.uploadFile(imagePath, {
      mimeType: mimeType == 'image/jpg' ? 'image/jpeg' : mimeType,
      displayName: "Reading",
    });

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
    });

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: "Faça a leitura desse medidor, retorne apenas os números" },
    ]);    
    const responseText = result.response.text();
    const trimmedText = responseText.endsWith('.') ? responseText.slice(0, -1) : responseText;
    return {value : +trimmedText, url: imagePath};
  }

  async insert(read: {customer_code: string, measure_datetime: string, measure_type: string, measure_value: number, image_url: string}): Promise<string> {
    // const reading = await prismaClient.readings.create({
    //   data: {
    //     customer_code: read.customer_code,
    //     measure_datetime: new Date(read.measure_datetime),
    //     measure_type: read.measure_type,
    //     measure_value: read.measure_value,
    //     image_url: read.image_url,
    //   },
    // });

    //return reading.id;

    return "1";
  }
}

export { ReadingRepository };
