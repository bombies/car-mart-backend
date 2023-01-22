import { Redis } from "ioredis";
import { RedisManager } from "../redismanager";
import { User } from "src/users/user.schema";

export class UserRedisManager extends RedisManager {
    constructor(redis: Redis) {
        super(redis, "user");
    }

    public async putOne(user: User) {
        return this.setex(user.id, user, 300);
    }

    public async findOne(id: string) {
        return this.get<User>(id);
    }

    public async findAll() {
        return this.getAll<User>();
    }

    public async findOneByUsername(username: string) {
        return (await this.findAll()).find(user => user.username === username)
    }

    public async findMany(ids: string[]) {
        return this.mget<User>(ids);
    }

    public async deleteOne(id: string) {
        return this.del(id);
    }
}