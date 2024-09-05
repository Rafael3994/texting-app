import { Test, TestingModule } from '@nestjs/testing';
import { TextService } from './text.service';
import { mockRepository, TypeMockRepository } from '@src/user/user.service.spec';
import { BadRequestException, Logger } from '@nestjs/common';
import { TextEntity } from './entity/text.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockTextCreateDTO, mockTextDTO, mockTextEntity } from './text.controller.spec';

describe('TextService', () => {
  let textService: TextService;
  let textRepository: TypeMockRepository;
  const mockTextId = mockTextEntity[0].id;

  beforeEach(async () => {
    // jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TextService,
        Logger,
        {
          provide:
            getRepositoryToken(TextEntity),
          useValue: mockRepository(),
        }
      ],
    }).compile();

    textService = module.get<TextService>(TextService);
    textRepository = module.get<TypeMockRepository>(getRepositoryToken(TextEntity));
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  describe('findTextById', () => {
    it('should return a text.', async () => {
      // jest.spyOn(textRepository, 'findOne').mockResolvedValue(mockTextEntity[0]);
      textRepository.findOne.mockReturnValue(mockTextEntity);
      const result = await textService.findTextById(mockTextId);

      expect(result).toEqual(mockTextEntity);
    });

    it('should throw BadRequestException if id is invalid.', async () => {
      await expect(textService.findTextById('')).rejects.toThrow(BadRequestException);
    });
  });

  describe('createText', () => {
    it('should return a created text.', async () => {
      jest.spyOn(textRepository, 'save').mockResolvedValue(mockTextEntity);

      const result = await textService.createText(mockTextCreateDTO);

      expect(result).toEqual(mockTextEntity);
      expect(textRepository.save).toHaveBeenCalledWith(mockTextCreateDTO);
    });

    it('should throw BadRequestException if id is invalid.', async () => {
      await expect(textService.createText(null)).rejects.toThrow(BadRequestException);
      await expect(textService.createText(undefined)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateText', () => {
    it('should return a updated text.', async () => {
      jest.spyOn(textRepository, 'save').mockResolvedValue(mockTextEntity);

      const result = await textService.updateText(mockTextDTO[0]);

      expect(result).toEqual(mockTextEntity);
      expect(textRepository.save).toHaveBeenCalledWith(mockTextDTO[0]);
    });

    it('should throw BadRequestException if id is invalid.', async () => {
      await expect(textService.updateText(null)).rejects.toThrow(BadRequestException);
      await expect(textService.updateText(undefined)).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteText', () => {
    it('should return a deleted text.', async () => {
      const deleteResult = { affected: 1 };
      jest.spyOn(textRepository, 'delete').mockResolvedValue(deleteResult);

      const result = await textService.deleteText(mockTextId);

      expect(result).toBe(1);
      expect(textRepository.delete).toHaveBeenCalledWith(mockTextId);
    });

    it('should throw BadRequestException if id is invalid.', async () => {
      await expect(textService.deleteText(null)).rejects.toThrow(BadRequestException);
      await expect(textService.deleteText(undefined)).rejects.toThrow(BadRequestException);
    });
  });
}); 
