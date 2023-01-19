import {StoreItems} from "../../../location/location.schema";

export class UpdateStoreDto {
    name?: string;
    inventory?: StoreItems[]
}