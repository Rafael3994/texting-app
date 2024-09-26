"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const text_entity_1 = require("./entity/text.entity");
const typeorm_2 = require("typeorm");
let TextService = class TextService {
    constructor(textRepository) {
        this.textRepository = textRepository;
    }
    async findTextById(id) {
        if (!id)
            throw new common_1.BadRequestException();
        return await this.textRepository.findOne({ where: { id } });
    }
    async findAllTextByChatId(id) {
        if (!id)
            throw new common_1.BadRequestException();
        return await this.textRepository.find({
            where: {
                chatId: id
            },
            order: {
                createdTime: 'ASC',
            },
        });
    }
    async createText(text) {
        if (!text)
            throw new common_1.BadRequestException();
        return await this.textRepository.save(text);
    }
    async updateText(text) {
        if (!text)
            throw new common_1.BadRequestException();
        return await this.textRepository.save(text);
    }
    async deleteText(id) {
        if (!id)
            throw new common_1.BadRequestException();
        return (await this.textRepository.delete(id)).affected;
    }
};
TextService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(text_entity_1.TextEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TextService);
exports.TextService = TextService;
//# sourceMappingURL=text.service.js.map