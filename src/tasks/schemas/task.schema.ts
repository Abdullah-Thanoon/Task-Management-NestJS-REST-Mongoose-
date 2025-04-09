import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TaskStatus } from '../enums/tasks-status.enum';
import mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: TaskStatus.OPEN })
  status?: TaskStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
