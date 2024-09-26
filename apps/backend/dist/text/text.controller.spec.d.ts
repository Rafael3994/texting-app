import { TextEntity } from './entity/text.entity';
import { TextDTO } from './dto/text.dto';
import { TextCreateDTO } from './dto/text.create.dto';
export declare const mockTextEntity: TextEntity[];
export declare const mockTextDTO: TextDTO[];
export declare const mockTextCreateDTO: TextCreateDTO;
export declare const mockTextService: {
    deleteText: () => 0 | 1;
    findTextById: () => TextEntity;
    createText: () => TextEntity;
    updateText: () => TextEntity;
};
