import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Request} from "@nestjs/common";
import {LocationService} from "./location.service";
import {PermissionGuard} from "../utils/permissions/permission.guard";
import {Permission} from "../utils/permissions/permission.enum";
import {UsersService} from "../users/users.service";
import {Permissions} from "../utils/permissions/permission.decorator";
import {CreateLocationDto} from "../dto/location/create-location.dto";
import {UpdateLocationDto} from "../dto/location/update-location.dto";
import {User} from "../users/user.schema";
import {CreateStoreDto} from "../dto/location/store/create-store.dto";
import {UpdateStoreDto} from "../dto/location/store/update-store.dto";

@Controller('location')
export class LocationController {
    constructor(
        private readonly locationService: LocationService,
        private readonly usersService: UsersService
    ) {}

    @Get()
    async getLocations(@Request() req) {
        const user = await this.usersService.findOne(req.user.id);
        if (PermissionGuard.userHasPermission(user.permissions, Permission.INVITE_REPS))
            return this.locationService.findAll();
        else
            return this.locationService.findMany(user.allowed_locations.map(location => location.location_id));
    }

    @Get(':id')
    async getLocation(@Request() req, @Param('id') id: string) {
        const user = await this.usersService.findOne(req.user.id);
        if (!LocationController.userHasPermissionToLocation(user, id))
            throw new HttpException('You do not have permission to fetch this location!', HttpStatus.UNAUTHORIZED);
        return this.locationService.findOne(id);
    }

    @Post()
    @Permissions(Permission.INVITE_REPS)
    async createLocation(@Body() createLocationDto: CreateLocationDto) {
        return this.locationService.create(createLocationDto);
    }

    @Patch(':id')
    @Permissions(Permission.INVITE_REPS)
    async updateLocation(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
        return this.locationService.update(id, updateLocationDto);
    }

    @Delete(':id')
    @Permissions(Permission.INVITE_REPS)
    async deleteLocation(@Param('id') id: string) {
        return this.locationService.deleteOne(id);
    }

    @Get(':loc_id/stores')
    async getStores(@Request() req, @Param(':loc_id') loc_id: string) {
        const user = await this.usersService.findOne(req.user.id);
        const location = await this.locationService.findOne(loc_id);
        if (!location)
            throw new HttpException('There is no such location with that ID!', HttpStatus.NOT_FOUND);
        if (!LocationController.userHasPermissionToLocation(user, loc_id))
            throw new HttpException('You do not have permission to fetch stores for this location!', HttpStatus.UNAUTHORIZED);
        return this.locationService.findStores(loc_id);
    }

    @Get(':loc_id/store/:store_id')
    async getStore(@Request() req, @Param('loc_id') loc_id: string, @Param('store_id') store_id: string) {
        const user = await this.usersService.findOne(req.user.id);
        const location = await this.locationService.findOne(loc_id);
        if (!location)
            throw new HttpException('There is no such location with that ID!', HttpStatus.NOT_FOUND);
        if (!LocationController.userHasPermissionToLocation(user, loc_id))
            throw new HttpException('You do not have permission to fetch this location!', HttpStatus.UNAUTHORIZED);
        const store = await this.locationService.findStore(loc_id, store_id);
        if (!store)
            throw new HttpException('There is no store with that ID in this location!', HttpStatus.NOT_FOUND);
        return store;
    }

    @Post(':loc_id/store')
    @Permissions(Permission.ADD_STORE)
    async createStore(@Request() req, @Param('loc_id') loc_id: string, @Body() createStoreDto: CreateStoreDto) {
        const user = await this.usersService.findOne(req.user.id);
        const location = await this.locationService.findOne(loc_id);
        if (!location)
            throw new HttpException('There is no such location with that ID!', HttpStatus.NOT_FOUND);
        if (!LocationController.userHasPermissionToLocation(user, loc_id))
            throw new HttpException('You do not have permission to interact with this location!', HttpStatus.UNAUTHORIZED);
        return this.locationService.createStore(loc_id, createStoreDto);
    }

    @Patch(':loc_id/store/:store_id')
    @Permissions(Permission.ADD_STORE)
    async updateStore(
        @Request() req,
        @Param('loc_id') loc_id: string,
        @Param('store_id') store_id: string,
        @Body() updateStoreDto: UpdateStoreDto
    ) {
        const user = await this.usersService.findOne(req.user.id);
        const location = await this.locationService.findOne(loc_id);
        if (!location)
            throw new HttpException('There is no such location with that ID!', HttpStatus.NOT_FOUND);
        if (!LocationController.userHasPermissionToLocation(user, loc_id))
            throw new HttpException('You do not have permission to fetch this location!', HttpStatus.UNAUTHORIZED);
        const store = await this.locationService.findStore(loc_id, store_id);
        if (!store)
            throw new HttpException('There is no store with that ID in this location!', HttpStatus.NOT_FOUND);
        return this.locationService.updateStore(loc_id, store_id, updateStoreDto);
    }

    @Delete(':loc_id/store/:store_id')
    @Permissions(Permission.ADD_STORE)
    async deleteStore(
        @Request() req,
        @Param('loc_id') loc_id: string,
        @Param('store_id') store_id: string,
    ) {
        const user = await this.usersService.findOne(req.user.id);
        const location = await this.locationService.findOne(loc_id);
        if (!location)
            throw new HttpException('There is no such location with that ID!', HttpStatus.NOT_FOUND);
        if (!LocationController.userHasPermissionToLocation(user, loc_id))
            throw new HttpException('You do not have permission to fetch this location!', HttpStatus.UNAUTHORIZED);
        const store = await this.locationService.findStore(loc_id, store_id);
        if (!store)
            throw new HttpException('There is no store with that ID in this location!', HttpStatus.NOT_FOUND);
        return this.locationService.deleteStore(loc_id, store_id);
    }

    public static userHasPermissionToLocation(user: User, id: string) {
        return (!!user.allowed_locations.find(location => location.location_id === id))
        || PermissionGuard.userHasPermission(user.permissions, Permission.INVITE_REPS)
    }
}