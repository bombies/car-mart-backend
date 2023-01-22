import Redis from "ioredis/built/Redis";
import { RedisManager } from "../redismanager";
import { Model } from "mongoose";
import { LocationDocument, Location } from "src/location/location.schema";

export class LocationRedisManager extends RedisManager {
    constructor(redis: Redis, private readonly locationModel: Model<LocationDocument>) {
        super(redis, locationModel.name)
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
        return this.get<Location[]>("*carmart-backend-location*")
    }

    public async findOne(id: string) {
        return this.get<Location>(id);
    }

    public async putOne(location: Location) {
        return this.setex(location.id, location, 1800);
    }

    public async deleteOne(loc_id: string) {
        return this.del(loc_id);
    }
}