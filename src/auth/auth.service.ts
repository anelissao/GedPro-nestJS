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

        // login (sign in)
    // goal: check/compare credential, return Token
    async login(email: string, pass: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('User not found'); // 401 error
        }

        // compare password (we hash the incomping password and compare it with the hashedpassword)
        const isMatch = await bcrypt.compare(pass, user.passwordHash);
        if (!isMatch) {
            throw new UnauthorizedException('Wrong password');
        }
        // generate token
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        }

    }

}
