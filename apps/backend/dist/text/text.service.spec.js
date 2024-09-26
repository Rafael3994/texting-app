"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const text_service_1 = require("./text.service");
const user_service_spec_1 = require("../user/user.service.spec");
const common_1 = require("@nestjs/common");
const text_entity_1 = require("./entity/text.entity");
const typeorm_1 = require("@nestjs/typeorm");
const text_controller_spec_1 = require("./text.controller.spec");
const webSockets_gateway_1 = require("../web-sockets/webSockets.gateway");
describe('TextService', () => {
    let textService;
    let textRepository;
    const mockTextId = text_controller_spec_1.mockTextEntity[0].id;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                text_service_1.TextService,
                common_1.Logger,
                webSockets_gateway_1.WebSocketsGateway,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(text_entity_1.TextEntity),
                    useValue: (0, user_service_spec_1.mockRepository)(),
                }
            ],
        }).compile();
        textService = module.get(text_service_1.TextService);
        textRepository = module.get((0, typeorm_1.getRepositoryToken)(text_entity_1.TextEntity));
    });
    describe('findTextById', () => {
        it('should return a text.', async () => {
            textRepository.findOne.mockReturnValue(text_controller_spec_1.mockTextEntity);
            const result = await textService.findTextById(mockTextId);
            expect(result).toEqual(text_controller_spec_1.mockTextEntity);
        });
        it('should throw BadRequestException if id is invalid.', async () => {
            await expect(textService.findTextById('')).rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('createText', () => {
        it('should return a created text.', async () => {
            jest.spyOn(textRepository, 'save').mockResolvedValue(text_controller_spec_1.mockTextEntity);
            const result = await textService.createText(text_controller_spec_1.mockTextCreateDTO);
            expect(result).toEqual(text_controller_spec_1.mockTextEntity);
            expect(textRepository.save).toHaveBeenCalledWith(text_controller_spec_1.mockTextCreateDTO);
        });
        it('should throw BadRequestException if id is invalid.', async () => {
            await expect(textService.createText(null)).rejects.toThrow(common_1.BadRequestException);
            await expect(textService.createText(undefined)).rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('updateText', () => {
        it('should return a updated text.', async () => {
            jest.spyOn(textRepository, 'save').mockResolvedValue(text_controller_spec_1.mockTextEntity);
            const result = await textService.updateText(text_controller_spec_1.mockTextDTO[0]);
            expect(result).toEqual(text_controller_spec_1.mockTextEntity);
            expect(textRepository.save).toHaveBeenCalledWith(text_controller_spec_1.mockTextDTO[0]);
        });
        it('should throw BadRequestException if id is invalid.', async () => {
            await expect(textService.updateText(null)).rejects.toThrow(common_1.BadRequestException);
            await expect(textService.updateText(undefined)).rejects.toThrow(common_1.BadRequestException);
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
            await expect(textService.deleteText(null)).rejects.toThrow(common_1.BadRequestException);
            await expect(textService.deleteText(undefined)).rejects.toThrow(common_1.BadRequestException);
        });
    });
});
//# sourceMappingURL=text.service.spec.js.map