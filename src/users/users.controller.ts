import {Body, Controller, Get, Param, Post, Request} from "@nestjs/common";
import {UsersService} from "./users.service";
import {Permissions} from "../utils/permissions/permission.decorator";
import {Permission} from "../utils/permissions/permission.enum";
import {CreateUserDto} from "../dto/user/create-user.dto";

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
}
