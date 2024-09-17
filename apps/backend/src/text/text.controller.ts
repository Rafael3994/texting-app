import { Controller, Get, Param, Res, Logger, Post, Body, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { TextService } from './text.service';
import { isNotFound } from '@src/utils/classificatedHttpCode';
import { TextEntity } from './entity/text.entity';
import { TextDTO } from './dto/text.dto';
import { UserService } from '@src/user/user.service';
import { ChatService } from '@src/chat/chat.service';
import { RolesGuard } from '@src/auth/roles.guard';
import { Roles } from '@src/auth/roles.decorator';
import { isOwnOrAdmin } from '@src/utils/isOwnOrAdmin';
import { isOwn } from '@src/utils/isOwn';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TextPublicDTO } from './dto/text.public.dto';
import { TextCreateDTO } from './dto/text.create.dto';

@ApiBearerAuth()
@ApiTags('TEXT')
@Controller('text')
export class TextController {
    constructor(
        private textService: TextService,
        private userService: UserService,
        private chatService: ChatService,
        private logger: Logger
    ) { }

    @ApiOperation({
        summary: 'Get a text.',
        description: 'This endpoint is enabled for the user owner of the text and users with role admin.'
    })
    @ApiResponse({
        status: 200,
        description: 'Returns the text.',
        type: TextDTO,
    })
    @Get(':id')
    async findTextById(
        @Res() response,
        @Req() request,
        @Param('id') id: string
    ): Promise<any> {
        try {
            if (!id) {
                return response.status(400).send('Incorrect data.');
            }

            const textEntity = await this.textService.findTextById(id);

            if (isNotFound(textEntity)) {
                return response.status(404).send('Not found.');
            }

            if (!isOwnOrAdmin(request.user, textEntity.userId)) {
                return response.status(401).send(`You don't have permission.`);
            }

            return response.status(200).send(TextEntity.parserTextEntityToDTO(textEntity));
        } catch (error) {
            this.logger.error('findTextById', error);
            return response.status(500).send('Something went wrong.');
        }
    }


    @ApiOperation({
        summary: 'Create a text.',
        description: 'This endpoint is enabled for the users participants of the chat.'
    })
    @ApiResponse({
        status: 200,
        description: 'Returns the created text.',
        type: TextPublicDTO,
    })
    @Post('')
    async createText(
        @Res() response,
        @Req() request,
        @Body() text: TextCreateDTO
    ): Promise<any> {
        try {
            if (!this.isSanitedText(text)) {
                return response.status(400).send('Incorrect data.');
            }

            const idsExist = await this.areIdsExists(text.userId, text.chatId);
            if (!idsExist) {
                return response.status(404).send('Data ids Not found.');
            }

            const foundChat = await this.chatService.findChatById(text.chatId);
            const hasPermission = isOwn(request.user.id, foundChat.userId1) || isOwn(request.user.id, foundChat.userId2);

            if (!hasPermission) {
                return response.status(401).send(`You don't have permission.`);
            }

            const createdText = await this.textService.createText(text);
            return response.status(201).send(TextEntity.parserTextPublicEntityToDTO(createdText));

        } catch (err) {
            this.logger.error('createText', err);
            return response.status(500).send('Something went wrong.');
        }
    }


    @ApiOperation({
        summary: 'Update a text.',
        description: 'This endpoint is enabled for the user owner of the text.'
    })
    @ApiResponse({
        status: 200,
        description: 'Returns the updated text.',
        type: TextCreateDTO,
    })
    @Roles('user')
    @UseGuards(RolesGuard)
    @Put(':id')
    async updateText(
        @Res() response,
        @Req() request,
        @Param('id') id: string,
        @Body('text') text: string,
    ): Promise<any> {
        if (!text) {
            return response.status(400).send('Incorrect data.');
        }

        try {
            const foundText = await this.textService.findTextById(id);
            if (!foundText) {
                return response.status(404).send('Not found.');
            }

            const foundChat = await this.chatService.findChatById(foundText.chatId);
            if (!isOwn(request.user.id, foundChat.userId1) && !isOwn(request.user.id, foundChat.userId2)) {
                return response.status(401).send(`You don't have permission.`);
            }

            const updatedText = await this.textService.updateText({
                ...TextEntity.parserTextPublicEntityToDTO(foundText),
                text: text,
            });

            return response.status(200).send(TextEntity.parserTextPublicEntityToDTO(updatedText));
        } catch (err) {
            this.logger.error('updateText', err);
            return response.status(500).send('Error: ' + err.message);
        }
    }


    @ApiOperation({
        summary: 'Delete a text.',
        description: 'This endpoint is enabled for the user owner of the text and the user with role admin.'
    })
    @ApiResponse({
        status: 200,
        description: 'Returns the delete text.',
        type: TextPublicDTO,
    })
    @Delete(':id')
    async deleteText(
        @Res() response,
        @Req() request,
        @Param('id') id: string
    ): Promise<any> {
        if (!id) {
            return response.status(400).send('Incorrect data.');
        }

        try {
            const foundText = await this.textService.findTextById(id);
            if (!foundText) {
                return response.status(404).send('Not found.');
            }

            const foundChat = await this.chatService.findChatById(foundText.chatId);
            if (!isOwnOrAdmin(request.user, foundChat.userId1) && !isOwnOrAdmin(request.user, foundChat.userId2)) {
                return response.status(401).send(`You don't have permission.`);
            }

            const deleteResult = await this.textService.deleteText(id);
            if (deleteResult > 0) {
                return response.status(200).send(TextEntity.parserTextPublicEntityToDTO(foundText));
            } else {
                return response.status(404).send('Not Deleted.');
            }
        } catch (err) {
            this.logger.error('deleteText', err);
            return response.status(500).send('Error: ' + err.message);
        }
    }


    async areIdsExists(idUser: string, idChat: string) {
        if (!(await this.userService.findUserById(idUser))) return false;
        if (!(await this.chatService.findChatById(idChat))) return false;
        return true;
    }

    isSanitedText(newText: TextCreateDTO): boolean {
        if (!newText || !newText.text || !newText.userId || !newText.chatId) return false;
        return true;
    }
}
