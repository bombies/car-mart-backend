import {Controller, Delete, Get, Param, Patch} from "@nestjs/common";
import {RolesService} from "./roles.service";
import {Permissions} from "../utils/permissions/permission.decorator";
import {Permission} from "../utils/permissions/permission.enum";
import {UpdateRoleDto} from "../dto/roles/update-role.dto";

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Get()
    async getRoles() {
        return this.rolesService.findAll();
    }

    @Get(':id')
    async getRole(@Param('id') id: string) {
        return this.rolesService.findOne(id);
    }

    @Delete(':id')
    @Permissions(Permission.INVITE_REPS)
    async deleteRole(@Param('id') id: string) {
        return this.rolesService.deleteOne(id);
    }

    @Patch(':id')
    @Permissions(Permission.INVITE_REPS)
    async updateRole(@Param('id') id: string, updateRoleDto: UpdateRoleDto) {
        return this.rolesService.updateOne(id, updateRoleDto);
    }
}