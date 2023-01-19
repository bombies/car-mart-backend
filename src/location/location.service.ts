import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Location, LocationDocument, LocationStore} from "./location.schema";
import {Model} from "mongoose";
import {CreateLocationDto} from "../dto/location/create-location.dto";
import {v4} from "uuid";
import {UpdateLocationDto} from "../dto/location/update-location.dto";
import {CreateStoreDto} from "../dto/location/store/create-store.dto";
import {UpdateStoreDto} from "../dto/location/store/update-store.dto";

@Injectable()
export class LocationService {
    constructor(@InjectModel(Location.name) private locationModel: Model<LocationDocument>) {}

    async create(createLocationDto: CreateLocationDto) {
        return new this.locationModel({
            id: v4(),
            name: createLocationDto.name,
            stores: []
        }).save();
    }

    async findAll() {
        return this.locationModel.find().exec();
    }

    async findMany(ids: string[]) {
        return this.locationModel.find({ id: ids }).exec()
    }

    async findOne(id: string) {
        return this.locationModel.findOne({ id: id }).exec();
    }

    async findByName(name: string) {
        return this.locationModel.find({ name: name }).exec();
    }

    async deleteOne(id: string) {
        return this.locationModel.deleteOne({ id: id }).exec();
    }

    async update(id: string, updateLocationDto: UpdateLocationDto) {
        const location = await this.findOne(id);
        if (!location)
            return null;
        if (updateLocationDto.name)
            location.name = updateLocationDto.name;
        if (updateLocationDto.stores)
            location.stores = updateLocationDto.stores;
    }

    async createStore(id: string, createStoreDto: CreateStoreDto) {
        const location = await this.findOne(id);
        if (!location)
            return null;
        location.stores = [...location.stores, { id: v4(), name: createStoreDto.name, inventory: [] }];
        return location.save();
    }

    async findStores(loc_id: string) {
        const location = await this.findOne(loc_id);
        if (!location)
            return null;
        return location.stores;
    }

    async findStore(loc_id: string, store_id: string) {
        const location = await this.findOne(loc_id);
        if (!location)
            return null;
        return location.stores.find(store => store.id === store_id);
    }

    async deleteStore(loc_id: string, store_id: string) {
        const location = await this.findOne(loc_id);
        if (!location)
            return null;
        location.stores = location.stores.filter(store => store.id !== store_id);
        return location.save();
    }

    async updateStore(loc_id: string, store_id: string, updateStoreDto: UpdateStoreDto) {
        const location = await this.findOne(loc_id);
        if (!location)
            return null;
        const store = await this.findStore(location.id, store_id);
        if (!store)
            return null;
        if (updateStoreDto.name)
            store.name = updateStoreDto.name;
        if (updateStoreDto.inventory)
            store.inventory = updateStoreDto.inventory;
        const updatedStores = location.stores.filter(s => s.id !== store_id);
        updatedStores.push(store);
        location.stores = updatedStores;
        return location.save();
    }

}