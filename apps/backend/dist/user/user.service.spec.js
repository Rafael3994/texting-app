"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockRepository = void 0;
const testing_1 = require("@nestjs/testing");
const user_service_1 = require("./user.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entity/user.entity");
const common_1 = require("@nestjs/common");
const user_controller_spec_1 = require("./user.controller.spec");
const bcrypt = require('bcrypt');
const mockRepository = () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
});
exports.mockRepository = mockRepository;
describe('UserService', () => {
    let service;
    let userRepository;
    const userId = '123456789';
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                user_service_1.UserService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(user_entity_1.UserEntity),
                    useValue: (0, exports.mockRepository)(),
                }
            ],
        })
            .compile();
        service = module.get(user_service_1.UserService);
        userRepository = module.get((0, typeorm_1.getRepositoryToken)(user_entity_1.UserEntity));
    });
    describe('findAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [
                { id: '1', name: 'User One', email: 'userone@example.com' },
                { id: '2', name: 'User Two', email: 'usertwo@example.com' },
            ];
            userRepository.find.mockReturnValue(mockUsers);
            const result = await service.findAllUsers();
            expect(result).toEqual(mockUsers);
        });
    });
    describe('findUserByName', () => {
        it('should return the user name', async () => {
            const username = 'user1';
            const expectedUser = {};
            userRepository.findOne.mockReturnValue(expectedUser);
            const user = await service.findUserByName(username);
            expect(user).toEqual(expectedUser);
        });
        it('should return a BadRequestException', async () => {
            const username = '';
            try {
                await service.findUserByName(username);
            }
            catch (error) {
                expect(error).toBeInstanceOf(common_1.BadRequestException);
            }
        });
    });
    describe('findUserById', () => {
        it('should return the user', async () => {
            const expectedUser = user_controller_spec_1.mockedUsersEntity[0];
            userRepository.findOne.mockReturnValue(expectedUser);
            const user = await service.findUserByName(userId);
            expect(user).toEqual(expectedUser);
        });
        it('should return a BadRequestException', async () => {
            const username = '';
            try {
                await service.findUserByName(username);
            }
            catch (error) {
                expect(error).toBeInstanceOf(common_1.BadRequestException);
            }
        });
    });
    describe('findUserByEmail', () => {
        it('should return the user', async () => {
            const mockUser = {
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
            };
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
            const result = await service.findUserByEmail('test@example.com');
            expect(result).toEqual(mockUser);
            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
                select: ["id", "name", "email"],
            });
        });
        it('should return a BadRequestException', async () => {
            await expect(service.findUserByEmail('')).rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('createUser', () => {
        it('should return the created user', async () => {
            const userDto = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            };
            const hashedPassword = 'hashedpassword';
            const savedUser = new user_entity_1.UserEntity();
            savedUser.name = userDto.name;
            savedUser.email = userDto.email;
            savedUser.password = hashedPassword;
            savedUser.role = user_entity_1.UserRoles.USER;
            jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
            jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser);
            const result = await service.createUser(userDto);
            expect(result).toEqual(savedUser);
            expect(bcrypt.hash).toHaveBeenCalledWith(userDto.password, user_service_1.SALTROUNDS);
            expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                name: userDto.name,
                email: userDto.email,
                password: hashedPassword,
            }));
        });
        it('should return a BadRequestException', async () => {
            await expect(service.createUser(null)).rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('updateUser', () => {
        it('should return the updated user', async () => {
            const userDto = { name: 'Updated Name', password: 'New Password' };
            const updatedUser = Object.assign({}, userDto);
            jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser);
            const result = await service.updateUser(userDto);
            expect(result).toEqual(updatedUser);
            expect(userRepository.save).toHaveBeenCalledWith(userDto);
        });
        it('should return a BadRequestException when no user data is provided', async () => {
            await expect(service.updateUser(null)).rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('deleteUser', () => {
        it('should return the deleted user', async () => {
            const deleteResult = { affected: 1 };
            jest.spyOn(userRepository, 'delete').mockResolvedValue(deleteResult);
            const result = await service.deleteUser(userId);
            expect(result).toBe(deleteResult.affected);
            expect(userRepository.delete).toHaveBeenCalledWith(userId);
        });
        it('should return a BadRequestException', async () => {
            await expect(service.deleteUser(null)).rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('areUsersExists', () => {
        it('should return true if both users exist', async () => {
            const userId1 = '1';
            const userId2 = '2';
            jest.spyOn(service, 'findUserById')
                .mockImplementation(async (id) => {
                if (id === userId1)
                    return user_controller_spec_1.mockedUsersEntity[0];
                if (id === userId2)
                    return user_controller_spec_1.mockedUsersEntity[1];
                return null;
            });
            const result = await service.areUsersExists(userId1, userId2);
            expect(result).toBe(true);
        });
        it('should return false if at least one user does not exist', async () => {
            const userId1 = '1';
            const userId2 = '2';
            jest.spyOn(service, 'findUserById')
                .mockImplementation(async (id) => {
                if (id === userId1)
                    return user_controller_spec_1.mockedUsersEntity[0];
                return null;
            });
            const result = await service.areUsersExists(userId1, userId2);
            expect(result).toBe(false);
        });
    });
});
//# sourceMappingURL=user.service.spec.js.map