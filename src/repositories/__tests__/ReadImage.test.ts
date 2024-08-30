import { GoogleGenerativeAI } from "@google/generative-ai";
import { ReadingRepository } from "../../repositories/ReadingRepository";
import { GoogleAIFileManager } from "@google/generative-ai/server";

jest.mock('@google/generative-ai');
jest.mock('../repositories/ReadingRepository');

describe('ReadingRepository', () => {
  let repository: ReadingRepository;

  beforeEach(() => {
    repository = new ReadingRepository();
    jest.clearAllMocks();
  });

  describe('readImage', () => {
    it('should read the image and return the value and url', async () => {
      const mockSaveImage = jest.spyOn(repository, 'saveImage').mockResolvedValue('image-path');
      const mockUploadFile = jest.fn().mockResolvedValue({
        file: {
          mimeType: 'image/jpeg',
          uri: 'uploaded-uri',
        },
      });
      GoogleAIFileManager.prototype.uploadFile = mockUploadFile;

      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue('12345'),
        },
      });
      GoogleGenerativeAI.prototype.getGenerativeModel = jest.fn().mockReturnValue({
        generateContent: mockGenerateContent,
      });

      const image = 'data:image/jpeg;base64,someimagebase64string';
      const result = await repository.readImage(image);

      expect(mockSaveImage).toHaveBeenCalledWith('someimagebase64string');
      expect(mockUploadFile).toHaveBeenCalledWith('image-path', {
        mimeType: 'image/jpeg',
        displayName: 'Reading',
      });
      expect(result).toEqual({ value: 12345, url: 'image-path' });
    });
  });
});
