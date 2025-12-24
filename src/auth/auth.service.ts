import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor (
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    // register (sign up)
    // goal: take a password, hash it, then save it

    async register(CreateUserDto: CreateUserDto) {
        // using salt to use random data to make the hash unique even if 2 users have the same password
        const salt = await bcrypt.genSalt();
        
        const passwordHash = await bcrypt.hash(CreateUserDto.password, salt);

        const newUser = await this.usersService.create({
            ...CreateUserDto,
            passwordHash,
        });

        return { id: newUser.id, email: newUser.email };
    }


}
