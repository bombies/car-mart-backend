import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Location, LocationDocument, LocationStore} from "./location.schema";
import {Model} from "mongoose";
import {CreateLocationDto} from "../dto/location/create-location.dto";
import {v4} from "uuid";
import {UpdateLocationDto} from "../dto/location/update-location.dto";
import {CreateStoreDto} from "../dto/location/store/create-store.dto";
import {UpdateStoreDto} from "../dto/location/store/update-store.dto";
import { CreateItemDto } from "../dto/location/store/create-item.dto";
import { UpdateItemDto } from "../dto/location/store/update-item.dto";
import { Redis } from "ioredis";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { LocationRedisManager } from "src/redis/managers/location.redismanager";

@Injectable()
export class LocationService {
    private redisManager: LocationRedisManager;

    constructor(
        @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
        @InjectRedis() private readonly redis: Redis
    ) {
        this.redisManager = new LocationRedisManager(redis);
    }

    async create(createLocationDto: CreateLocationDto) {
        const createdLoc = await new this.locationModel({
            id: v4(),
            name: createLocationDto.name,
            stores: []
        }).save()       
        await this.redisManager.putOne(createdLoc);
        return createdLoc;
    }

    async findAll() {
        return this.locationModel.find().exec();
    }

    async findMany(ids: string[]) {
        const prelimLocs = await this.redisManager.findMany(ids);
        const locsToFind: string[] = [];
        const validLocs: Location[] = [];
        prelimLocs.forEach((loc, key) => {
            if (!loc)
                locsToFind.push(key)
            else validLocs.push(loc);
        });
        
        const dbFetchedLocs = await this.locationModel.find({ id: {
                $in: locsToFind
            }
        }).exec();

        dbFetchedLocs.forEach(loc => validLocs.push(loc));
        return validLocs;
    }

    async findOne(id: string) {
        const redisFetch = await this.rawFindLocation(id);
        return redisFetch;
    }

    async findByName(name: string) {
        return this.locationModel.find({ name: name }).exec();
    }

    async deleteOne(id: string) {
        return this.locationModel.deleteOne({ id: id }).exec().then(async (deleteResult) => {
            if (await this.redisManager.findOne(id)) 
                this.redisManager.deleteOne(id);
            return deleteResult;
        });
    }

    async update(id: string, updateLocationDto: UpdateLocationDto) {
        let location: Location = await this.rawFindLocation(id);
        return this.rawUpdateLocation(location, updateLocationDto);
    }

    

    async createStore(id: string, createStoreDto: CreateStoreDto) {
        const location = await this.rawFindLocation(id);
        return this.rawUpdateLocation(location, { stores: [...location.stores, { id: v4(), name: createStoreDto.name, inventory: [] }] });
    }

    async findStores(loc_id: string) {
        const location = await this.rawFindLocation(loc_id);
        return location.stores;
    }

    async findStore(loc_id: string, store_id: string) {
        const location = await this.rawFindLocation(loc_id)
        return this.rawFindStore(location, store_id);
    }

    async deleteStore(loc_id: string, store_id: string) {
        const location = await this.rawFindLocation(loc_id);
        return this.rawUpdateLocation(location, { stores: location.stores.filter(store => store.id !== store_id) });
    }

    async updateStore(loc_id: string, store_id: string, updateStoreDto: UpdateStoreDto) {
        const location = await this.rawFindLocation(loc_id)
        const store = this.rawFindStore(location, store_id);
        if (updateStoreDto.name)
            store.name = updateStoreDto.name;
        if (updateStoreDto.inventory)
            store.inventory = updateStoreDto.inventory;
        const updatedStores = location.stores.filter(s => s.id !== store_id);
        updatedStores.push(store);
        return this.rawUpdateLocation(location, { stores: updatedStores });
    }

    async createItem(loc_id: string, store_id: string, createItemDto: CreateItemDto) {
        const location = await this.rawFindLocation(loc_id)
        const store = this.rawFindStore(location, store_id);
        const inventory = store.inventory;
        inventory.push({
            id: v4(),
            name: createItemDto.name,
            cost: createItemDto.cost,
            quantity: 0,
            last_updated: new Date().getTime(),
        });

        return this.rawUpdateLocation(location, {
            stores: [
                ...location.stores.filter(store => store.id !== store_id),
                store,
            ]
        });
    }

    async findItem(loc_id: string, store_id: string, item_id: string) {
        const location = await this.rawFindLocation(loc_id)
        const store = this.rawFindStore(location, store_id);
        return this.rawFindItem(store, item_id);
    }

    async updateItem(loc_id: string, store_id: string, item_id: string, updateItemDto: UpdateItemDto) {
        const location = await this.rawFindLocation(loc_id)
        const store = this.rawFindStore(location, store_id);
        const item = this.rawFindItem(store, item_id);
        if (updateItemDto.name)
            item.name = updateItemDto.name;
        if (updateItemDto.cost)
            item.cost = updateItemDto.cost;
        if (updateItemDto.quantity)
            item.quantity = updateItemDto.quantity;
        item.last_updated = new Date().getTime();
        
        const newInventory = store.inventory.filter(item => item.id !== item_id);
        newInventory.push(item);
        store.inventory = newInventory;

        return this.rawUpdateLocation(location,{
            stores: [
                ...location.stores.filter(store => store.id !== store_id),
                store
            ]
        });
    }

    async deleteItem(loc_id: string, store_id: string, item_id: string) {
        const location = await this.rawFindLocation(loc_id)
        const store = this.rawFindStore(location, store_id);
        const newInventory = store.inventory.filter(item => item.id !== item_id);
        store.inventory = newInventory;

        return this.rawUpdateLocation(location,{
            stores: [
                ...location.stores.filter(store => store.id !== store_id),
                store
            ]
        });
    }

    private async rawFindLocation(id: string) {
        let location: Location = await this.redisManager.findOne(id);
        if (!location) {
            const dbLocation = await this.locationModel.findOne({ id: id });
            if (!dbLocation)
                throw new HttpException("There is no such location with that ID!", HttpStatus.NOT_FOUND);
            this.redisManager.putOne(dbLocation);
            location = dbLocation;
        }
        return location;
    }

    private rawFindStore(location: Location, store_id: string) {
        const store = location.stores.find(store => store.id === store_id)
        if (!store)
            throw new HttpException("There is no such store with that ID!", HttpStatus.NOT_FOUND);
        return store;
    }

    private rawFindItem(store: LocationStore, item_id: string) {
        const item = store.inventory.find(item => item.id === item_id);
        if (!item)
            throw new HttpException("There is no such item with that ID!", HttpStatus.NOT_FOUND);
        return item;
    }

    private async rawUpdateLocation(location: Location, updateLocationDto: UpdateLocationDto) {
        if (updateLocationDto.name)
            location.name = updateLocationDto.name;
        if (updateLocationDto.stores)
            location.stores = updateLocationDto.stores;
        return this.locationModel.updateOne({ id: location.id }, location).then(async (updateResult) => {
            await this.redisManager.putOne(location)
            return location;
        });
    }
}