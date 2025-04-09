import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const res = await bcrypt.compare(password, hash);
  if (!res) {
    throw new BadRequestException('Password does not match');
  }
  return res;
}
