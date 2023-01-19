import {Body, HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User, UserDocument} from "./user.schema";
import {CreateUserDto} from "../dto/user/create-user.dto";
import {v4} from 'uuid';
import {hash} from "bcrypt";
import {UpdateUserDto} from "../dto/user/update-user.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      id: v4(),
      date_of_creation: new Date().getTime(),
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(user_id: string) {
    return this.userModel.findOne({ id: user_id }).exec();
  }

  async findOneByUsername(username: string) {
    return this.userModel.findOne({ username: username }).exec();
  }

  async deleteOne(user_id: string) {
    return this.userModel.deleteOne({ id: user_id }).exec();
  }

  async updateOne(user_id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(user_id);
    if (!user)
      return null;
    if (updateUserDto.username) {
      const existingUser = await this.findOneByUsername(updateUserDto.username);
      if (existingUser)
        throw new HttpException('There is already a user with that username.', HttpStatus.BAD_REQUEST);
      user.username = updateUserDto.username;
    }

    if (updateUserDto.password)
      user.password = await hash(updateUserDto.password, 10);
    if (updateUserDto.email)
      user.email = updateUserDto.email;
    if (updateUserDto.permissions)
      user.permissions = updateUserDto.permissions;
    if (updateUserDto.roles)
      user.roles = updateUserDto.roles;
    if (updateUserDto.allowed_locations)
      user.allowed_locations = updateUserDto.allowed_locations;
    if (updateUserDto.first_name)
      user.first_name = updateUserDto.first_name;
    if (updateUserDto.last_name)
      user.last_name = updateUserDto.last_name;

    return user.save();
  }
}