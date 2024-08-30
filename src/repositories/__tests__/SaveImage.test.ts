import fs from 'fs';
import path from 'path';
import { ReadingRepository } from '../../repositories/ReadingRepository';

jest.mock('fs');

describe('ReadingRepository', () => {
  let repository: ReadingRepository;

  beforeEach(() => {
    repository = new ReadingRepository();
    jest.clearAllMocks();
  });

  describe('saveImage', () => {
    it('should save the image and return the file path', async () => {
      const mockWriteFileSync = jest.spyOn(fs, 'writeFileSync').mockImplementation();
      const mockJoin = jest.spyOn(path, 'join').mockReturnValue('images/image-123.jpg');

      const image = 'base64encodedimage';
      const filePath = await repository.saveImage(image);

      expect(mockJoin).toHaveBeenCalledWith('images', expect.any(String));
      expect(mockWriteFileSync).toHaveBeenCalledWith('images/image-123.jpg', expect.any(Buffer));
      expect(filePath).toBe('images/image-123.jpg');
    });
  });
});
