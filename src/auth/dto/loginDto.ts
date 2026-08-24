import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    password: string;
}