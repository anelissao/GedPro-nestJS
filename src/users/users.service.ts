import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  // simple in-memory store for now
  private users: User[] = [];
  private idCounter = 1;

  create(createUserDto: CreateUserDto & { passwordHash: string }): Promise<User> {
    const user: User = {
      id: this.idCounter++,
      email: createUserDto.email,
      passwordHash: createUserDto.passwordHash,
      isActive: true,
      createdAt: new Date(),
    };
    this.users.push(user);
    return Promise.resolve(user);
  }

  findAll(): Promise<User[]> {
    return Promise.resolve(this.users);
  }

  // keep compatibility: support lookup by id (number) or email (string)
  findOne(identifier: number): Promise<User | undefined>;
  findOne(identifier: string): Promise<User | undefined>;
  async findOne(identifier: number | string): Promise<User | undefined> {
    if (typeof identifier === 'number') {
      return this.users.find(u => u.id === identifier);
    }
    return this.users.find(u => u.email === identifier);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
