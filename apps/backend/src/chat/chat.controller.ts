import { Body, Controller, Delete, ForbiddenException, Get, Logger, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ChatDTO } from './dto/chat.dto';
import { ChatService } from './chat.service';
import { ChatEntity } from './entity/chat.entity';
import { UserService } from '@src/user/user.service';
import { isNotFound } from '@src/utils/classificatedHttpCode';
import { Roles } from '@src/auth/roles.decorator';
import { RolesGuard } from '@src/auth/roles.guard';
import { isOwnOrAdmin } from '@src/utils/isOwnOrAdmin';
import { TextService } from '@src/text/text.service';
import { TextDTO } from '@src/text/dto/text.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, PickType } from '@nestjs/swagger';
import { ChatCreateDTO } from './dto/chat.create.dto';
import { isOwn } from '@src/utils/isOwn';
import { UserRoles } from '@src/user/entity/user.entity';
import { WebSocketsGateway } from '../web-sockets/webSockets.gateway';

@ApiBearerAuth()
@ApiTags('CHAT')
@Controller('chat')
export class ChatController {
    constructor(
        private chatService: ChatService,
        private userService: UserService,
        private textService: TextService,
        private logger: Logger,
        private webSocketsGateway: WebSocketsGateway
    ) { }

    @ApiOperation({
        summary: 'Get a chat.',
        description: 'This endpoint is enabled for the users participants of the chat and users with role admin.'
    })
    @ApiResponse({
        status: 200,
        description: 'Returns the chat found.',
        type: PickType(ChatDTO, ['user1', 'user2', 'texts'] as const),
    })
    @Get(':id')
    async findChatById(
        @Res() response,
        @Req() request,
        @Param('id') chatId: string
    ): Promise<any> {
        try {
            if (!chatId) return response.status(400).send('Incorrect data.');

            const chat = await this.chatService.findChatById(chatId, ['user1', 'user2', 'texts']);

            if (isNotFound(chat)) return response.status(404).send('Not found.');

            if (
                !isOwnOrAdmin(request.user, chat.userId1) &&
                !isOwnOrAdmin(request.user, chat.userId2)
            ) {
                return response.status(401).send(`You don't have permission.`);
            }

            return response.status(200).send(
                ChatEntity.parserChatEntityToDTO(chat)
            );
        } catch (err) {
            this.logger.error('findChatById', err);
            return response.status(500).send('Something went wrong.');
        }
    }

    @ApiOperation({
        summary: 'Get all chats from a user.',
        description: 'This endpoint is enabled for the user logged and users with role admin.'
    })
    @ApiResponse({
        status: 200,
        description: 'Returns all chats found.',
        type: PickType(ChatDTO, ['user1', 'user2', 'texts'] as const),
        isArray: true,
    })
    @Get('user/:id')
    async findAllChatByUserId(
        @Res() response,
        @Req() request,
        @Param('id') userId: string
    ): Promise<any> {
        try {
            if (!userId) return response.status(400).send('Incorrect data.');

            const userFound = await this.userService.findUserById(userId);

            if (isNotFound(userFound)) return response.status(404).send('Not found.');

            if (
                !isOwn(request.user.id, userFound.id) && request.user.role !== UserRoles.ADMIN
            ) {
                return response.status(401).send(`You don't have permission.`);
            }

            const allChats = await this.chatService.findAllChatByUserId(userId)

            if (isNotFound(allChats)) {
                return response.status(204).send([]);
            }


            return response.status(200).send(
                allChats.map(chat => {
                    return ChatEntity.parserChatEntityToDTO(chat)
                })
            );
        } catch (err) {
            this.logger.error('findChatById', err);
            return response.status(500).send('Something went wrong.');
        }
    }



    @ApiOperation({
        summary: 'Create a chat.',
        description: 'Create a chat.'
    })
    @ApiResponse({
        status: 200,
        description: 'Returns the created chat.',
        type: PickType(ChatDTO, ['user1', 'user2'] as const),
    })
    @Post()
    async createChat(
        @Res() response,
        @Body('') chat: ChatCreateDTO
    ): Promise<any> {
        try {
            if (!chat) {
                return response.status(400).send('Incorrect data.');
            }

            const usersExist = await this.userService.areUsersExists(chat.userId1, chat.userId2);
            if (!usersExist) {
                return response.status(404).send('Not found.');
            }

            const createdChat = await this.chatService.createChat(chat);
            const findNewChat = await this.chatService.findChatById(createdChat.id, ['user1', 'user2'])
            const createdChatDto = ChatEntity.parserChatEntityToDTO(findNewChat)
            this.webSocketsGateway.handleCreateChat(findNewChat)
            return response
                .status(201)
                .send(createdChatDto);

        } catch (err) {
            this.logger.error('createChat', err);
            return response.status(500).send('Something went wrong.');
        }
    }

    @ApiOperation({
        summary: 'Update chat.',
        description: 'Only for the admin.'
    })
    @ApiResponse({
        status: 200,
        description: 'Returns the updated chat.',
        type: PickType(ChatDTO, ['user1', 'user2', 'texts'] as const),
    })
    @Put(':id')
    @Roles('admin')
    @UseGuards(RolesGuard)
    async updateChat(
        @Res() response,
        @Req() request,
        @Param('id') id: string,
        @Body() chat: ChatCreateDTO,
    ): Promise<any> {
        try {
            if (!chat) {
                return response.status(400).send('Incorrect data.');
            }

            const foundChat = await this.chatService.findChatById(id);
            if (!foundChat) {
                return response.status(404).send('Not found.');
            }

            if (
                !isOwnOrAdmin(request.user, foundChat.userId1) &&
                !isOwnOrAdmin(request.user, foundChat.userId2)
            ) {
                throw new ForbiddenException('You do not have permission to access this resource');
            }

            const usersExist = await this.userService.areUsersExists(chat.userId1, chat.userId2);
            if (!usersExist) {
                return response.status(404).send('Not found.');
            }

            const updatedChatData = { ...ChatEntity.parserChatEntityToDTO(foundChat), ...chat };
            const updatedChat = await this.chatService.updateChat(updatedChatData);

            return response.status(201).send(ChatEntity.parserChatPublicEntityToDTO(updatedChat));
        } catch (err) {
            this.logger.error('createChat', err);
            return response.status(500).send('Something went wrong.');
        }
    }

    @ApiOperation({
        summary: 'Delete a chat.',
        description: 'This endpoint is enabled for the users participants of the chat and users with role admin.'
    })
    @ApiResponse({
        status: 200,
        description: 'Returns the deleted chat.',
        type: PickType(ChatDTO, ['user1', 'user2', 'texts'] as const),
    })
    @Delete(':id')
    async deleteById(
        @Res() response,
        @Req() request,
        @Param('id') id: string
    ): Promise<any> {
        try {
            const foundChat = await this.chatService.findChatById(id, ['texts']);
            if (!foundChat) {
                return response.status(404).send('Not found.');
            }

            if (
                !isOwnOrAdmin(request.user, foundChat.userId1) &&
                !isOwnOrAdmin(request.user, foundChat.userId2)
            ) {
                return response.status(403).send({
                    statusCode: 403,
                    message: 'You do not have permission to access this resource',
                });
            }

            for (const text of foundChat.texts) {
                await this.textService.deleteText(text.id);
            }

            const deleteResult = await this.chatService.deleteChat(id);
            if (deleteResult > 0) {
                this.webSocketsGateway.handleDeleteChat(foundChat)
                return response.status(200).send(
                    ChatEntity.parserChatEntityToDTO(foundChat)
                );
            } else {
                return response.status(404).send('Not Delete.');
            }
        } catch (error) {
            this.logger.error('deleteById', error);
            return response.status(500).send('Something went wrong.');
        }
    }
}

