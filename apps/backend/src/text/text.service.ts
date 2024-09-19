import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TextEntity } from './entity/text.entity';
import { Repository } from 'typeorm';
import { TextDTO } from './dto/text.dto';
import { TextCreateDTO } from './dto/text.create.dto';

@Injectable()
export class TextService {
    constructor(
        @InjectRepository(TextEntity)
        private textRepository: Repository<TextEntity>,
    ) { }

    async findTextById(id: string): Promise<TextEntity> {
        if (!id) throw new BadRequestException();
        return await this.textRepository.findOne({ where: { id } })
    }

    async findAllTextByChatId(id: string): Promise<TextEntity[]> {
        if (!id) throw new BadRequestException();
        return await this.textRepository.find(
            {
                where: {
                    chatId: id
                },
                order: {
                    createdTime: 'ASC',
                },
            })
    }

    async createText(text: TextCreateDTO): Promise<TextEntity> {
        if (!text) throw new BadRequestException();
        return await this.textRepository.save(text);
    }

    async updateText(text: TextDTO): Promise<TextEntity> {
        if (!text) throw new BadRequestException();
        return await this.textRepository.save(text);
    }

    async deleteText(id: string): Promise<number> {
        if (!id) throw new BadRequestException();
        return (await this.textRepository.delete(id)).affected;
    }
}
