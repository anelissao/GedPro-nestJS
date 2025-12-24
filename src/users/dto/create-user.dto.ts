import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()

    email: string;

    @IsNotEmpty()
    @MinLength(6, { message: 'Password is too short!' })
    password: string;
}
