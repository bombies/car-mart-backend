import Redis from "ioredis/built/Redis";
import { RedisManager } from "../redismanager";
import { Model } from "mongoose";
import { LocationDocument, Location } from "src/location/location.schema";

export class LocationRedisManager extends RedisManager {
    constructor(redis: Redis) {
        super(redis, "location")
    }

    /**
     * Finds every location in the redis cache.
     * 
     * @returns A promise containing an array of all the available locations in cache.
     * 
     * @example
     * ```ts
     * const locations = await locationManager.findAll();
     * locations.forEach(location => console.log(location));
     * ```
     * 
     * OR
     * 
     * ```ts
     * locationManager.findAll()
     *  .then(locations => locations.forEach(location => console.log(location)));
     * ```
     */
    public async findAll() {
        const keys = await this.keys(`*${this.cacheID}*`)
        const entries = (await this.mget<Location>(keys)).values();
        const ret: Location[] = [];

        let currentEntry = entries.next();
        while (currentEntry.value) {
            ret.push(currentEntry.value);
            currentEntry = entries.next();
        }

        return ret;
    }

    public async findOne(id: string) {
        return this.get<Location>(id);
    }

    public async findMany(ids: string[]) {
        const results = await this.mget<Location>(ids);
        const retMap = new Map<string, Location>();
        results.forEach((result, n) => retMap.set(ids[n], result));
        return retMap;
    }

    public async putOne(location: Location) {
        return this.setex(location.id, location, 1800);
    }

    public async deleteOne(loc_id: string) {
        return this.del(loc_id);
    }
}