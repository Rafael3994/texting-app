import { TextEntity } from './entity/text.entity';
import { Repository } from 'typeorm';
import { TextDTO } from './dto/text.dto';
import { TextCreateDTO } from './dto/text.create.dto';
export declare class TextService {
    private textRepository;
    constructor(textRepository: Repository<TextEntity>);
    findTextById(id: string): Promise<TextEntity>;
    findAllTextByChatId(id: string): Promise<TextEntity[]>;
    createText(text: TextCreateDTO): Promise<TextEntity>;
    updateText(text: TextDTO): Promise<TextEntity>;
    deleteText(id: string): Promise<number>;
}
