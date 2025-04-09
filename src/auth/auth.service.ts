import { BadRequestException, Injectable } from '@nestjs/common';
import { comparePassword } from 'src/common/utils/bcrypt.util';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(email: string, password: string): Promise<string> {
    try {
      const foundUser = await this.usersService.findOneByEmail(email);
      if (!foundUser) {
        throw new BadRequestException('User not found');
      }

      await comparePassword(password, foundUser.password);

      return 'Login successful!';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid credentials');
    }
  }
}
