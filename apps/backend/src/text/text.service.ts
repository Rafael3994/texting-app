import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TextEntity } from './entity/text.entity';
import { Repository } from 'typeorm';
import { TextDTO } from './dto/text.dto';

@Injectable()
export class TextService {
    constructor(
        @InjectRepository(TextEntity)
        private textRepository: Repository<TextEntity>,
    ) { }

    async findTextById(id: string): Promise<TextEntity> {
        return await this.textRepository.findOne({ where: { id } })
    }

    async createText(text: TextDTO): Promise<TextEntity> {
        return await this.textRepository.save(text);
    }

    async updateText(text: TextDTO): Promise<TextEntity> {
        return await this.textRepository.save(text);
    }

    async deleteText(id: string): Promise<number> {
        return (await this.textRepository.delete(id)).affected;
    }
}
