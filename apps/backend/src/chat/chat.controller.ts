import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ChatDTO } from './dto/chat.dto';
import { response } from 'express';
import { ChatService } from './chat.service';
import { ChatEntity } from './entity/chat.entity.dto';
import { UserService } from 'src/user/user.service';
import { error, log } from 'console';
import { isNotFound } from 'src/utils/classificatedHttpCode';

@Controller('chat')
export class ChatController {
    constructor(
        private chatService: ChatService,
        private userService: UserService,
    ) { }

    @Get(':id')
    async findChatById(
        @Res() response,
        @Param('id') chatId: string
    ) {
        try {
            if (!chatId) return response.status(400).send('Incorrect data.');

            this.chatService.findChatById(chatId, ['user1', 'user2', 'texts'])
                .then(res => {
                    if (!isNotFound(res)) return response.status(404).send('Not found.');
                    return response
                        .status(200)
                        .send(ChatEntity.parserChatEntityToDTO(res));
                })
                .catch(err => {
                    throw new Error(err);
                });
        } catch (err) {
            console.log('findChatById', err);
            return response.status(500).send('Something was bad.');
        }
    }

    @Post()
    async createChat(
        @Res() response,
        @Body('') chat: ChatDTO
    ): Promise<any> {
        try {
            if (!chat)
                return response.status(400).send('Incorrect data.');

            if (!(await this.userService.areUsersExists(chat.userId1, chat.userId2)))
                return response.status(404).send('Not found.');

            this.chatService.createChat(chat)
                .then(res => {
                    return response
                        .status(201)
                        .send(ChatEntity.parserChatEntityToDTO(res));
                })
                .catch(err => {
                    throw new Error(err);
                });
        } catch (err) {
            console.log('createChat', err);
            return response.status(500).send('Something was bad.');
        }
    }

    @Put(':id')
    async updateChat(
        @Res() response,
        @Param('id') id: string,
        @Body() chat: ChatDTO,
    ): Promise<any> {
        try {
            if (!chat || !id) return response.status(400).send('Incorrect data.');

            const foundChat = await this.chatService.findChatById(id);
            if (!foundChat) return response.status(404).send('Not found.');

            const newChat = { ...ChatEntity.parserChatEntityToDTO(foundChat), ...chat }

            if (!(await this.userService.areUsersExists(newChat.userId1, newChat.userId2)))
                return response.status(404).send('Not found.');

            this.chatService
                .updateChat(id, newChat)
                .then((res: ChatEntity) => {
                    return response.status(201).send(ChatEntity.parserChatEntityToDTO(res));
                })
                .catch((err) => {
                    throw new Error(err);
                });
        } catch (err) {
            console.log('createChat', err);
            return response.status(500).send('err: ' + err);
        }
    }

    @Delete(':id')
    async deleteById(
        @Res() response,
        @Param('id') id: string
    ): Promise<any> {
        if (!id) return response.status(400).send('Incorrect data.');
        this.chatService
            .delete(id)
            .then((res: ChatEntity) => {
                if (!res) {
                    return response.status(404).send('Chat not found');
                }
                return response.status(200).send(ChatEntity.parserChatEntityToDTO(res));
            })
            .catch((err) => {
                return response.status(500).send('err: ' + err);
            });
    }
}
