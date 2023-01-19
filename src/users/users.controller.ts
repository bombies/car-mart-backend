import {Body, Controller, Delete, Get, Param, Patch, Post, Request} from "@nestjs/common";
import {UsersService} from "./users.service";
import {Permissions} from "../utils/permissions/permission.decorator";
import {Permission} from "../utils/permissions/permission.enum";
import {CreateUserDto} from "../dto/user/create-user.dto";
import {UpdateUserDto} from "../dto/user/update-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Permissions(Permission.INVITE_REPS)
  addUser(
    @Body() body: CreateUserDto
  ): any {
    return this.usersService.create(body)
  }

  @Get('@me')
  getSelf(@Request() req) {
    return req.user;
  }

  @Get(':id')
  @Permissions(Permission.INVITE_REPS)
  async getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @Permissions(Permission.INVITE_REPS)
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteOne(id);
  }

  @Patch(':id')
  @Permissions(Permission.INVITE_REPS)
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(id, updateUserDto);
  }
}
