import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ChatDTO } from './dto/chat.dto';
import { response } from 'express';
import { ChatService } from './chat.service';
import { ChatEntity } from './entity/chat.entity.dto';
import { UserService } from 'src/user/user.service';
import { error, log } from 'console';

@Controller('chat')
export class ChatController {
    constructor(
        private chatService: ChatService,
        private userService: UserService,
    ) { }

    @Get(':id')
    async findOne(
        @Res() response,
        @Param('id') chatId: string
    ) {
        try {
            if (!chatId || typeof chatId !== 'string') throw new Error('Invalit param.');
            const foundChat = await this.chatService.findOne(chatId);
            return response.status(200).send(ChatEntity.parserChatEntityToDTO(foundChat));
        } catch (err) {
            response.status(500).send('err ' + err);
        }
    }

    @Post()
    async create(
        @Res() response,
        @Body('') chat: ChatDTO
    ): Promise<any> {
        try {
            if (!chat) throw new Error('Invalid chat.')

            // this.checkIfUsersExists(chat.userId1, chat.userId2);

            const newChat = await this.chatService.create(chat);
            return response.status(201).send(
                ChatEntity.parserChatEntityToDTO(newChat)
            );
        } catch (err) {
            return response.status(500).send('Something was bad.');
        }
    }

    @Put('')
    async update(
        @Res() response,
        @Param('id') id: string,
        @Body() chat: ChatDTO,
    ): Promise<any> {
        try {
            if (!chat && !id) return response.status(400).send('id and chat is required');
            const foundChat = ChatEntity.parserChatEntityToDTO(await this.chatService.findOne(id));

            const newChat = { ...foundChat, ...chat }

            // this.checkIfUsersExists(newChat.userId1, newChat.userId2);

            this.chatService
                .update(id, chat)
                .then((res: ChatEntity) => {
                    return response.status(201).send(ChatEntity.parserChatEntityToDTO(res));
                })
                .catch((err) => {

                });
        } catch (err) {
            return response.status(500).send('err: ' + err);
        }
    }

    @Delete(':id')
    async deleteById(@Res() response, @Param('id') id: string): Promise<any> {
        if (!id) return response.status(400).send('id is required');
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

    // async checkIfUsersExists(userId1, userId2) {
    //     const resPromiseAll = await Promise.all([
    //         this.userService.findUserById(userId1),
    //         this.userService.findUserById(userId2)
    //     ]).catch(err => { throw new Error() })
    //     resPromiseAll.forEach(item => this.userService.isExistUser(item));
    // }
}
