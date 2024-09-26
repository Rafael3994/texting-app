"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const user_dto_1 = require("./dto/user.dto");
const user_service_1 = require("./user.service");
const user_entity_1 = require("./entity/user.entity");
const classificatedHttpCode_1 = require("../utils/classificatedHttpCode");
const user_updated_dto_1 = require("./dto/user.updated.dto");
const public_decorator_1 = require("../auth/public.decorator");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const selectIdToDoTheSearch_1 = require("../utils/selectIdToDoTheSearch");
const swagger_1 = require("@nestjs/swagger");
const user_public_dto_1 = require("./dto/user.public.dto");
const user_created_dto_1 = require("./dto/user.created.dto");
let UserController = class UserController {
    constructor(userService, logger) {
        this.userService = userService;
        this.logger = logger;
        this.isSanitedUser = (user) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if ((user.email && !regex.test(user.email)) || user.name.length < 3 || user.password.length < 3) {
                return false;
            }
            return true;
        };
    }
    async findAllUsers(response) {
        try {
            const res = await this.userService.findAllUsers();
            if ((0, classificatedHttpCode_1.isNotFound)(res)) {
                return response.status(204).send([]);
            }
            return response.status(200).send(res.map((user) => user_entity_1.UserEntity.parserUserEntityToDTO(user)));
        }
        catch (err) {
            this.logger.error('findAllUsers', err);
            return response.status(500).send('Something was bad.');
        }
    }
    async findUserById(response, request, id) {
        try {
            const selectedId = (0, selectIdToDoTheSearch_1.selectIdToDoTheSearch)(request.user, id);
            if (!selectedId) {
                return response.status(400).send('Incorrect data.');
            }
            const user = await this.userService.findUserById(selectedId);
            if ((0, classificatedHttpCode_1.isNotFound)(user)) {
                return response.status(404).send('Not found.');
            }
            return response.status(200).send(user_entity_1.UserEntity.parserUserEntityToDTO(user));
        }
        catch (err) {
            this.logger.error('findUserById', err);
            return response.status(500).send('Something went wrong.');
        }
    }
    async createUser(response, user) {
        try {
            if (!user || !this.isSanitedUser(user)) {
                return response.status(400).send('Incorrect data.');
            }
            const existingUser = await this.userService.findUserByEmail(user.email);
            if (existingUser) {
                return response.status(404).send(`It's already exist`);
            }
            const createdUser = await this.userService.createUser(user);
            const publicUser = user_entity_1.UserEntity.parserUserPublicEntityToDTO(createdUser);
            return response.status(201).send(publicUser);
        }
        catch (err) {
            this.logger.error('createUser', err);
            return response.status(500).send('Something was bad.');
        }
    }
    async updateUser(response, request, id, user) {
        try {
            const selectedId = (0, selectIdToDoTheSearch_1.selectIdToDoTheSearch)(request.user, id);
            if (!selectedId) {
                return response.status(400).send('Incorrect data.');
            }
            if (!user || !this.isSanitedUser(user)) {
                return response.status(400).send('Incorrect data.');
            }
            const foundUser = await this.userService.findUserById(selectedId);
            if (!foundUser) {
                return response.status(404).send('Not found.');
            }
            const updatedUser = await this.userService.updateUser(Object.assign(Object.assign({}, foundUser), user));
            return response.status(201).send(user_entity_1.UserEntity.parserUserPublicEntityToDTO(updatedUser));
        }
        catch (err) {
            this.logger.error('updateUser', err);
            return response.status(500).send('Something was bad.');
        }
    }
    async deleteUserById(response, id) {
        try {
            if (!id) {
                return response.status(400).send('Incorrect data.');
            }
            const foundUser = await this.userService.findUserById(id);
            if (!foundUser) {
                return response.status(404).send('Not found.');
            }
            const result = await this.userService.deleteUser(id);
            if (result > 0) {
                return response.status(200).send(user_entity_1.UserEntity.parserUserEntityToDTO(foundUser));
            }
            else {
                return response.status(404).send('Not Delete.');
            }
        }
        catch (err) {
            this.logger.error('deleteUserById', err);
            return response.status(500).send('Something was bad.');
        }
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all users.',
        description: 'This endpoint is only for role admins'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The list of items has been successfully retrieved.',
        type: user_dto_1.UserDTO,
        isArray: true,
    }),
    (0, common_1.Get)(''),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAllUsers", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a user by id.',
        description: 'If you use a admin user you can search all users, but if you use a user standard only search yourself'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The list of items has been successfully retrieved.',
        type: [(0, swagger_1.PickType)(user_dto_1.UserDTO, ['id', 'name', 'email'])],
    }),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUserById", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create user',
        description: 'The endpoint is public.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the new user.',
        type: user_public_dto_1.UserPublicDTO,
    }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(''),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_created_dto_1.UserCreatedDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update user.',
        description: 'If you use a admin user you can update the user pass, but if you use a user standard only updated yourself'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the updated user.',
        type: user_public_dto_1.UserPublicDTO,
    }),
    (0, common_1.Put)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, user_updated_dto_1.UserUpdatedDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete user.',
        description: 'This endpoint is only used for the role admin.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the deleted user.',
        type: user_dto_1.UserDTO,
    }),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUserById", null);
UserController = __decorate([
    (0, swagger_1.ApiTags)('USER'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        common_1.Logger])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map