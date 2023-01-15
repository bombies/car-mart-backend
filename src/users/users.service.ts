import { Body, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import { CreateUserDto } from "../dto/user/create-user.dto";
import { v4 } from 'uuid';
import { hash } from "bcrypt";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hash(createUserDto.user_password, 10);
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

  async findOne(user_id: string): Promise<User> {
    return this.userModel.findOne({ id: user_id }).exec();
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username: username }).exec();
  }

  async deleteOne(user_id: string): Promise<any> {
    return this.userModel.deleteOne({ id: user_id }).exec();
  }
}