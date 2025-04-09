import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import mongoose, { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class TasksRepository {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<Task>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const { userId } = createTaskDto;
      const foundUser = await this.userModel.findById(userId);
      if (!foundUser) {
        throw new NotFoundException('User not found');
      }

      const task = new this.taskModel({
        ...createTaskDto,
        user: createTaskDto.userId,
      });
      const savedTask = await task.save();

      await foundUser.updateOne({ $push: { tasks: task } });
      return savedTask;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating task. Please try again later.',
        error.message,
      );
    }
  }

  findAll() {
    try {
      return this.taskModel.find();
    } catch (error) {
      throw new Error('Error fetching tasks. Please try again later.');
    }
  }

  async findOne(id: string) {
    try {
      const task = await this.taskModel.findById(id);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error fetching task. Please try again later.',
      );
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.findOne(id);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      return await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating task. Please try again later.',
      );
    }
  }

  async remove(id: string) {
    try {
      const task = await this.findOne(id);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      return await this.taskModel.findByIdAndDelete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error deleting task. Please try again later.',
      );
    }
  }
}
