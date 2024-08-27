import { Body, Controller, Delete, ForbiddenException, Get, Logger, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ChatDTO } from './dto/chat.dto';
import { response } from 'express';
import { ChatService } from './chat.service';
import { ChatEntity } from './entity/chat.entity';
import { UserService } from 'src/user/user.service';
import { isNotFound } from 'src/utils/classificatedHttpCode';
import { selectIdToDoTheSearch } from 'src/utils/selectIdToDoTheSearch';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { isOwnOrAdmin } from 'src/utils/isOwnOrAdmin';
import { TextService } from 'src/text/text.service';
import { TextDTO } from 'src/text/dto/text.dto';

@Controller('chat')
export class ChatController {
    constructor(
        private chatService: ChatService,
        private userService: UserService,
        private textService: TextService,
        private logger: Logger,
    ) { }

    @Get(':id')
    async findChatById(
        @Res() response,
        @Req() request,
        @Param('id') chatId: string
    ) {
        try {
            if (!chatId) return response.status(400).send('Incorrect data.');

            this.chatService.findChatById(chatId, ['user1', 'user2', 'texts'])
                .then(res => {
                    if (!isNotFound(res)) return response.status(404).send('Not found.');

                    if (
                        !isOwnOrAdmin(request.user, res.userId1)
                        &&
                        !isOwnOrAdmin(request.user, res.userId2)
                    ) {
                        response.status(401).send(`You don't have permission.`);
                    }

                    return response
                        .status(200)
                        .send(ChatEntity.parserChatEntityToDTO(res));
                })
                .catch(err => {
                    throw new Error(err);
                });
        } catch (err) {
            this.logger.error('findChatById', err);
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
            this.logger.error('createChat', err);
            return response.status(500).send('Something was bad.');
        }
    }

    @Put(':id')
    @Roles('admin')
    @UseGuards(RolesGuard)
    async updateChat(
        @Res() response,
        @Req() request,
        @Param('id') id: string,
        @Body() chat: ChatDTO,
    ): Promise<any> {
        try {
            if (!chat) return response.status(400).send('Incorrect data.');

            const foundChat = await this.chatService.findChatById(id);
            if (!foundChat) return response.status(404).send('Not found.');

            if (
                !isOwnOrAdmin(request.user, foundChat.userId1)
                &&
                !isOwnOrAdmin(request.user, foundChat.userId2)
            ) {
                throw new ForbiddenException('You do not have permission to access this resource');
            }

            if (!(await this.userService.areUsersExists(chat.userId1, chat.userId2)))
                return response.status(404).send('Not found.');

            const newChat = { ...ChatEntity.parserChatEntityToDTO(foundChat), ...chat }

            this.chatService
                .updateChat(id, newChat)
                .then((res: ChatEntity) => {
                    return response.status(201).send(ChatEntity.parserChatEntityToDTO(res));
                })
                .catch((err) => {
                    throw new Error(err);
                });
        } catch (err) {
            this.logger.error('createChat', err);
            return response.status(500).send('err: ' + err);
        }
    }

    @Delete(':id')
    async deleteById(
        @Res() response,
        @Req() request,
        @Param('id') id: string
    ): Promise<any> {
        try {
            const foundChat = await this.chatService.findChatById(id, ['texts'])
            if (!foundChat) return response.status(404).send('Not found.');

            if (
                !isOwnOrAdmin(request.user, foundChat.userId1)
                &&
                !isOwnOrAdmin(request.user, foundChat.userId2)
            ) {
                throw new ForbiddenException('You do not have permission to access this resource');
            }

            await Promise.all([
                foundChat.texts.map((text: TextDTO) => {
                    this.textService.deleteText(text.id);
                })
            ]);

            this.chatService
                .deleteChat(id)
                .then((res: number) => {
                    if (res > 0) return response.status(200).send(
                        ChatEntity.parserChatEntityToDTO(foundChat)
                    );
                    return response.status(404).send('Not Delete.');
                })
                .catch((err) => {
                    throw new Error(err);
                });
        } catch (error) {
            this.logger.error('deleteById', error);
            response.status(500).send('Something was bad.');
        }
    }
}
