import { Body, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {Role, RoleDocument} from "./roles.schema";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {CreateRoleDto} from "../dto/roles/create-role.dto";
import {v4} from "uuid";
import {UpdateRoleDto} from "../dto/roles/update-role.dto";

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

    async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
        return await new this.roleModel({
            ...createRoleDto,
            id: v4()
        }).save()
    }

    async updateOne(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
        const role = await this.findOne(id);
        if (!role)
            throw new HttpException("There is no such role with that ID!", HttpStatus.NOT_FOUND);
        if (updateRoleDto.name)
            role.name = updateRoleDto.name;
        if (updateRoleDto.permissions)
            role.permissions = updateRoleDto.permissions;
        return role.save();
    }

    async deleteOne(id: string) {
        return this.roleModel.deleteOne({ id: id}).exec();
    }

    async findOne(id: string) {
        return this.roleModel.findOne({ id: id }).exec();
    }
    
    async findAll() {
        return this.roleModel.find().exec();
    }

    async findByName(name: string) {
        return this.roleModel.find({ name: name }).exec();
    }
}