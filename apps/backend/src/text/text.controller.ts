import { Controller, Get, Param, Res, Logger, Post, Body, Put, Delete } from '@nestjs/common';
import { TextService } from './text.service';
import { isNotFound } from 'src/utils/classificatedHttpCode';
import { TextEntity } from './entity/text.entity';
import { TextDTO } from './dto/text.dto';
import { UserService } from 'src/user/user.service';
import { ChatService } from 'src/chat/chat.service';
import { response } from 'express';

@Controller('text')
export class TextController {
    constructor(
        private textService: TextService,
        private userService: UserService,
        private chatService: ChatService,
        private logger: Logger
    ) { }

    @Get(':id')
    async findTextById(
        @Res() response,
        @Param('id') id: string
    ): Promise<any> {
        try {
            if (!id) return response.status(400).send('Incorrect data.');
            this.textService.findTextById(id)
                .then((res: TextEntity) => {
                    if (!isNotFound(res)) return response.status(404).send('Not found.');
                    return response
                        .status(200)
                        .send(TextEntity.parserTextEntityToDTO(res));
                })
                .catch((error) => {
                    throw new Error(error);
                });
        } catch (error) {
            this.logger.error('findTextById', error);
            return response.status(500).send('Something was bad.');
        }
    }

    @Post('')
    async createText(@Res() response, @Body() text: TextDTO): Promise<any> {
        try {

            if (!this.isSanitedText(text)) return response.status(400).send('Incorrect data.');

            if (!(await this.areIdsExists(text.userId, text.chatId)))
                return response.status(404).send('Data ids Not found.');

            this.textService
                .createText(text)
                .then((res: TextEntity) => {
                    return response.status(201).send(
                        TextEntity.parserTextPucblicEntityToDTO(res)
                    );
                })
                .catch((err) => {
                    throw new Error(err);
                });

        } catch (err) {
            this.logger.error('createText', err);
            return response.status(500).send('Something was bad.');
        }
    }

    @Put(':id')
    async updateText(
        @Res() response,
        @Param('id') id: string,
        @Body('text') text: string,
    ): Promise<any> {
        try {
            if (!id) return response.status(400).send('Incorrect data.');
            if (!text) return response.status(400).send('Incorrect data.');

            const foundText = await this.textService.findTextById(id);
            if (!foundText) return response.status(404).send('Not found.');

            this.textService
                .updateText(
                    { ...TextEntity.parserTextEntityToDTO(foundText), text: text }
                )
                .then((res: TextEntity) => {
                    return response.status(201).send(TextEntity.parserTextEntityToDTO(res));
                })
                .catch((err) => {
                    throw new Error(err);
                });

        } catch (err) {
            this.logger.error('updateText', err);
            return response.status(500).send('err: ' + err);
        }
    }

    @Delete(':id')
    async deleteText(
        @Res() response,
        @Param('id') id: string
    ) {
        try {
            if (!id) return response.status(400).send('Incorrect data.');

            const foundText = await this.textService.findTextById(id);
            if (!foundText)
                return response.status(404).send('Not found.');

            this.textService.deleteText(id)
                .then(res => {
                    if (res > 0) return response.status(200).send(TextEntity.parserTextEntityToDTO(foundText));
                    return response.status(404).send('Not Delete.');
                })
                .catch((error) => {
                    throw new Error(error);
                });

        } catch (err) {
            this.logger.error('deleteText', err);
            return response.status(500).send('err: ' + err);
        }
    }


    async areIdsExists(idUser: string, idChat: string) {
        if (!(await this.userService.findUserById(idUser))) return false;
        if (!(await this.chatService.findChatById(idChat))) return false;
        return true;
    }

    isSanitedText(newText: TextDTO): boolean {
        if (!newText || !newText.text || !newText.userId || !newText.chatId) return false;
        return true;
    }
}
