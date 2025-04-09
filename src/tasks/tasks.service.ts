import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './tasks.repository.ts';
import mongoose from 'mongoose';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  create(createTaskDto: CreateTaskDto) {
    return this.tasksRepository.create(createTaskDto);
  }

  findAll() {
    return this.tasksRepository.findAll();
  }

  findOne(id: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new Error('Invalid ID format');
    }
    return this.tasksRepository.findOne(id);
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new Error('Invalid ID format');
    }
    return this.tasksRepository.update(id, updateTaskDto);
  }

  remove(id: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new Error('Invalid ID format');
    }
    return this.tasksRepository.remove(id);
  }
}
