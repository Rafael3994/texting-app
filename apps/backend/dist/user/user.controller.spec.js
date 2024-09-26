"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockUsersService = exports.mockRequest = exports.mockedUsersEntity = exports.mockedUsersPublicDTO = exports.mockedUsersDTO = exports.mockResponse = void 0;
const testing_1 = require("@nestjs/testing");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entity/user.entity");
exports.mockResponse = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
};
exports.mockedUsersDTO = [
    {
        id: "40f6fb9b-9f77-4dbd-8497-1d030ba11081",
        name: "userTest",
        email: "userTest@gmail.com",
        password: "$2b$08$YoRkNwbaVrenijIxuuxG/eTHJv.It3m4Hu2YYLbjFFWaBAozH9k4W",
        role: user_entity_1.UserRoles.ADMIN
    },
    {
        id: "09398f56-93e4-4a2f-96e8-342683f7d35a",
        name: "user1",
        email: "user1@gmail.com",
        password: "$2b$08$zYfB.m7VNCwFtqG4amUc0O9AiYfWD2ZutgBlLv7F5gmWI4BH.azJy",
        role: user_entity_1.UserRoles.USER
    },
    {
        id: "0e2431eb-a822-4e34-aad1-490721012e87",
        name: "user2",
        email: "user2@gmail.com",
        password: "$2b$08$y8lyR4IHnkmjyluG8NAsAe043THzSxZJI9KM/nW76ka7L.ruQEIH6",
        role: user_entity_1.UserRoles.USER
    },
];
exports.mockedUsersPublicDTO = [
    {
        name: "userTest",
        email: "userTest@gmail.com",
    },
    {
        name: "user1",
        email: "user1@gmail.com",
    },
    {
        name: "user2",
        email: "user2@gmail.com",
    },
];
exports.mockedUsersEntity = [
    {
        id: "40f6fb9b-9f77-4dbd-8497-1d030ba11081",
        name: "userTest",
        email: "userTest@gmail.com",
        password: "$2b$08$YoRkNwbaVrenijIxuuxG/eTHJv.It3m4Hu2YYLbjFFWaBAozH9k4W",
        role: user_entity_1.UserRoles.ADMIN,
        createdTime: undefined,
        chatsAsUser1: [],
        chatsAsUser2: [],
        texts: [],
    },
    {
        id: "09398f56-93e4-4a2f-96e8-342683f7d35a",
        name: "user1",
        email: "user1@gmail.com",
        password: "$2b$08$zYfB.m7VNCwFtqG4amUc0O9AiYfWD2ZutgBlLv7F5gmWI4BH.azJy",
        role: user_entity_1.UserRoles.USER,
        createdTime: undefined,
        chatsAsUser1: [],
        chatsAsUser2: [],
        texts: [],
    },
    {
        id: "0e2431eb-a822-4e34-aad1-490721012e87",
        name: "user2",
        email: "user2@gmail.com",
        password: "$2b$08$y8lyR4IHnkmjyluG8NAsAe043THzSxZJI9KM/nW76ka7L.ruQEIH6",
        role: user_entity_1.UserRoles.USER,
        createdTime: undefined,
        chatsAsUser1: [],
        chatsAsUser2: [],
        texts: [],
    },
];
exports.mockRequest = {
    user: { id: exports.mockedUsersEntity[1].id, role: user_entity_1.UserRoles.USER },
};
exports.mockUsersService = {
    findAllUsers: () => exports.mockedUsersEntity,
    findUserById: () => exports.mockedUsersEntity[0],
    createUser: () => exports.mockedUsersEntity,
    updateUser: () => exports.mockedUsersEntity,
    findUserByEmail: () => exports.mockedUsersEntity[0],
    deleteUser: () => 1 || 0,
    areUsersExists: () => true || false,
};
describe('UserController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [user_controller_1.UserController],
            providers: [user_service_1.UserService, common_1.Logger],
        })
            .overrideProvider(user_service_1.UserService)
            .useValue(exports.mockUsersService)
            .compile();
        controller = module.get(user_controller_1.UserController);
        service = module.get(user_service_1.UserService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('findAllUsers', () => {
        it('should be return all users', async () => {
            const findAllUsersSpy = jest.spyOn(service, 'findAllUsers');
            findAllUsersSpy.mockResolvedValue(exports.mockedUsersEntity);
            await controller.findAllUsers(exports.mockResponse);
            expect(exports.mockResponse.status).toHaveBeenCalledWith(200);
            expect(exports.mockResponse.send).toHaveBeenCalledWith(exports.mockedUsersDTO);
        });
        it('should be return all users but there are not', async () => {
            const findAllUsersSpy = jest.spyOn(service, 'findAllUsers');
            findAllUsersSpy.mockResolvedValue([]);
            await controller.findAllUsers(exports.mockResponse);
            expect(exports.mockResponse.status).toHaveBeenCalledWith(204);
            expect(exports.mockResponse.send).toHaveBeenCalledWith([]);
        });
        it('should handle errors and return a 500 status', async () => {
            const error = new Error('Something went wrong');
            jest.spyOn(service, 'findAllUsers').mockRejectedValue(error);
            await controller.findAllUsers(exports.mockResponse);
            expect(exports.mockResponse.status).toHaveBeenCalledWith(500);
            expect(exports.mockResponse.send).toHaveBeenCalledWith('Something was bad.');
        });
    });
    describe('findUserById', () => {
        it('should return the user', async () => {
            const mockUserEntity = exports.mockedUsersEntity[0];
            jest.spyOn(service, 'findUserById').mockResolvedValue(mockUserEntity);
            await controller.findUserById(exports.mockResponse, exports.mockRequest, mockUserEntity.id);
            expect(exports.mockResponse.status).toHaveBeenCalledWith(200);
            expect(exports.mockResponse.send).toHaveBeenCalledWith(user_entity_1.UserEntity.parserUserEntityToDTO(mockUserEntity));
        });
        it('should return "Incorrect data" when selectedId is invalid', async () => {
            await controller.findUserById(exports.mockResponse, exports.mockRequest, undefined);
            expect(exports.mockResponse.status).toHaveBeenCalledWith(400);
            expect(exports.mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
        });
        it('should return "Not found" when user is not found', async () => {
            jest.spyOn(service, 'findUserById').mockResolvedValue(null);
            await controller.findUserById(exports.mockResponse, exports.mockRequest, '123456789234567');
            expect(exports.mockResponse.status).toHaveBeenCalledWith(404);
            expect(exports.mockResponse.send).toHaveBeenCalledWith('Not found.');
        });
        it('should handle errors and return a 500 status', async () => {
            const error = new Error('Something went wrong');
            jest.spyOn(service, 'findUserById').mockRejectedValue(error);
            await controller.findUserById(exports.mockResponse, exports.mockRequest, 'some-id');
            expect(exports.mockResponse.status).toHaveBeenCalledWith(500);
            expect(exports.mockResponse.send).toHaveBeenCalledWith('Something went wrong.');
        });
    });
    describe('createUser', () => {
        it('should return the created user', async () => {
            const userEntity = exports.mockedUsersEntity[0];
            const mockUser = {
                email: 'newUser@gmail.com',
                password: 'newUser',
                name: 'newUser',
            };
            jest.spyOn(service, 'findUserByEmail').mockResolvedValue(null);
            jest.spyOn(service, 'createUser').mockResolvedValue(userEntity);
            await controller.createUser(exports.mockResponse, mockUser);
            expect(exports.mockResponse.status).toHaveBeenCalledWith(201);
            expect(exports.mockResponse.send).toHaveBeenCalledWith(user_entity_1.UserEntity.parserUserPublicEntityToDTO(userEntity));
        });
        it('should return Incorrect data when passing wrong params', async () => {
            const invalidUser = { email: '', password: '', name: '' };
            await controller.createUser(exports.mockResponse, invalidUser);
            expect(exports.mockResponse.status).toHaveBeenCalledWith(400);
            expect(exports.mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
        });
        it('should return It is already exist when finding the email', async () => {
            const mockedUserValue = exports.mockedUsersEntity[0];
            const existingUser = {
                email: mockedUserValue.email,
                password: mockedUserValue.password,
                name: mockedUserValue.name,
            };
            jest.spyOn(service, 'findUserByEmail').mockResolvedValue(mockedUserValue);
            await controller.createUser(exports.mockResponse, existingUser);
            expect(exports.mockResponse.status).toHaveBeenCalledWith(404);
            expect(exports.mockResponse.send).toHaveBeenCalledWith("It's already exist");
        });
        it('should handle errors and return a 500 status', async () => {
            const error = new Error('Something went wrong');
            jest.spyOn(service, 'findUserById').mockRejectedValue(error);
            await controller.findUserById(exports.mockResponse, exports.mockRequest, 'some-id');
            expect(exports.mockResponse.status).toHaveBeenCalledWith(500);
            expect(exports.mockResponse.send).toHaveBeenCalledWith('Something went wrong.');
        });
    });
    describe('updateUser', () => {
        it('should return the updated user.', async () => {
            const userEntity = exports.mockedUsersEntity[0];
            const updatedUser = {
                name: 'Updated Name',
                password: userEntity.password
            };
            jest.spyOn(service, 'findUserById').mockResolvedValue(userEntity);
            jest.spyOn(service, 'updateUser').mockResolvedValue(Object.assign(Object.assign({}, userEntity), updatedUser));
            await controller.updateUser(exports.mockResponse, exports.mockRequest, userEntity.id, updatedUser);
            expect(exports.mockResponse.status).toHaveBeenCalledWith(201);
            expect(exports.mockResponse.send).toHaveBeenCalledWith(user_entity_1.UserEntity.parserUserPublicEntityToDTO(Object.assign(Object.assign({}, userEntity), updatedUser)));
        });
        it('should return "Incorrect data." when data is invalid.', async () => {
            const invalidUser = null;
            await controller.updateUser(exports.mockResponse, exports.mockRequest, 'some-id', invalidUser);
            expect(exports.mockResponse.status).toHaveBeenCalledWith(400);
            expect(exports.mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
        });
        it('should return "Not found." when the user is not found.', async () => {
            const validUser = {
                name: 'Updated Name',
                password: 'password123'
            };
            jest.spyOn(service, 'findUserById').mockResolvedValue(null);
            await controller.updateUser(exports.mockResponse, exports.mockRequest, 'non-existing-id', validUser);
            expect(exports.mockResponse.status).toHaveBeenCalledWith(404);
            expect(exports.mockResponse.send).toHaveBeenCalledWith('Not found.');
        });
        it('should handle errors and return a 500 status', async () => {
            const validUser = {
                name: 'Updated Name',
                password: 'password123'
            };
            jest.spyOn(service, 'findUserById').mockRejectedValue(new Error('Internal error'));
            await controller.updateUser(exports.mockResponse, exports.mockRequest, 'some-id', validUser);
            expect(exports.mockResponse.status).toHaveBeenCalledWith(500);
            expect(exports.mockResponse.send).toHaveBeenCalledWith('Something was bad.');
        });
    });
    describe('deleteUserById', () => {
        it('should return the deleted user', async () => {
            const foundUser = exports.mockedUsersEntity[0];
            jest.spyOn(service, 'findUserById').mockResolvedValue(foundUser);
            jest.spyOn(service, 'deleteUser').mockResolvedValue(1);
            await controller.deleteUserById(exports.mockResponse, '123456789');
            expect(exports.mockResponse.status).toHaveBeenCalledWith(200);
            expect(exports.mockResponse.send).toHaveBeenCalledWith(user_entity_1.UserEntity.parserUserEntityToDTO(foundUser));
        });
        it('should return "Incorrect data." when id is missing', async () => {
            await controller.deleteUserById(exports.mockResponse, '');
            expect(exports.mockResponse.status).toHaveBeenCalledWith(400);
            expect(exports.mockResponse.send).toHaveBeenCalledWith('Incorrect data.');
        });
        it('should return "Not found." when user does not exist', async () => {
            jest.spyOn(service, 'findUserById').mockResolvedValue(null);
            await controller.deleteUserById(exports.mockResponse, '123456789');
            expect(exports.mockResponse.status).toHaveBeenCalledWith(404);
            expect(exports.mockResponse.send).toHaveBeenCalledWith('Not found.');
        });
        it('should return "Not delete." when deleteUser fails', async () => {
            const foundUser = exports.mockedUsersEntity[0];
            jest.spyOn(service, 'findUserById').mockResolvedValue(foundUser);
            jest.spyOn(service, 'deleteUser').mockResolvedValue(0);
            await controller.deleteUserById(exports.mockResponse, '123456789');
            expect(exports.mockResponse.status).toHaveBeenCalledWith(404);
            expect(exports.mockResponse.send).toHaveBeenCalledWith('Not Delete.');
        });
        it('should handle errors and return a 500 status', async () => {
            jest.spyOn(service, 'findUserById').mockRejectedValue(new Error('Unexpected error'));
            await controller.deleteUserById(exports.mockResponse, '123456789');
            expect(exports.mockResponse.status).toHaveBeenCalledWith(500);
            expect(exports.mockResponse.send).toHaveBeenCalledWith('Something was bad.');
        });
    });
});
//# sourceMappingURL=user.controller.spec.js.map