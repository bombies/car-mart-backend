import { Body, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./user.schema";
import { CreateUserDto } from "../dto/user/create-user.dto";
import { v4 } from "uuid";
import { hash } from "bcrypt";
import { UpdateUserDto } from "../dto/user/update-user.dto";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { Redis } from "ioredis";
import { UserRedisManager } from "src/redis/managers/user.redismanager";

@Injectable()
export class UsersService {
    private redisManager: UserRedisManager;

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectRedis() private readonly redis: Redis
    ) {
        this.redisManager = new UserRedisManager(redis);
    }

    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await hash(createUserDto.password, 10);
        const createdUser = await (new this.userModel({
            ...createUserDto,
            id: v4(),
            date_of_creation: new Date().getTime(),
            password: hashedPassword,
        })).save();
        await this.redisManager.putOne(createdUser);
        return createdUser;
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOne(user_id: string) {
        return this.rawFindUser(user_id);
    }

    async findOneByUsername(username: string) {
        return this.rawFindUserByUsername(username);
    }

    async deleteOne(user_id: string) {
        return this.userModel.deleteOne({ id: user_id }).exec().then(deleteResult => {
            this.redisManager.deleteOne(user_id);
            return deleteResult;
        });
    }

    async updateOne(user_id: string, updateUserDto: UpdateUserDto) {
        const user = await this.rawFindUser(user_id);
        return this.rawUpdateUser(user, updateUserDto);
    }

    private async rawFindUser(id: string) {
        let cachedUser: User = await this.redisManager.findOne(id);
        if (!cachedUser) {
            const dbUser = await this.userModel.findOne({ id: id }).exec();
            if (!dbUser)
                throw new HttpException("There is no user with that ID!", HttpStatus.NOT_FOUND);
            await this.redisManager.putOne(dbUser);
            cachedUser = dbUser;
        }
        return cachedUser;
    }

    private async rawFindUserByUsername(username: string) {
        let cachedUser: User = await this.redisManager.findOneByUsername(username);
        if (!cachedUser) {
            const dbUser = await this.userModel.findOne({ username: username }).exec();
            if (!dbUser)
                return null;
            await this.redisManager.putOne(dbUser);
            cachedUser = dbUser;
        }
        return cachedUser;
    }

    private async rawUpdateUser(user: User, updateUserDto: UpdateUserDto) {
        if (updateUserDto.username) {
            const existingUser = await this.rawFindUserByUsername(updateUserDto.username);
            if (existingUser)
                throw new HttpException(
                    "There is already a user with that username.",
                    HttpStatus.BAD_REQUEST
                );
            user.username = updateUserDto.username;
        }

        if (updateUserDto.password)
            user.password = await hash(updateUserDto.password, 10);
        if (updateUserDto.email) user.email = updateUserDto.email;
        if (updateUserDto.permissions)
            user.permissions = updateUserDto.permissions;
        if (updateUserDto.roles) user.roles = updateUserDto.roles;
        if (updateUserDto.allowed_locations)
            user.allowed_locations = updateUserDto.allowed_locations;
        if (updateUserDto.first_name)
            user.first_name = updateUserDto.first_name;
        if (updateUserDto.last_name) user.last_name = updateUserDto.last_name;

        return this.userModel.updateOne({ id: user.id }, user).then(async (updateResult) => {
            await this.redisManager.putOne(user);
            return updateResult;
        });
    }
}
