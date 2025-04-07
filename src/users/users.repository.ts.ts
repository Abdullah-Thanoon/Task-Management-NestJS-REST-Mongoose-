import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = new this.userModel({
        ...createUserDto,
        role: createUserDto.role || UserRole.USER, // Set default role if not provided
      });

      return await user.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating user. Please try again later.',
        error.message,
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return this.userModel.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching users. Please try again later.',
        error.message,
      );
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error fetching user. Please try again later.',
        error.message,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return this.userModel.findByIdAndUpdate(id, updateUserDto, {
        new: true, // Return the updated document
        runValidators: true, // Validate the update against the schema
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating user. Please try again later.',
        error.message,
      );
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userModel.findByIdAndDelete(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error removing user. Please try again later.',
        error.message,
      );
    }
  }
}
