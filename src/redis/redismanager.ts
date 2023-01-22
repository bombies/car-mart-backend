import Redis from "ioredis/built/Redis";

export class RedisManager {
    protected cacheID: string;

    public constructor(private readonly redis: Redis, cacheID: string) {
        this.cacheID = "car-mart-backend#" + cacheID + "#";
    }

    protected async setex(identifier: string, value: Object | any[], seconds: number) {
        return this.redis.setex(this.cacheID + identifier, seconds, JSON.stringify(value));
    }

    protected async set(identifier: string, value: Object | any[]) {
        return this.redis.set(this.cacheID + identifier, JSON.stringify(value));
    }

    protected async get<T>(identifier: string): Promise<T> {
        const str = await this.redis.get(this.cacheID + identifier)
        return JSON.parse(str);
    }

    protected async mget<T>(identifiers: string[]): Promise<Map<string, T>> {
        const strArr = await this.redis.mget(identifiers);
        const retMap = new Map<string, T>();
        strArr.forEach((str, i) => retMap.set(identifiers[i], JSON.parse(str)))
        return retMap;
    }

    protected async keys(filter: string) {
        return this.redis.keys(filter);
    }

    protected async getRaw<T>(identifier: string): Promise<T> {
        console.log(identifier);
        const str = await this.redis.get(identifier)
        console.log(str);
        return JSON.parse(str);
    }

    protected async del(identifier: string) {
        return this.redis.del(this.cacheID + identifier);
    }

}