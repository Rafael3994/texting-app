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
exports.UserService = exports.SALTROUNDS = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entity/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require('bcrypt');
exports.SALTROUNDS = 8;
let UserService = class UserService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findAllUsers() {
        return this.usersRepository.find({ select: ["id", "name", "email"] });
    }
    async findUserByName(username) {
        if (!username)
            throw new common_1.BadRequestException();
        return await this.usersRepository.findOne({ where: { name: username } });
    }
    async findUserById(id) {
        if (!id)
            throw new common_1.BadRequestException();
        return this.usersRepository.findOne({ where: { id }, select: ["id", "name", "email"] });
    }
    async findUserByEmail(email, select = ["id", "name", "email"]) {
        if (!email)
            throw new common_1.BadRequestException();
        return this.usersRepository.findOne({ where: { email: email }, select });
    }
    async createUser(user) {
        if (!user)
            throw new common_1.BadRequestException();
        const newUser = new user_entity_1.UserEntity();
        newUser.name = user.name;
        newUser.email = user.email;
        newUser.role = user_entity_1.UserRoles.USER;
        const encryptPass = await bcrypt.hash(user.password, exports.SALTROUNDS);
        newUser.password = encryptPass;
        return this.usersRepository.save(newUser);
    }
    async updateUser(user) {
        if (!user)
            throw new common_1.BadRequestException();
        return this.usersRepository.save(user);
    }
    async deleteUser(id) {
        if (!id)
            throw new common_1.BadRequestException();
        return (await this.usersRepository.delete(id)).affected;
    }
    async areUsersExists(userId1, userId2) {
        const user1 = await this.findUserById(userId1);
        const user2 = await this.findUserById(userId2);
        if (!user1 || !user2)
            return false;
        return true;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map