import {StoreItem} from "../../../location/location.schema";

export class UpdateStoreDto {
    name?: string;
    inventory?: StoreItem[]
}